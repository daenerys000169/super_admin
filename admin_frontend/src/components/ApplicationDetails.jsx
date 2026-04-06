import React, { useState } from 'react';
import { 
  ChevronRight, Calendar, Edit, Star, Mail, Phone, 
  Check, Clock, X, Send, FileText, Play, Linkedin,
  Youtube, Instagram, Facebook, ExternalLink
} from 'lucide-react';

// Document Viewer Modal
const DocumentViewerModal = ({ isOpen, onClose, title, documents }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-white dark:bg-dark-card rounded-2xl w-full max-w-md animate-scale-in">
        <div className="flex items-center justify-between p-5 border-b border-gray-100 dark:border-dark-border">
          <h3 className="text-lg font-semibold text-secondary dark:text-white">{title}</h3>
          <button 
            onClick={onClose}
            className="p-1 hover:bg-gray-100 dark:hover:bg-dark-border rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        <div className="p-5">
          {documents?.map((doc, index) => (
            <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-dark-border rounded-xl mb-3">
              <div className="w-10 h-10 bg-white dark:bg-dark-card rounded-lg flex items-center justify-center border border-gray-200 dark:border-dark-border">
                <FileText className="w-5 h-5 text-red-500" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-secondary dark:text-white line-clamp-1">{doc.name || 'Document'}</p>
              </div>
            </div>
          ))}
          <a 
            href="#" 
            className="text-primary hover:text-primary-hover text-sm font-medium underline transition-colors"
          >
            View
          </a>
        </div>
      </div>
    </div>
  );
};

