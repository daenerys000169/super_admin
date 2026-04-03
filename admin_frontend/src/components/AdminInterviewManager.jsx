import React, { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  User, 
  MapPin, 
  Video, 
  Phone, 
  CheckCircle, 
  AlertCircle, 
  ArrowLeft, 
  Send, 
  Plus,
  Edit3,
  Trash2,
  Eye,
  Filter,
  Search,
  Users,
  CalendarCheck,
  AlertTriangle
} from 'lucide-react';

const AdminInterviewManager = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState('all');
  const [showScheduleForm, setShowScheduleForm] = useState(false);
  const [editingInterview, setEditingInterview] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  
  const [scheduleForm, setScheduleForm] = useState({
    applicantName: '',
    applicantEmail: '',
    date: '',
    time: '',
    duration: 60,
    type: 'video',
    interviewer: '',
    meetingLink: '',
    notes: ''
  });

  // Mock data - in real app, this would come from API
  const [interviews, setInterviews] = useState([
    {
      id: '1',
      applicantName: 'John Smith',
      applicantEmail: 'john.smith@email.com',
      date: '2024-02-15',
      time: '14:00',
      duration: 60,
      type: 'video',
      meetingLink: 'https://meet.google.com/abc-defg-hij',
      interviewer: 'Sarah Johnson',
      status: 'scheduled',
      notes: 'Initial screening interview for startup funding application.',
      requestedDate: '',
      requestedTime: ''
    },
    {
      id: '2',
      applicantName: 'Emily Davis',
      applicantEmail: 'emily.davis@email.com',
      date: '2024-01-28',
      time: '10:30',
      duration: 45,
      type: 'phone',
      interviewer: 'Michael Chen',
      status: 'completed',
      notes: 'Follow-up interview completed. Application moved to final review stage.',
      requestedDate: '',
      requestedTime: ''
    },
    {
      id: '3',
      applicantName: 'Alex Rodriguez',
      applicantEmail: 'alex.rodriguez@email.com',
      date: '',
      time: '',
      duration: 0,
      type: 'video',
      interviewer: '',
      status: 'pending',
      notes: 'Interview request from applicant. Needs to be scheduled.',
      requestedDate: '2024-02-20',
      requestedTime: '15:00'
    },
    {
      id: '4',
      applicantName: 'Maria Garcia',
      applicantEmail: 'maria.garcia@email.com',
      date: '2024-02-18',
      time: '11:00',
      duration: 90,
      type: 'in-person',
      location: 'Conference Room A',
      interviewer: 'David Rodriguez',
      status: 'scheduled',
      notes: 'Final interview for Series A funding. Bring pitch deck and financial projections.',
      requestedDate: '',
      requestedTime: ''
    }
  ]);

  const [interviewers] = useState([
    'Sarah Johnson',
    'Michael Chen',
    'David Rodriguez',
    'Lisa Wang',
    'James Thompson'
  ]);

  const handleScheduleSubmit = (e) => {
    e.preventDefault();
    
    if (editingInterview) {
      // Update existing interview
      setInterviews(interviews.map(interview => 
        interview.id === editingInterview.id 
          ? { ...interview, ...scheduleForm, status: 'scheduled' }
          : interview
      ));
      setEditingInterview(null);
    } else {
      // Create new interview
      const newInterview = {
        id: Date.now().toString(),
        ...scheduleForm,
        status: 'scheduled'
      };
      setInterviews([...interviews, newInterview]);
    }
    
    setScheduleForm({
      applicantName: '',
      applicantEmail: '',
      date: '',
      time: '',
      duration: 60,
      type: 'video',
      interviewer: '',
      meetingLink: '',
      notes: ''
    });
    setShowScheduleForm(false);
  };

  const handleEdit = (interview) => {
    setEditingInterview(interview);
    setScheduleForm({
      applicantName: interview.applicantName,
      applicantEmail: interview.applicantEmail,
      date: interview.date || interview.requestedDate,
      time: interview.time || interview.requestedTime,
      duration: interview.duration || 60,
      type: interview.type,
      interviewer: interview.interviewer,
      meetingLink: interview.meetingLink || '',
      notes: interview.notes
    });
    setShowScheduleForm(true);
  };

  const handleApproveRequest = (interview) => {
    setEditingInterview(interview);
    setScheduleForm({
      applicantName: interview.applicantName,
      applicantEmail: interview.applicantEmail,
      date: interview.requestedDate,
      time: interview.requestedTime,
      duration: 60,
      type: interview.type,
      interviewer: '',
      meetingLink: '',
      notes: interview.notes
    });
    setShowScheduleForm(true);
  };

  const handleDelete = (interviewId) => {
    if (window.confirm('Are you sure you want to delete this interview?')) {
      setInterviews(interviews.filter(interview => interview.id !== interviewId));
    }
  };

  const handleStatusChange = (interviewId, newStatus) => {
    setInterviews(interviews.map(interview => 
      interview.id === interviewId 
        ? { ...interview, status: newStatus }
        : interview
    ));
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'scheduled':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'pending':
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-blue-500" />;
      case 'cancelled':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      default:
        return null;
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'video':
        return <Video className="w-4 h-4" />;
      case 'phone':
        return <Phone className="w-4 h-4" />;
      case 'in-person':
        return <MapPin className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const formatTime = (timeString) => {
    if (!timeString) return '';
    const [hours, minutes] = timeString.split(':');
    const date = new Date();
    date.setHours(parseInt(hours), parseInt(minutes));
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const filteredInterviews = interviews.filter(interview => {
    const matchesSearch = interview.applicantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         interview.applicantEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         interview.interviewer.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterStatus === 'all' || interview.status === filterStatus;
    
    return matchesSearch && matchesFilter;
  });

  const getStats = () => {
    return {
      total: interviews.length,
      scheduled: interviews.filter(i => i.status === 'scheduled').length,
      pending: interviews.filter(i => i.status === 'pending').length,
      completed: interviews.filter(i => i.status === 'completed').length
    };
  };

  const stats = getStats();

  if (showScheduleForm) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-blue-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <button 
            onClick={() => {
              setShowScheduleForm(false);
              setEditingInterview(null);
              setScheduleForm({
                applicantName: '',
                applicantEmail: '',
                date: '',
                time: '',
                duration: 60,
                type: 'video',
                interviewer: '',
                meetingLink: '',
                notes: ''
              });
            }}
            className="mb-6 inline-flex items-center text-gray-600 hover:text-secondary transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Interview Manager
          </button>

          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h1 className="text-2xl font-bold text-secondary mb-6 font-spartan">
              {editingInterview ? 'Edit Interview' : 'Schedule New Interview'}
            </h1>
            
            <form onSubmit={handleScheduleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Applicant Name
                  </label>
                  <input
                    type="text"
                    required
                    value={scheduleForm.applicantName}
                    onChange={(e) => setScheduleForm({...scheduleForm, applicantName: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Applicant Email
                  </label>
                  <input
                    type="email"
                    required
                    value={scheduleForm.applicantEmail}
                    onChange={(e) => setScheduleForm({...scheduleForm, applicantEmail: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Interview Date
                  </label>
                  <input
                    type="date"
                    required
                    value={scheduleForm.date}
                    onChange={(e) => setScheduleForm({...scheduleForm, date: e.target.value})}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Interview Time
                  </label>
                  <input
                    type="time"
                    required
                    value={scheduleForm.time}
                    onChange={(e) => setScheduleForm({...scheduleForm, time: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Duration (minutes)
                  </label>
                  <select
                    value={scheduleForm.duration}
                    onChange={(e) => setScheduleForm({...scheduleForm, duration: parseInt(e.target.value)})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value={30}>30 minutes</option>
                    <option value={45}>45 minutes</option>
                    <option value={60}>1 hour</option>
                    <option value={90}>1.5 hours</option>
                    <option value={120}>2 hours</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Interviewer
                  </label>
                  <select
                    required
                    value={scheduleForm.interviewer}
                    onChange={(e) => setScheduleForm({...scheduleForm, interviewer: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="">Select Interviewer</option>
                    {interviewers.map((interviewer) => (
                      <option key={interviewer} value={interviewer}>{interviewer}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Interview Type
                </label>
                <div className="grid grid-cols-3 gap-4">
                  {['video', 'phone', 'in-person'].map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setScheduleForm({...scheduleForm, type: type})}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        scheduleForm.type === type
                          ? 'border-primary bg-yellow-50 text-secondary'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex flex-col items-center">
                        {getTypeIcon(type)}
                        <span className="mt-2 text-sm font-medium capitalize">{type.replace('-', ' ')}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {scheduleForm.type === 'video' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Meeting Link
                  </label>
                  <input
                    type="url"
                    value={scheduleForm.meetingLink}
                    onChange={(e) => setScheduleForm({...scheduleForm, meetingLink: e.target.value})}
                    placeholder="https://meet.google.com/..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notes
                </label>
                <textarea
                  rows={4}
                  value={scheduleForm.notes}
                  onChange={(e) => setScheduleForm({...scheduleForm, notes: e.target.value})}
                  placeholder="Interview agenda, preparation notes, etc..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  className="bg-primary text-secondary px-6 py-3 rounded-lg font-semibold hover:bg-yellow-600 transition-all inline-flex items-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  {editingInterview ? 'Update Interview' : 'Schedule Interview'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowScheduleForm(false);
                    setEditingInterview(null);
                  }}
                  className="px-6 py-3 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button 
          onClick={onBack}
          className="mb-6 inline-flex items-center text-gray-600 hover:text-secondary transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Admin Dashboard
        </button>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Interviews</p>
                <p className="text-2xl font-bold text-secondary">{stats.total}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CalendarCheck className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Scheduled</p>
                <p className="text-2xl font-bold text-secondary">{stats.scheduled}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Pending</p>
                <p className="text-2xl font-bold text-secondary">{stats.pending}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Completed</p>
                <p className="text-2xl font-bold text-secondary">{stats.completed}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Header */}
          <div className="p-8 border-b border-gray-200">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-secondary font-spartan">Interview Management</h1>
                <p className="text-gray-600 mt-1">Manage all interview schedules and requests</p>
              </div>
              <button
                onClick={() => setShowScheduleForm(true)}
                className="bg-primary text-secondary px-4 py-2 rounded-lg font-semibold hover:bg-yellow-600 transition-all inline-flex items-center gap-2 w-fit"
              >
                <Plus className="w-4 h-4" />
                Schedule Interview
              </button>
            </div>

            {/* Search and Filter */}
            <div className="flex flex-col sm:flex-row gap-4 mt-6">
              <div className="flex-1 relative">
                <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name, email, or interviewer..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-gray-400" />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="all">All Status</option>
                  <option value="scheduled">Scheduled</option>
                  <option value="pending">Pending</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-8">
            {filteredInterviews.length === 0 ? (
              <div className="text-center py-12">
                <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No interviews found</h3>
                <p className="text-gray-500 mb-6">
                  {searchTerm || filterStatus !== 'all' 
                    ? 'Try adjusting your search or filter criteria'
                    : 'Schedule your first interview to get started'
                  }
                </p>
                {!searchTerm && filterStatus === 'all' && (
                  <button
                    onClick={() => setShowScheduleForm(true)}
                    className="bg-primary text-secondary px-6 py-3 rounded-lg font-semibold hover:bg-yellow-600 transition-all inline-flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Schedule Interview
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-6">
                {filteredInterviews.map((interview) => (
                  <div key={interview.id} className="bg-gray-50 rounded-xl p-6">
                    <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          {getStatusIcon(interview.status)}
                          <h3 className="font-semibold text-secondary text-lg font-spartan">
                            {interview.applicantName}
                          </h3>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            interview.status === 'scheduled' ? 'bg-green-100 text-green-800' :
                            interview.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            interview.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {interview.status.charAt(0).toUpperCase() + interview.status.slice(1)}
                          </span>
                        </div>

                        <div className="grid md:grid-cols-3 gap-4 mb-4">
                          <div className="flex items-center gap-3">
                            <User className="w-4 h-4 text-gray-400" />
                            <div>
                              <p className="text-sm text-gray-500">Email</p>
                              <p className="font-medium text-secondary">{interview.applicantEmail}</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            <div>
                              <p className="text-sm text-gray-500">
                                {interview.status === 'pending' ? 'Requested Date' : 'Date'}
                              </p>
                              <p className="font-medium text-secondary">
                                {interview.status === 'pending' && interview.requestedDate
                                  ? formatDate(interview.requestedDate)
                                  : interview.date
                                  ? formatDate(interview.date)
                                  : 'TBD'}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            <Clock className="w-4 h-4 text-gray-400" />
                            <div>
                              <p className="text-sm text-gray-500">
                                {interview.status === 'pending' ? 'Requested Time' : 'Time'}
                              </p>
                              <p className="font-medium text-secondary">
                                {interview.status === 'pending' && interview.requestedTime
                                  ? formatTime(interview.requestedTime)
                                  : interview.time
                                  ? `${formatTime(interview.time)} (${interview.duration} min)`
                                  : 'TBD'}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            {getTypeIcon(interview.type)}
                            <div>
                              <p className="text-sm text-gray-500">Type</p>
                              <p className="font-medium text-secondary capitalize">
                                {interview.type.replace('-', ' ')}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            <User className="w-4 h-4 text-gray-400" />
                            <div>
                              <p className="text-sm text-gray-500">Interviewer</p>
                              <p className="font-medium text-secondary">
                                {interview.interviewer || 'Not assigned'}
                              </p>
                            </div>
                          </div>

                          {interview.status === 'scheduled' && (
                            <div className="flex items-center gap-3">
                              <select
                                value={interview.status}
                                onChange={(e) => handleStatusChange(interview.id, e.target.value)}
                                className="px-3 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
                              >
                                <option value="scheduled">Scheduled</option>
                                <option value="completed">Completed</option>
                                <option value="cancelled">Cancelled</option>
                              </select>
                            </div>
                          )}
                        </div>

                        {interview.notes && (
                          <div className="bg-white rounded-lg p-4">
                            <p className="text-sm text-gray-500 mb-1">Notes</p>
                            <p className="text-gray-700">{interview.notes}</p>
                          </div>
                        )}
                      </div>

                      <div className="flex flex-col sm:flex-row xl:flex-col gap-2 xl:w-48">
                        {interview.status === 'pending' ? (
                          <button
                            onClick={() => handleApproveRequest(interview)}
                            className="bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors inline-flex items-center justify-center gap-2"
                          >
                            <CheckCircle className="w-4 h-4" />
                            Approve & Schedule
                          </button>
                        ) : (
                          <>
                            <button
                              onClick={() => handleEdit(interview)}
                              className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors inline-flex items-center justify-center gap-2"
                            >
                              <Edit3 className="w-4 h-4" />
                              Edit
                            </button>
                            {interview.status === 'scheduled' && interview.meetingLink && (
                              <a
                                href={interview.meetingLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors inline-flex items-center justify-center gap-2"
                              >
                                <Video className="w-4 h-4" />
                                Join Meeting
                              </a>
                            )}
                          </>
                        )}
                        <button
                          onClick={() => handleDelete(interview.id)}
                          className="bg-red-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-700 transition-colors inline-flex items-center justify-center gap-2"
                        >
                          <Trash2 className="w-4 h-4" />
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminInterviewManager;