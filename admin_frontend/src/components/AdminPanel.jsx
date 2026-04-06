import React, { useState, useEffect, useMemo } from 'react';
import API from '../utils/axiosInstance';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { 
  Search, Filter, Download, Eye, CheckCircle, XCircle, Clock, 
  TrendingUp, Building, Mail, Phone, Calendar, Star, AlertCircle, 
  MoreVertical, Edit, Send, Users, FileText, Settings, Contact
} from 'lucide-react';

// Import new components
import Sidebar from './Sidebar';
import Header from './Header';
import Dashboard from './Dashboard';
import UsersManagement from './UsersManagement';
import ContactManagement from './ContactManagement';
import ChatManagement from './ChatManagement';
import AdminInterviewManager from './AdminInterviewManager';
import ScheduleInterviewModal from './ScheduleInterviewModal';
import sendScheduleInterviewMail from './sendScheduleInterviewMail';

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [applications, setApplications] = useState([]);
  const [donations, setDonations] = useState([]);
  const [filteredApplications, setFilteredApplications] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [showApplicationModal, setShowApplicationModal] = useState(false);
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);
  const [schedulingApp, setSchedulingApp] = useState(null);
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
        setFilteredApplications(res.data);
      } catch (err) {
        console.error('Failed to fetch applications', err);
        setApplications([]);
        setFilteredApplications([]);
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

  const handleScheduleConfirm = async (date, time) => {
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

  // Filter applications
  useEffect(() => {
    let filtered = applications;
    if (searchTerm) {
      filtered = filtered.filter(app =>
        (app.fullName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (app.companyName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (app.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (app.applicationId || '').toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (statusFilter !== 'all') {
      filtered = filtered.filter(app => (app.status || '') === statusFilter);
    }
    setFilteredApplications(filtered);
  }, [searchTerm, statusFilter, applications]);

  const getStatusColor = (status) => {
    switch ((status || '').toLowerCase()) {
      case 'approved': return 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800';
      case 'rejected': return 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800';
      case 'under_review': return 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-800';
      case 'pending': return 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700';
      default: return 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700';
    }
  };

  const getStatusIcon = (status) => {
    switch ((status || '').toLowerCase()) {
      case 'approved': return <CheckCircle className="w-4 h-4" />;
      case 'rejected': return <XCircle className="w-4 h-4" />;
      case 'under_review': return <Clock className="w-4 h-4" />;
      case 'pending': return <AlertCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const updateApplicationStatus = async (id, newStatus) => {
    try {
      await API.patch(`/applications/${id}/status`, { status: newStatus });
      setApplications(prev =>
        prev.map(app =>
          app.id === id ? { ...app, status: newStatus } : app
        )
      );
    } catch (error) {
      console.error('Failed to update status:', error);
      alert('Failed to update application status');
    }
  };

  // Get page title based on active tab
  const getPageTitle = () => {
    const titles = {
      dashboard: 'Dashboard',
      applications: 'Applications',
      users: 'Users',
      stage: 'Stage',
      donation: 'Donations',
      campaigns: 'Campaigns',
      settings: 'Settings',
      help: 'Help Center',
      contactsdata: 'Contacts',
      chatwaydata: 'Chatway',
      admininterviewmanager: 'Manage Interview'
    };
    return titles[activeTab] || 'Dashboard';
  };

  // Application Modal Component
  const ApplicationModal = ({ application, onClose }) => (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-white dark:bg-dark-card rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto animate-scale-in">
        <div className="sticky top-0 bg-white dark:bg-dark-card border-b border-gray-200 dark:border-dark-border p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-secondary dark:text-white font-spartan">{application.companyName || 'N/A'}</h2>
              <p className="text-gray-600 dark:text-gray-400">{application.fullName || 'N/A'}</p>
            </div>
            <div className="flex items-center space-x-3">
              <div className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(application.status)}`}>
                <div className="flex items-center space-x-1">
                  {getStatusIcon(application.status)}
                  <span className="capitalize">{(application.status || '').replace('_', ' ')}</span>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-gray-100 dark:bg-dark-border flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                <XCircle className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-gray-50 dark:bg-dark-border rounded-xl p-6">
                <h3 className="text-lg font-semibold text-secondary dark:text-white mb-4 font-spartan">Business Overview</h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{application.businessDescription || 'N/A'}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-xl p-6">
                  <h4 className="font-semibold text-secondary dark:text-white mb-3 font-spartan">Company Details</h4>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <Building className="w-4 h-4 text-gray-400 mr-3" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">{application.entityType || 'N/A'}</span>
                    </div>
                    <div className="flex items-center">
                      <Users className="w-4 h-4 text-gray-400 mr-3" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">{application.teamMembers || 'N/A'} team members</span>
                    </div>
                    <div className="flex items-center">
                      <TrendingUp className="w-4 h-4 text-gray-400 mr-3" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">{application.currentStage || 'N/A'}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-xl p-6">
                  <h4 className="font-semibold text-secondary dark:text-white mb-3 font-spartan">Contact Information</h4>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <Mail className="w-4 h-4 text-gray-400 mr-3" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">{application.email || 'N/A'}</span>
                    </div>
                    <div className="flex items-center">
                      <Phone className="w-4 h-4 text-gray-400 mr-3" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">{application.mobile || 'N/A'}</span>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 text-gray-400 mr-3" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">{formatDate(application.submittedAt)}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-xl p-6">
                <h4 className="font-semibold text-secondary dark:text-white mb-3 font-spartan">Sectors</h4>
                <div className="flex flex-wrap gap-2">
                  {(application.sectors || []).map((sector, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-full border border-primary/20"
                    >
                      {sector}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-xl p-6">
                <h4 className="font-semibold text-secondary dark:text-white mb-4 font-spartan">Funding Request</h4>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary mb-2">{application.fundingAmount || 'N/A'}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Previous Funding: {application.previousFunding || 'N/A'}
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-xl p-6">
                <h4 className="font-semibold text-secondary dark:text-white mb-4 font-spartan">Application Rating</h4>
                <div className="flex items-center justify-center">
                  <div className="flex items-center space-x-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-6 h-6 ${star <= (application.rating || 0) ? 'text-primary fill-current' : 'text-gray-300 dark:text-gray-600'}`}
                      />
                    ))}
                  </div>
                  <span className="ml-2 text-lg font-semibold text-secondary dark:text-white">{application.rating || 'N/A'}</span>
                </div>
              </div>

              <div className="bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-xl p-6">
                <h4 className="font-semibold text-secondary dark:text-white mb-4 font-spartan">Actions</h4>
                <div className="space-y-3">
                  <button
                    onClick={() => {
                      setSchedulingApp(application);
                      setScheduleModalOpen(true);
                      onClose();
                    }}
                    className="w-full bg-primary text-secondary py-2 px-4 rounded-xl hover:bg-primary-hover transition-all duration-300 font-medium"
                  >
                    Schedule Interview
                  </button>
                  <button
                    onClick={() => updateApplicationStatus(application.id, 'approved')}
                    className="w-full bg-green-600 text-white py-2 px-4 rounded-xl hover:bg-green-700 transition-colors font-medium"
                  >
                    Approve Application
                  </button>
                  <button
                    onClick={() => updateApplicationStatus(application.id, 'under_review')}
                    className="w-full bg-yellow-600 text-white py-2 px-4 rounded-xl hover:bg-yellow-700 transition-colors font-medium"
                  >
                    Mark Under Review
                  </button>
                  <button
                    onClick={() => updateApplicationStatus(application.id, 'rejected')}
                    className="w-full bg-red-600 text-white py-2 px-4 rounded-xl hover:bg-red-700 transition-colors font-medium"
                  >
                    Reject Application
                  </button>
                  <button className="w-full bg-accent text-white py-2 px-4 rounded-xl hover:bg-blue-700 transition-colors font-medium flex items-center justify-center">
                    <Send className="w-4 h-4 mr-2" />
                    Send Message
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className={`min-h-screen bg-gray-50 dark:bg-dark-bg font-sans transition-colors duration-300`}>
      <div className="flex">
        {/* Sidebar */}
        <Sidebar 
          activeTab={activeTab} 
          setActiveTab={setActiveTab}
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          onLogout={handleLogout}
        />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-h-screen">
          <Header title={getPageTitle()} />

          <main className="flex-1 overflow-auto">
            {activeTab === 'dashboard' && (
              <Dashboard 
                applications={applications} 
                donations={donations} 
                onViewApplication={(app) => {
                  setSelectedApplication(app);
                  setShowApplicationModal(true);
                }}
              />
            )}

            {activeTab === 'applications' && (
              <div className="p-8 animate-fade-in">
                {/* Filters and Search */}
                <div className="bg-white dark:bg-dark-card rounded-xl border border-gray-100 dark:border-dark-border p-6 mb-6">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                    <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                          type="text"
                          placeholder="Search applications..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-10 pr-4 py-2.5 border border-gray-200 dark:border-dark-border dark:bg-dark-card dark:text-white rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent w-full sm:w-64 transition-all duration-300"
                        />
                      </div>

                      <div className="relative">
                        <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <select
                          value={statusFilter}
                          onChange={(e) => setStatusFilter(e.target.value)}
                          className="pl-10 pr-8 py-2.5 border border-gray-200 dark:border-dark-border dark:bg-dark-card dark:text-white rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent appearance-none bg-white dark:bg-dark-card transition-all duration-300"
                        >
                          <option value="all">All Status</option>
                          <option value="pending">Pending</option>
                          <option value="under_review">Under Review</option>
                          <option value="approved">Approved</option>
                          <option value="rejected">Rejected</option>
                        </select>
                      </div>
                    </div>

                    <button className="btn-primary flex items-center gap-2">
                      <Download className="w-4 h-4" />
                      Export Data
                    </button>
                  </div>
                </div>

                {/* Applications Table */}
                <div className="bg-white dark:bg-dark-card rounded-xl border border-gray-100 dark:border-dark-border overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50 dark:bg-dark-border">
                        <tr>
                          <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Company Details
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Sectors
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Funding
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Rating
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white dark:bg-dark-card divide-y divide-gray-100 dark:divide-dark-border">
                        {filteredApplications.map((app) => (
                          <tr key={app.id} className="hover:bg-gray-50 dark:hover:bg-dark-border transition-colors duration-200">
                            <td className="px-6 py-4">
                              <div className="flex items-center">
                                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mr-4">
                                  <Building className="w-5 h-5 text-primary" />
                                </div>
                                <div>
                                  <div className="text-xs font-medium text-gray-500 dark:text-gray-400">
                                    {app.applicationId || 'N/A'}
                                  </div>
                                  <div className="font-semibold text-secondary dark:text-white">{app.companyName || 'N/A'}</div>
                                  <div className="text-sm text-gray-600 dark:text-gray-400">{app.fullName || 'N/A'}</div>
                                  <div className="text-xs text-gray-500 dark:text-gray-500">{app.email || 'N/A'}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex flex-wrap gap-1">
                                {(app.sectors || []).slice(0, 2).map((sector, index) => (
                                  <span
                                    key={index}
                                    className="px-2 py-1 bg-gray-100 dark:bg-dark-border text-gray-700 dark:text-gray-300 text-xs rounded-full"
                                  >
                                    {sector.split(' / ')[0]}
                                  </span>
                                ))}
                                {(app.sectors || []).length > 2 && (
                                  <span className="px-2 py-1 bg-gray-100 dark:bg-dark-border text-gray-700 dark:text-gray-300 text-xs rounded-full">
                                    +{(app.sectors || []).length - 2}
                                  </span>
                                )}
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="font-semibold text-secondary dark:text-white">{app.fundingAmount || 'N/A'}</div>
                              <div className="text-sm text-gray-600 dark:text-gray-400">{app.currentStage || 'N/A'}</div>
                            </td>
                            <td className="px-6 py-4">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(app.status)}`}>
                                {getStatusIcon(app.status)}
                                <span className="ml-1 capitalize">{(app.status || '').replace('_', ' ')}</span>
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center">
                                <Star className="w-4 h-4 text-primary fill-current mr-1" />
                                <span className="font-medium text-secondary dark:text-white">{app.rating || 'N/A'}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center space-x-2">
                                <button
                                  onClick={() => {
                                    setSelectedApplication(app);
                                    setShowApplicationModal(true);
                                  }}
                                  className="p-2 text-gray-600 dark:text-gray-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-all duration-300"
                                >
                                  <Eye className="w-4 h-4" />
                                </button>
                                <button className="p-2 text-gray-600 dark:text-gray-400 hover:text-accent hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all duration-300">
                                  <Edit className="w-4 h-4" />
                                </button>
                                <button className="p-2 text-gray-600 dark:text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all duration-300">
                                  <MoreVertical className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'users' && (
              <div className="p-8 animate-fade-in">
                <div className="bg-white dark:bg-dark-card rounded-xl border border-gray-100 dark:border-dark-border p-8 text-center mb-6">
                  <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-secondary dark:text-white mb-2">User Management</h3>
                  <p className="text-gray-600 dark:text-gray-400">Manage registered users and their permissions</p>
                </div>
                <UsersManagement />
              </div>
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
              <div className="p-8 animate-fade-in">
                <div className="bg-white dark:bg-dark-card rounded-xl border border-gray-100 dark:border-dark-border p-8 text-center">
                  <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-secondary dark:text-white mb-2">Stage Management</h3>
                  <p className="text-gray-600 dark:text-gray-400">Application stages will be managed here</p>
                </div>
              </div>
            )}

            {activeTab === 'donation' && (
              <div className="p-8 animate-fade-in">
                <div className="bg-white dark:bg-dark-card rounded-xl border border-gray-100 dark:border-dark-border p-8 text-center">
                  <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-secondary dark:text-white mb-2">Donations</h3>
                  <p className="text-gray-600 dark:text-gray-400">Donation management will be implemented here</p>
                </div>
              </div>
            )}

            {activeTab === 'campaigns' && (
              <div className="p-8 animate-fade-in">
                <div className="bg-white dark:bg-dark-card rounded-xl border border-gray-100 dark:border-dark-border p-8 text-center">
                  <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-secondary dark:text-white mb-2">Campaigns</h3>
                  <p className="text-gray-600 dark:text-gray-400">Campaign management will be implemented here</p>
                </div>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="p-8 animate-fade-in">
                <div className="bg-white dark:bg-dark-card rounded-xl border border-gray-100 dark:border-dark-border p-8 text-center">
                  <Settings className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-secondary dark:text-white mb-2">System Settings</h3>
                  <p className="text-gray-600 dark:text-gray-400">Settings panel will be implemented here</p>
                </div>
              </div>
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

      {/* Application Modal */}
      {showApplicationModal && selectedApplication && (
        <ApplicationModal
          application={selectedApplication}
          onClose={() => {
            setShowApplicationModal(false);
            setSelectedApplication(null);
          }}
        />
      )}

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
