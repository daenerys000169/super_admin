import React, { useState, useMemo, useRef, useEffect } from 'react';
import { 
  Search, Download, CheckCircle, XCircle, Clock, AlertCircle, 
  FileText, MoreVertical, ChevronDown, Calendar, Filter,
  X
} from 'lucide-react';

// Status filter dropdown options
const STATUS_OPTIONS = [
  { value: 'all', label: 'All Status' },
  { value: 'pending', label: 'Pending' },
  { value: 'under_review', label: 'Under Review' },
  { value: 'approved', label: 'Approved' },
  { value: 'rejected', label: 'Rejected' },
  { value: 'stage_1', label: 'Stage 1' },
  { value: 'stage_2', label: 'Stage 2' },
  { value: 'stage_3', label: 'Stage 3' },
  { value: 'stage_4', label: 'Stage 4' },
];

// Scheme filter options
const SCHEME_OPTIONS = [
  { value: 'all', label: 'All Status' },
  { value: 'mahila', label: 'Mahila Empowerment' },
  { value: 'iyogdan', label: 'iYogdan' },
];

// Date filter options
const DATE_FILTER_OPTIONS = [
  { value: 'day', label: 'Day' },
  { value: 'week', label: 'Week' },
  { value: 'month', label: 'Month' },
  { value: 'year', label: 'Year' },
  { value: 'custom', label: 'Custom' },
];

// Stat Card Icons matching Figma
const TotalApplicationsIcon = () => (
  <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="8" y="5" width="24" height="30" rx="3" stroke="#D97706" strokeWidth="2.5"/>
    <path d="M13 13H27" stroke="#D97706" strokeWidth="2.5" strokeLinecap="round"/>
    <path d="M13 20H27" stroke="#D97706" strokeWidth="2.5" strokeLinecap="round"/>
    <path d="M13 27H21" stroke="#D97706" strokeWidth="2.5" strokeLinecap="round"/>
  </svg>
);

const PendingIcon = () => (
  <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="8" y="5" width="24" height="30" rx="3" stroke="#6B7280" strokeWidth="2.5"/>
    <path d="M13 13H27" stroke="#6B7280" strokeWidth="2.5" strokeLinecap="round"/>
    <path d="M13 20H27" stroke="#6B7280" strokeWidth="2.5" strokeLinecap="round"/>
    <path d="M13 27H21" stroke="#6B7280" strokeWidth="2.5" strokeLinecap="round"/>
  </svg>
);

const UnderReviewIcon = () => (
  <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M8 10H14V32H8V10Z" fill="#F59E0B"/>
    <path d="M17 16H23V32H17V16Z" fill="#F59E0B" opacity="0.7"/>
    <path d="M26 22H32V32H26V22Z" fill="#F59E0B" opacity="0.4"/>
  </svg>
);

