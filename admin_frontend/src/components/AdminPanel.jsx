import React, { useState, useEffect } from 'react';
import API from '../utils/axiosInstance';
import { useAuth } from '../context/AuthContext'; // Adjust path as needed
import { useNavigate } from 'react-router-dom';
import { BarChart3, Users, FileText, Settings, Search, Filter, Download, Eye, CheckCircle, XCircle, Clock, TrendingUp, DollarSign, Building, Mail, Phone, Calendar, Star, AlertCircle, MoreVertical, Edit, Send, Bell, LogOut, Contact } from 'lucide-react';
import UsersManagement from './UsersManagement';
import ContactManagement from './ContactManagement';
import ChatManagement from './ChatManagement';
import AdminInterviewManager from './AdminInterviewManager';
import ScheduleInterviewModal from './ScheduleInterviewModal'
import sendScheduleInterviewMail from './sendScheduleInterviewMail'
const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [applications, setApplications] = useState([]);
  const [filteredApplications, setFilteredApplications] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [showApplicationModal, setShowApplicationModal] = useState(false);
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);
  const [scheduleDate, setScheduleDate] = useState('');
  const [scheduleTime, setScheduleTime] = useState('');
  const [schedulingApp, setSchedulingApp] = useState(null);

  const { logout } = useAuth();
  const navigate = useNavigate();


  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const res = await API.get('/applications');
        console.log(res.data);
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

  const handleScheduleConfirm = async (date, time) => {
  if (!schedulingApp) return;

  try {
    await sendScheduleInterviewMail(schedulingApp.email, schedulingApp.fullName, date, time);
    setScheduleModalOpen(false);
    setSchedulingApp(null);
    alert('Interview invitation sent successfully!');
  } catch (error) {
    console.error('Error sending schedule mail:', error);
    if (error.response) {
      console.error('Response data:', error.response.data);
      alert(`Failed to send invitation: ${error.response.data.message || 'Unknown error'}`);
    } else {
      alert(`Failed to send invitation: ${error.message}`);
    }
  }
};



  // Filter applications with safe string checks
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
      case 'approved': return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected': return 'bg-red-100 text-red-800 border-red-200';
      case 'under_review': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'pending': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
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

  const updateApplicationStatus = (id, newStatus) => {
    setApplications(prev =>
      prev.map(app =>
        app.id === id ? { ...app, status: newStatus } : app
      )
    );
  };

  const DashboardStats = ({ applications }) => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-primary">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Total Applications</p>
            <p className="text-3xl font-bold text-secondary">{applications.length}</p>
          </div>
          <div className="w-12 h-12 bg-primary bg-opacity-10 rounded-lg flex items-center justify-center">
            <FileText className="w-6 h-6 text-primary" />
          </div>
        </div>
        <div className="mt-4 flex items-center">
          <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
          <span className="text-sm text-green-600">+12% from last month</span>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Approved</p>
            <p className="text-3xl font-bold text-secondary">
              {applications.filter(app => (app.status || '') === 'approved').length}
            </p>
          </div>
          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
            <CheckCircle className="w-6 h-6 text-green-600" />
          </div>
        </div>
        <div className="mt-4 flex items-center">
          <span className="text-sm text-gray-600">
            {applications.length > 0
              ? ((applications.filter(app => (app.status || '') === 'approved').length / applications.length) * 100).toFixed(1)
              : 0
            }% approval rate
          </span>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-yellow-500">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Under Review</p>
            <p className="text-3xl font-bold text-secondary">
              {applications.filter(app => (app.status || '') === 'under_review').length}
            </p>
          </div>
          <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
            <Clock className="w-6 h-6 text-yellow-600" />
          </div>
        </div>
        <div className="mt-4 flex items-center">
          <span className="text-sm text-gray-600">Avg. review time: 3 days</span>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-accent">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Total Funding</p>
            <p className="text-3xl font-bold text-secondary">₹2.55Cr</p>
          </div>
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
            <DollarSign className="w-6 h-6 text-accent" />
          </div>
        </div>
        <div className="mt-4 flex items-center">
          <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
          <span className="text-sm text-green-600">+8% from last quarter</span>
        </div>
      </div>
    </div>
  );


  const ApplicationModal = ({ application, onClose }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-secondary font-spartan">{application.companyName || 'N/A'}</h2>
              <p className="text-gray-600">{application.fullName || 'N/A'}</p>
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
                className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
              >
                <XCircle className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>
        </div>


        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-secondary mb-4 font-spartan">Business Overview</h3>
                <p className="text-gray-700 leading-relaxed">{application.businessDescription || 'N/A'}</p>
              </div>


              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white border border-gray-200 rounded-xl p-6">
                  <h4 className="font-semibold text-secondary mb-3 font-spartan">Company Details</h4>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <Building className="w-4 h-4 text-gray-400 mr-3" />
                      <span className="text-sm text-gray-600">{application.entityType || 'N/A'}</span>
                    </div>
                    <div className="flex items-center">
                      <Users className="w-4 h-4 text-gray-400 mr-3" />
                      <span className="text-sm text-gray-600">{application.teamMembers || 'N/A'} team members</span>
                    </div>
                    <div className="flex items-center">
                      <TrendingUp className="w-4 h-4 text-gray-400 mr-3" />
                      <span className="text-sm text-gray-600">{application.currentStage || 'N/A'}</span>
                    </div>
                  </div>
                </div>


                <div className="bg-white border border-gray-200 rounded-xl p-6">
                  <h4 className="font-semibold text-secondary mb-3 font-spartan">Contact Information</h4>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <Mail className="w-4 h-4 text-gray-400 mr-3" />
                      <span className="text-sm text-gray-600">{application.email || 'N/A'}</span>
                    </div>
                    <div className="flex items-center">
                      <Phone className="w-4 h-4 text-gray-400 mr-3" />
                      <span className="text-sm text-gray-600">{application.mobile || 'N/A'}</span>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 text-gray-400 mr-3" />
                      <span className="text-sm text-gray-600">{formatDate(application.submittedAt)}</span>
                    </div>
                  </div>
                </div>
              </div>


              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <h4 className="font-semibold text-secondary mb-3 font-spartan">Sectors</h4>
                <div className="flex flex-wrap gap-2">
                  {(application.sectors || []).map((sector, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-primary bg-opacity-10 text-primary text-sm rounded-full border border-primary border-opacity-20"
                    >
                      {sector}
                    </span>
                  ))}
                </div>
              </div>
            </div>


            {/* Sidebar */}
            <div className="space-y-6">
              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <h4 className="font-semibold text-secondary mb-4 font-spartan">Funding Request</h4>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary mb-2">{application.fundingAmount || 'N/A'}</div>
                  <div className="text-sm text-gray-600">
                    Previous Funding: {application.previousFunding || 'N/A'}
                  </div>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <h4 className="font-semibold text-secondary mb-4 font-spartan">Application Rating</h4>
                <div className="flex items-center justify-center">
                  <div className="flex items-center space-x-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-6 h-6 ${star <= (application.rating || 0) ? 'text-primary fill-current' : 'text-gray-300'
                          }`}
                      />
                    ))}
                  </div>
                  <span className="ml-2 text-lg font-semibold text-secondary">{application.rating || 'N/A'}</span>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <h4 className="font-semibold text-secondary mb-4 font-spartan">Actions</h4>
                <div className="space-y-3">
                  <button
                    onClick={() => {
                      setSchedulingApp(application);
                      setScheduleModalOpen(true);
                    }}
                    className="w-full bg-yellow-400 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors font-medium"
                  >
                    Schedule Interview
                  </button>

                  <button
                    onClick={() => updateApplicationStatus(application.id, 'approved')}
                    className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors font-medium"
                  >
                    Approve Application
                  </button>
                  <button
                    onClick={() => updateApplicationStatus(application.id, 'under_review')}
                    className="w-full bg-yellow-600 text-white py-2 px-4 rounded-lg hover:bg-yellow-700 transition-colors font-medium"
                  >
                    Mark Under Review
                  </button>
                  <button
                    onClick={() => updateApplicationStatus(application.id, 'rejected')}
                    className="w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors font-medium"
                  >
                    Reject Application
                  </button>
                  <button className="w-full bg-accent text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center">
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
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Header */}
      <header className="bg-white shadow-lg border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <h1 className="text-2xl font-bold text-secondary font-spartan">Startup Yogdaan</h1>
                <p className="text-sm text-gray-600">Admin Panel</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <button className="relative p-2 text-gray-600 hover:text-secondary transition-colors">
                <Bell className="w-6 h-6" />
                <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full"></span>
              </button>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                  <span className="text-sm font-semibold text-white">A</span>
                </div>
                <span className="text-sm font-medium text-secondary">Admin User</span>
              </div>
              <button
                className="p-2 text-gray-600 hover:text-secondary transition-colors"
                onClick={() => {
                  logout();
                  navigate('/login'); // redirect to login after logout; adjust route as needed
                }}
                title="Logout"
              >
                <LogOut className="w-5 h-5" />Logout
              </button>
            </div>
          </div>
        </div>
      </header>


      <div className="flex">
        {/* Sidebar */}
        <nav className="w-64 bg-white shadow-lg sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto">
          <div className="p-6">
            <div className="space-y-2">
              {[
                { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
                { id: 'applications', label: 'Applications', icon: FileText },
                { id: 'users', label: 'Users', icon: Users },
                { id: 'contactsdata', label: 'Contacts', icon: Contact },
                { id: 'chatwaydata', label: 'Chatway', icon: Contact },
                { id: 'admininterviewmanager', label: 'Manage Interview', icon: Contact },
                { id: 'settings', label: 'Settings', icon: Settings }
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-all duration-200 ${activeTab === item.id
                      ? 'bg-primary text-white shadow-lg'
                      : 'text-gray-700 hover:bg-gray-100'
                      }`}
                  >
                    <Icon className="w-5 h-5 mr-3" />
                    <span className="font-medium">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </nav>


        {/* Main Content */}
        <main className="flex-1 p-6">
          {activeTab === 'dashboard' && (
            <div>
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-secondary font-spartan mb-2">Dashboard</h2>
                <p className="text-gray-600">Overview of your startup applications and analytics</p>
              </div>

              <DashboardStats applications={applications} />


              {/* Recent Applications */}
              <div className="bg-white rounded-xl shadow-lg">
                <div className="p-6 border-b border-gray-200">
                  <h3 className="text-xl font-semibold text-secondary font-spartan">Recent Applications</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Company
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Founder
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Funding
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {applications.slice(0, 5).map((app) => (
                        <tr key={app.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="font-medium text-secondary">{app.companyName || 'N/A'}</div>
                            <div className="text-sm text-gray-500">{app.entityType || 'N/A'}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{app.fullName || 'N/A'}</div>
                            <div className="text-sm text-gray-500">{app.email || 'N/A'}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-secondary">
                            {app.fundingAmount || 'N/A'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(app.status)}`}>
                              {getStatusIcon(app.status)}
                              <span className="ml-1 capitalize">{(app.status || '').replace('_', ' ')}</span>
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatDate(app.submittedAt)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}


          {activeTab === 'applications' && (
            <div>
              {/* <div className="mb-8">
                <h2 className="text-3xl font-bold text-secondary font-spartan mb-2">Applications</h2>
                <p className="text-gray-600">Manage and review startup applications</p>
              </div> */}


              {/* Filters and Search */}
              <div className="bg-white rounded-xl  p-6 mb-6 sticky top-16 z-40">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                  <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="text"
                        placeholder="Search applications..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent w-full sm:w-64"
                      />
                    </div>

                    <div className="relative">
                      <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent appearance-none bg-white"
                      >
                        <option value="all">All Status</option>
                        <option value="pending">Pending</option>
                        <option value="under_review">Under Review</option>
                        <option value="approved">Approved</option>
                        <option value="rejected">Rejected</option>
                      </select>
                    </div>
                  </div>

                  <button className="bg-primary text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity flex items-center">
                    {/* <Download className="w-4 h-4 mr-2" /> */}
                    Do what you want!!!!
                  </button>
                </div>
              </div>


              {/* Applications Table */}
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Company Details
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Sectors
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Funding
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Rating
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredApplications.map((app) => (
                        <tr key={app.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center">
                              <div className="w-10 h-10 bg-primary bg-opacity-10 rounded-lg flex items-center justify-center mr-4">
                                <Building className="w-5 h-5 text-primary" />
                              </div>
                              <div>
                                <div className="text-xs font-medium text-gray-500">
                                  {app.applicationId || 'N/A'}
                                </div>
                                <div className="font-semibold text-secondary">{app.companyName || 'N/A'}</div>
                                <div className="text-sm text-gray-600">{app.fullName || 'N/A'}</div>
                                <div className="text-xs text-gray-500">{app.email || 'N/A'}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex flex-wrap gap-1">
                              {(app.sectors || []).slice(0, 2).map((sector, index) => (
                                <span
                                  key={index}
                                  className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                                >
                                  {sector.split(' / ')[0]}
                                </span>
                              ))}
                              {(app.sectors || []).length > 2 && (
                                <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                                  +{(app.sectors || []).length - 2}
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="font-semibold text-secondary">{app.fundingAmount || 'N/A'}</div>
                            <div className="text-sm text-gray-600">{app.currentStage || 'N/A'}</div>
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
                              <span className="font-medium text-secondary">{app.rating || 'N/A'}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => {
                                  setSelectedApplication(app);
                                  setShowApplicationModal(true);
                                }}
                                className="p-2 text-gray-600 hover:text-primary hover:bg-primary hover:bg-opacity-10 rounded-lg transition-all"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              <button className="p-2 text-gray-600 hover:text-accent hover:bg-blue-50 rounded-lg transition-all">
                                <Edit className="w-4 h-4" />
                              </button>
                              <button className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all">
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
            <div>
              {/* <div className="mb-8">
                <h2 className="text-3xl font-bold text-secondary font-spartan mb-2">User Management</h2>
                <p className="text-gray-600">Manage registered users and their permissions</p>
              </div> */}

              <div className="bg-white rounded-xl shadow-lg p-8 text-center">
                <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-secondary mb-2">User Management</h3>
                <p className="text-gray-600">User management features will be implemented here</p>
              </div>

              <UsersManagement />
            </div>
          )}
          {activeTab === 'contactsdata' && (
            <div>
              {/* <div className="mb-8">
                <h2 className="text-3xl font-bold text-secondary font-spartan mb-2">User Management</h2>
                <p className="text-gray-600">Manage registered users and their permissions</p>
              </div> */}

              <div className="bg-white rounded-xl shadow-lg p-8 text-center">
                <Contact className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-secondary mb-2">Contact Form Data</h3>
                <p className="text-gray-600">Contact Form Data is displayed here</p>
              </div>

              <div className="">
                <ContactManagement />
              </div>
            </div>
          )}

          {activeTab === 'chatwaydata' && (
            <div>
              {/* <div className="mb-8">
                <h2 className="text-3xl font-bold text-secondary font-spartan mb-2">User Management</h2>
                <p className="text-gray-600">Manage registered users and their permissions</p>
              </div> */}

              <div className="bg-white rounded-xl shadow-lg p-8 text-center">
                <Contact className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-secondary mb-2">Chatway Data</h3>
                <p className="text-gray-600">Chatway Data is displayed here</p>
              </div>

              <div className="">
                <ChatManagement />
              </div>
            </div>
          )}

          {activeTab === 'admininterviewmanager' && (
            <div>
              {/* <div className="mb-8">
                <h2 className="text-3xl font-bold text-secondary font-spartan mb-2">User Management</h2>
                <p className="text-gray-600">Manage registered users and their permissions</p>
              </div> */}

              <div className="bg-white rounded-xl shadow-lg p-8 text-center">
                <Contact className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-secondary mb-2">Manage Interview</h3>
                <p className="text-gray-600">interview Data is available here</p>
              </div>

              <div className="">
                <AdminInterviewManager />
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div>
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-secondary font-spartan mb-2">Settings</h2>
                <p className="text-gray-600">Configure system settings and preferences</p>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-8 text-center">
                <Settings className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-secondary mb-2">System Settings</h3>
                <p className="text-gray-600">Settings panel will be implemented here</p>
              </div>
            </div>
          )}
        </main>
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
