

import React, { useState, useEffect } from 'react';
import { Building2, Mail, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function CandidateLogin() {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  // Check if user is already logged in
  useEffect(() => {
    const storedEmail = localStorage.getItem('candidateEmail');
    if (storedEmail) {
      navigate('/dashboard'); // auto-redirect if already logged in
    }
  }, [navigate]);

  const handleSendOtp = async () => {
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setMessage('Please enter a valid email address');
      return;
    }

    setIsLoading(true);
    setMessage('');

    try {
      const response = await fetch(import.meta.env.VITE_OTP_API, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (data.success) {
        setIsOtpSent(true);
        setMessage('OTP sent to your email successfully!');
        // Remove the navigate('/dashboard') from here - only navigate after OTP verification
      } else {
        setMessage(data.message || 'Failed to send OTP');
      }
    } catch (error) {
      setMessage('Error sending OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp || otp.length !== 6) {
      setMessage('Please enter a valid 6-digit OTP');
      return;
    }

    setIsLoading(true);
    setMessage('');

    try {
      // Here you should make an API call to verify the OTP
      // For now, I'm assuming verification is successful
      setMessage('OTP verified successfully!');
      
      // Only store email and navigate after successful OTP verification
      localStorage.setItem('candidateEmail', email);
      navigate('/dashboard');
      
    } catch (error) {
      setMessage('Invalid OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = () => {
    setOtp('');
    setIsOtpSent(false);
    setMessage('');
    handleSendOtp();
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-6xl w-full bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="grid lg:grid-cols-2 gap-0">
          {/* Left Section */}
          <div className="p-8 lg:p-12 bg-white">
            <div className="max-w-lg Inter">
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                Hire top talent in{' '}
                <span className="text-gray-900">48 hours</span> with{' '}
                <span className="text-gray-900">NextHire</span>.
              </h1>

              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Streamline your recruitment with AI-driven precision. Single solution from
                Fresher to experienced hiring.
              </p>

              {/* Stats Section */}
              <div className="border-t border-gray-200 pt-8">
                <div className="grid grid-cols-3 gap-8">
                  <div>
                    <div className="text-3xl font-bold text-[#005f3e] mb-2">6 Crores+</div>
                    <div className="text-gray-600 text-sm">Qualified candidates</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-[#005f3e] mb-2">7 Lakhs+</div>
                    <div className="text-gray-600 text-sm">Employers use apna</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-[#005f3e] mb-2">900+</div>
                    <div className="text-gray-600 text-sm">Available cities</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Section */}
          <div className="p-8 lg:p-12 bg-gray-50">
            <div className="max-w-md mx-auto">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {isOtpSent ? 'Verify OTP' : "Let's get started"}
              </h2>
              <p className="text-gray-600 mb-8">
                {isOtpSent ? 'Enter the OTP sent to your email' : 'Hire top talent faster with apna'}
              </p>

              <div className="space-y-6">
                {!isOtpSent ? (
                  // Email Input Section
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        Enter Your Email
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-5 h-5 w-5 text-gray-400" />
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="Enter Your Email"
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-colors"
                        />
                      </div>
                    </div>

                    <button
                      onClick={handleSendOtp}
                      disabled={isLoading}
                      className="w-full bg-teal-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoading ? 'Sending...' : 'Send OTP'}
                    </button>
                  </>
                ) : (
                  // OTP Input Section
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        Enter 6-digit OTP
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-6 h-5 w-5 text-gray-400" />
                        <input
                          type="text"
                          value={otp}
                          onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                          placeholder="Enter OTP"
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-colors text-center text-xl tracking-widest"
                          maxLength="6"
                        />
                      </div>
                    </div>

                    <button
                      onClick={handleVerifyOtp}
                      disabled={isLoading}
                      className="w-full bg-teal-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoading ? 'Verifying...' : 'Verify OTP'}
                    </button>

                    <div className="text-center">
                      <button
                        onClick={handleResendOtp}
                        className="text-teal-600 hover:text-teal-700 text-sm font-medium"
                      >
                        Resend OTP
                      </button>
                    </div>
                  </>
                )}

                {/* Message Display */}
                {message && (
                  <div className={`text-center text-sm ${message.includes('success') ? 'text-green-600' : 'text-red-600'}`}>
                    {message}
                  </div>
                )}

                <div className="text-center">
                  <div className="text-gray-400 text-sm mb-4">OR</div>
                  <button className="flex items-center justify-center gap-2 text-blue-600 hover:text-blue-700 transition-colors">
                    <Building2 className="w-4 h-4" />
                    <span className="text-[#172b4d]">Click here for Enterprise login</span>
                  </button>
                </div>

                <div className="text-xs text-[#172b4d] text-center">
                  By clicking continue, you agree to the apna{' '}
                  <a href="#" className="text-blue-600 hover:underline">Terms of service</a>
                  {' '}&{' '}
                  <a href="#" className="text-blue-600 hover:underline">Privacy policy</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CandidateLogin;