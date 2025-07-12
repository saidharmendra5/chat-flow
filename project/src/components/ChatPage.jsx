import React, { useState, useEffect, useRef, useContext } from 'react';
import { Link } from 'react-router-dom';
import { io } from 'socket.io-client';
import { API_BASE_URL } from '../config/api';
import {
  MessageCircle,
  Send,
  Search,
  MoreVertical,
  Phone,
  Video,
  Paperclip,
  Smile,
  User,
  Settings,
  LogOut,
  UserPlus,
  Circle,
  Image,
  File
} from 'lucide-react';
import { UserDetails } from '../context/UserContext';

const ChatPage = () => {
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [message, setMessage] = useState('');
  const [messageList, setMessageList] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const messagesEndRef = useRef(null);
  
  const { loggeduser, setOnlineUsersList, onlineUserslist , friends, setFriends } = useContext(UserDetails);
  const socket = useRef(null);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messageList]);

  useEffect(() => {
    const getFriends = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/chat/getfriendslist`, {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        });
        const result = await response.json();
        if (response.ok && result.userfriendslist) {
          setFriends(result.userfriendslist);
          console.log("friends : " , result.userfriendslist );
        } else {
          console.error("Error loading friends list:", result.message);
        }
      } catch (err) {
        console.error("Fetch error:", err);
        // Show user-friendly error message
        console.log("Failed to load friends. Please check your connection.");
      }
    };
    getFriends();
  }, []);


    useEffect(() => {
    if (loggeduser && !socket.current) {
      socket.current = io(API_BASE_URL, { //creates a socket
        query: { userId: loggeduser._id }
      });
      

//to listen for new messages and transforms the msg data sent by server into required format :

    socket.current.on('newmessage', (msg) => {
    const formattedMsg = {
    id: msg._id,
    sender: msg.senderId === loggeduser._id ? 'me' : 'other',
    content: msg.text,
    time: new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  };

  setMessageList((prev) => [...prev, formattedMsg]);
});


      socket.current.on('getOnlineUsers', (onlineusers) => {
        setOnlineUsersList(onlineusers);
      });
    }

    return () => {
      if (socket.current) {
        socket.current.disconnect();
        socket.current = null;
      }
    };
  }, [loggeduser]);

  const filteredFriends = friends.filter(friend =>
    friend.fullname.toLowerCase().includes(searchTerm.toLowerCase())
  );


//to get all mesages b/w loggeduser and selected user:
  useEffect(() => {
  if (!selectedFriend) return;

  const getmsgdata = {
    myId: loggeduser._id,
    otherId: selectedFriend._id,
  };

  const getMessages = async (data) => {
    try {
      const response = await fetch(`${API_BASE_URL}/chat/getmessages`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      console.log("get messages result:", result);

      if (Array.isArray(result)) {
        const formattedMessages = result.map((msg) => ({
          id: msg._id,
          sender: msg.senderId === loggeduser._id ? 'me' : 'other',
          content: msg.text,
          time: new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        }));

        setMessageList(formattedMessages);
      } else {
        console.error("Unexpected message format");
      }
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  getMessages(getmsgdata);

  return () => {
    setMessageList([]); // clear on friend switch (cleanup function)
  };
}, [selectedFriend]);

//to send msg from loggeduser to selecteduser : 
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim() || !selectedFriend) return;
    const sendmsgdata = {
      senderId : loggeduser._id,
      receiverId : selectedFriend._id,
      text : message
    }
    const response = await fetch(`${API_BASE_URL}/chat/sendmessage` , {
      method:"POST",
      headers:{"content-type" : "application/json"},
      body : JSON.stringify(sendmsgdata)
    })
    const result = await response.json();
    console.log("send message response : ",response,"send message result : ",result);
    const newMsg = {
      id: Date.now(),
      sender: 'me',
      content: message,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessageList((prev) => [...prev, newMsg]);
    
    setMessage('');
  };

  const floatingElements = [
    { id: 1, size: 'w-3 h-3', delay: '0s', x: '5%', y: '15%' },
    { id: 2, size: 'w-4 h-4', delay: '4s', x: '95%', y: '25%' },
    { id: 3, size: 'w-2 h-2', delay: '8s', x: '10%', y: '85%' },
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white overflow-hidden flex">
      <div className="fixed inset-0 pointer-events-none">
        <div
          className="absolute inset-0 bg-gradient-to-br from-blue-900/10 to-purple-900/10 transition-all duration-1000"
          style={{ transform: `translate(${mousePosition.x * 0.005}px, ${mousePosition.y * 0.005}px)` }}
        />
        {floatingElements.map(element => (
          <div
            key={element.id}
            className={`absolute ${element.size} bg-blue-500/10 rounded-full blur-sm animate-float`}
            style={{ left: element.x, top: element.y, animationDelay: element.delay, animationDuration: '8s' }}
          />
        ))}
      </div>

      <div className="relative z-10 w-80 h-screen bg-gray-900/80 backdrop-blur-xl border-r border-gray-700/50 flex flex-col">
        <div className="p-6 border-b border-gray-700/50">
          <div className="flex items-center justify-between mb-4">
            <Link to="/" className="flex items-center space-x-2">
              <MessageCircle className="w-8 h-8 text-blue-500" />
              <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                ChatFlow
              </span>
            </Link>
            <div className="flex items-center space-x-2">
              <Link to="/friends" className="p-2 hover:bg-gray-800/50 rounded-lg transition-colors">
                <UserPlus className="w-5 h-5 text-gray-400 hover:text-white" />
              </Link>
              <Link to="/profile" className="p-2 hover:bg-gray-800/50 rounded-lg transition-colors">
                <Settings className="w-5 h-5 text-gray-400 hover:text-white" />
              </Link>
            </div>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search friends..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-gray-800/50 border border-gray-600/50 rounded-xl py-2 pl-10 pr-4 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto hide-scrollbar">
          {filteredFriends.map(friend => {
            const isOnline = onlineUserslist.includes(friend._id);
            return (
              <div
                key={friend._id}
                onClick={() => setSelectedFriend(friend)}
                className={`p-4 border-b border-gray-700/30 cursor-pointer transition-all hover:bg-gray-800/30 ${
                  selectedFriend?._id === friend._id ? 'bg-blue-600/20 border-blue-500/30' : ''
                }`}
              >
                
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center font-semibold">
                      {friend.fullname.charAt(0).toUpperCase()} 
                    </div>
                    {isOnline && (
                      <span className="absolute -bottom-1.5 -right-1.5 w-4 h-4 rounded-full bg-green-500 border-2 border-gray-900" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-white truncate">{friend.fullname}</h3>
                    <p className="text-sm text-gray-400 truncate">{friend.email}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex-1 flex flex-col relative z-10">
        {selectedFriend ? (
          <>
            <div className="p-4 border-b border-gray-700/50 bg-gray-900/80 backdrop-blur-xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center font-semibold">
                      {selectedFriend.fullname.charAt(0).toUpperCase()}
                    </div>
                    {selectedFriend.online && (
                      <Circle className="absolute -bottom-1 -right-1 w-3 h-3 text-green-400 fill-current" />
                    )}
                  </div>
                  <div>
                    <h2 className="font-semibold text-white">{selectedFriend.fullname}</h2>
                    <p className="text-sm text-gray-400">
                      {onlineUserslist.includes(selectedFriend._id) ? 'Online' : 'Last seen recently'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 space-y-4 overflow-y-auto custom-scrollbar" style={{ height: 'calc(100vh - 192px)' }}>

              {messageList.map((msg) => (
               <div key={msg.id} className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'} px-2`}>
  <div
    className={`bubble ${msg.sender === 'me' ? 'me' : 'other'} relative max-w-[80%] md:max-w-md p-3 rounded-2xl
      ${msg.sender === 'me'
        ? 'bg-blue-600 text-white rounded-br-none shadow-md'
        : 'bg-gray-800 text-white border border-gray-700/50 rounded-bl-none shadow-sm'
      }
    `}
  >
    <p className="text-sm leading-snug break-words">{msg.content}</p>
    <span className={`text-[10px] block text-right mt-1 ${msg.sender === 'me' ? 'text-blue-100' : 'text-gray-400'}`}>
      {msg.time}
    </span>
  </div>
</div>


              ))}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-4 border-t border-gray-700/50 bg-gray-900/80 backdrop-blur-xl">
              <form onSubmit={handleSendMessage} className="flex items-center space-x-3">
                <button type="button" className="p-2 hover:bg-gray-800/50 rounded-lg transition-colors">
                  <Paperclip className="w-5 h-5 text-gray-400 hover:text-white" />
                </button>
                <button type="button" className="p-2 hover:bg-gray-800/50 rounded-lg transition-colors">
                  <Image className="w-5 h-5 text-gray-400 hover:text-white" />
                </button>
                <div className="flex-1 relative">
                  <input
                    type="text"
                    placeholder="Type a message..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full bg-gray-800/50 border border-gray-600/50 rounded-xl py-3 px-4 pr-12 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all"
                  />
                  <button type="button" className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-700/50 rounded-lg transition-colors">
                    <Smile className="w-5 h-5 text-gray-400 hover:text-white" />
                  </button>
                </div>
                <button type="submit" disabled={!message.trim()} className="p-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:cursor-not-allowed rounded-xl transition-all transform hover:scale-105">
                  <Send className="w-5 h-5" />
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <MessageCircle className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h2 className="text-2xl font-semibold text-gray-400 mb-2">Select a conversation</h2>
              <p className="text-gray-500">Choose a friend from the sidebar to start chatting</p>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-8px) rotate(3deg); }
        }

        .animate-float {
          animation: float 8s ease-in-out infinite;
        }

        .hide-scrollbar {
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default ChatPage;
<style>
  {`
    .bubble::after {
      content: '';
      position: absolute;
      bottom: 0;
      width: 0;
      height: 0;
    }

    .bubble.me::after {
      right: -8px;
      border-left: 8px solid #2563eb; /* Tailwind blue-600 */
      border-top: 8px solid transparent;
      border-bottom: 8px solid transparent;
    }

    .bubble.other::after {
      left: -8px;
      border-right: 8px solid #1f2937; /* Tailwind gray-800 */
      border-top: 8px solid transparent;
      border-bottom: 8px solid transparent;
    }
  `}
</style>
