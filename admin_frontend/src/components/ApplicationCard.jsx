import React from 'react';
import { CheckCircle, Clock, AlertCircle, XCircle } from 'lucide-react';

const ApplicationCard = ({ application, index = 0, onViewDetails }) => {
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
          buttonStyle: 'btn-primary'
        };
      case 'pending':
        return {
          label: 'Pending',
          bgClass: 'bg-gray-100 dark:bg-gray-800',
          textClass: 'text-gray-600 dark:text-gray-400',
          Icon: Clock,
          buttonStyle: 'btn-outline'
        };
      case 'under_review':
        return {
          label: 'Under Review',
          bgClass: 'bg-yellow-100 dark:bg-yellow-900/30',
          textClass: 'text-yellow-700 dark:text-yellow-400',
          Icon: AlertCircle,
          buttonStyle: 'btn-outline'
        };
      case 'rejected':
        return {
          label: 'Rejected',
          bgClass: 'bg-red-100 dark:bg-red-900/30',
          textClass: 'text-red-700 dark:text-red-400',
          Icon: XCircle,
          buttonStyle: 'btn-outline'
        };
      default:
        return {
          label: 'Pending',
          bgClass: 'bg-gray-100 dark:bg-gray-800',
          textClass: 'text-gray-600 dark:text-gray-400',
          Icon: Clock,
          buttonStyle: 'btn-outline'
        };
    }
  };

  const statusConfig = getStatusConfig(status);
  const StatusIcon = statusConfig.Icon;

  // Format funding amount
  const formatFunding = (amount) => {
    if (!amount || amount === 'N/A') return 'N/A';
    // If it's already formatted with commas
    if (typeof amount === 'string' && amount.includes(',')) {
      return `Rs.${amount}`;
    }
    // If it's a number
    const num = parseFloat(amount);
    if (isNaN(num)) return amount;
    return `Rs.${num.toLocaleString('en-IN')}`;
  };

  return (
    <div 
      className={`app-card animate-slide-up`}
      style={{ animationDelay: `${index * 100}ms` }}
    >
      {/* Status Badge */}
      <div className="mb-4">
        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${statusConfig.bgClass} ${statusConfig.textClass}`}>
          <StatusIcon className="w-3.5 h-3.5" />
          {statusConfig.label}
        </span>
      </div>

      {/* Contact Info */}
      <div className="mb-5">
        <h3 className="font-semibold text-secondary dark:text-white text-sm mb-1 line-clamp-1">
          {fullName}
        </h3>
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5 line-clamp-1">
          {email}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {mobile}
        </p>
      </div>

      {/* Company Info */}
      <div className="mb-5">
        <p className="text-[10px] text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1">Company</p>
        <p className="text-sm font-semibold text-secondary dark:text-white line-clamp-1">
          {companyName}
        </p>
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
        className={`w-full py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
          statusConfig.buttonStyle === 'btn-primary'
            ? 'bg-primary text-secondary hover:bg-primary-hover hover:shadow-lg active:scale-[0.98]'
            : 'bg-white dark:bg-dark-card border-2 border-gray-200 dark:border-dark-border text-secondary dark:text-white hover:border-gray-300 dark:hover:border-gray-600 hover:bg-gray-50 dark:hover:bg-dark-border active:scale-[0.98]'
        }`}
      >
        All Details
      </button>
    </div>
  );
};

export default ApplicationCard;