const ApprovedIcon = () => (
  <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="20" cy="20" r="14" stroke="#22C55E" strokeWidth="2.5"/>
    <path d="M12 20L17 25L28 14" stroke="#22C55E" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const RejectedIcon = () => (
  <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="20" cy="20" r="14" fill="#EF4444"/>
    <path d="M14 14L26 26M26 14L14 26" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
  </svg>
);

// Custom Dropdown Component
const CustomDropdown = ({ options, value, onChange, icon: Icon, className = '' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedOption = options.find(opt => opt.value === value) || options[0];

  return (
    <div ref={dropdownRef} className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-200"
      >
        {Icon && <Icon className="w-4 h-4 text-gray-500" />}
        <span>{selectedOption.label}</span>
        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-48 bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-xl shadow-lg z-50 overflow-hidden animate-fade-in">
          {options.map((option, index) => (
            <button
              key={option.value}
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
              className={`w-full px-4 py-3 text-left text-sm transition-colors duration-150 
                ${value === option.value 
                  ? 'bg-primary/10 text-primary font-medium' 
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-dark-border'
                }
                ${index === 0 ? 'rounded-t-xl' : ''}
                ${index === options.length - 1 ? 'rounded-b-xl' : ''}
              `}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// Date Picker Component
const DatePicker = ({ value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [filterType, setFilterType] = useState('day');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [customStartDate, setCustomStartDate] = useState(null);
  const [customEndDate, setCustomEndDate] = useState(null);
  const dropdownRef = useRef(null);

  const months = ['January', 'February', 'March', 'April', 'May', 'June', 
                  'July', 'August', 'September', 'October', 'November', 'December'];
  const years = Array.from({ length: 12 }, (_, i) => 2015 + i);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const formatDisplayDate = () => {
    if (!value) return `Date: ${selectedDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}`;
    return `Date: ${value}`;
  };

  const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

  const handlePrevMonth = () => {
    setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1));
  };

  const handleDayClick = (day) => {
    const newDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), day);
    if (filterType === 'custom') {
      if (!customStartDate || (customStartDate && customEndDate)) {
        setCustomStartDate(newDate);
        setCustomEndDate(null);
      } else {
        if (newDate < customStartDate) {
          setCustomEndDate(customStartDate);
          setCustomStartDate(newDate);
        } else {
          setCustomEndDate(newDate);
        }
      }
    } else {
      onChange(newDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }));
      setIsOpen(false);
    }
  };

  const isDateSelected = (day) => {
    const date = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), day);
    if (filterType === 'custom') {
      if (customStartDate && customEndDate) {
        return date >= customStartDate && date <= customEndDate;
      }
      return customStartDate && date.getTime() === customStartDate.getTime();
    }
    return false;
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(selectedDate.getFullYear(), selectedDate.getMonth());
    const firstDay = getFirstDayOfMonth(selectedDate.getFullYear(), selectedDate.getMonth());
    const days = [];
    
    // Previous month's days
    const prevMonthDays = getDaysInMonth(selectedDate.getFullYear(), selectedDate.getMonth() - 1);
    for (let i = firstDay - 1; i >= 0; i--) {
      days.push(
        <div key={`prev-${i}`} className="text-center py-2 text-gray-300 dark:text-gray-600 text-sm">
          {prevMonthDays - i}
        </div>
      );
    }

    // Current month's days
    for (let day = 1; day <= daysInMonth; day++) {
      const isToday = new Date().getDate() === day && 
                      new Date().getMonth() === selectedDate.getMonth() &&
                      new Date().getFullYear() === selectedDate.getFullYear();
      const selected = isDateSelected(day);
      
      days.push(
        <button
          key={day}
          onClick={() => handleDayClick(day)}
          className={`text-center py-2 text-sm rounded-lg transition-all duration-200
            ${selected 
              ? 'bg-primary text-secondary font-semibold' 
              : isToday 
                ? 'bg-primary/20 text-primary font-semibold'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-border'
            }`}
        >
          {day}
        </button>
      );
    }

    return days;
  };

  return (
    <div ref={dropdownRef} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-200"
      >
        <Calendar className="w-4 h-4 text-gray-500" />
        <span>{formatDisplayDate()}</span>
        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-80 bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-xl shadow-lg z-50 p-4 animate-fade-in">
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Filter by</p>
          
          {/* Filter Type Tabs */}
          <div className="flex gap-2 mb-4 flex-wrap">
            {DATE_FILTER_OPTIONS.map((option) => (
              <button
                key={option.value}
                onClick={() => setFilterType(option.value)}
                className={`px-3 py-1.5 text-xs font-medium rounded-full transition-all duration-200
                  ${filterType === option.value 
                    ? 'bg-primary text-secondary' 
                    : 'bg-gray-100 dark:bg-dark-border text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
              >
                {option.label}
              </button>
            ))}
          </div>

          {/* Custom date range display */}
          {filterType === 'custom' && (
            <div className="flex gap-2 mb-4">
              <div className="flex-1 px-3 py-2 border border-primary rounded-lg text-xs text-center bg-primary/5">
                {customStartDate ? customStartDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Select Start Date'}
              </div>
              <div className="flex-1 px-3 py-2 border border-primary rounded-lg text-xs text-center bg-primary/5">
                {customEndDate ? customEndDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Select End Date'}
              </div>
            </div>
          )}

          {/* Month/Year Selector */}
          {(filterType === 'day' || filterType === 'week' || filterType === 'custom') && (
            <>
              <div className="flex items-center justify-between mb-4">
                <button onClick={handlePrevMonth} className="p-1 hover:bg-gray-100 dark:hover:bg-dark-border rounded-lg transition-colors">
                  <ChevronDown className="w-5 h-5 rotate-90 text-gray-600 dark:text-gray-400" />
                </button>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {months[selectedDate.getMonth()]} {selectedDate.getFullYear()}
                </span>
                <button onClick={handleNextMonth} className="p-1 hover:bg-gray-100 dark:hover:bg-dark-border rounded-lg transition-colors">
                  <ChevronDown className="w-5 h-5 -rotate-90 text-gray-600 dark:text-gray-400" />
                </button>
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-1 mb-2">
                {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
                  <div key={day} className="text-center text-xs font-medium text-gray-400 py-2">{day}</div>
                ))}
                {renderCalendar()}
              </div>
            </>
          )}

          {/* Month Selector */}
          {filterType === 'month' && (
            <div className="grid grid-cols-3 gap-2">
              {months.map((month, index) => (
                <button
                  key={month}
                  onClick={() => {
                    const newDate = new Date(selectedDate.getFullYear(), index, 1);
                    onChange(newDate.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' }));
                    setIsOpen(false);
                  }}
                  className={`px-3 py-2 text-sm rounded-lg transition-all duration-200
                    ${selectedDate.getMonth() === index 
                      ? 'bg-primary text-secondary font-semibold' 
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-border'
                    }`}
                >
                  {month.slice(0, 3)}
                </button>
              ))}
            </div>
          )}

          {/* Year Selector */}
          {filterType === 'year' && (
            <div className="grid grid-cols-4 gap-2">
              {years.map((year) => (
                <button
                  key={year}
                  onClick={() => {
                    onChange(year.toString());
                    setIsOpen(false);
                  }}
                  className={`px-3 py-2 text-sm rounded-lg transition-all duration-200
                    ${selectedDate.getFullYear() === year 
                      ? 'bg-primary text-secondary font-semibold' 
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-border'
                    }`}
                >
                  {year}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// Application Card Component for grid view
const ApplicationGridCard = ({ application, onViewDetails }) => {
  const {
    status = 'pending',
    fullName = 'N/A',
    email = 'N/A',
    mobile = 'N/A',
    companyName = 'N/A',
    currentStage = 'N/A',
    fundingAmount = 'N/A'
  } = application || {};

  const getStatusConfig = (status) => {
    const statusLower = (status || '').toLowerCase();
    switch (statusLower) {
      case 'approved':
        return {
          label: 'Approved',
          bgClass: 'bg-green-100 dark:bg-green-900/30',
          textClass: 'text-green-700 dark:text-green-400',
          Icon: CheckCircle,
          buttonBg: 'bg-primary hover:bg-primary-hover text-secondary'
        };
      case 'pending':
        return {
          label: 'Pending',
          bgClass: 'bg-gray-100 dark:bg-gray-800',
          textClass: 'text-gray-600 dark:text-gray-400',
          Icon: Clock,
          buttonBg: 'bg-white dark:bg-dark-card border-2 border-gray-200 dark:border-dark-border text-secondary dark:text-white hover:border-gray-300'
        };
      case 'under_review':
        return {
          label: 'Under Review',
          bgClass: 'bg-yellow-100 dark:bg-yellow-900/30',
          textClass: 'text-yellow-700 dark:text-yellow-400',
          Icon: AlertCircle,
          buttonBg: 'bg-white dark:bg-dark-card border-2 border-gray-200 dark:border-dark-border text-secondary dark:text-white hover:border-gray-300'
        };
      case 'rejected':
        return {
          label: 'Rejected',
          bgClass: 'bg-red-100 dark:bg-red-900/30',
          textClass: 'text-red-700 dark:text-red-400',
          Icon: XCircle,
          buttonBg: 'bg-white dark:bg-dark-card border-2 border-gray-200 dark:border-dark-border text-secondary dark:text-white hover:border-gray-300'
        };
      default:
        return {
          label: 'Pending',
          bgClass: 'bg-gray-100 dark:bg-gray-800',
          textClass: 'text-gray-600 dark:text-gray-400',
          Icon: Clock,
          buttonBg: 'bg-white dark:bg-dark-card border-2 border-gray-200 dark:border-dark-border text-secondary dark:text-white hover:border-gray-300'
        };
    }
  };

  const statusConfig = getStatusConfig(status);
  const StatusIcon = statusConfig.Icon;

  const formatFunding = (amount) => {
    if (!amount || amount === 'N/A') return 'N/A';
    if (typeof amount === 'string' && amount.includes(',')) return `Rs.${amount}`;
    const num = parseFloat(amount);
    if (isNaN(num)) return amount;
    return `Rs.${num.toLocaleString('en-IN')}`;
  };

  return (
    <div className="app-card group">
      {/* Header with status and actions */}
      <div className="flex items-center justify-between mb-4">
        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${statusConfig.bgClass} ${statusConfig.textClass}`}>
          <StatusIcon className="w-3.5 h-3.5" />
          {statusConfig.label}
        </span>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button className="p-1.5 hover:bg-gray-100 dark:hover:bg-dark-border rounded-lg transition-colors">
            <FileText className="w-4 h-4 text-gray-500" />
          </button>
          <button className="p-1.5 hover:bg-gray-100 dark:hover:bg-dark-border rounded-lg transition-colors">
            <MoreVertical className="w-4 h-4 text-gray-500" />
          </button>
        </div>
      </div>

      {/* Contact Info */}
      <div className="mb-5">
        <h3 className="font-semibold text-secondary dark:text-white text-sm mb-1 line-clamp-1">{fullName}</h3>
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5 line-clamp-1">{email}</p>
        <p className="text-xs text-gray-500 dark:text-gray-400">{mobile}</p>
      </div>

      {/* Company Info */}
      <div className="mb-5">
        <p className="text-[10px] text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1">Company</p>
        <p className="text-sm font-semibold text-secondary dark:text-white line-clamp-1">{companyName}</p>
      </div>

      {/* Interview & Funding Row */}
      <div className="flex items-center gap-4 mb-5 pb-5 border-b border-gray-100 dark:border-dark-border">
        <div className="flex-1">
          <p className="text-[10px] text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1">interview</p>
          <p className="text-sm font-semibold text-secondary dark:text-white">{currentStage}</p>
        </div>
        <div className="w-px h-8 bg-gray-200 dark:bg-dark-border" />
        <div className="flex-1">
          <p className="text-[10px] text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1">Funding</p>
          <p className="text-sm font-semibold text-secondary dark:text-white">{formatFunding(fundingAmount)}</p>
        </div>
      </div>

      {/* Action Button */}
      <button
        onClick={() => onViewDetails && onViewDetails(application)}
        className={`w-full py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 active:scale-[0.98] ${statusConfig.buttonBg}`}
      >
        View Details
      </button>
    </div>
  );
};

const ApplicationsPage = ({ applications = [], onViewDetails, onScheduleInterview }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [schemeFilter, setSchemeFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('');

  // Calculate stats
  const stats = useMemo(() => {
    const total = applications.length;
    const pending = applications.filter(app => (app.status || '').toLowerCase() === 'pending').length;
    const underReview = applications.filter(app => (app.status || '').toLowerCase() === 'under_review').length;
    const approved = applications.filter(app => (app.status || '').toLowerCase() === 'approved').length;
    const rejected = applications.filter(app => (app.status || '').toLowerCase() === 'rejected').length;
    
    const approvalRate = total > 0 ? ((approved / total) * 100).toFixed(1) : 0;
    
    return { total: total || 1120, pending: pending || 160, underReview, approved: approved || 152, rejected: rejected || 48, approvalRate };
  }, [applications]);

  // Filter applications
  const filteredApplications = useMemo(() => {
    let filtered = applications;

    if (searchTerm) {
      filtered = filtered.filter(app =>
        (app.fullName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (app.companyName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (app.email || '').toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(app => (app.status || '').toLowerCase() === statusFilter);
    }

    return filtered;
  }, [applications, searchTerm, statusFilter]);

  // Demo applications if empty
  const displayApplications = filteredApplications.length > 0 ? filteredApplications : [
    { id: 1, status: 'approved', fullName: 'Dwarkesh Mukundbhai Sidapara', email: 'loansphere.ai@gmail.com', mobile: '+91 12345 67890', companyName: 'Finsphere A1 (OPC) Private Limited', currentStage: '3-2', fundingAmount: '20,00,000' },
    { id: 2, status: 'pending', fullName: 'Dwarkesh Mukundbhai Sidapara', email: 'loansphere.ai@gmail.com', mobile: '+91 12345 67890', companyName: 'Finsphere A1 (OPC) Private Limited', currentStage: '3-2', fundingAmount: '20,00,000' },
    { id: 3, status: 'rejected', fullName: 'Dwarkesh Mukundbhai Sidapara', email: 'loansphere.ai@gmail.com', mobile: '+91 12345 67890', companyName: 'Finsphere A1 (OPC) Private Limited', currentStage: '3-2', fundingAmount: '20,00,000' },
    { id: 4, status: 'approved', fullName: 'Dwarkesh Mukundbhai Sidapara', email: 'loansphere.ai@gmail.com', mobile: '+91 12345 67890', companyName: 'Finsphere A1 (OPC) Private Limited', currentStage: '3-2', fundingAmount: '20,00,000' },
    { id: 5, status: 'approved', fullName: 'Dwarkesh Mukundbhai Sidapara', email: 'loansphere.ai@gmail.com', mobile: '+91 12345 67890', companyName: 'Finsphere A1 (OPC) Private Limited', currentStage: '3-2', fundingAmount: '20,00,000' },
    { id: 6, status: 'pending', fullName: 'Dwarkesh Mukundbhai Sidapara', email: 'loansphere.ai@gmail.com', mobile: '+91 12345 67890', companyName: 'Finsphere A1 (OPC) Private Limited', currentStage: '3-2', fundingAmount: '20,00,000' },
    { id: 7, status: 'rejected', fullName: 'Dwarkesh Mukundbhai Sidapara', email: 'loansphere.ai@gmail.com', mobile: '+91 12345 67890', companyName: 'Finsphere A1 (OPC) Private Limited', currentStage: '3-2', fundingAmount: '20,00,000' },
    { id: 8, status: 'approved', fullName: 'Dwarkesh Mukundbhai Sidapara', email: 'loansphere.ai@gmail.com', mobile: '+91 12345 67890', companyName: 'Finsphere A1 (OPC) Private Limited', currentStage: '3-2', fundingAmount: '20,00,000' },
  ];

  return (
    <div className="p-8 animate-fade-in">
      {/* Today's Overview Section */}
      <div className="bg-white dark:bg-dark-card rounded-2xl border border-gray-100 dark:border-dark-border p-6 mb-6 transition-colors duration-300">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-secondary dark:text-white">Today&apos;s Overview</h2>
          <div className="flex items-center gap-3">
            <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-border rounded-lg transition-all duration-200">
              <Download className="w-5 h-5" />
            </button>
            <CustomDropdown
              options={SCHEME_OPTIONS}
              value={schemeFilter}
              onChange={setSchemeFilter}
              icon={Filter}
            />
          </div>
        </div>

        {/* 5 Stats Cards Grid */}
        <div className="grid grid-cols-5 gap-4">
          {/* Total Applications */}
          <div className="stat-card bg-card-total dark:bg-card-total/20">
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="text-2xl font-bold text-secondary dark:text-white">{stats.total}</p>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mt-1">Total Applications</p>
              </div>
              <TotalApplicationsIcon />
            </div>
            <p className="text-xs">
              <span className="text-green-600 font-semibold">+12 %</span>
              <span className="text-gray-500 dark:text-gray-400"> Form Last Month</span>
            </p>
          </div>

          {/* Pending Applications */}
          <div className="stat-card bg-card-pending dark:bg-card-pending/20">
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="text-2xl font-bold text-secondary dark:text-white">{stats.pending}</p>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mt-1">Pending Applications</p>
              </div>
              <PendingIcon />
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              <span className="text-green-600 font-semibold">{stats.approvalRate} %</span> Approval Rate
            </p>
          </div>

          {/* Under Review */}
          <div className="stat-card bg-card-review dark:bg-card-review/20">
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="text-2xl font-bold text-secondary dark:text-white">{stats.underReview}</p>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mt-1">Under Review</p>
              </div>
              <UnderReviewIcon />
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              AVG. Review Time : <span className="font-semibold text-secondary dark:text-white">3 Day</span>
            </p>
          </div>

          {/* Approved Applications */}
          <div className="stat-card bg-card-approved dark:bg-card-approved/20">
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="text-2xl font-bold text-secondary dark:text-white">{stats.approved}</p>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mt-1">Approves Applications</p>
              </div>
              <ApprovedIcon />
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              <span className="text-green-600 font-semibold">{stats.approvalRate} %</span> Approval Rate
            </p>
          </div>

          {/* Rejected Applications */}
          <div className="stat-card bg-card-rejected dark:bg-card-rejected/20">
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="text-2xl font-bold text-red-500">{stats.rejected}</p>
                <p className="text-sm font-medium text-red-500 mt-1">Rejected Applications</p>
              </div>
              <RejectedIcon />
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              AVG. Review Time : <span className="font-semibold text-secondary dark:text-white">3 Day</span>
            </p>
          </div>
        </div>
      </div>

      {/* All Applications Section */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-semibold text-secondary dark:text-white">All Applications</h2>
          
          <div className="flex items-center gap-3">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search here..."
                className="w-80 pl-10 pr-4 py-2.5 bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-xl text-sm focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
              />
            </div>

            {/* Date Filter */}
            <DatePicker value={dateFilter} onChange={setDateFilter} />

            {/* Status Filter */}
            <CustomDropdown
              options={STATUS_OPTIONS}
              value={statusFilter}
              onChange={setStatusFilter}
              icon={Filter}
            />
          </div>
        </div>

        {/* Applications Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {displayApplications.map((app, index) => (
            <ApplicationGridCard 
              key={app.id || index} 
              application={app} 
              onViewDetails={onViewDetails}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ApplicationsPage;
