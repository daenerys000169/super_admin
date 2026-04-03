import { useState } from "react";

const ScheduleInterviewModal = ({ application, onClose, onConfirm }) => {
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');

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
    hour = hour % 12 || 12; // Convert 0 to 12 for 12 AM
    return `${hour}:${minute} ${ampm}`;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl p-6 max-w-md w-full">
        <h3 className="text-xl font-semibold mb-4">Schedule Interview for {application.fullName}</h3>

        <label className="block mb-2">
          Date:
          <input
            type="date"
            value={date}
            onChange={e => setDate(e.target.value)}
            className="border p-2 rounded w-full"
          />
        </label>

        {date && <p className="mb-4 text-gray-700">Selected Date: {formatDate(date)}</p>}

        <label className="block mb-4">
          Time:
          <input
            type="time"
            value={time}
            onChange={e => setTime(e.target.value)}
            className="border p-2 rounded w-full"
          />
        </label>

        {time && <p className="mb-4 text-gray-700">Selected Time: {formatTime(time)}</p>}

        <div className="flex justify-end space-x-3">
          <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded">Cancel</button>
          <button
            onClick={() => onConfirm(formatDate(date), formatTime(time))}
            disabled={!date || !time}
            className="px-4 py-2 bg-primary text-white rounded disabled:opacity-50"
          >
            Send Invitation
          </button>
        </div>
      </div>
    </div>
  );
};

export default ScheduleInterviewModal;
