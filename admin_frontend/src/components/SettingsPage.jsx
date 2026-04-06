import React, { useState, useRef } from 'react';
import { Mail, Phone, Camera, Lock, Eye, EyeOff, Check, AlertCircle } from 'lucide-react';

const SettingsPage = ({ user, onUpdateProfile, onUpdatePassword }) => {
  // Profile state - dynamic from user prop or defaults
  const [profile, setProfile] = useState({
    firstName: user?.firstName || 'Alexander',
    lastName: user?.lastName || 'Hamilton',
    email: user?.email || 'a.hamilton@architectural.io',
    mobile: user?.mobile || '+91 (555) 000-1234',
    avatar: user?.avatar || null
  });

  // Password state
  const [passwords, setPasswords] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // UI states
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileSaveSuccess, setProfileSaveSuccess] = useState(false);
  const [error, setError] = useState('');

  const fileInputRef = useRef(null);

  // Handle avatar change
  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfile(prev => ({ ...prev, avatar: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle profile field change
  const handleProfileChange = (field, value) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  // Handle password field change
  const handlePasswordChange = (field, value) => {
    setPasswords(prev => ({ ...prev, [field]: value }));
    setError('');
  };

  // Save profile changes
  const handleSaveProfile = async () => {
    setProfileSaving(true);
    try {
      // Simulate API call or use provided callback
      if (onUpdateProfile) {
        await onUpdateProfile(profile);
      } else {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      setProfileSaveSuccess(true);
      setTimeout(() => setProfileSaveSuccess(false), 3000);
    } catch (err) {
      setError('Failed to update profile');
    } finally {
      setProfileSaving(false);
    }
  };

  // Save password changes
  const handleSavePassword = async () => {
    // Validation
    if (!passwords.oldPassword || !passwords.newPassword || !passwords.confirmPassword) {
      setError('Please fill in all password fields');
      return;
    }
    if (passwords.newPassword !== passwords.confirmPassword) {
      setError('New passwords do not match');
      return;
    }
    if (passwords.newPassword.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    setSaving(true);
    setError('');
    try {
      // Simulate API call or use provided callback
      if (onUpdatePassword) {
        await onUpdatePassword(passwords);
      } else {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      setSaveSuccess(true);
      setPasswords({ oldPassword: '', newPassword: '', confirmPassword: '' });
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      setError('Failed to update password');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-6 lg:p-8 animate-fade-in">
      {/* Profile Settings Card */}
      <div className="bg-white dark:bg-dark-card rounded-xl border border-gray-200 dark:border-dark-border p-6 lg:p-8 mb-6 transition-all duration-300 hover:shadow-lg">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-secondary dark:text-white">Profile Settings</h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
            Update your personal information and how others see you.
          </p>
        </div>

        <div className="bg-gray-50 dark:bg-dark-border/50 rounded-xl p-6 lg:p-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Avatar Section */}
            <div className="flex flex-col items-center">
              <div className="relative group">
                <div className="w-28 h-28 rounded-full overflow-hidden bg-gray-200 dark:bg-dark-border border-4 border-white dark:border-dark-card shadow-lg">
                  {profile.avatar ? (
                    <img 
                      src={profile.avatar} 
                      alt="Profile" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-amber-100 to-amber-200 flex items-center justify-center">
                      <span className="text-3xl font-bold text-amber-600">
                        {profile.firstName.charAt(0)}{profile.lastName.charAt(0)}
                      </span>
                    </div>
                  )}
                </div>
                {/* Camera overlay */}
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-1 right-1 w-8 h-8 bg-primary rounded-full flex items-center justify-center shadow-lg hover:bg-primary-hover transition-all duration-200 hover:scale-110"
                >
                  <Camera className="w-4 h-4 text-white" />
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="hidden"
                />
              </div>
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="mt-3 text-primary hover:text-primary-hover text-sm font-medium transition-colors"
              >
                Change Photo
              </button>
            </div>

            {/* Form Fields */}
            <div className="flex-1 space-y-5">
              {/* First Name & Last Name */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-secondary dark:text-gray-300 mb-2">
                    First Name
                  </label>
                  <input
                    type="text"
                    value={profile.firstName}
                    onChange={(e) => handleProfileChange('firstName', e.target.value)}
                    className="w-full px-4 py-3 bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-xl text-secondary dark:text-white text-sm focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 hover:border-primary/50"
                    placeholder="Enter first name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary dark:text-gray-300 mb-2">
                    Last Name
                  </label>
                  <input
                    type="text"
                    value={profile.lastName}
                    onChange={(e) => handleProfileChange('lastName', e.target.value)}
                    className="w-full px-4 py-3 bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-xl text-secondary dark:text-white text-sm focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 hover:border-primary/50"
                    placeholder="Enter last name"
                  />
                </div>
              </div>

              {/* Email Address */}
              <div>
                <label className="block text-sm font-medium text-secondary dark:text-gray-300 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    value={profile.email}
                    onChange={(e) => handleProfileChange('email', e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-xl text-secondary dark:text-white text-sm focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 hover:border-primary/50"
                    placeholder="Enter email address"
                  />
                </div>
              </div>

              {/* Mobile Number */}
              <div>
                <label className="block text-sm font-medium text-secondary dark:text-gray-300 mb-2">
                  Mobile Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="tel"
                    value={profile.mobile}
                    onChange={(e) => handleProfileChange('mobile', e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-xl text-secondary dark:text-white text-sm focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 hover:border-primary/50"
                    placeholder="Enter mobile number"
                  />
                </div>
              </div>

              {/* Save Profile Button - Optional */}
              {profileSaveSuccess && (
                <div className="flex items-center gap-2 text-green-600 text-sm animate-fade-in">
                  <Check className="w-4 h-4" />
                  Profile updated successfully!
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Security & Password Card */}
      <div className="bg-white dark:bg-dark-card rounded-xl border border-gray-200 dark:border-dark-border p-6 lg:p-8 transition-all duration-300 hover:shadow-lg">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-secondary dark:text-white">Security & Password</h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
            Manage your account authentication details.
          </p>
        </div>

        <div className="bg-gray-50 dark:bg-dark-border/50 rounded-xl p-6 lg:p-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left side - Icon and description */}
            <div className="lg:w-1/3">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Lock className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-secondary dark:text-white">Update Password</h3>
                  <p className="text-gray-500 dark:text-gray-400 text-sm mt-2 leading-relaxed">
                    Ensure your account is using a long, random password to stay secure. We recommend using a password manager.
                  </p>
                </div>
              </div>
            </div>

            {/* Right side - Password fields */}
            <div className="flex-1 space-y-5">
              {/* Old Password */}
              <div>
                <label className="block text-sm font-medium text-secondary dark:text-gray-300 mb-2">
                  Old Password
                </label>
                <div className="relative">
                  <input
                    type={showOldPassword ? 'text' : 'password'}
                    value={passwords.oldPassword}
                    onChange={(e) => handlePasswordChange('oldPassword', e.target.value)}
                    className="w-full px-4 py-3 pr-12 bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-xl text-secondary dark:text-white text-sm focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 hover:border-primary/50"
                    placeholder="••••••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowOldPassword(!showOldPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                  >
                    {showOldPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* New Password & Confirm Password */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-secondary dark:text-gray-300 mb-2">
                    New Passwrod
                  </label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? 'text' : 'password'}
                      value={passwords.newPassword}
                      onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
                      className="w-full px-4 py-3 pr-12 bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-xl text-secondary dark:text-white text-sm focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 hover:border-primary/50"
                      placeholder="••••••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                    >
                      {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary dark:text-gray-300 mb-2">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={passwords.confirmPassword}
                      onChange={(e) => handlePasswordChange('confirmPassword', e.target.value)}
                      className="w-full px-4 py-3 pr-12 bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-xl text-secondary dark:text-white text-sm focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 hover:border-primary/50"
                      placeholder="••••••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="flex items-center gap-2 text-red-500 text-sm animate-fade-in">
                  <AlertCircle className="w-4 h-4" />
                  {error}
                </div>
              )}

              {/* Success Message */}
              {saveSuccess && (
                <div className="flex items-center gap-2 text-green-600 text-sm animate-fade-in">
                  <Check className="w-4 h-4" />
                  Password updated successfully!
                </div>
              )}

              {/* Save Button */}
              <div className="flex justify-end pt-2">
                <button
                  onClick={handleSavePassword}
                  disabled={saving}
                  className="px-8 py-3 bg-primary text-white rounded-xl text-sm font-medium hover:bg-primary-hover transition-all duration-200 hover:shadow-lg hover:shadow-primary/25 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {saving ? (
                    <>
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Saving...
                    </>
                  ) : (
                    'Save Changes'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
