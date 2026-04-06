import React, { useState, useEffect, useMemo } from 'react';
import { Download, FileText, CheckCircle, Clock, Edit2 } from 'lucide-react';
import ApplicationCard from './ApplicationCard';

// Speedometer component for funding overview
const Speedometer = ({ percentage = 75 }) => {
  const [animatedPercentage, setAnimatedPercentage] = useState(0);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedPercentage(percentage);
    }, 300);
    return () => clearTimeout(timer);
  }, [percentage]);
  
  // SVG arc calculation
  const radius = 45;
  const circumference = Math.PI * radius; // Half circle
  const strokeDashoffset = circumference - (animatedPercentage / 100) * circumference;
  
  return (
    <div className="relative w-32 h-20 mx-auto">
      <svg className="w-full h-full" viewBox="0 0 100 60">
        {/* Background arc */}
        <path
          d="M 5 55 A 45 45 0 0 1 95 55"
          className="speedometer-bg"
          strokeWidth="8"
        />
        {/* Filled arc */}
        <path
          d="M 5 55 A 45 45 0 0 1 95 55"
          className="speedometer-fill"
          strokeWidth="8"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          style={{ transition: 'stroke-dashoffset 1.5s ease-out' }}
        />
      </svg>
      {/* Percentage labels */}
      <div className="absolute bottom-0 left-0 text-[10px] text-gray-400 dark:text-gray-500">0%</div>
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 text-lg font-bold text-secondary dark:text-white">
        {animatedPercentage}%
      </div>
      <div className="absolute bottom-0 right-0 text-[10px] text-gray-400 dark:text-gray-500">100%</div>
    </div>
  );
};

// Stat Card Icons
const TotalApplicationsIcon = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="6" y="4" width="20" height="24" rx="2" stroke="#D97706" strokeWidth="2"/>
    <path d="M10 10H22" stroke="#D97706" strokeWidth="2" strokeLinecap="round"/>
    <path d="M10 15H22" stroke="#D97706" strokeWidth="2" strokeLinecap="round"/>
    <path d="M10 20H17" stroke="#D97706" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

const TotalApprovesIcon = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="16" cy="16" r="12" stroke="#22C55E" strokeWidth="2"/>
    <path d="M10 16L14 20L22 12" stroke="#22C55E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const UnderReviewIcon = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M6 8H10V24H6V8Z" fill="#F59E0B"/>
    <path d="M13 12H17V24H13V12Z" fill="#F59E0B" opacity="0.7"/>
    <path d="M20 16H24V24H20V16Z" fill="#F59E0B" opacity="0.4"/>
  </svg>
);

