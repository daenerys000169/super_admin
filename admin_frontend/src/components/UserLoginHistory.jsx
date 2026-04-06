import React, { useState, useRef, useEffect } from 'react';
import { Search, ChevronDown, ChevronLeft, ChevronRight, Trash2, MoreHorizontal, Monitor, Smartphone, X } from 'lucide-react';

// Hook for click outside
const useClickOutside = (ref, handler) => {
  useEffect(() => {
    const listener = (event) => {
      if (!ref.current || ref.current.contains(event.target)) return;
      handler(event);
    };
    document.addEventListener('mousedown', listener);
    return () => document.removeEventListener('mousedown', listener);
  }, [ref, handler]);
};

// Filter Icon matching Figma
const FilterIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="5" cy="6" r="2" fill="currentColor" />
    <circle cx="5" cy="12" r="2" fill="currentColor" />
    <circle cx="5" cy="18" r="2" fill="currentColor" />
    <line x1="9" y1="6" x2="21" y2="6" />
    <line x1="9" y1="12" x2="21" y2="12" />
    <line x1="9" y1="18" x2="21" y2="18" />
  </svg>
);

// Clipboard/Document icon for Total Logins card
const ClipboardIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none">
    <rect x="5" y="3" width="14" height="18" rx="2" stroke="#F3B10C" strokeWidth="2" fill="none" />
    <path d="M9 7h6M9 11h6M9 15h4" stroke="#F3B10C" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

// People icon for Active Sessions card
const PeopleIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none">
    <circle cx="8" cy="6" r="3" fill="#F3B10C" />
    <circle cx="16" cy="6" r="3" fill="#F3B10C" />
    <circle cx="12" cy="14" r="3" fill="#F3B10C" />
    <path d="M4 20c0-2 2-4 4-4s4 2 4 4" stroke="#F3B10C" strokeWidth="2" strokeLinecap="round" fill="none" />
    <path d="M12 20c0-2 2-4 4-4s4 2 4 4" stroke="#F3B10C" strokeWidth="2" strokeLinecap="round" fill="none" />
  </svg>
);

// Sample login history data
const SAMPLE_LOGIN_DATA = [
  { id: 1, name: 'Sarah Miller', email: 's.miller@ledger.io', initials: 'SM', color: 'bg-blue-500', ip: '104.28.44.110', date: 'Oct 24, 2023', time: '12:59:01 IST', device: 'Edge / Windows', deviceType: 'desktop', status: 'Success' },
  { id: 2, name: 'Dwarkesh Sidapara', email: 'Loansphere.ai@gmail.com', initials: 'DS', color: 'bg-indigo-600', ip: '104.28.44.110', date: 'Oct 24, 2023', time: '12:59:01 IST', device: 'Safari / iOS', deviceType: 'mobile', status: 'Success' },
  { id: 3, name: 'Sarah Miller', email: 's.miller@ledger.io', initials: 'SM', color: 'bg-blue-500', ip: '104.28.44.110', date: 'Oct 24, 2023', time: '12:59:01 IST', device: 'Edge / Windows', deviceType: 'desktop', status: 'Failed' },
  { id: 4, name: 'Dwarkesh Sidapara', email: 'Loansphere.ai@gmail.com', initials: 'DS', color: 'bg-indigo-600', ip: '104.28.44.110', date: 'Oct 24, 2023', time: '12:59:01 IST', device: 'Safari / iOS', deviceType: 'mobile', status: 'Success' },
  { id: 5, name: 'Sarah Miller', email: 's.miller@ledger.io', initials: 'SM', color: 'bg-blue-500', ip: '104.28.44.110', date: 'Oct 24, 2023', time: '12:59:01 IST', device: 'Edge / Windows', deviceType: 'desktop', status: 'Failed' },
  { id: 6, name: 'Dwarkesh Sidapara', email: 'Loansphere.ai@gmail.com', initials: 'DS', color: 'bg-indigo-600', ip: '104.28.44.110', date: 'Oct 24, 2023', time: '12:59:01 IST', device: 'Edge / Windows', deviceType: 'desktop', status: 'Success' },
  { id: 7, name: 'Sarah Miller', email: 's.miller@ledger.io', initials: 'SM', color: 'bg-blue-500', ip: '104.28.44.110', date: 'Oct 24, 2023', time: '12:59:01 IST', device: 'Edge / Windows', deviceType: 'desktop', status: 'Blocked', isHighlighted: true },
  { id: 8, name: 'Dwarkesh Sidapara', email: 'Loansphere.ai@gmail.com', initials: 'DS', color: 'bg-indigo-600', ip: '104.28.44.110', date: 'Oct 24, 2023', time: '12:59:01 IST', device: 'Edge / Windows', deviceType: 'desktop', status: 'Success' },
  { id: 9, name: 'Sarah Miller', email: 's.miller@ledger.io', initials: 'SM', color: 'bg-blue-500', ip: '104.28.44.110', date: 'Oct 24, 2023', time: '12:59:01 IST', device: 'Edge / Windows', deviceType: 'desktop', status: 'Success' },
  { id: 10, name: 'Dwarkesh Sidapara', email: 'Loansphere.ai@gmail.com', initials: 'DS', color: 'bg-indigo-600', ip: '104.28.44.110', date: 'Oct 24, 2023', time: '12:59:01 IST', device: 'Edge / Windows', deviceType: 'desktop', status: 'Success' },
];

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const YEARS = [2026, 2025, 2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017, 2016, 2015];

