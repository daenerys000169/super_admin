import React, { useState, useEffect, useMemo } from 'react';
import { Calendar, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';

// Custom Area Chart Component with animation
const AreaChart = ({ data, width = 700, height = 300 }) => {
  const [animated, setAnimated] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => setAnimated(true), 100);
    return () => clearTimeout(timer);
  }, [data]);

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const maxValue = Math.max(...data.map(d => d.value), 1);
  const padding = { top: 30, right: 30, bottom: 40, left: 20 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  // Calculate points for the line
  const points = data.map((d, i) => ({
    x: padding.left + (i / (data.length - 1)) * chartWidth,
    y: padding.top + chartHeight - (d.value / maxValue) * chartHeight,
    value: d.value
  }));

  // Create smooth curve path using cubic bezier
  const createSmoothPath = (pts) => {
    if (pts.length < 2) return '';
    
    let path = `M ${pts[0].x} ${pts[0].y}`;
    
    for (let i = 0; i < pts.length - 1; i++) {
      const current = pts[i];
      const next = pts[i + 1];
      const controlX = (current.x + next.x) / 2;
      
      path += ` C ${controlX} ${current.y}, ${controlX} ${next.y}, ${next.x} ${next.y}`;
    }
    
    return path;
  };

  const linePath = createSmoothPath(points);
  
  // Create area path (line path + close to bottom)
  const areaPath = linePath + 
    ` L ${points[points.length - 1].x} ${padding.top + chartHeight}` +
    ` L ${points[0].x} ${padding.top + chartHeight} Z`;

  return (
    <svg width={width} height={height} className="overflow-visible">
      <defs>
        {/* Gradient for area fill */}
        <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#F3B10C" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#F3B10C" stopOpacity="0.05" />
        </linearGradient>
        {/* Glow filter for line */}
        <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      {/* Area fill */}
      <path
        d={areaPath}
        fill="url(#areaGradient)"
        className={`transition-all duration-1000 ease-out ${animated ? 'opacity-100' : 'opacity-0'}`}
      />

      {/* Line */}
      <path
        d={linePath}
        fill="none"
        stroke="#F3B10C"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        filter="url(#glow)"
        className={`transition-all duration-1000 ease-out ${animated ? 'opacity-100' : 'opacity-0'}`}
        style={{
          strokeDasharray: animated ? 'none' : '2000',
          strokeDashoffset: animated ? '0' : '2000'
        }}
      />

      {/* Data points */}
      {points.map((point, i) => (
        <g key={i} className={`transition-all duration-500 ease-out ${animated ? 'opacity-100' : 'opacity-0'}`} style={{ transitionDelay: `${i * 50}ms` }}>
          {/* Outer glow */}
          <circle
            cx={point.x}
            cy={point.y}
            r="8"
            fill="#F3B10C"
            fillOpacity="0.2"
            className="transition-all duration-200"
          />
          {/* Inner point */}
          <circle
            cx={point.x}
            cy={point.y}
            r="5"
            fill="#F3B10C"
            stroke="white"
            strokeWidth="2"
            className="transition-all duration-200 hover:r-7 cursor-pointer"
          />
          {/* Hover tooltip area */}
          <circle
            cx={point.x}
            cy={point.y}
            r="15"
            fill="transparent"
            className="cursor-pointer"
          >
            <title>₹{point.value.toLocaleString('en-IN')}</title>
          </circle>
        </g>
      ))}

      {/* X-axis labels */}
      {months.map((month, i) => (
        <text
          key={month}
          x={padding.left + (i / (months.length - 1)) * chartWidth}
          y={height - 10}
          textAnchor="middle"
          className="text-xs fill-gray-400 dark:fill-gray-500"
        >
          {month}
        </text>
      ))}
    </svg>
  );
};

