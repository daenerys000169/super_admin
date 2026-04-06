import React, { useState, useEffect } from 'react';
import API from '../utils/axiosInstance';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Users, FileText, Settings, Contact } from 'lucide-react';

// Import components
import Sidebar from './Sidebar';
import Header from './Header';
import Dashboard from './Dashboard';
import ApplicationsPage from './ApplicationsPage';
import ApplicationDetails from './ApplicationDetails';
import StartupApplicationForm from './StartupApplicationForm';
import UsersManagement from './UsersManagement';
import UserLoginHistory from './UserLoginHistory';
import StagePage from './StagePage';
import DonationPage from './DonationPage';
import SettingsPage from './SettingsPage';
import CampaignsPage from './CampaignsPage';
import ContactManagement from './ContactManagement';
import ChatManagement from './ChatManagement';
import AdminInterviewManager from './AdminInterviewManager';
import ScheduleInterviewModal from './ScheduleInterviewModal';
import sendScheduleInterviewMail from './sendScheduleInterviewMail';

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [applications, setApplications] = useState([]);
  const [donations, setDonations] = useState([]);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [viewMode, setViewMode] = useState('list'); // 'list', 'details', 'edit'
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);
  const [schedulingApp, setSchedulingApp] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : false;
  });

  const { logout } = useAuth();
  const navigate = useNavigate();

  // Apply dark mode class to html element
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]);

  // Fetch applications
  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const res = await API.get('/applications');
        setApplications(res.data);
      } catch (err) {
        console.error('Failed to fetch applications', err);
        setApplications([]);
      }
    };
    fetchApplications();
  }, []);

  // Fetch donations
  useEffect(() => {
    const fetchDonations = async () => {
      try {
        const res = await API.get('/donations');
        setDonations(res.data);
      } catch (err) {
        console.error('Failed to fetch donations', err);
        setDonations([]);
      }
    };
    fetchDonations();
  }, []);

  const handleScheduleConfirm = async (date, time, additionalData) => {
    if (!schedulingApp) return;
    try {
      await sendScheduleInterviewMail(schedulingApp.email, schedulingApp.fullName, date, time);
      setScheduleModalOpen(false);
      setSchedulingApp(null);
      alert('Interview invitation sent successfully!');
    } catch (error) {
      console.error('Error sending schedule mail:', error);
      alert(`Failed to send invitation: ${error.message}`);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleViewApplication = (app) => {
    setSelectedApplication(app);
    setViewMode('details');
  };

  const handleBackToList = () => {
    setSelectedApplication(null);
    setViewMode('list');
  };

  const handleEditApplication = (app) => {
    setSelectedApplication(app);
    setViewMode('edit');
  };

  const handleScheduleInterview = (app) => {
    setSchedulingApp(app);
    setScheduleModalOpen(true);
  };

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      await API.patch(`/applications/${id}/status`, { status: newStatus });
      setApplications(prev =>
        prev.map(app =>
          app.id === id ? { ...app, status: newStatus } : app
        )
      );
      // Update selected application if it's the one being modified
      if (selectedApplication?.id === id) {
        setSelectedApplication(prev => ({ ...prev, status: newStatus }));
      }
    } catch (error) {
      console.error('Failed to update status:', error);
      alert('Failed to update application status');
    }
  };

  const handleFormSubmit = async (formData) => {
    try {
      if (selectedApplication) {
        // Update existing application
        await API.put(`/applications/${selectedApplication.id}`, formData);
        setApplications(prev =>
          prev.map(app =>
            app.id === selectedApplication.id ? { ...app, ...formData } : app
          )
        );
      } else {
        // Create new application
        const res = await API.post('/applications', formData);
        setApplications(prev => [...prev, res.data]);
      }
      setViewMode('list');
      setSelectedApplication(null);
    } catch (error) {
      console.error('Failed to save application:', error);
      alert('Failed to save application');
    }
  };

  const handleFormClose = () => {
    setViewMode('list');
    setSelectedApplication(null);
  };

  // Get page title based on active tab and view mode
  const getPageTitle = () => {
    if (activeTab === 'applications') {
      if (viewMode === 'details') return 'Dashboard';
      if (viewMode === 'edit') return 'Dashboard';
    }
    const titles = {
      dashboard: 'Dashboard',
      applications: 'Dashboard',
      users: 'User Login History',
      stage: 'Stage',
      donation: 'General Settings',
      campaigns: 'Campaigns',
      settings: 'Donation',
      help: 'Help Center',
      contactsdata: 'Contacts',
      chatwaydata: 'Chatway',
      admininterviewmanager: 'Manage Interview'
    };
    return titles[activeTab] || 'Dashboard';
  };

  // Render applications content based on view mode
  const renderApplicationsContent = () => {
    if (viewMode === 'details' && selectedApplication) {
      return (
        <ApplicationDetails
          application={selectedApplication}
          onBack={handleBackToList}
          onScheduleInterview={handleScheduleInterview}
          onEditApplication={handleEditApplication}
          onUpdateStatus={handleUpdateStatus}
        />
      );
    }

    if (viewMode === 'edit') {
      return (
        <StartupApplicationForm
          initialData={selectedApplication}
          onSubmit={handleFormSubmit}
          onClose={handleFormClose}
        />
      );
    }

    return (
      <ApplicationsPage
        applications={applications}
        onViewDetails={handleViewApplication}
        onScheduleInterview={handleScheduleInterview}
      />
    );
  };

  return (
    <div className={`min-h-screen bg-gray-50 dark:bg-dark-bg font-sans transition-colors duration-300`}>
      <div className="flex">
        {/* Sidebar */}
        <Sidebar 
          activeTab={activeTab} 
          setActiveTab={(tab) => {
            setActiveTab(tab);
            setViewMode('list');
            setSelectedApplication(null);
          }}
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          onLogout={handleLogout}
          isMobileMenuOpen={isMobileMenuOpen}
          setIsMobileMenuOpen={setIsMobileMenuOpen}
        />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-h-screen">
          <Header title={getPageTitle()} onMobileMenuToggle={() => setIsMobileMenuOpen(true)} />

          <main className="flex-1 overflow-auto">
            {activeTab === 'dashboard' && (
              <Dashboard 
                applications={applications} 
                donations={donations} 
                onViewApplication={handleViewApplication}
              />
            )}

            {activeTab === 'applications' && renderApplicationsContent()}

            {activeTab === 'users' && (
              <UserLoginHistory />
            )}

            {activeTab === 'contactsdata' && (
              <div className="p-8 animate-fade-in">
                <div className="bg-white dark:bg-dark-card rounded-xl border border-gray-100 dark:border-dark-border p-8 text-center mb-6">
                  <Contact className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-secondary dark:text-white mb-2">Contact Form Data</h3>
                  <p className="text-gray-600 dark:text-gray-400">Contact Form Data is displayed here</p>
                </div>
                <ContactManagement />
              </div>
            )}

            {activeTab === 'chatwaydata' && (
              <div className="p-8 animate-fade-in">
                <div className="bg-white dark:bg-dark-card rounded-xl border border-gray-100 dark:border-dark-border p-8 text-center mb-6">
                  <Contact className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-secondary dark:text-white mb-2">Chatway Data</h3>
                  <p className="text-gray-600 dark:text-gray-400">Chatway Data is displayed here</p>
                </div>
                <ChatManagement />
              </div>
            )}

            {activeTab === 'admininterviewmanager' && (
              <div className="p-8 animate-fade-in">
                <div className="bg-white dark:bg-dark-card rounded-xl border border-gray-100 dark:border-dark-border p-8 text-center mb-6">
                  <Contact className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-secondary dark:text-white mb-2">Manage Interview</h3>
                  <p className="text-gray-600 dark:text-gray-400">Interview data is available here</p>
                </div>
                <AdminInterviewManager />
              </div>
            )}

            {activeTab === 'stage' && (
              <StagePage applications={applications} />
            )}

            {activeTab === 'donation' && (
              <DonationPage donations={donations} />
            )}

            {activeTab === 'campaigns' && (
              <CampaignsPage donations={donations} />
            )}

            {activeTab === 'settings' && (
              <SettingsPage />
            )}

            {activeTab === 'help' && (
              <div className="p-8 animate-fade-in">
                <div className="bg-white dark:bg-dark-card rounded-xl border border-gray-100 dark:border-dark-border p-8 text-center">
                  <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-secondary dark:text-white mb-2">Help Center</h3>
                  <p className="text-gray-600 dark:text-gray-400">Help documentation will be available here</p>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Schedule Interview Modal */}
      {scheduleModalOpen && schedulingApp && (
        <ScheduleInterviewModal
          application={schedulingApp}
          onClose={() => {
            setScheduleModalOpen(false);
            setSchedulingApp(null);
          }}
          onConfirm={handleScheduleConfirm}
        />
      )}
    </div>
  );
};

export default AdminPanel;
