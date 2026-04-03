import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, User, Eye, EyeOff, CheckCircle, AlertCircle, Send, Sparkles, Heart } from 'lucide-react';

const Register = () => {
  const { sendOTP, verifyOTP, register } = useAuth();

  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    otp: ''
  });

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSendOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');
    try {
      await sendOTP(form.email);
      setMessage('OTP sent to your email.');
      setStep(2);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');
    try {
      await verifyOTP({ email: form.email, otp: form.otp });
      await register({
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        password: form.password
      });
      setMessage('Registration successful! You can now log in.');
      setStep(3);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-8">
      <div className="flex items-center space-x-4">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-500 shadow-lg ${
          step >= 1 ? 'bg-gradient-to-r from-primary to-primary text-white shadow-yellow-200' : 'bg-gray-200 text-gray-500'
        }`}>
          1
        </div>
        <div className={`h-2 w-16 rounded-full transition-all duration-500 ${
          step >= 2 ? 'bg-gradient-to-r from-primary to-primary' : 'bg-gray-200'
        }`}></div>
        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-500 shadow-lg ${
          step >= 2 ? 'bg-gradient-to-r from-primary to-primary text-white shadow-yellow-200' : 'bg-gray-200 text-gray-500'
        }`}>
          2
        </div>
        <div className={`h-2 w-16 rounded-full transition-all duration-500 ${
          step >= 3 ? 'bg-gradient-to-r from-primary to-primary' : 'bg-gray-200'
        }`}></div>
        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-500 shadow-lg ${
          step >= 3 ? 'bg-gradient-to-r from-primary to-primary text-white shadow-yellow-200' : 'bg-gray-200 text-gray-500'
        }`}>
          3
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-primary/20 to-primary/30 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-primary to-primary rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-secondary to-accent rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-60 h-60 bg-gradient-to-br from-primary/40 to-primary/80 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse animation-delay-4000"></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-primary via-primary to-primary p-8 text-center relative">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary/30"></div>
            <div className="relative z-10">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
              </div>
              <h2 className="text-3xl font-bold text-white font-spartan mb-2">
                Join Our Community
              </h2>
              <p className="text-white/90 text-sm">Create your account and start your journey</p>
            </div>
          </div>
          
          <div className="p-8">
            {renderStepIndicator()}

            {/* Messages */}
            {message && (
              <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-primary/10 to-primary/20 border border-green-200 flex items-center space-x-3 animate-in slide-in-from-top-1 duration-300">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
                <span className="text-green-700 text-sm font-medium">{message}</span>
              </div>
            )}
            
            {error && (
              <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-red-50 to-primary/10 border border-red-200 flex items-center space-x-3 animate-in slide-in-from-top-1 duration-300">
                <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                  <AlertCircle className="w-5 h-5 text-red-600" />
                </div>
                <span className="text-red-700 text-sm font-medium">{error}</span>
              </div>
            )}

            {/* Step 1: Email Input */}
            {step === 1 && (
              <form onSubmit={handleSendOTP} className="space-y-6 animate-in slide-in-from-right-1 duration-500">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Email Address</label>
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-300"></div>
                    <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-primary transition-colors duration-200 z-10" />
                    <input
                      className="relative z-10 w-full pl-12 pr-4 py-4 bg-gray-50/80 border-2 border-gray-200 rounded-2xl text-gray-800 placeholder-gray-400 focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/20 focus:outline-none transition-all duration-300"
                      name="email"
                      type="email"
                      placeholder="Enter your email address"
                      value={form.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
                
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-primary via-primary to-primary text-white font-bold py-4 px-6 rounded-2xl hover:from-primary hover:to-primary transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center space-x-3 shadow-lg hover:shadow-xl"
                  disabled={loading}
                >
                  {loading ? (
                    <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      <span>Send Verification Code</span>
                    </>
                  )}
                </button>
              </form>
            )}

            {/* Step 2: Registration Form */}
            {step === 2 && (
              <form onSubmit={handleRegister} className="space-y-6 animate-in slide-in-from-right-1 duration-500">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">First Name</label>
                    <div className="relative group">
                      <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-300"></div>
                      <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-primary transition-colors duration-200 z-10" />
                      <input
                        className="relative z-10 w-full pl-12 pr-4 py-4 bg-gray-50/80 border-2 border-gray-200 rounded-2xl text-gray-800 placeholder-gray-400 focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/20 focus:outline-none transition-all duration-300"
                        name="firstName"
                        type="text"
                        placeholder="John"
                        value={form.firstName}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">Last Name</label>
                    <div className="relative group">
                      <div className="absolute inset-0 bg-gradient-to-r from-secondary/10 to-accent/10 rounded-2xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-300"></div>
                      <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-secondary transition-colors duration-200 z-10" />
                      <input
                        className="relative z-10 w-full pl-12 pr-4 py-4 bg-gray-50/80 border-2 border-gray-200 rounded-2xl text-gray-800 placeholder-gray-400 focus:border-secondary focus:bg-white focus:ring-4 focus:ring-secondary/20 focus:outline-none transition-all duration-300"
                        name="lastName"
                        type="text"
                        placeholder="Doe"
                        value={form.lastName}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Password</label>
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-accent/10 rounded-2xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-300"></div>
                    <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-primary transition-colors duration-200 z-10" />
                    <input
                      className="relative z-10 w-full pl-12 pr-14 py-4 bg-gray-50/80 border-2 border-gray-200 rounded-2xl text-gray-800 placeholder-gray-400 focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/20 focus:outline-none transition-all duration-300"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Create a strong password"
                      value={form.password}
                      onChange={handleChange}
                      required
                    />
                    <button
                      type="button"
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors z-10"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Verification Code</label>
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-primary/30 rounded-2xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-300"></div>
                    <input
                      className="relative z-10 w-full px-4 py-4 bg-gray-50/80 border-2 border-gray-200 rounded-2xl text-gray-800 text-center text-2xl font-mono tracking-widest placeholder-gray-400 focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/20 focus:outline-none transition-all duration-300"
                      name="otp"
                      type="text"
                      placeholder="••••••"
                      value={form.otp}
                      onChange={handleChange}
                      maxLength={6}
                      required
                    />
                  </div>
                  <p className="text-xs text-gray-500 text-center">Enter the 6-digit code sent to your email</p>
                </div>
                
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-primary via-primary to-primary text-white font-bold py-4 px-6 rounded-2xl hover:from-primary hover:to-primary transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center space-x-3 shadow-lg hover:shadow-xl"
                  disabled={loading}
                >
                  {loading ? (
                    <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <Heart className="w-5 h-5" />
                      <span>Create My Account</span>
                    </>
                  )}
                </button>
              </form>
            )}

            {/* Step 3: Success */}
            {step === 3 && (
              <div className="text-center space-y-8 animate-in slide-in-from-right-1 duration-500">
                <div className="relative">
                  <div className="w-24 h-24 bg-gradient-to-r from-primary/20 to-primary/40 rounded-full flex items-center justify-center mx-auto shadow-lg">
                    <CheckCircle className="w-12 h-12 text-green-500" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-primary to-primary/50 rounded-full flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-3">Welcome to Our Family! 🎉</h3>
                  <p className="text-gray-600 leading-relaxed">Your account has been created successfully. Get ready to explore amazing features and connect with our community.</p>
                </div>
                <button
                  onClick={() => window.location.href = '/login'}
                  className="bg-gradient-to-r from-primary via-primary to-primary text-white font-bold py-4 px-8 rounded-2xl hover:from-primary hover:to-primary transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl"
                >
                  Start Your Journey
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