// Filter Dropdown Component
const FilterDropdown = ({ value, onChange, options }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-lg text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-dark-border transition-colors"
      >
        {value}
        <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-lg shadow-lg z-50 min-w-32 animate-fade-in">
          {options.map((option) => (
            <button
              key={option}
              onClick={() => {
                onChange(option);
                setIsOpen(false);
              }}
              className={`w-full px-4 py-2.5 text-left text-sm transition-colors ${
                value === option
                  ? 'bg-[#FFF7E2] text-secondary font-medium'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-dark-border'
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const DonationPage = ({ donations = [] }) => {
  const [timeFilter, setTimeFilter] = useState('Yearly');
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;

  // Generate dynamic chart data based on donations and filter
  const chartData = useMemo(() => {
    // Default mock data matching Figma if no real data
    const monthlyValues = [
      { month: 'Jan', value: 150000 },
      { month: 'Feb', value: 280000 },
      { month: 'Mar', value: 420000 },
      { month: 'Apr', value: 480000 },
      { month: 'May', value: 520000 },
      { month: 'Jun', value: 380000 },
      { month: 'Jul', value: 280000 },
      { month: 'Aug', value: 450000 },
      { month: 'Sep', value: 380000 },
      { month: 'Oct', value: 480000 },
      { month: 'Nov', value: 520000 },
      { month: 'Dec', value: 620000 }
    ];

    // If we have real donation data, aggregate by month
    if (donations.length > 0) {
      const aggregated = {};
      donations.forEach(d => {
        const date = new Date(d.date || d.createdAt);
        const month = date.toLocaleString('en-US', { month: 'short' });
        aggregated[month] = (aggregated[month] || 0) + (d.amount || 0);
      });
      
      return monthlyValues.map(m => ({
        ...m,
        value: aggregated[m.month] || m.value
      }));
    }

    return monthlyValues;
  }, [donations, timeFilter]);

  // Calculate collection totals
  const collectionData = useMemo(() => {
    if (donations.length > 0) {
      const iYogdan = donations
        .filter(d => d.scheme === 'iYogdan' || d.campaign?.includes('iYogdan'))
        .reduce((sum, d) => sum + (d.amount || 0), 0);
      const mahila = donations
        .filter(d => d.scheme === 'Mahila Empowerment' || d.campaign?.includes('Mahila'))
        .reduce((sum, d) => sum + (d.amount || 0), 0);
      
      return {
        iYogdan: iYogdan || 900000,
        mahila: mahila || 1100000,
        total: (iYogdan + mahila) || 2000000
      };
    }
    
    return {
      iYogdan: 900000,
      mahila: 1100000,
      total: 2000000
    };
  }, [donations]);

  // Mock transaction data matching Figma
  const transactions = useMemo(() => {
    if (donations.length > 0) {
      return donations.slice(0, 10).map(d => ({
        id: d.id || d._id,
        customer: d.donorName || d.customer || 'Anonymous',
        campaign: d.campaign || d.campaignName || 'General Donation',
        paymentMethod: d.paymentMethod || 'UPI',
        paymentDetails: d.paymentDetails || '****1234',
        amount: d.amount || 0,
        date: d.date || d.createdAt
      }));
    }

    // Default data matching Figma
    return [
      { id: 1, customer: 'Jonathan Doe', campaign: 'Old Age Home Care', paymentMethod: 'HDFC Bank', paymentDetails: '**** 9876', amount: 1000, date: '2026-02-22' },
      { id: 2, customer: 'Mark Thompson', campaign: 'Education Under Bridge', paymentMethod: 'Google Pay', paymentDetails: 'Sarah@Okaxis', amount: 500, date: '2026-02-14' },
      { id: 3, customer: 'Sarah Jenkins', campaign: 'Education Under Bridge', paymentMethod: 'SBI UPI', paymentDetails: 'Mark@Upi', amount: 500, date: '2026-02-10' },
      { id: 4, customer: 'Jonathan Doe', campaign: 'Donate Blanket Campaign', paymentMethod: 'ICICI Net Banking', paymentDetails: '**** 9876', amount: 500, date: '2026-02-08' },
      { id: 5, customer: 'Sarah Jenkins', campaign: 'Old Age Home Care', paymentMethod: 'HDFC Bank', paymentDetails: '**** 9876', amount: 1000, date: '2026-02-02' },
      { id: 6, customer: 'Emily Carter', campaign: 'Child Education Fund', paymentMethod: 'Paytm', paymentDetails: 'emily@paytm', amount: 2000, date: '2026-01-28' },
      { id: 7, customer: 'Robert Wilson', campaign: 'Healthcare Initiative', paymentMethod: 'Axis Bank', paymentDetails: '**** 5432', amount: 1500, date: '2026-01-25' },
    ];
  }, [donations]);

  // Pagination
  const totalPages = Math.ceil(transactions.length / rowsPerPage);
  const paginatedTransactions = transactions.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  // Format currency in Indian format
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount).replace('₹', '₹');
  };

  // Format date
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  return (
    <div className="p-6 lg:p-8 animate-fade-in">
      {/* Chart Section */}
      <div className="flex flex-col xl:flex-row gap-6 mb-8">
        {/* Area Chart Card */}
        <div className="flex-1 bg-white dark:bg-dark-card rounded-xl border border-gray-200 dark:border-dark-border p-6 transition-all duration-300 hover:shadow-lg">
          {/* Chart Header */}
          <div className="flex justify-end mb-4">
            <FilterDropdown
              value={timeFilter}
              onChange={setTimeFilter}
              options={['Daily', 'Weekly', 'Monthly', 'Yearly']}
            />
          </div>

          {/* Chart */}
          <div className="w-full overflow-x-auto">
            <div className="min-w-[600px]">
              <AreaChart data={chartData} width={750} height={280} />
            </div>
          </div>
        </div>

        {/* Monthly Collection Sidebar */}
        <div className="w-full xl:w-80 flex-shrink-0">
          <div className="bg-white dark:bg-dark-card rounded-xl border border-gray-200 dark:border-dark-border p-6 transition-all duration-300 hover:shadow-lg">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-secondary dark:text-white">Monthly Collection</h3>
              <div className="w-10 h-10 bg-gray-100 dark:bg-dark-border rounded-lg flex items-center justify-center">
                <Calendar className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              </div>
            </div>

            {/* Table Header */}
            <div className="flex justify-between text-sm font-medium text-gray-500 dark:text-gray-400 mb-4 pb-2 border-b border-gray-100 dark:border-dark-border">
              <span>Schemes</span>
              <span>Collection</span>
            </div>

            {/* IYogdan Row */}
            <div className="flex justify-between items-center py-4 border-b border-gray-100 dark:border-dark-border group hover:bg-gray-50 dark:hover:bg-dark-border/50 -mx-2 px-2 rounded transition-colors">
              <span className="text-secondary dark:text-gray-300">IYogdan</span>
              <span className="font-bold text-secondary dark:text-white">₹9,00,000</span>
            </div>

            {/* Mahila Empowerment Row */}
            <div className="flex justify-between items-center py-4 border-b border-gray-100 dark:border-dark-border group hover:bg-gray-50 dark:hover:bg-dark-border/50 -mx-2 px-2 rounded transition-colors">
              <span className="text-secondary dark:text-gray-300">Mahila Empowerment</span>
              <span className="font-bold text-secondary dark:text-white">₹11,00,000</span>
            </div>

            {/* Total */}
            <div className="flex justify-end mt-6 pt-4">
              <span className="text-2xl font-bold text-primary">₹20,00,000</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Transaction Table */}
      <div className="bg-white dark:bg-dark-card rounded-xl border border-gray-200 dark:border-dark-border overflow-hidden transition-all duration-300 hover:shadow-lg">
        {/* Table Header */}
        <div className="px-6 py-4 border-b border-gray-100 dark:border-dark-border">
          <h3 className="text-lg font-semibold text-secondary dark:text-white">Recent Transaction</h3>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-[#FFF7E2] dark:bg-dark-border/50">
                <th className="text-left px-6 py-4 text-sm font-semibold text-secondary dark:text-white">Customer</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-secondary dark:text-white">Campaign Name</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-secondary dark:text-white">Payment Method</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-secondary dark:text-white">Amount</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-secondary dark:text-white">Date</th>
              </tr>
            </thead>
            <tbody>
              {paginatedTransactions.map((transaction, index) => (
                <tr 
                  key={transaction.id}
                  className="border-b border-gray-100 dark:border-dark-border hover:bg-gray-50 dark:hover:bg-dark-border/30 transition-colors animate-fade-in"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <td className="px-6 py-4">
                    <span className="text-sm text-secondary dark:text-white font-medium">
                      {transaction.customer}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-secondary dark:text-gray-300">
                      {transaction.campaign}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <span className="text-sm text-secondary dark:text-white font-medium block">
                        {transaction.paymentMethod}
                      </span>
                      <span className="text-xs text-gray-400 dark:text-gray-500">
                        {transaction.paymentDetails}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-secondary dark:text-white font-medium">
                      ₹{transaction.amount.toLocaleString('en-IN')}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-secondary dark:text-gray-300">
                      {formatDate(transaction.date)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {transactions.length > rowsPerPage && (
          <div className="px-6 py-4 border-t border-gray-100 dark:border-dark-border flex items-center justify-between">
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Showing {(currentPage - 1) * rowsPerPage + 1} to {Math.min(currentPage * rowsPerPage, transactions.length)} of {transactions.length}
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-border disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              </button>
              <span className="px-3 py-1 bg-primary text-white rounded-lg text-sm font-medium">
                {currentPage}
              </span>
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-border disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DonationPage;
