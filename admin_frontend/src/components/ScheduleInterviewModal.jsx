import { useState } from "react";
import { X, Calendar, Link as LinkIcon } from "lucide-react";

const ScheduleInterviewModal = ({ application, onClose, onConfirm }) => {
  const [interviewTitle, setInterviewTitle] = useState('Technical Round 1');
  const [meetingUrl, setMeetingUrl] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [duration, setDuration] = useState('30');
  const [prospectName, setProspectName] = useState(application?.fullName || 'Dwarkesh Sidapara');
  const [prospectEmail, setProspectEmail] = useState(application?.email || 'loansphere.ai@gmail.com');

  const {
    companyName = 'Fins here A1 OPC Private Limited',
    sector = 'FinTech Finance'
  } = application || {};

  // Format date from yyyy-mm-dd to dd-mm-yyyy
  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const [year, month, day] = dateStr.split('-');
    return `${day}-${month}-${year}`;
  };

  // Convert 24-hour time string HH:mm to 12-hour format with AM/PM
  const formatTime = (time24) => {
    if (!time24) return '';
    let [hour, minute] = time24.split(':');
    hour = parseInt(hour, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    hour = hour % 12 || 12;
    return `${hour}:${minute} ${ampm}`;
  };

  const handleSubmit = () => {
    if (date && time) {
      onConfirm(formatDate(date), formatTime(time), {
        interviewTitle,
        meetingUrl,
        duration,
        prospectName,
        prospectEmail
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-white dark:bg-dark-card rounded-2xl w-full max-w-lg animate-scale-in shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-dark-border">
          <h2 className="text-xl font-bold text-secondary dark:text-white">Schedule new interview</h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-dark-border rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Interview Details Label */}
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">Interview Details</p>

          {/* Company Info Card */}
          <div className="bg-gray-50 dark:bg-dark-border rounded-xl p-4 mb-6">
            <h3 className="font-semibold text-secondary dark:text-white mb-2">{companyName}</h3>
            <span className="inline-block px-3 py-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-full">
              {sector}
            </span>
          </div>

          {/* Form Grid */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            {/* Interview Title */}
            <div>
              <label className="block text-sm text-gray-500 dark:text-gray-400 mb-2">Interview Title</label>
              <input
                type="text"
                value={interviewTitle}
                onChange={(e) => setInterviewTitle(e.target.value)}
                placeholder="Technical Round 1"
                className="w-full px-4 py-3 bg-gray-50 dark:bg-dark-border border border-gray-200 dark:border-dark-border rounded-xl text-sm text-secondary dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
              />
            </div>

            {/* Meeting URL */}
            <div>
              <label className="block text-sm text-gray-500 dark:text-gray-400 mb-2">Meeting URL</label>
              <div className="relative">
                <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="url"
                  value={meetingUrl}
                  onChange={(e) => setMeetingUrl(e.target.value)}
                  placeholder="https://meet.google.com/..."
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-dark-border border border-gray-200 dark:border-dark-border rounded-xl text-sm text-secondary dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
                />
              </div>
            </div>

            {/* Interview Date & Time */}
            <div>
              <label className="block text-sm text-gray-500 dark:text-gray-400 mb-2">Interview date & time</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="datetime-local"
                  value={date && time ? `${date}T${time}` : ''}
                  onChange={(e) => {
                    const [newDate, newTime] = e.target.value.split('T');
                    setDate(newDate);
                    setTime(newTime);
                  }}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-dark-border border border-gray-200 dark:border-dark-border rounded-xl text-sm text-secondary dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
                />
              </div>
            </div>

            {/* Duration */}
            <div>
              <label className="block text-sm text-gray-500 dark:text-gray-400 mb-2">Duration</label>
              <select
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-dark-border border border-gray-200 dark:border-dark-border rounded-xl text-sm text-secondary dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 appearance-none cursor-pointer"
              >
                <option value="15">15 min</option>
                <option value="30">30 min</option>
                <option value="45">45 min</option>
                <option value="60">60 min</option>
                <option value="90">90 min</option>
              </select>
            </div>
          </div>

          {/* Prospect Details Section */}
          <div className="mb-6">
            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">PROSPECT DETAILS</p>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-500 dark:text-gray-400 mb-2">Name</label>
                <input
                  type="text"
                  value={prospectName}
                  onChange={(e) => setProspectName(e.target.value)}
                  placeholder="Dwarkesh Sidapara"
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-dark-border border border-gray-200 dark:border-dark-border rounded-xl text-sm text-secondary dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-500 dark:text-gray-400 mb-2">Email</label>
                <input
                  type="email"
                  value={prospectEmail}
                  onChange={(e) => setProspectEmail(e.target.value)}
                  placeholder="loansphere.ai@gmail.com"
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-dark-border border border-gray-200 dark:border-dark-border rounded-xl text-sm text-secondary dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-4 px-6 py-4 bg-gray-50 dark:bg-dark-border rounded-b-2xl">
          <button 
            onClick={onClose}
            className="px-6 py-2.5 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:text-secondary dark:hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!date || !time}
            className="flex items-center gap-2 px-6 py-2.5 bg-primary text-secondary text-sm font-semibold rounded-xl hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 active:scale-[0.98]"
          >
            <Calendar className="w-4 h-4" />
            Schedule Interview
          </button>
        </div>
      </div>
    </div>
  );
};

export default ScheduleInterviewModal;
