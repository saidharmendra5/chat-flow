import React, { useState, useEffect, useContext } from 'react';
import { API_BASE_URL } from '../config/api';
import { 
  MessageCircle, 
  Mail, 
  ArrowRight,
  CheckCircle2,
  RefreshCw,
  Clock,
  AlertCircle
} from 'lucide-react';

import { UserDetails } from '../context/UserContext';
import { Link, useNavigate } from 'react-router-dom';

const EmailVerificationPage = () => {
  const [verificationCode, setVerificationCode] = useState(['', '', '', '', '', '']);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState(null);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const {mailtoverify , setmailtoverify} = useContext(UserDetails);
  const navigate = useNavigate();

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const floatingElements = [
    { id: 1, size: 'w-4 h-4', delay: '0s', x: '15%', y: '25%' },
    { id: 2, size: 'w-6 h-6', delay: '3s', x: '85%', y: '20%' },
    { id: 3, size: 'w-3 h-3', delay: '6s', x: '10%', y: '75%' },
    { id: 4, size: 'w-5 h-5', delay: '9s', x: '90%', y: '80%' },
  ];

  const handleCodeChange = (index, value) => {
    if (value.length <= 1 && /^[0-9]*$/.test(value)) {
      const newCode = [...verificationCode];
      newCode[index] = value;
      setVerificationCode(newCode);

      // Auto-focus next input
      if (value && index < 5) {
        const nextInput = document.getElementById(`code-${index + 1}`);
        if (nextInput) nextInput.focus();
      }
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !verificationCode[index] && index > 0) {
      const prevInput = document.getElementById(`code-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const code = verificationCode.join('');
    
    if (code.length !== 6) {
      setVerificationStatus('Please enter the complete 6-digit code');
      return;
    }

    setIsVerifying(true);
    setVerificationStatus(null);

    const data = {
        OTP : code ,
        email : mailtoverify
    }
    console.log("mailtoverify at emailverification page :" , mailtoverify);
     try{

     const response = await fetch(`${API_BASE_URL}/chat/verifyuseremail` ,{
      method: 'POST',
      credentials: 'include', // to send & receive cookies.
      headers : {"content-type":"application/json"},
      body: JSON.stringify(data)
     })
     const result = await response.json();
     console.log("response at emailverification page " , response , "result at emailverification page : " , result);
     if(! response.ok){
      setVerificationStatus(result.message);
     }else{
      setVerificationStatus(result.message);
      setTimeout(() => {
        navigate('/chat');
      }, 1500);
     }
    } catch (error) {
      setVerificationStatus('Network error. Please try again.');
      console.log("error in email verification page : " , error);
    
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendCode = async () => {
    if (resendCooldown > 0) return;
    
    setResendCooldown(60);
    setVerificationStatus('Verification code sent! Check your email.');
    
    try {
      // Simulate API call to resend code
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      setVerificationStatus('Failed to resend code. Please try again.');
    }
  };

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

      {/* Verification Form */}
      <div className="relative z-10 w-full max-w-md mx-4">
        <div className="bg-gray-900/80 backdrop-blur-xl border border-gray-700/50 rounded-3xl p-8 shadow-2xl">
          {/* Header */}
          <div className="text-center mb-8">
            <a href="/" className="inline-flex items-center space-x-2 mb-6 group">
              <MessageCircle className="w-8 h-8 text-blue-500 group-hover:scale-110 transition-transform" />
              <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                ChatFlow
              </span>
            </a>
            <h1 className="text-3xl font-bold mb-2">Verify Your Email</h1>
            <p className="text-gray-400 mb-4">We've sent a 6-digit code to</p>
            <p className="text-blue-400 font-semibold">{mailtoverify}</p>
          </div>

          {/* Email Icon */}
          <div className="flex justify-center mb-8">
            <div className="relative">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                <Mail className="w-10 h-10 text-white" />
              </div>
              <div className="absolute -top-2 -right-2">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5 text-white" />
                </div>
              </div>
            </div>
          </div>

          {/* Verification Code Input */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-300 text-center">
                Enter verification code
              </label>
              <div className="flex justify-center space-x-3">
                {verificationCode.map((digit, index) => (
                  <input
                    key={index}
                    id={`code-${index}`}
                    type="text"
                    maxLength="1"
                    value={digit}
                    onChange={(e) => handleCodeChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className="w-12 h-14 text-center text-xl font-bold bg-gray-800/50 border border-gray-600/50 rounded-xl text-white focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all"
                    disabled={isVerifying}
                  />
                ))}
              </div>
            </div>

            {/* Status Messages */}
            {verificationStatus && (
              <div className={`text-center p-4 rounded-xl ${
                verificationStatus === 'success' 
                  ? 'bg-green-900/30 border border-green-500/50' 
                  : verificationStatus.includes('sent')
                  ? 'bg-blue-900/30 border border-blue-500/50'
                  : 'bg-red-900/30 border border-red-500/50'
              }`}>
                <div className="flex items-center justify-center space-x-2">
                  {verificationStatus === 'success' ? (
                    <CheckCircle2 className="w-5 h-5 text-green-400" />
                  ) : verificationStatus.includes('sent') ? (
                    <Mail className="w-5 h-5 text-blue-400" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-red-400" />
                  )}
                  <p className={`text-sm ${
                    verificationStatus === 'success' 
                      ? 'text-green-400' 
                      : verificationStatus.includes('sent')
                      ? 'text-blue-400'
                      : 'text-red-400'
                  }`}>
                    {verificationStatus === 'success' ? 'Email verified successfully!' : verificationStatus}
                  </p>
                </div>
              </div>
            )}

            {/* Verify Button */}
            <button
              type="submit"
              disabled={isVerifying || verificationCode.join('').length !== 6}
              className="group w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white py-3 px-4 rounded-xl font-semibold transition-all transform hover:scale-[1.02] hover:shadow-2xl hover:shadow-blue-500/25 flex items-center justify-center space-x-2"
            >
              {isVerifying ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  <span>Verifying...</span>
                </>
              ) : (
                <>
                  <span>Verify Email</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          {/* Resend Code */}
          <div className="text-center mt-6 space-y-3">
            <p className="text-gray-400 text-sm">Didn't receive the code?</p>
            <button
              onClick={handleResendCode}
              disabled={resendCooldown > 0}
              className={`text-sm font-semibold transition-colors ${
                resendCooldown > 0 
                  ? 'text-gray-500 cursor-not-allowed' 
                  : 'text-blue-400 hover:text-blue-300'
              }`}
            >
              {resendCooldown > 0 ? (
                <span className="flex items-center justify-center space-x-2">
                  <Clock className="w-4 h-4" />
                  <span>Resend in {resendCooldown}s</span>
                </span>
              ) : (
                'Resend verification code'
              )}
            </button>
          </div>

          {/* Footer */}
          <div className="text-center mt-6">
            <p className="text-gray-400 text-sm">
              Want to use a different email?{' '}
             <Link to="/register" className="text-blue-400 hover:text-blue-300 transition-colors font-semibold">Go back</Link> 
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

export default EmailVerificationPage;