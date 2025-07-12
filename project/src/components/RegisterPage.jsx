import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../config/api';
import { 
  MessageCircle, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowRight,
  Github,
  Chrome,
  User,
  CheckCircle2
} from 'lucide-react';
import { UserDetails } from '../context/UserContext';

const RegisterPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const {mailtoverify , setmailtoverify} = useContext(UserDetails);
  const navigate = useNavigate();
  //sai:
    const [registerstate , setRegisterState] = useState(null);
  const [formData, setFormData] = useState({
    fullname: '',
    email: '',
    password: '',
    
  });
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const floatingElements = [
    { id: 1, size: 'w-4 h-4', delay: '0s', x: '15%', y: '25%' },
    { id: 2, size: 'w-6 h-6', delay: '3s', x: '85%', y: '20%' },
    { id: 3, size: 'w-3 h-3', delay: '6s', x: '10%', y: '75%' },
    { id: 4, size: 'w-5 h-5', delay: '9s', x: '90%', y: '80%' },
  ];

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Handle registration logic here
    console.log('Registration attempt:', formData);
    
    if (!formData.fullname || !formData.email || !formData.password) {
      setRegisterState("Please fill in all fields");
      return;
    }
    
    if (formData.password.length < 6) {
      setRegisterState("Password must be at least 6 characters long");
      return;
    }
    
    //sai:
     try{
      setRegisterState("Creating account...");

     const response = await fetch(`${API_BASE_URL}/chat/register` ,{
      method: 'POST',
      headers : {"content-type":"application/json"},
      body: JSON.stringify(formData)
     })
     const result = await response.json();
     console.log("response" , response , "result : " , result);
     if(! response.ok){
      setRegisterState(result.message);
     }else{
      setmailtoverify(formData.email);
      setRegisterState("user registered successful");
      navigate('/verifyemail');

     }
    }catch(err){
      setRegisterState(`Server or network error | try again later`);
      console.log("error in register page :" , err);
    }

  };

  const passwordRequirements = [
    { text: 'At least 8 characters', met: formData.password.length >= 8 },
    { text: 'Contains uppercase letter', met: /[A-Z]/.test(formData.password) },
    { text: 'Contains lowercase letter', met: /[a-z]/.test(formData.password) },
    { text: 'Contains number', met: /\d/.test(formData.password) },
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white overflow-hidden flex items-center justify-center py-8">
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

      {/* Register Form */}
      <div className="relative z-10 w-full max-w-md mx-4">
        <div className="bg-gray-900/80 backdrop-blur-xl border border-gray-700/50 rounded-3xl p-8 shadow-2xl">
          {/* Header */}
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center space-x-2 mb-6 group">
              <MessageCircle className="w-8 h-8 text-blue-500 group-hover:scale-110 transition-transform" />
              <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                ChatFlow
              </span>
            </Link>
            <h1 className="text-3xl font-bold mb-2">Create Account</h1>
            <p className="text-gray-400">Join millions of users worldwide</p>
          </div>

          {/* Social Login */}
          {/* <div className="space-y-3 mb-6">
            <button className="w-full bg-gray-800/50 hover:bg-gray-700/50 border border-gray-600/50 rounded-xl py-3 px-4 flex items-center justify-center space-x-3 transition-all transform hover:scale-[1.02]">
              <Chrome className="w-5 h-5" />
              <span>Continue with Google</span>
            </button>
            <button className="w-full bg-gray-800/50 hover:bg-gray-700/50 border border-gray-600/50 rounded-xl py-3 px-4 flex items-center justify-center space-x-3 transition-all transform hover:scale-[1.02]">
              <Github className="w-5 h-5" />
              <span>Continue with GitHub</span>
            </button>
          </div> */}

          {/* Divider */}
          {/* <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-600/50"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-gray-900/80 text-gray-400">or create with email</span>
            </div>
          </div> */}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  name="fullname"
                  placeholder="Full name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full bg-gray-800/50 border border-gray-600/50 rounded-xl py-3 pl-12 pr-4 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all"
                  required
                />
              </div>

              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  placeholder="Email address"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full bg-gray-800/50 border border-gray-600/50 rounded-xl py-3 pl-12 pr-4 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all"
                  required
                />
              </div>

              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  placeholder="Create password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full bg-gray-800/50 border border-gray-600/50 rounded-xl py-3 pl-12 pr-12 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>

              <div className="relative">
                {/* <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  placeholder="Confirm password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="w-full bg-gray-800/50 border border-gray-600/50 rounded-xl py-3 pl-12 pr-12 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all"
                  required
                /> */}
                {/* <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button> */}
              </div>
            </div>

            {/* Password Requirements */}
            {formData.password && (
              <div className="bg-gray-800/30 rounded-xl p-4 space-y-2">
                <p className="text-sm text-gray-300 font-medium">Password requirements:</p>
                {passwordRequirements.map((req, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <CheckCircle2 
                      className={`w-4 h-4 ${req.met ? 'text-green-400' : 'text-gray-500'}`} 
                    />
                    <span className={`text-sm ${req.met ? 'text-green-400' : 'text-gray-400'}`}>
                      {req.text}
                    </span>
                  </div>
                ))}
              </div>
            )}

            <div className="flex items-start space-x-2">
              <input 
                type="checkbox" 
                id="terms"
                className="w-4 h-4 text-blue-600 bg-gray-800 border-gray-600 rounded focus:ring-blue-500 focus:ring-2 mt-1" 
                required
              />
              <label htmlFor="terms" className="text-sm text-gray-400">
                I agree to the{' '}
                <a href="#" className="text-blue-400 hover:text-blue-300 transition-colors">
                  Terms of Service
                </a>{' '}
                and{' '}
                <a href="#" className="text-blue-400 hover:text-blue-300 transition-colors">
                  Privacy Policy
                </a>
              </label>
            </div>
             {registerstate && <p>{registerstate}</p>}
            <button
              type="submit"
              className="group w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-xl font-semibold transition-all transform hover:scale-[1.02] hover:shadow-2xl hover:shadow-blue-500/25 flex items-center justify-center space-x-2"
            >
              <span>Create Account</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          {/* Footer */}
          <div className="text-center mt-6">
            <p className="text-gray-400">
              Already have an account?{' '}
              <Link to="/login" className="text-blue-400 hover:text-blue-300 transition-colors font-semibold">
                Sign in
              </Link>
            </p>
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

export default RegisterPage;