const Dashboard = ({ applications = [], donations = [], onViewApplication }) => {
  // Calculate dynamic stats
  const stats = useMemo(() => {
    const total = applications.length;
    const approved = applications.filter(app => (app.status || '').toLowerCase() === 'approved').length;
    const underReview = applications.filter(app => (app.status || '').toLowerCase() === 'under_review').length;
    const pending = applications.filter(app => (app.status || '').toLowerCase() === 'pending').length;
    const rejected = applications.filter(app => (app.status || '').toLowerCase() === 'rejected').length;
    
    const approvalRate = total > 0 ? ((approved / total) * 100).toFixed(1) : 0;
    
    return { total, approved, underReview, pending, rejected, approvalRate };
  }, [applications]);

  // Calculate total funding from donations
  const fundingStats = useMemo(() => {
    const totalFunding = donations.reduce((sum, d) => sum + parseFloat(d.amount || 0), 0);
    
    // Mock campaign data - in production this would come from backend
    const campaigns = [
      { name: 'I Yogdan', amount: totalFunding * 0.6, icon: 'gift' },
      { name: 'Mahila Empowerment Scheme', amount: totalFunding * 0.4, icon: 'users' },
    ];
    
    return { 
      totalFunding: totalFunding > 0 ? totalFunding : 25500000, // Default to 2.55Cr for demo
      campaigns,
      quarterGrowth: 8
    };
  }, [donations]);

  const formatCurrency = (amount) => {
    if (amount >= 10000000) {
      return `${(amount / 10000000).toFixed(2)}Cr`;
    } else if (amount >= 100000) {
      return `${(amount / 100000).toFixed(2)}L`;
    }
    return amount.toLocaleString('en-IN');
  };

  // Get current month/year
  const currentDate = new Date();
  const monthYear = currentDate.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });

  // Get 4 recent applications for cards
  const recentApplications = applications.slice(0, 4);

  return (
    <div className="p-8 animate-fade-in">
      {/* Today's Overview Section */}
      <div className="flex gap-6 mb-8">
        {/* Stats Cards Container */}
        <div className="flex-1 bg-white dark:bg-dark-card rounded-2xl border border-gray-100 dark:border-dark-border p-6 transition-colors duration-300">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-secondary dark:text-white">Today&apos;s Overview</h2>
            <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-dark-border rounded-xl hover:bg-gray-50 dark:hover:bg-dark-border transition-all duration-300">
              <Download className="w-4 h-4" />
              Download
            </button>
          </div>
          
          {/* Stats Cards Grid */}
          <div className="grid grid-cols-3 gap-4">
            {/* Total Applications Card */}
            <div className="stat-card bg-card-total dark:bg-card-total/20 animate-slide-up">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-3xl font-bold text-secondary dark:text-white">{stats.total || 1120}</p>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mt-1">Total Applications</p>
                </div>
                <TotalApplicationsIcon />
              </div>
              <p className="text-xs">
                <span className="text-green-600 font-semibold">+12 %</span>
                <span className="text-gray-500 dark:text-gray-400"> Form Last Month</span>
              </p>
            </div>

            {/* Total Approves Card */}
            <div className="stat-card bg-card-approved dark:bg-card-approved/20 animate-slide-up animate-delay-100">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-3xl font-bold text-secondary dark:text-white">
                    {String(stats.approved || 1).padStart(2, '0')}
                  </p>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mt-1">Total Approves</p>
                </div>
                <TotalApprovesIcon />
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                <span className="text-green-600 font-semibold">{stats.approvalRate} %</span> Approval Rate
              </p>
            </div>

            {/* Under Review Card */}
            <div className="stat-card bg-card-review dark:bg-card-review/20 animate-slide-up animate-delay-200">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-3xl font-bold text-secondary dark:text-white">{stats.underReview || 0}</p>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mt-1">Under Review</p>
                </div>
                <UnderReviewIcon />
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                AVG. Review Time : <span className="font-semibold text-secondary dark:text-white">3 Day</span>
              </p>
            </div>
          </div>
        </div>

        {/* Funding Overview Panel */}
        <div className="w-72 bg-white dark:bg-dark-card rounded-2xl border border-gray-100 dark:border-dark-border p-6 transition-colors duration-300 animate-slide-up animate-delay-300">
          {/* Total Funding Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-secondary dark:text-white">
                Rs.{formatCurrency(fundingStats.totalFunding)}
              </span>
              <button className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
                <Edit2 className="w-4 h-4" />
              </button>
            </div>
            <span className="text-xs text-gray-500 dark:text-gray-400">{monthYear}</span>
          </div>

          {/* Campaign Items */}
          <div className="space-y-3 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 bg-gray-100 dark:bg-dark-border rounded-full flex items-center justify-center">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20 12V22H4V12" stroke="currentColor" strokeWidth="2" className="text-gray-500"/>
                  <path d="M22 7H2V12H22V7Z" stroke="currentColor" strokeWidth="2" className="text-gray-500"/>
                  <path d="M12 22V7" stroke="currentColor" strokeWidth="2" className="text-gray-500"/>
                </svg>
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">I Yogdan</p>
                <p className="text-sm font-semibold text-secondary dark:text-white">
                  Rs.{formatCurrency(fundingStats.campaigns[0]?.amount || 15500000)}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-6 h-6 bg-gray-100 dark:bg-dark-border rounded-full flex items-center justify-center">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" className="text-gray-500"/>
                  <path d="M12 8V12L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-gray-500"/>
                </svg>
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Mahila Empowerment Scheme</p>
                <p className="text-sm font-semibold text-secondary dark:text-white">
                  Rs.{formatCurrency(fundingStats.campaigns[1]?.amount || 12000000)}
                </p>
              </div>
            </div>
          </div>

          {/* Speedometer */}
          <Speedometer percentage={75} />

          {/* Growth indicator */}
          <div className="text-center mt-4">
            <p className="text-xs">
              <span className="text-green-600 font-semibold">+{fundingStats.quarterGrowth}%</span>
              <span className="text-gray-500 dark:text-gray-400"> From Last Quarter</span>
            </p>
          </div>
        </div>
      </div>

      {/* Recent Applications Section */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-secondary dark:text-white mb-5">Recent Applications</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {recentApplications.length > 0 ? (
            recentApplications.map((app, index) => (
              <ApplicationCard key={app.id || index} application={app} index={index} onViewDetails={onViewApplication} />
            ))
          ) : (
            // Demo cards when no data
            <>
              <ApplicationCard 
                application={{
                  status: 'approved',
                  fullName: 'Dwarkesh Mukundbhai Sidapara',
                  email: 'loansphere.ai@gmail.com',
                  mobile: '+91 12345 67890',
                  companyName: 'Finsphere A1 (OPC) Private Limited',
                  currentStage: '3-2',
                  fundingAmount: '20,00,000'
                }} 
                index={0}
              />
              <ApplicationCard 
                application={{
                  status: 'pending',
                  fullName: 'Harjinder Singh',
                  email: 'contact@dojomerakifoundation.org',
                  mobile: '+91 12345 67890',
                  companyName: 'Finsphere A1 (OPC) Private Limited',
                  currentStage: '3-1',
                  fundingAmount: '50,00,000'
                }} 
                index={1}
              />
              <ApplicationCard 
                application={{
                  status: 'approved',
                  fullName: 'Dwarkesh Mukundbhai Sidapara',
                  email: 'loansphere.ai@gmail.com',
                  mobile: '+91 12345 67890',
                  companyName: 'Finsphere A1 (OPC) Private Limited',
                  currentStage: '3-2',
                  fundingAmount: '20,00,000'
                }} 
                index={2}
              />
              <ApplicationCard 
                application={{
                  status: 'approved',
                  fullName: 'Dwarkesh Mukundbhai Sidapara',
                  email: 'loansphere.ai@gmail.com',
                  mobile: '+91 12345 67890',
                  companyName: 'Finsphere A1 (OPC) Private Limited',
                  currentStage: '3-2',
                  fundingAmount: '20,00,000'
                }} 
                index={3}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