// Status badge component
const StatusBadge = ({ status }) => {
  const styles = {
    'Success': 'bg-green-100 text-green-600 border border-green-200',
    'Failed': 'bg-red-100 text-red-600 border border-red-200',
    'Blocked': 'bg-orange-100 text-orange-600 border border-orange-200'
  };

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium ${styles[status] || styles['Success']}`}>
      {status}
    </span>
  );
};

// Date Filter Dropdown
const DateFilterDropdown = ({ selectedDate, onDateChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [filterType, setFilterType] = useState('Day');
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [showYearPicker, setShowYearPicker] = useState(false);
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');
  const dropdownRef = useRef(null);

  useClickOutside(dropdownRef, () => setIsOpen(false));

  const filterTypes = ['Day', 'Week', 'Month', 'Year', 'Custom'];

  const getDaysInMonth = (month, year) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (month, year) => new Date(year, month, 1).getDay();

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentMonth, currentYear);
    const firstDay = getFirstDayOfMonth(currentMonth, currentYear);
    const days = [];
    const today = new Date();

    // Previous month days
    const prevMonthDays = getDaysInMonth(currentMonth - 1, currentYear);
    for (let i = firstDay - 1; i >= 0; i--) {
      days.push(
        <div key={`prev-${i}`} className="w-8 h-8 flex items-center justify-center text-gray-300 text-sm">
          {prevMonthDays - i}
        </div>
      );
    }

    // Current month days
    for (let day = 1; day <= daysInMonth; day++) {
      const isToday = day === today.getDate() && currentMonth === today.getMonth() && currentYear === today.getFullYear();
      const isSelected = day === 14 && currentMonth === 6; // July 14 highlighted as in Figma

      days.push(
        <button
          key={day}
          type="button"
          onClick={() => {
            const newDate = new Date(currentYear, currentMonth, day);
            onDateChange(newDate);
          }}
          className={`w-8 h-8 flex items-center justify-center text-sm rounded-full transition-all ${
            isSelected
              ? 'bg-primary text-white font-medium'
              : isToday
                ? 'bg-primary/20 text-primary font-medium'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-border'
          }`}
        >
          {day}
        </button>
      );
    }

    // Next month days
    const totalCells = Math.ceil(days.length / 7) * 7;
    for (let i = 1; days.length < totalCells; i++) {
      days.push(
        <div key={`next-${i}`} className="w-8 h-8 flex items-center justify-center text-gray-300 text-sm">
          {i}
        </div>
      );
    }

    return days;
  };

  const formatDate = (date) => {
    const d = new Date(date);
    const day = d.getDate();
    const month = MONTHS[d.getMonth()];
    const year = d.getFullYear();
    return `${day} ${month.slice(0, 3)}, ${year}`;
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-xl text-sm hover:border-gray-300 transition-all"
      >
        <FilterIcon className="w-4 h-4 text-gray-600" />
        <span className="text-gray-700 dark:text-gray-300">Date:</span>
        <span className="text-secondary dark:text-white font-medium">{formatDate(selectedDate)}</span>
        <ChevronDown className="w-4 h-4 text-gray-400" />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-xl shadow-xl overflow-hidden animate-fade-in z-50 min-w-[320px]">
          <div className="p-4">
            <p className="text-sm font-medium text-secondary dark:text-white mb-3">Filter by</p>
            
            {/* Filter Type Tabs */}
            <div className="flex gap-1 mb-4">
              {filterTypes.map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setFilterType(type)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-full transition-all ${
                    filterType === type
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 dark:bg-dark-border text-gray-600 dark:text-gray-400 hover:bg-gray-200'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>

            {/* Custom Date Range */}
            {filterType === 'Custom' && (
              <div className="space-y-3 mb-4">
                <button className="w-full px-4 py-2 border border-primary text-primary rounded-lg text-sm font-medium hover:bg-primary/5 transition-colors">
                  Select Start Date
                </button>
                <button className="w-full px-4 py-2 border border-primary text-primary rounded-lg text-sm font-medium hover:bg-primary/5 transition-colors">
                  Select End Date
                </button>
              </div>
            )}

            {/* Month Picker */}
            {filterType === 'Month' && (
              <div className="grid grid-cols-3 gap-2 mb-4">
                {MONTHS.map((month, index) => (
                  <button
                    key={month}
                    type="button"
                    onClick={() => setCurrentMonth(index)}
                    className={`px-3 py-2 text-xs font-medium rounded-lg transition-all ${
                      currentMonth === index
                        ? 'bg-primary text-white'
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-dark-border'
                    }`}
                  >
                    {month}
                  </button>
                ))}
              </div>
            )}

            {/* Year Picker */}
            {filterType === 'Year' && (
              <div className="grid grid-cols-4 gap-2 mb-4">
                {YEARS.map((year) => (
                  <button
                    key={year}
                    type="button"
                    onClick={() => setCurrentYear(year)}
                    className={`px-3 py-2 text-xs font-medium rounded-lg transition-all ${
                      currentYear === year
                        ? 'bg-primary text-white'
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-dark-border'
                    }`}
                  >
                    {year}
                  </button>
                ))}
              </div>
            )}

            {/* Calendar for Day/Week */}
            {(filterType === 'Day' || filterType === 'Week' || filterType === 'Custom') && (
              <>
                {/* Month/Year Header */}
                <div className="flex items-center justify-between mb-4">
                  <button
                    type="button"
                    onClick={() => {
                      if (currentMonth === 0) {
                        setCurrentMonth(11);
                        setCurrentYear(currentYear - 1);
                      } else {
                        setCurrentMonth(currentMonth - 1);
                      }
                    }}
                    className="p-1 hover:bg-gray-100 dark:hover:bg-dark-border rounded-full transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5 text-primary" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowYearPicker(!showYearPicker)}
                    className="text-sm font-medium text-secondary dark:text-white hover:text-primary transition-colors"
                  >
                    {MONTHS[currentMonth]} {currentYear}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (currentMonth === 11) {
                        setCurrentMonth(0);
                        setCurrentYear(currentYear + 1);
                      } else {
                        setCurrentMonth(currentMonth + 1);
                      }
                    }}
                    className="p-1 hover:bg-gray-100 dark:hover:bg-dark-border rounded-full transition-colors"
                  >
                    <ChevronRight className="w-5 h-5 text-primary" />
                  </button>
                </div>

                {/* Day Headers */}
                <div className="grid grid-cols-7 gap-1 mb-2">
                  {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day) => (
                    <div key={day} className="w-8 h-8 flex items-center justify-center text-xs font-medium text-gray-400">
                      {day}
                    </div>
                  ))}
                </div>

                {/* Calendar Grid */}
                <div className="grid grid-cols-7 gap-1">
                  {renderCalendar()}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// Status Filter Dropdown
const StatusFilterDropdown = ({ selectedStatus, onStatusChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useClickOutside(dropdownRef, () => setIsOpen(false));

  const statuses = ['All Status', 'Success', 'Failed', 'Blocked'];

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-xl text-sm hover:border-gray-300 transition-all"
      >
        <FilterIcon className="w-4 h-4 text-gray-600" />
        <span className="text-secondary dark:text-white font-medium">{selectedStatus}</span>
        <ChevronDown className="w-4 h-4 text-gray-400" />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-xl shadow-xl overflow-hidden animate-fade-in z-50 min-w-[180px]">
          {statuses.map((status) => (
            <button
              key={status}
              type="button"
              onClick={() => {
                onStatusChange(status);
                setIsOpen(false);
              }}
              className={`w-full px-5 py-3.5 text-left text-sm transition-all border-b border-gray-100 dark:border-dark-border last:border-b-0 ${
                selectedStatus === status
                  ? 'bg-[#FFF7E2] text-primary font-medium'
                  : 'text-[#5B6178] dark:text-gray-300 hover:bg-[#FFF7E2]'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// Main UserLoginHistory Component
const UserLoginHistory = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date(2023, 6, 14)); // July 14, 2023
  const [selectedStatus, setSelectedStatus] = useState('All status');
  const [currentPage, setCurrentPage] = useState(5);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [loginData, setLoginData] = useState(SAMPLE_LOGIN_DATA);

  // Filter data based on search and status
  const filteredData = loginData.filter((item) => {
    const matchesSearch = 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.ip.includes(searchQuery);
    
    const matchesStatus = 
      selectedStatus === 'All status' || 
      selectedStatus === 'All Status' || 
      item.status === selectedStatus;

    return matchesSearch && matchesStatus;
  });

  const totalItems = 1120; // Total items as shown in Figma
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = Math.min(startIndex + rowsPerPage, filteredData.length);
  const displayedData = filteredData.slice(0, rowsPerPage);

  const handleDelete = (id) => {
    setLoginData(prev => prev.filter(item => item.id !== id));
  };

  return (
    <div className="p-6 lg:p-8 animate-fade-in">
      {/* Today's Overview Section */}
      <div className="mb-8">
        <h2 className="text-base font-semibold text-secondary dark:text-white mb-4">Today&apos;s Overview</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Total Logins Card */}
          <div className="bg-white dark:bg-dark-card rounded-xl border border-gray-200 dark:border-dark-border p-5 flex items-start justify-between">
            <div>
              <p className="text-3xl font-bold text-secondary dark:text-white mb-1">1120</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Total Logins</p>
              <p className="text-sm">
                <span className="text-green-500 font-medium">+12 %</span>
                <span className="text-gray-500 dark:text-gray-400"> Form Last Month</span>
              </p>
            </div>
            <div className="w-14 h-14 bg-[#FFF7E2] rounded-xl flex items-center justify-center">
              <ClipboardIcon className="w-7 h-7" />
            </div>
          </div>

          {/* Active Sessions Card */}
          <div className="bg-white dark:bg-dark-card rounded-xl border border-gray-200 dark:border-dark-border p-5 flex items-start justify-between">
            <div>
              <p className="text-3xl font-bold text-secondary dark:text-white mb-1">142</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Active Sessions</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">AVG. Review Time : 3 Day</p>
            </div>
            <div className="w-14 h-14 bg-[#FFF7E2] rounded-xl flex items-center justify-center">
              <PeopleIcon className="w-7 h-7" />
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters Row */}
      <div className="flex flex-col lg:flex-row gap-4 mb-6">
        {/* Search Input */}
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search here..."
            className="w-full pl-12 pr-4 py-3 bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-xl text-sm text-secondary dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
          />
        </div>

        {/* Filters */}
        <div className="flex gap-3">
          <DateFilterDropdown selectedDate={selectedDate} onDateChange={setSelectedDate} />
          <StatusFilterDropdown selectedStatus={selectedStatus} onStatusChange={setSelectedStatus} />
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white dark:bg-dark-card rounded-xl border border-gray-200 dark:border-dark-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 dark:border-dark-border">
                <th className="px-6 py-4 text-left text-xs font-semibold text-secondary dark:text-gray-300 uppercase tracking-wider">User Name</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-secondary dark:text-gray-300 uppercase tracking-wider">IP Address</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-secondary dark:text-gray-300 uppercase tracking-wider">Date & Time</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-secondary dark:text-gray-300 uppercase tracking-wider">Device / Browser</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-secondary dark:text-gray-300 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-secondary dark:text-gray-300 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {displayedData.map((item, index) => (
                <tr 
                  key={item.id}
                  className={`border-b border-gray-50 dark:border-dark-border last:border-b-0 transition-colors hover:bg-gray-50 dark:hover:bg-dark-border/50 ${
                    item.isHighlighted ? 'bg-[#FFF7E2]/30' : ''
                  }`}
                >
                  {/* User Name */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-full ${item.color} flex items-center justify-center text-white text-xs font-medium`}>
                        {item.initials}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-secondary dark:text-white">{item.name}</p>
                        <p className={`text-xs ${item.isHighlighted ? 'text-red-500' : 'text-gray-500 dark:text-gray-400'}`}>
                          {item.email}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* IP Address */}
                  <td className="px-6 py-4">
                    <span className={`text-sm ${item.isHighlighted ? 'text-red-500 font-medium' : 'text-gray-600 dark:text-gray-400'}`}>
                      {item.ip}
                    </span>
                  </td>

                  {/* Date & Time */}
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-sm text-secondary dark:text-white">{item.date}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{item.time}</p>
                    </div>
                  </td>

                  {/* Device / Browser */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {item.deviceType === 'desktop' ? (
                        <Monitor className="w-4 h-4 text-gray-400" />
                      ) : (
                        <Smartphone className="w-4 h-4 text-gray-400" />
                      )}
                      <span className="text-sm text-gray-600 dark:text-gray-400">{item.device}</span>
                    </div>
                  </td>

                  {/* Status */}
                  <td className="px-6 py-4">
                    <StatusBadge status={item.status} />
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleDelete(item.id)}
                        className="p-2 text-red-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-all"
                        aria-label="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-dark-border rounded-lg transition-all"
                        aria-label="More options"
                      >
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-gray-100 dark:border-dark-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <span>Rows per page:</span>
            <select
              value={rowsPerPage}
              onChange={(e) => setRowsPerPage(Number(e.target.value))}
              className="bg-transparent border-none text-secondary dark:text-white font-medium cursor-pointer focus:outline-none"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Showing {displayedData.length} of {totalItems}
            </span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-dark-border rounded-lg transition-all"
                aria-label="Previous page"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="px-3 py-1 bg-gray-100 dark:bg-dark-border rounded-lg text-sm font-medium text-secondary dark:text-white">
                {currentPage}
              </span>
              <button
                type="button"
                onClick={() => setCurrentPage(currentPage + 1)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-dark-border rounded-lg transition-all"
                aria-label="Next page"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserLoginHistory;
