import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'
import { 
  MessageCircle, 
  Zap, 
  Shield, 
  Users, 
  Smartphone, 
  Globe, 
  ArrowRight,
  Menu,
  X,
  Play,
  Star,
  CheckCircle2
} from 'lucide-react';
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom'
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import ChatPage from './components/ChatPage';
import ProfilePage from './components/ProfilePage';
import FriendsPage from './components/FriendsPage';
import { UserDetails } from './context/UserContext';
import Authenticate from './Authenticator/Authenticate';
import RootLayout from './Layout/RootLayout';
import EmailVerificationPage from './components/EmailVerificationPage';


function LandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const floatingElements = [
    { id: 1, size: 'w-6 h-6', delay: '0s', x: '10%', y: '20%' },
    { id: 2, size: 'w-4 h-4', delay: '2s', x: '80%', y: '30%' },
    { id: 3, size: 'w-8 h-8', delay: '4s', x: '70%', y: '70%' },
    { id: 4, size: 'w-5 h-5', delay: '6s', x: '15%', y: '80%' },
    { id: 5, size: 'w-3 h-3', delay: '8s', x: '90%', y: '10%' },
  ];

  const features = [
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Lightning Fast",
      description: "Experience real-time messaging with zero lag. Our optimized infrastructure ensures instant delivery."
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "End-to-End Security",
      description: "Your conversations are protected with military-grade encryption. Privacy is our top priority."
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Group Collaboration",
      description: "Create unlimited groups, share files, and collaborate seamlessly with your team."
    },
    {
      icon: <Smartphone className="w-8 h-8" />,
      title: "Cross-Platform",
      description: "Access your chats from any device. Native apps for iOS, Android, and desktop."
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: "Global Reach",
      description: "Connect with people worldwide. Our global network ensures reliable connectivity."
    },
    {
      icon: <MessageCircle className="w-8 h-8" />,
      title: "Rich Messaging",
      description: "Send text, images, videos, voice messages, and files with our feature-rich chat."
    }
  ];

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Product Manager",
      company: "TechCorp",
      rating: 5,
      comment: "The best chat app we've ever used. The real-time features are incredible!"
    },
    {
      name: "Michael Rodriguez",
      role: "Team Lead",
      company: "StartupXYZ",
      rating: 5,
      comment: "Our team productivity has increased by 40% since switching to this platform."
    },
    {
      name: "Emma Johnson",
      role: "Designer",
      company: "Creative Studio",
      rating: 5,
      comment: "Beautiful interface and seamless experience. Highly recommended!"
    }
  ];

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

      {/* Navigation */}
      <nav className="relative z-50 px-6 py-4 border-b border-gray-800/50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <MessageCircle className="w-8 h-8 text-blue-500" />
            <Link to="/" className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              ChatFlow
            </Link>
          </div>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-gray-300 hover:text-white transition-colors">Features</a>
            <a href="#testimonials" className="text-gray-300 hover:text-white transition-colors">Testimonials</a>
            <Link to="/login" className="text-gray-300 hover:text-white transition-colors">Login</Link>
            <Link to="/register" className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-full transition-all transform hover:scale-105 inline-block">
              Get Started
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-gray-900/95 backdrop-blur-xl border-b border-gray-800/50 py-4">
            <div className="flex flex-col space-y-4 px-6">
              <a href="#features" className="text-gray-300 hover:text-white transition-colors">Features</a>
              <a href="#testimonials" className="text-gray-300 hover:text-white transition-colors">Testimonials</a>
              <Link to="/login" className="text-gray-300 hover:text-white transition-colors">Login</Link>
              <Link to="/register" className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-full transition-all self-start inline-block">
                Get Started
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-8">
            <div className="relative">
              <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400 bg-clip-text text-transparent leading-tight">
                Real-Time Chat
                <br />
                <span className="text-white">Reimagined</span>
              </h1>
              <div className="absolute -top-4 -right-4 w-12 h-12 bg-blue-500/20 rounded-full blur-xl animate-pulse" />
            </div>
            
            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Experience the future of communication with lightning-fast messaging, 
              end-to-end encryption, and seamless collaboration across all your devices.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link to="/register" className="group bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-full text-lg font-semibold transition-all transform hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/25 flex items-center space-x-2">
                <span>Get Started Free</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <button className="group flex items-center space-x-2 text-gray-300 hover:text-white transition-colors">
                <Play className="w-5 h-5" />
                <span>Watch Demo</span>
              </button>
            </div>

            <div className="flex justify-center items-center space-x-8 pt-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-400">1M+</div>
                <div className="text-gray-400">Active Users</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-400">99.9%</div>
                <div className="text-gray-400">Uptime</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-400">50+</div>
                <div className="text-gray-400">Countries</div>
              </div>
            </div>
          </div>
        </div>

        {/* 3D Chat Bubbles */}
        <div className="absolute top-1/2 left-10 transform -translate-y-1/2 animate-float">
          <div className="bg-blue-600/20 backdrop-blur-sm border border-blue-500/20 rounded-2xl p-4 transform rotate-3 hover:rotate-0 transition-transform duration-300">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <MessageCircle className="w-4 h-4" />
              </div>
              <div className="text-sm">Hey there! 👋</div>
            </div>
          </div>
        </div>

        <div className="absolute top-1/3 right-10 transform animate-float" style={{ animationDelay: '2s' }}>
          <div className="bg-purple-600/20 backdrop-blur-sm border border-purple-500/20 rounded-2xl p-4 transform -rotate-3 hover:rotate-0 transition-transform duration-300">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                <Users className="w-4 h-4" />
              </div>
              <div className="text-sm">Love this app! 💜</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-6 bg-gray-800/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Powerful Features for
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"> Modern Teams</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Everything you need to communicate effectively and collaborate seamlessly.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 hover:border-blue-500/50 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/10"
                style={{
                  animationDelay: `${index * 0.1}s`
                }}
              >
                <div className="text-blue-400 mb-4 group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3 text-white">{feature.title}</h3>
                <p className="text-gray-300 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Loved by Teams
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"> Worldwide</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              See what our users are saying about their experience with ChatFlow.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 hover:border-blue-500/50 transition-all duration-300 transform hover:scale-105"
              >
                <div className="flex items-center space-x-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-300 mb-4 italic">"{testimonial.comment}"</p>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold">
                      {testimonial.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <div className="font-semibold text-white">{testimonial.name}</div>
                    <div className="text-gray-400 text-sm">{testimonial.role} at {testimonial.company}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-gradient-to-r from-blue-600/20 to-purple-600/20">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Transform Your
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"> Communication?</span>
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Join millions of users who have revolutionized their team communication with ChatFlow - completely free.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link to="/register" className="group bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-full text-lg font-semibold transition-all transform hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/25 flex items-center space-x-2">
              <span>Get Started Free</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <button className="text-gray-300 hover:text-white transition-colors px-8 py-4">
              Schedule a Demo
            </button>
          </div>

          <div className="mt-8 flex justify-center items-center space-x-6 text-sm text-gray-400">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-green-400" />
              <span>Completely free forever</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-green-400" />
              <span>No hidden fees</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-green-400" />
              <span>Unlimited usage</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-gray-800/50">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <MessageCircle className="w-8 h-8 text-blue-500" />
              <Link to="/" className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                ChatFlow
              </Link>
            </div>
            <div className="text-gray-400 text-sm">
              © 2024 ChatFlow. All rights reserved.
            </div>
          </div>
        </div>
      </footer>

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



}

function App() {
  const [loggeduser , setLoggedUser] = useState([]);
  const [onlineUserslist , setOnlineUsersList] = useState([]);
  const [selecteduser , setSelecteduser] = useState(null);
  const [friends, setFriends] = useState([]);
  const [mailtoverify , setmailtoverify] = useState(null);
   const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path='/' element={<RootLayout />}>
        <Route index element={<LandingPage />} />
        <Route path='login' element={<LoginPage />} />
        <Route path='register' element={<RegisterPage />} />
        <Route path='verifyemail' element={<EmailVerificationPage />} />

        <Route path='chat' element={<Authenticate><ChatPage /></Authenticate>} />
        <Route path='friends' element={<Authenticate><FriendsPage /></Authenticate>} />

        <Route path='profile' element={<Authenticate><ProfilePage /></Authenticate>} />
        
      </Route>
    )
  )
  return (
   <>
    <UserDetails.Provider value={{mailtoverify , setmailtoverify , loggeduser , setLoggedUser ,onlineUserslist , setOnlineUsersList , selecteduser , setSelecteduser ,friends, setFriends}}>
    <RouterProvider router={router} />
    </UserDetails.Provider>
    </>
  );
}

export default App;