const ApplicationDetails = ({ application, onBack, onScheduleInterview, onEditApplication, onUpdateStatus }) => {
  const [showDocViewer, setShowDocViewer] = useState(false);
  const [docViewerTitle, setDocViewerTitle] = useState('');
  const [docViewerDocs, setDocViewerDocs] = useState([]);

  const {
    fullName = 'Dwarkesh Mukundbhai Sidapara',
    email = 'Loansphere.Ai@Gmail.Com',
    mobile = '+91 9537290307',
    companyName = 'Fins here A1 OPC Private Limited',
    schemeName = 'Mahila Empowerment Scheme',
    sector = 'FinTech Finance',
    establishedYear = '2023',
    businessDescription = 'Loan A1, Operated Under Finsphere A1 (OPC) Pvt Ltd, Is An A1-Powered Fintech Platform Designed To Simplify And Automate The Loan Process For Banks, NBFCs, And Borrowers. Our Mission Is To Transform The Lending Industry By Reducing Manual Intervention, Improving Transparency, And Accelerating Approvals Through Advanced Machine Learning And Data Analytics. We Provide An End-To-End Digital Solution That Automates Document Verification, Performs Credit Analysis, Matches Borrowers To Suitable Loans In Real-Time, And Integrates Directly With Lending Institutions. Our White-Label SaaS Model Enables Banks And Financial Institutions To Offer Faster, More Personalized, And Cost-Effective Services- By Eliminating Dependency On DSAs And Middlemen, Loan A1 Empowers Borrowers With Better Choices And Financial Literacy. Our Long-Term Vision Includes Building A Peer-To-Peer Lending Ecosystem And Expanding Into Adjacent Areas Like Insurance.',
    fundingAmount = '20,00,000',
    teamMembers = '4',
    currentStage = 'Early Revenue',
    rating = 4,
    status = 'approved',
    stage = 2,
    stages = [
      { id: 1, name: 'Application Evaluation', status: 'completed', date: 'Oct 14' },
      { id: 2, name: 'Virtual Meeting', status: 'in_progress', date: null },
      { id: 3, name: 'Pitch deck Stage', status: 'in_progress', date: null },
      { id: 4, name: 'Due Diligence process', status: 'pending', date: null },
    ],
    activityLog = [
      { type: 'received', title: 'Application Received', date: 'Oct 24, 2023', time: '10:30 AM' },
      { type: 'passed', title: 'Initial Screening Passed', date: 'Oct 25, 2023', time: '02:15 PM' },
      { type: 'notes', title: 'Internal Notes Added', date: 'Oct 26, 2023', time: '09:00 AM' },
    ],
    pitchDeck = { name: 'BREATHING NATURES PRIVATE LIMITED LOA_.pdf', lastRun: '7 day ago' },
    socialMedia = { linkedin: '#', youtube: '#', instagram: '#', facebook: '#' }
  } = application || {};

  const getStageStatusConfig = (stageStatus) => {
    switch (stageStatus) {
      case 'completed':
        return { 
          bgClass: 'bg-green-500', 
          textClass: 'text-white',
          label: 'Email Completed',
          icon: <Check className="w-3 h-3" />
        };
      case 'in_progress':
        return { 
          bgClass: 'bg-primary', 
          textClass: 'text-secondary',
          label: 'Email Progress',
          icon: <Clock className="w-3 h-3" />
        };
      case 'pending':
        return { 
          bgClass: 'bg-gray-200 dark:bg-gray-700', 
          textClass: 'text-gray-600 dark:text-gray-400',
          label: 'Pending',
          icon: null
        };
      default:
        return { 
          bgClass: 'bg-gray-200', 
          textClass: 'text-gray-600',
          label: 'Pending',
          icon: null
        };
    }
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case 'received':
        return (
          <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
            <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          </div>
        );
      case 'passed':
        return (
          <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
            <Check className="w-4 h-4 text-green-600 dark:text-green-400" />
          </div>
        );
      case 'notes':
        return (
          <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
            <FileText className="w-4 h-4 text-purple-600 dark:text-purple-400" />
          </div>
        );
      default:
        return (
          <div className="w-8 h-8 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
            <FileText className="w-4 h-4 text-gray-600 dark:text-gray-400" />
          </div>
        );
    }
  };

  const handleViewDocuments = (title, docs) => {
    setDocViewerTitle(title);
    setDocViewerDocs(docs);
    setShowDocViewer(true);
  };

  return (
    <div className="p-8 animate-fade-in">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm mb-2">
        <button onClick={onBack} className="text-gray-500 dark:text-gray-400 hover:text-primary transition-colors">
          Applications
        </button>
        <ChevronRight className="w-4 h-4 text-gray-400" />
        <span className="text-primary font-medium">{fullName}</span>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-secondary dark:text-white mb-1">Application Details</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Submitting for <span className="font-semibold text-secondary dark:text-white">{companyName}</span>
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => onScheduleInterview && onScheduleInterview(application)}
            className="flex items-center gap-2 px-5 py-2.5 bg-primary text-secondary font-semibold rounded-xl hover:bg-primary-hover transition-all duration-300 active:scale-[0.98]"
          >
            <Calendar className="w-4 h-4" />
            Schedule Interview
          </button>
          <button 
            onClick={() => onEditApplication && onEditApplication(application)}
            className="flex items-center gap-2 px-5 py-2.5 bg-white dark:bg-dark-card border-2 border-gray-200 dark:border-dark-border text-secondary dark:text-white font-semibold rounded-xl hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-300 active:scale-[0.98]"
          >
            <Edit className="w-4 h-4" />
            Edit Application
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex gap-6">
        {/* Left Column - Main Info */}
        <div className="flex-1 space-y-6">
          {/* Company Profile Card */}
          <div className="bg-white dark:bg-dark-card rounded-2xl border border-gray-100 dark:border-dark-border p-6 transition-colors duration-300">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 bg-gray-100 dark:bg-dark-border rounded-xl flex items-center justify-center">
                  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="16" cy="12" r="6" stroke="#6B7280" strokeWidth="2"/>
                    <circle cx="8" cy="22" r="4" stroke="#6B7280" strokeWidth="2"/>
                    <circle cx="24" cy="22" r="4" stroke="#6B7280" strokeWidth="2"/>
                    <path d="M12 18L16 22L20 18" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-secondary dark:text-white mb-2">{schemeName}</h2>
                  <div className="flex items-center gap-3">
                    <span className="px-3 py-1 bg-primary/20 text-primary text-xs font-semibold rounded-full">
                      {sector}
                    </span>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Established {establishedYear}
                    </span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Application Rating</p>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-5 h-5 ${star <= rating ? 'text-primary fill-current' : 'text-gray-300 dark:text-gray-600'}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Business Overview */}
          <div className="bg-white dark:bg-dark-card rounded-2xl border border-gray-100 dark:border-dark-border p-6 transition-colors duration-300">
            <h3 className="text-lg font-semibold text-secondary dark:text-white mb-4">Business Overview</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{businessDescription}</p>
          </div>

          {/* Info Cards Row */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white dark:bg-dark-card rounded-2xl border border-gray-100 dark:border-dark-border p-6 transition-colors duration-300">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Funding Request</p>
              <p className="text-2xl font-bold text-secondary dark:text-white">Rs.{fundingAmount}</p>
            </div>
            <div className="bg-white dark:bg-dark-card rounded-2xl border border-gray-100 dark:border-dark-border p-6 transition-colors duration-300">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Company Details</p>
              <p className="text-2xl font-bold text-secondary dark:text-white">{teamMembers} Members</p>
            </div>
            <div className="bg-white dark:bg-dark-card rounded-2xl border border-gray-100 dark:border-dark-border p-6 transition-colors duration-300">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Stage</p>
              <p className="text-2xl font-bold text-secondary dark:text-white">{currentStage}</p>
            </div>
          </div>

          {/* Founder Profile & Pitch Deck */}
          <div className="grid grid-cols-2 gap-4">
            {/* Founder Profile */}
            <div className="bg-gray-50 dark:bg-dark-border rounded-2xl p-6">
              <h4 className="text-sm text-gray-500 dark:text-gray-400 mb-4">Founder Profile</h4>
              <div className="flex items-start justify-between">
                <div>
                  <h5 className="font-semibold text-secondary dark:text-white mb-1">{fullName.split(' ')[0]} Sidapara</h5>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Founder & CEO</p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-primary" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">{email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-green-500" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">{mobile}</span>
                    </div>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mb-2">Social Media</p>
                  <div className="flex items-center gap-2">
                    <a href={socialMedia.linkedin} className="p-1.5 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors">
                      <Linkedin className="w-4 h-4 text-gray-500" />
                    </a>
                    <a href={socialMedia.youtube} className="p-1.5 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors">
                      <Youtube className="w-4 h-4 text-gray-500" />
                    </a>
                    <a href={socialMedia.instagram} className="p-1.5 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors">
                      <Instagram className="w-4 h-4 text-gray-500" />
                    </a>
                    <a href={socialMedia.facebook} className="p-1.5 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors">
                      <Facebook className="w-4 h-4 text-gray-500" />
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Pitch Deck */}
            <div className="bg-white dark:bg-dark-card rounded-2xl border border-gray-100 dark:border-dark-border p-6">
              <h4 className="text-sm text-gray-500 dark:text-gray-400 mb-4">Pitch Deck</h4>
              <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-dark-border rounded-xl mb-3">
                <div className="w-8 h-8 bg-white dark:bg-dark-card rounded-lg flex items-center justify-center border border-gray-200 dark:border-dark-border">
                  <FileText className="w-4 h-4 text-red-500" />
                </div>
                <span className="text-sm text-gray-600 dark:text-gray-400 flex-1 line-clamp-1">{pitchDeck.name}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400 dark:text-gray-500">Last run {pitchDeck.lastRun}</span>
                <button 
                  onClick={() => handleViewDocuments('Pitch Deck', [{ name: pitchDeck.name }])}
                  className="text-primary hover:text-primary-hover text-sm font-medium underline transition-colors"
                >
                  View Documents
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Decision Center */}
        <div className="w-80 space-y-6">
          {/* Decision Center */}
          <div className="bg-white dark:bg-dark-card rounded-2xl border border-gray-100 dark:border-dark-border p-6 transition-colors duration-300">
            <h3 className="text-lg font-semibold text-secondary dark:text-white mb-5">Decision Center</h3>
            
            {/* Stages Timeline */}
            <div className="space-y-4 mb-6">
              {(stages || []).map((stageItem, index) => {
                const stageConfig = getStageStatusConfig(stageItem.status);
                return (
                  <div key={stageItem.id} className="flex items-start gap-3">
                    <div className="relative">
                      <div className={`w-3 h-3 rounded-full mt-1.5 ${
                        stageItem.status === 'completed' ? 'bg-green-500' : 
                        stageItem.status === 'in_progress' ? 'bg-primary' : 'bg-gray-300 dark:bg-gray-600'
                      }`} />
                      {index < (stages?.length || 0) - 1 && (
                        <div className={`absolute left-1.5 top-4 w-0.5 h-12 -ml-px ${
                          stageItem.status === 'completed' ? 'bg-green-500' : 'bg-gray-200 dark:bg-gray-700'
                        }`} />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs text-gray-400 dark:text-gray-500">Stage {stageItem.id}</p>
                          <p className="text-sm font-medium text-secondary dark:text-white">{stageItem.name}</p>
                          {stageItem.status === 'completed' && stageItem.date && (
                            <p className="text-xs text-gray-400 dark:text-gray-500">Completed On {stageItem.date}</p>
                          )}
                          {stageItem.status === 'in_progress' && (
                            <p className="text-xs text-gray-400 dark:text-gray-500">In Progress</p>
                          )}
                          {stageItem.status === 'pending' && (
                            <p className="text-xs text-gray-400 dark:text-gray-500">Pending Completion Of Evaluation</p>
                          )}
                        </div>
                        {stageItem.status !== 'pending' && (
                          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-semibold ${stageConfig.bgClass} ${stageConfig.textClass}`}>
                            {stageConfig.icon}
                            {stageConfig.label}
                          </span>
                        )}
                        {stageItem.id === 3 && stageItem.status === 'in_progress' && (
                          <button className="flex items-center gap-1 px-3 py-1.5 bg-green-500 text-white text-xs font-semibold rounded-full hover:bg-green-600 transition-colors">
                            <Send className="w-3 h-3" />
                            Send Email
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button 
                onClick={() => onUpdateStatus && onUpdateStatus(application?.id, 'under_review')}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 dark:bg-dark-border text-gray-700 dark:text-gray-300 font-medium rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-300"
              >
                <Clock className="w-4 h-4" />
                Mark Under Review
              </button>
              <button 
                onClick={() => onUpdateStatus && onUpdateStatus(application?.id, 'approved')}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-green-500 text-white font-medium rounded-xl hover:bg-green-600 transition-all duration-300"
              >
                <Check className="w-4 h-4" />
                Approve Application
              </button>
              <button 
                onClick={() => onUpdateStatus && onUpdateStatus(application?.id, 'rejected')}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-500 text-white font-medium rounded-xl hover:bg-red-600 transition-all duration-300"
              >
                <X className="w-4 h-4" />
                Reject Application
              </button>
              <button className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white dark:bg-dark-card border-2 border-gray-200 dark:border-dark-border text-secondary dark:text-white font-medium rounded-xl hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-300">
                <Send className="w-4 h-4" />
                Send Message
              </button>
            </div>
          </div>

          {/* Activity Log */}
          <div className="bg-white dark:bg-dark-card rounded-2xl border border-gray-100 dark:border-dark-border p-6 transition-colors duration-300">
            <h3 className="text-base font-semibold text-secondary dark:text-white mb-4">Activity Log</h3>
            <div className="space-y-4">
              {(activityLog || []).map((activity, index) => (
                <div key={index} className="flex items-start gap-3">
                  {getActivityIcon(activity.type)}
                  <div>
                    <p className="text-sm font-medium text-secondary dark:text-white">{activity.title}</p>
                    <p className="text-xs text-gray-400 dark:text-gray-500">{activity.date} - {activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Document Viewer Modal */}
      <DocumentViewerModal 
        isOpen={showDocViewer}
        onClose={() => setShowDocViewer(false)}
        title={docViewerTitle}
        documents={docViewerDocs}
      />
    </div>
  );
};

export default ApplicationDetails;
