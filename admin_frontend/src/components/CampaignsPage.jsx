import React, { useState, useMemo } from 'react';
import { Download, X, ChevronDown, Users, Heart, Eye } from 'lucide-react';

// Campaign Card Component
const CampaignCard = ({ campaign, onViewDetails, index }) => (
  <div 
    className="bg-white dark:bg-dark-card rounded-xl border border-gray-200 dark:border-dark-border overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 animate-fade-in"
    style={{ animationDelay: `${index * 100}ms` }}
  >
    {/* Campaign Image */}
    <div className="relative h-44 overflow-hidden">
      <img 
        src={campaign.image || "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=400&h=300&fit=crop"}
        alt={campaign.name}
        className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
      />
    </div>
    
    {/* Campaign Content */}
    <div className="p-4">
      <span className="text-xs text-gray-500 dark:text-gray-400">Campaign</span>
      <h3 className="text-lg font-bold text-secondary dark:text-white mt-1">{campaign.name}</h3>
      <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 line-clamp-2">
        {campaign.description}
      </p>
      
      {/* Footer with avatars and button */}
      <div className="flex items-center justify-between mt-4">
        {/* Donor Avatars */}
        <div className="flex -space-x-2">
          {[1, 2, 3].map((i) => (
            <div 
              key={i}
              className="w-8 h-8 rounded-full border-2 border-white dark:border-dark-card overflow-hidden"
            >
              <img 
                src={`https://i.pravatar.cc/32?img=${i + 10}`}
                alt="Donor"
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
        
        {/* View Details Button */}
        <button
          onClick={() => onViewDetails(campaign)}
          className="px-5 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary-hover transition-all duration-200 hover:shadow-md"
        >
          View Details
        </button>
      </div>
    </div>
  </div>
);

// Total Revenue Table Component
const TotalRevenueTable = ({ data }) => (
  <div className="bg-white dark:bg-dark-card rounded-xl border border-gray-200 dark:border-dark-border overflow-hidden">
    <h3 className="text-lg font-bold text-secondary dark:text-white p-4 border-b border-gray-100 dark:border-dark-border">
      Total Revenue
    </h3>
    <div className="overflow-hidden">
      {/* Header */}
      <div className="grid grid-cols-2 bg-[#FFF7E2] dark:bg-primary/20 px-4 py-3">
        <span className="text-sm font-medium text-secondary dark:text-white">Year</span>
        <span className="text-sm font-medium text-secondary dark:text-white text-right">AMT</span>
      </div>
      
      {/* Rows */}
      {data.map((item, index) => (
        <div 
          key={item.year}
          className="grid grid-cols-2 px-4 py-3 border-b border-gray-100 dark:border-dark-border last:border-b-0 hover:bg-gray-50 dark:hover:bg-dark-border transition-colors"
          style={{ animationDelay: `${index * 50}ms` }}
        >
          <span className="text-sm text-secondary dark:text-gray-300">{item.year}</span>
          <span className="text-sm font-semibold text-primary text-right">{item.amount}</span>
        </div>
      ))}
      
      {/* Cumulative Total */}
      <div className="grid grid-cols-2 bg-primary px-4 py-3">
        <span className="text-sm font-medium text-white">Cumulative Total</span>
        <span className="text-sm font-bold text-white text-right">11,00,000</span>
      </div>
    </div>
  </div>
);

// Stat Card Component
const StatCard = ({ value, label, icon: Icon, bgColor }) => (
  <div className={`${bgColor} rounded-xl p-5 relative overflow-hidden transition-all duration-300 hover:shadow-md hover:-translate-y-0.5`}>
    <div className="flex justify-between items-start">
      <div>
        <p className="text-2xl font-bold text-secondary dark:text-white">{value}</p>
        <p className="text-sm text-secondary/80 dark:text-gray-300 mt-1">{label}</p>
      </div>
      <div className="w-12 h-12 bg-white/50 dark:bg-white/20 rounded-lg flex items-center justify-center">
        <Icon className="w-6 h-6 text-red-500" />
      </div>
    </div>
    <p className="text-xs mt-4">
      <span className="text-green-500 font-medium">+12 %</span>
      <span className="text-gray-600 dark:text-gray-400 ml-1">Form Last Month</span>
    </p>
  </div>
);

// Growth Chart Component (SVG Area Chart)
const GrowthChart = ({ data, filter, onFilterChange }) => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const maxValue = Math.max(...data);
  const minValue = 0;
  const range = maxValue - minValue;
  
  const width = 500;
  const height = 200;
  const padding = { top: 20, right: 20, bottom: 30, left: 50 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;
  
  const points = data.map((value, index) => {
    const x = padding.left + (index / (data.length - 1)) * chartWidth;
    const y = padding.top + chartHeight - ((value - minValue) / range) * chartHeight;
    return { x, y, value };
  });
  
  const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  const areaPath = `${linePath} L ${points[points.length - 1].x} ${height - padding.bottom} L ${padding.left} ${height - padding.bottom} Z`;

  const yAxisLabels = ['0', '10k', '20k', '50k', '100k'];

  return (
    <div className="bg-white dark:bg-dark-card rounded-xl border border-primary p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-secondary dark:text-white">Growth</h3>
        <div className="relative">
          <select
            value={filter}
            onChange={(e) => onFilterChange(e.target.value)}
            className="appearance-none bg-white dark:bg-dark-border border border-gray-200 dark:border-dark-border rounded-lg px-4 py-2 pr-8 text-sm text-secondary dark:text-white focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer"
          >
            <option value="yearly">Yearly</option>
            <option value="monthly">Monthly</option>
            <option value="weekly">Weekly</option>
          </select>
          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        </div>
      </div>
      
      <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} className="overflow-visible">
        <defs>
          <linearGradient id="modalAreaGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#F3B10C" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#F3B10C" stopOpacity="0.05" />
          </linearGradient>
        </defs>
        
        {/* Y-axis labels */}
        {yAxisLabels.map((label, i) => (
          <text
            key={label}
            x={padding.left - 10}
            y={padding.top + chartHeight - (i / (yAxisLabels.length - 1)) * chartHeight}
            textAnchor="end"
            alignmentBaseline="middle"
            className="text-xs fill-gray-400"
          >
            {label}
          </text>
        ))}
        
        {/* X-axis labels */}
        {months.map((month, i) => (
          <text
            key={month}
            x={padding.left + (i / (months.length - 1)) * chartWidth}
            y={height - 5}
            textAnchor="middle"
            className="text-xs fill-gray-400"
          >
            {month}
          </text>
        ))}
        
        {/* Area fill */}
        <path
          d={areaPath}
          fill="url(#modalAreaGradient)"
          className="animate-fade-in"
        />
        
        {/* Line */}
        <path
          d={linePath}
          fill="none"
          stroke="#F3B10C"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="animate-draw-line"
        />
        
        {/* Data points */}
        {points.map((point, i) => (
          <g key={i} className="group cursor-pointer">
            <circle
              cx={point.x}
              cy={point.y}
              r="5"
              fill="#F3B10C"
              stroke="white"
              strokeWidth="2"
              className="transition-all duration-200 group-hover:r-7"
            />
            <title>{`${months[i]}: ${point.value.toLocaleString()}`}</title>
          </g>
        ))}
      </svg>
    </div>
  );
};

// Campaign Details Modal
const CampaignDetailsModal = ({ campaign, onClose }) => {
  const [chartFilter, setChartFilter] = useState('yearly');
  
  const chartData = [2000, 8000, 15000, 25000, 35000, 50000, 8000, 15000, 25000, 45000, 70000, 95000];
  
  if (!campaign) return null;
  
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fade-in">
      <div 
        className="bg-white dark:bg-dark-card rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-dark-border">
          <h2 className="text-2xl font-bold text-secondary dark:text-white">{campaign.name}</h2>
          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-dark-border transition-colors"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>
        
        {/* Modal Content */}
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* IYogdan Applications Card */}
            <div className="bg-white dark:bg-dark-card rounded-xl border border-primary p-6">
              <h3 className="text-lg font-bold text-secondary dark:text-white mb-6 pb-4 border-b border-gray-100 dark:border-dark-border">
                IYogdan Applications
              </h3>
              
              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Total Donors</span>
                  <span className="text-xl font-bold text-secondary dark:text-white">{campaign.totalDonors || 1521}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Avg. Donation</span>
                  <span className="text-xl font-bold text-secondary dark:text-white">₹{campaign.avgDonation || '15,21,000'}</span>
                </div>
                
                <div className="h-px bg-gray-200 dark:bg-dark-border my-2"></div>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400 font-medium">Total Donation</span>
                  <span className="text-xl font-bold text-secondary dark:text-white">₹{campaign.totalDonation || '15,21,000'}</span>
                </div>
              </div>
            </div>
            
            {/* Growth Chart */}
            <GrowthChart 
              data={chartData}
              filter={chartFilter}
              onFilterChange={setChartFilter}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

// Document Icon Component
const DocumentIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-red-500">
    <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M14 2V8H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M16 13H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M16 17H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M10 9H9H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const CampaignsPage = ({ donations = [] }) => {
  const [activeTab, setActiveTab] = useState('active');
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  
  // Mock campaigns data - will use real data when available
  const campaigns = useMemo(() => {
    const mockCampaigns = [
      { id: 1, name: 'Child Welfare', description: 'Providing educational supplies and nutritional support to under-served regions.', status: 'active', totalDonors: 1521, avgDonation: '15,21,000', totalDonation: '15,21,000' },
      { id: 2, name: 'Child Welfare', description: 'Providing educational supplies and nutritional support to under-served regions.', status: 'active', totalDonors: 1200, avgDonation: '12,00,000', totalDonation: '12,00,000' },
      { id: 3, name: 'Child Welfare', description: 'Providing educational supplies and nutritional support to under-served regions.', status: 'active', totalDonors: 980, avgDonation: '9,80,000', totalDonation: '9,80,000' },
      { id: 4, name: 'Child Welfare', description: 'Providing educational supplies and nutritional support to under-served regions.', status: 'active', totalDonors: 850, avgDonation: '8,50,000', totalDonation: '8,50,000' },
      { id: 5, name: 'Child Welfare', description: 'Providing educational supplies and nutritional support to under-served regions.', status: 'active', totalDonors: 720, avgDonation: '7,20,000', totalDonation: '7,20,000' },
      { id: 6, name: 'Child Welfare', description: 'Providing educational supplies and nutritional support to under-served regions.', status: 'active', totalDonors: 650, avgDonation: '6,50,000', totalDonation: '6,50,000' },
      { id: 7, name: 'Old Age Home Care', description: 'Supporting elderly care facilities with medical supplies and daily necessities.', status: 'closed', totalDonors: 450, avgDonation: '4,50,000', totalDonation: '4,50,000' },
      { id: 8, name: 'Education Under Bridge', description: 'Bringing education to underprivileged children in urban areas.', status: 'closed', totalDonors: 380, avgDonation: '3,80,000', totalDonation: '3,80,000' },
    ];
    return mockCampaigns;
  }, []);
  
  const filteredCampaigns = campaigns.filter(c => c.status === activeTab);
  
  // Dynamic stats from donations
  const stats = useMemo(() => {
    const hasRealData = donations && donations.length > 0;
    const totalDonation = hasRealData 
      ? donations.reduce((sum, d) => sum + (d.amount || 0), 0) 
      : 2500000;
    const totalDonors = hasRealData ? new Set(donations.map(d => d.donorId || d.email)).size : 1120;
    
    return {
      totalDonors,
      totalDonation: `₹${totalDonation.toLocaleString('en-IN')}`,
      visitors: 1120
    };
  }, [donations]);
  
  // Revenue data for table
  const revenueData = [
    { year: '2026', amount: '25,00,000' },
    { year: '2025', amount: '18,00,000' },
    { year: '2024', amount: '11,00,000' },
    { year: '2023', amount: '8,00,000' },
    { year: '2022', amount: '5,00,000' },
    { year: '2020', amount: '3,00,000' },
    { year: '2019', amount: '2,00,000' },
    { year: '2018', amount: '1,00,000' },
  ];

  return (
    <div className="p-6 lg:p-8 animate-fade-in">
      {/* Today's Overview */}
      <div className="bg-white dark:bg-dark-card rounded-xl border border-gray-100 dark:border-dark-border p-6 mb-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-secondary dark:text-white">Today&apos;s Overview</h2>
          <button className="inline-flex items-center gap-2 px-4 py-2 border border-gray-200 dark:border-dark-border rounded-lg text-sm text-secondary dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-dark-border transition-colors">
            <Download className="w-4 h-4" />
            Download
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard 
            value={stats.totalDonors}
            label="Total Donors"
            icon={DocumentIcon}
            bgColor="bg-[#FEE5D9]"
          />
          <StatCard 
            value={stats.totalDonation}
            label="Total Donation"
            icon={DocumentIcon}
            bgColor="bg-[#FFF7E2]"
          />
          <StatCard 
            value={stats.visitors}
            label="Visitor"
            icon={DocumentIcon}
            bgColor="bg-[#E8F5E9]"
          />
        </div>
      </div>
      
      {/* Initiative Overview + Total Revenue */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Initiative Overview */}
        <div className="flex-1">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <h2 className="text-lg font-semibold text-secondary dark:text-white">Initiative Overview</h2>
            
            {/* Tab Toggle */}
            <div className="inline-flex rounded-lg border border-gray-200 dark:border-dark-border overflow-hidden">
              <button
                onClick={() => setActiveTab('active')}
                className={`px-4 py-2 text-sm font-medium transition-all duration-200 ${
                  activeTab === 'active'
                    ? 'bg-primary text-white'
                    : 'bg-white dark:bg-dark-card text-secondary dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-dark-border'
                }`}
              >
                Active Campaign
              </button>
              <button
                onClick={() => setActiveTab('closed')}
                className={`px-4 py-2 text-sm font-medium transition-all duration-200 ${
                  activeTab === 'closed'
                    ? 'bg-primary text-white'
                    : 'bg-white dark:bg-dark-card text-secondary dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-dark-border'
                }`}
              >
                Closed Campaign
              </button>
            </div>
          </div>
          
          {/* Campaign Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {filteredCampaigns.map((campaign, index) => (
              <CampaignCard 
                key={campaign.id}
                campaign={campaign}
                index={index}
                onViewDetails={setSelectedCampaign}
              />
            ))}
          </div>
          
          {filteredCampaigns.length === 0 && (
            <div className="text-center py-12 bg-white dark:bg-dark-card rounded-xl border border-gray-200 dark:border-dark-border">
              <p className="text-gray-500 dark:text-gray-400">No {activeTab} campaigns found</p>
            </div>
          )}
        </div>
        
        {/* Total Revenue Sidebar */}
        <div className="w-full lg:w-72 flex-shrink-0">
          <TotalRevenueTable data={revenueData} />
        </div>
      </div>
      
      {/* Campaign Details Modal */}
      {selectedCampaign && (
        <CampaignDetailsModal 
          campaign={selectedCampaign}
          onClose={() => setSelectedCampaign(null)}
        />
      )}
    </div>
  );
};

export default CampaignsPage;
