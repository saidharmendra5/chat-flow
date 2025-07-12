import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../config/api';
import { 
  MessageCircle, 
  User, 
  Mail, 
  Calendar, 
  LogOut, 
  Edit3, 
  Camera, 
  Save, 
  X,
  ArrowLeft,
  Shield,
  Bell,
  Moon,
  Globe
} from 'lucide-react';
import { UserDetails } from '../context/UserContext';


const ProfilePage = () => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const { loggeduser , setLoggedUser } = useContext(UserDetails);
  const [userInfo, setUserInfo] = useState({
    name: loggeduser.fullname,
    email: loggeduser.email,
    username: loggeduser.email,
    bio: 'Software developer passionate about creating amazing user experiences.',
    joinDate: new Date(loggeduser.createdAt).toLocaleDateString(),
    avatar: loggeduser.fullname.charAt(0).toUpperCase()
  });
  const [editedInfo, setEditedInfo] = useState({ ...userInfo });

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

  const handleSave = () => {
    setUserInfo({ ...editedInfo });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedInfo({ ...userInfo });
    setIsEditing(false);
  };

  const handleLogout = async() => {
    // Handle logout logic here
    console.log('Logging out...');
     try {
      const res = await fetch(`${API_BASE_URL}/chat/logout`, {
        method: 'POST',
        credentials: 'include',
      });

      if (res.ok) {
        console.log('Logged out successfully');
        navigate('/');
      } else {
        console.error('Logout failed');
      }
    } catch (err) {
      console.error('Error during logout:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white overflow-hidden">
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
        <div className="max-w-4xl mx-auto flex items-center justify-between">
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
          <h1 className="text-2xl font-bold">Profile</h1>
        </div>
      </div>

      {/* Profile Content */}
      <div className="relative z-10 max-w-4xl mx-auto p-6">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="lg:col-span-2">
            <div className="bg-gray-900/80 backdrop-blur-xl border border-gray-700/50 rounded-3xl p-8 shadow-2xl">
              {/* Profile Header */}
              <div className="flex items-start justify-between mb-8">
                <div className="flex items-center space-x-6">
                  <div className="relative group">
                    <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-2xl font-bold">
                      {userInfo.avatar}
                    </div>
                    <button className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Camera className="w-6 h-6" />
                    </button>
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-white mb-1">{userInfo.name}</h2>
                    <p className="text-blue-400 text-lg mb-2">{userInfo.username}</p>
                    <p className="text-gray-400">{userInfo.bio}</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="p-3 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 rounded-xl transition-all transform hover:scale-105"
                >
                  <Edit3 className="w-5 h-5 text-blue-400" />
                </button>
              </div>

              {/* Profile Information */}
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-400">Full Name</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editedInfo.name}
                        onChange={(e) => setEditedInfo({ ...editedInfo, name: e.target.value })}
                        className="w-full bg-gray-800/50 border border-gray-600/50 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all"
                      />
                    ) : (
                      <div className="flex items-center space-x-3 p-3 bg-gray-800/30 rounded-xl">
                        <User className="w-5 h-5 text-gray-400" />
                        <span className="text-white">{userInfo.name}</span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-400">Username</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editedInfo.username}
                        onChange={(e) => setEditedInfo({ ...editedInfo, username: e.target.value })}
                        className="w-full bg-gray-800/50 border border-gray-600/50 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all"
                      />
                    ) : (
                      <div className="flex items-center space-x-3 p-3 bg-gray-800/30 rounded-xl">
                        <span className="text-blue-400">@</span>
                        <span className="text-white">{userInfo.username.replace('@', '')}</span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-400">Email Address</label>
                    <div className="flex items-center space-x-3 p-3 bg-gray-800/30 rounded-xl">
                      <Mail className="w-5 h-5 text-gray-400" />
                      <span className="text-white">{userInfo.email}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-400">Member Since</label>
                    <div className="flex items-center space-x-3 p-3 bg-gray-800/30 rounded-xl">
                      <Calendar className="w-5 h-5 text-gray-400" />
                      <span className="text-white">{userInfo.joinDate}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-400">Bio</label>
                  {isEditing ? (
                    <textarea
                      value={editedInfo.bio}
                      onChange={(e) => setEditedInfo({ ...editedInfo, bio: e.target.value })}
                      rows={3}
                      className="w-full bg-gray-800/50 border border-gray-600/50 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all resize-none"
                    />
                  ) : (
                    <div className="p-3 bg-gray-800/30 rounded-xl">
                      <span className="text-white">{userInfo.bio}</span>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                {isEditing ? (
                  <div className="flex space-x-4 pt-4">
                    <button
                      onClick={handleSave}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-xl font-semibold transition-all transform hover:scale-[1.02] flex items-center justify-center space-x-2"
                    >
                      <Save className="w-5 h-5" />
                      <span>Save Changes</span>
                    </button>
                    <button
                      onClick={handleCancel}
                      className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-3 px-6 rounded-xl font-semibold transition-all transform hover:scale-[1.02] flex items-center justify-center space-x-2"
                    >
                      <X className="w-5 h-5" />
                      <span>Cancel</span>
                    </button>
                  </div>
                ) : (
                  <div className="pt-4">
                    <button
                      onClick={handleLogout}
                      className="w-full bg-red-600/20 hover:bg-red-600/30 border border-red-500/30 text-red-400 hover:text-red-300 py-3 px-6 rounded-xl font-semibold transition-all transform hover:scale-[1.02] flex items-center justify-center space-x-2"
                    >
                      <LogOut className="w-5 h-5" />
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Settings Panel */}
          <div className="space-y-6">
            {/* Account Settings */}
            <div className="bg-gray-900/80 backdrop-blur-xl border border-gray-700/50 rounded-3xl p-6 shadow-2xl">
              <h3 className="text-xl font-bold mb-4 flex items-center space-x-2">
                <Shield className="w-6 h-6 text-blue-400" />
                <span>Account Settings</span>
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gray-800/30 rounded-xl">
                  <div className="flex items-center space-x-3">
                    <Bell className="w-5 h-5 text-gray-400" />
                    <span className="text-white">Notifications</span>
                  </div>
                  <button className="w-12 h-6 bg-blue-600 rounded-full relative">
                    <div className="w-5 h-5 bg-white rounded-full absolute right-0.5 top-0.5 transition-transform"></div>
                  </button>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-800/30 rounded-xl">
                  <div className="flex items-center space-x-3">
                    <Moon className="w-5 h-5 text-gray-400" />
                    <span className="text-white">Dark Mode</span>
                  </div>
                  <button className="w-12 h-6 bg-blue-600 rounded-full relative">
                    <div className="w-5 h-5 bg-white rounded-full absolute right-0.5 top-0.5 transition-transform"></div>
                  </button>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-800/30 rounded-xl">
                  <div className="flex items-center space-x-3">
                    <Globe className="w-5 h-5 text-gray-400" />
                    <span className="text-white">Online Status</span>
                  </div>
                  <button className="w-12 h-6 bg-blue-600 rounded-full relative">
                    <div className="w-5 h-5 bg-white rounded-full absolute right-0.5 top-0.5 transition-transform"></div>
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-gray-900/80 backdrop-blur-xl border border-gray-700/50 rounded-3xl p-6 shadow-2xl">
              <h3 className="text-xl font-bold mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Link
                  to="/chat"
                  className="block w-full bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 text-blue-400 py-3 px-4 rounded-xl font-semibold transition-all transform hover:scale-[1.02] text-center"
                >
                  Back to Chat
                </Link>
                <Link
                  to="/friends"
                  className="block w-full bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/30 text-purple-400 py-3 px-4 rounded-xl font-semibold transition-all transform hover:scale-[1.02] text-center"
                >
                  Manage Friends
                </Link>
              </div>
            </div>
          </div>
        </div>
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

export default ProfilePage;