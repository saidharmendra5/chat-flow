import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { API_BASE_URL } from '../config/api';
import { 
  MessageCircle, 
  UserPlus, 
  Search, 
  Check, 
  X, 
  ArrowLeft,
  Users,
  Clock,
  Send,
  UserCheck,
  UserX,
  Filter
} from 'lucide-react';

import { UserDetails } from '../context/UserContext';

const FriendsPage = () => {
  const [activeTab, setActiveTab] = useState('friends');
  const [searchTerm, setSearchTerm] = useState('');
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [addfriendstate, setAddfriendstate] = useState(null);
  
  const { loggeduser, setOnlineUsersList, onlineUserslist, friends, setFriends } = useContext(UserDetails);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset
  } = useForm();

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const floatingElements = [
    { id: 1, size: 'w-4 h-4', delay: '0s', x: '10%', y: '20%' },
    { id: 2, size: 'w-3 h-3', delay: '3s', x: '85%', y: '15%' },
    { id: 3, size: 'w-5 h-5', delay: '6s', x: '15%', y: '80%' },
    { id: 4, size: 'w-2 h-2', delay: '9s', x: '90%', y: '75%' },
  ];

  const handleRemoveFriend = (id) => {
    console.log('Removing friend:', id);
  };

  const onSubmit = async (data) => {
    data.fromemail = loggeduser.email ;
    console.log("add form data", data);
    setAddfriendstate(null);
    
    if (!data.toemail) {
      setAddfriendstate("Please enter an email address");
      return;
    }
    
    try {
      const response = await fetch(`${API_BASE_URL}/chat/addfriend`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(data)
      });

      const result = await response.json();
      console.log("add friend response:", response);
      console.log("Add friend result:", result);
      setAddfriendstate(result.message);
      
      if (response.ok) {
        reset(); // Reset form on success
      }
    } catch (error) {
      console.log("error in add friend:", error);
      setAddfriendstate("An error occurred. Please try again.");
    }
  };

  const tabs = [
    { id: 'friends', label: 'Friends', icon: Users, count: friends.length },
    { id: 'add', label: 'Add', icon: UserPlus, count: 0 }
  ];

  const getFilteredData = () => {
    if (activeTab === 'add') return [];
    
    const data = friends;

    return data.filter(item =>
      item.fullname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.username?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white overflow-hidden">
      {/* Loading Overlay */}
      {isSubmitting && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-gray-800/90 rounded-2xl p-8 flex flex-col items-center space-y-4">
            <div className="w-8 h-8 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
            <p className="text-white font-semibold">Sending friend request...</p>
          </div>
        </div>
      )}

      {/* Animated Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div 
          className="absolute inset-0 bg-gradient-to-br from-blue-900/20 to-purple-900/20 transition-all duration-1000"
          style={{
            transform: `translate(${mousePosition.x * 0.01}px, ${mousePosition.y * 0.01}px)`
          }}
        />
        {floatingElements.map((element) => (
          <div
            key={element.id}
            className={`absolute ${element.size} bg-blue-500/20 rounded-full blur-sm animate-float`}
            style={{
              left: element.x,
              top: element.y,
              animationDelay: element.delay,
              animationDuration: '6s'
            }}
          />
        ))}
      </div>

      {/* Header */}
      <div className="relative z-10 p-6 border-b border-gray-800/50 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link to="/chat" className="p-2 hover:bg-gray-800/50 rounded-lg transition-colors">
              <ArrowLeft className="w-6 h-6 text-gray-400 hover:text-white" />
            </Link>
            <div className="flex items-center space-x-2">
              <MessageCircle className="w-8 h-8 text-blue-500" />
              <Link to="/" className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                ChatFlow
              </Link>
            </div>
          </div>
          <h1 className="text-2xl font-bold">Friends</h1>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto p-6">
        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-semibold transition-all transform hover:scale-105 ${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25'
                    : 'bg-gray-800/50 text-gray-400 hover:bg-gray-700/50 hover:text-white'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{tab.label}</span>
                {tab.count > 0 && (
                  <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                    activeTab === tab.id ? 'bg-blue-800' : 'bg-gray-700'
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Add Friend Form */}
        {activeTab === 'add' && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-gray-900/80 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-8 shadow-2xl">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <UserPlus className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">Add Friends</h2>
                <p className="text-gray-400">Send a friend request by entering their email address</p>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <input
                    placeholder="Enter friend's email address"
                    {...register('toemail', {
                    required: 'Email is required',
                    pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Invalid email address'
                    }
                    })}
                    className="w-full bg-gray-800/50 border border-gray-600/50 rounded-xl py-4 px-4 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20"
                />
                {errors.toemail && (
                    <p className="text-red-400 text-sm">{errors.toemail.message}</p>
                )}
                
                {addfriendstate && (
                    <div className={`p-4 rounded-lg ${
                    addfriendstate.includes('successfully') 
                        ? 'bg-green-600/20 border border-green-500/30 text-green-400'
                        : 'bg-red-600/20 border border-red-500/30 text-red-400'
                    }`}>
                    {addfriendstate}
                    </div>
                )}

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800/50 disabled:cursor-not-allowed text-white py-4 rounded-xl font-semibold transition-all flex items-center justify-center space-x-2"
                >
                    <Send className="w-5 h-5" />
                    <span>Send Friend Request</span>
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Search - Only show for non-add tabs */}
        {activeTab !== 'add' && (
          <div className="relative mb-8">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder={`Search ${activeTab}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-gray-800/50 border border-gray-600/50 rounded-xl py-4 pl-12 pr-4 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all"
            />
          </div>
        )}

        {/* Content Grid - Only show for non-add tabs */}
        {activeTab !== 'add' && (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {getFilteredData().map((item) => (
                <div
                  key={item._id || item.id}
                  className="bg-gray-900/80 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-6 shadow-2xl hover:border-blue-500/30 transition-all transform hover:scale-105"
                >
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-xl font-bold">
                      {item.avatar || item.fullname?.charAt(0) || item.name?.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-white text-lg">
                        {item.fullname || item.name}
                      </h3>
                      <p className="text-blue-400">{item.email || item.username}</p>
                      <p className="text-gray-400 text-sm">
                        {item.mutualFriends} mutual friends
                      </p>
                    </div>
                  </div>

                  {activeTab === 'friends' && item.online !== undefined && (
                    <div className="flex items-center space-x-2 mb-4">
                      <div className={`w-3 h-3 rounded-full ${item.online ? 'bg-green-400' : 'bg-gray-500'}`} />
                      <span className="text-sm text-gray-400">
                        {item.online ? 'Online' : 'Offline'}
                      </span>
                    </div>
                  )}

                  {(activeTab === 'pending' || activeTab === 'sent') && (
                    <div className="mb-4">
                      <p className="text-sm text-gray-400">
                        {activeTab === 'pending' ? `Received ${item.requestDate}` : `Sent ${item.sentDate}`}
                      </p>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex space-x-2">
                    {activeTab === 'friends' && (
                      <>
                        <Link
                          to="/chat"
                          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-semibold transition-all text-center"
                        >
                          Message
                        </Link>
                        <button
                          onClick={() => handleRemoveFriend(item._id || item.id)}
                          className="p-2 bg-red-600/20 hover:bg-red-600/30 border border-red-500/30 text-red-400 rounded-lg transition-all"
                        >
                          <UserX className="w-5 h-5" />
                        </button>
                      </>
                    )}

                    {activeTab === 'pending' && (
                      <>
                        <button
                          onClick={() => handleAcceptRequest(item._id || item.id)}
                          className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg font-semibold transition-all flex items-center justify-center space-x-2"
                        >
                          <Check className="w-4 h-4" />
                          <span>Accept</span>
                        </button>
                        <button
                          onClick={() => handleRejectRequest(item._id || item.id)}
                          className="p-2 bg-red-600/20 hover:bg-red-600/30 border border-red-500/30 text-red-400 rounded-lg transition-all"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </>
                    )}

                    {activeTab === 'sent' && (
                      <button
                        onClick={() => handleCancelRequest(item._id || item.id)}
                        className="w-full bg-gray-600/20 hover:bg-gray-600/30 border border-gray-500/30 text-gray-400 py-2 px-4 rounded-lg font-semibold transition-all"
                      >
                        Cancel Request
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {getFilteredData().length === 0 && (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-800/50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-gray-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-400 mb-2">
                  No {activeTab} found
                </h3>
                <p className="text-gray-500">
                  {searchTerm ? 'Try adjusting your search terms.' : `You don't have any ${activeTab} yet.`}
                </p>
              </div>
            )}
          </>
        )}
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(5deg); }
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default FriendsPage;