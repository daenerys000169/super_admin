import React from 'react';
import { useAuth } from '../context/AuthContext';
import { LogOut, User, Mail, Calendar, CheckCircle, Rocket, FileText, ArrowRight } from 'lucide-react';
import Navbar from '../components/Navbar';
import ApplicationForm from '../components/ApplicationForm';

const ApplicationPage = () => {
  const { user, logout } = useAuth();
  const [showForm, setShowForm] = React.useState(false);

  const handleLogout = () => {
    logout();
  };

  if (showForm) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-blue-50">
        <Navbar />
        <div className="pt-16">
          <ApplicationForm />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-blue-50 font-sans">
      {/* Navbar with Logout */}
      <div className="relative">
        <Navbar />
        <div className="fixed top-4 right-4 z-50">
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors font-medium inline-flex items-center gap-2 shadow-lg"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
        {/* Welcome Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="flex items-center mb-6">
            <CheckCircle className="w-8 h-8 text-green-500 mr-3" />
            <h1 className="text-3xl font-bold text-secondary font-spartan">Welcome, {user?.firstName}!</h1>
          </div>
          <p className="text-lg text-gray-600 mb-6">
            Your registration was successful. You now have access to our application portal.
          </p>
          
          {/* User Info Card */}
          <div className="bg-yellow-50 rounded-xl p-6">
            <h2 className="text-xl font-semibold text-secondary mb-4 font-spartan">Your Account Information</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-center">
                <User className="w-5 h-5 text-gray-400 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Full Name</p>
                  <p className="font-medium text-secondary">{user?.firstName} {user?.lastName}</p>
                </div>
              </div>
              <div className="flex items-center">
                <Mail className="w-5 h-5 text-gray-400 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Email Address</p>
                  <p className="font-medium text-secondary">{user?.email}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Dashboard Sections */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-secondary mb-6 font-spartan">Quick Actions</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <button 
                  onClick={() => setShowForm(true)}
                  className="p-6 bg-yellow-50 rounded-xl hover:bg-yellow-100 transition-colors text-left"
                >
                  <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mb-4">
                    <FileText className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-secondary mb-2 font-spartan">Start Application</h3>
                  <p className="text-gray-600 text-sm">Fill out your funding application form</p>
                </button>
                
                <button className="p-6 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors text-left">
                  <div className="w-12 h-12 bg-accent rounded-lg flex items-center justify-center mb-4">
                    <Calendar className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-secondary mb-2 font-spartan">Schedule Interview</h3>
                  <p className="text-gray-600 text-sm">Book your next interview slot</p>
                </button>
                
                <button className="p-6 bg-green-50 rounded-xl hover:bg-green-100 transition-colors text-left">
                  <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center mb-4">
                    <CheckCircle className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-secondary mb-2 font-spartan">View Applications</h3>
                  <p className="text-gray-600 text-sm">Check your application status</p>
                </button>
                
                <button className="p-6 bg-purple-50 rounded-xl hover:bg-purple-100 transition-colors text-left">
                  <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center mb-4">
                    <User className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-secondary mb-2 font-spartan">Profile Settings</h3>
                  <p className="text-gray-600 text-sm">Update your profile information</p>
                </button>
              </div>
            </div>
          </div>

          {/* Status Panel */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-xl font-bold text-secondary mb-6 font-spartan">Application Status</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                <div>
                  <p className="font-medium text-green-900 font-spartan">Profile</p>
                  <p className="text-sm text-green-600">Complete</p>
                </div>
                <CheckCircle className="w-5 h-5 text-green-500" />
              </div>
              
              <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg">
                <div>
                  <p className="font-medium text-yellow-900 font-spartan">Documents</p>
                  <p className="text-sm text-yellow-600">Pending</p>
                </div>
                <Calendar className="w-5 h-5 text-yellow-500" />
              </div>
              
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-secondary font-spartan">Interview</p>
                  <p className="text-sm text-gray-600">Not scheduled</p>
                </div>
                <Calendar className="w-5 h-5 text-gray-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Additional Information */}
        <div className="mt-8 bg-white rounded-2xl shadow-lg p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-secondary font-spartan">Ready to Apply?</h2>
            <button 
              onClick={() => setShowForm(true)}
              className="bg-primary text-secondary px-6 py-3 rounded-xl font-semibold hover:bg-yellow-600 transition-all transform hover:scale-105 shadow-lg hover:shadow-xl inline-flex items-center gap-2"
            >
              Start Application
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="font-semibold text-secondary mb-2 font-spartan">Complete Application</h3>
              <p className="text-gray-600 text-sm">Fill out our comprehensive application form with your startup details</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="font-semibold text-secondary mb-2 font-spartan">Review Process</h3>
              <p className="text-gray-600 text-sm">Our team will review your application and get back to you</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Rocket className="w-8 h-8 text-yellow-600" />
              </div>
              <h3 className="font-semibold text-secondary mb-2 font-spartan">Get Support</h3>
              <p className="text-gray-600 text-sm">Receive funding, mentorship, and resources to grow your startup</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ApplicationPage;