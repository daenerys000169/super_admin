import React, { useEffect, useState } from 'react';
import API from '../utils/axiosInstance';
import { Search, User, Phone, Mail } from 'lucide-react';

const ChatManagement = () => {
  const [chats, setChats] = useState([]);
  const [filteredChats, setFilteredChats] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchChats = async () => {
      setLoading(true);
      try {
        const res = await API.get('/chat/sessions'); // Adjust API path accordingly
        setChats(res.data);
        setFilteredChats(res.data);
      } catch (error) {
        console.error('Failed to fetch chat sessions:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchChats();
  }, []);

  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredChats(chats);
      return;
    }
    const lower = searchTerm.toLowerCase();
    const filtered = chats.filter(chat =>
      (chat.name || '').toLowerCase().includes(lower) ||
      (chat.email || '').toLowerCase().includes(lower) ||
      (chat.contactNo || '').toLowerCase().includes(lower) ||
      (chat.organisation || '').toLowerCase().includes(lower)
    );
    setFilteredChats(filtered);
  }, [searchTerm, chats]);

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 max-w-5xl mx-auto font-sans">
            <div className="relative max-w-md mb-6 mx-auto md:mx-0">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Search by name, email, phone, or organisation"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
        />
      </div>

      {loading ? (
        <div className="text-center py-10 text-gray-500">Loading chat sessions...</div>
      ) : filteredChats.length === 0 ? (
        <div className="text-center py-10 text-gray-500">No chat sessions found.</div>
      ) : (
        <div className="overflow-x-auto max-h-[600px] rounded-lg">
          <table className="min-w-full table-auto border-separate border-spacing-y-3 border-spacing-x-0 w-full text-left">
            <thead className="bg-primary/10 sticky top-0 z-20 rounded-t-xl">
              <tr>
                <th className="px-6 py-4 text-secondary font-semibold rounded-tl-xl min-w-[180px]">User</th>
                <th className="px-6 py-4 text-secondary font-semibold min-w-[220px]">Organisation</th>
                <th className="px-6 py-4 text-secondary font-semibold min-w-[250px]">Support Requested</th>
                <th className="px-6 py-4 text-secondary font-semibold rounded-tr-xl w-48">Created At</th>
              </tr>
            </thead>
            <tbody>
              {filteredChats.map(chat => (
                <tr
                  key={chat.id}
                  className="bg-yellow-50 hover:bg-yellow-100 rounded-lg transition-colors cursor-default"
                >
                  <td className="px-6 py-5 text-secondary font-medium whitespace-nowrap flex items-center gap-2">
                    <User className="w-5 h-5 text-primary" />
                    {chat.name}
                  </td>
                  <td className="px-6 py-5 text-gray-700 text-sm whitespace-nowrap flex items-center gap-2">
                    <Phone className="w-4 h-4 text-primary" />
                    {chat.contactNo || '-'}
                  </td>
                  <td className="px-6 py-5 text-gray-700 text-sm whitespace-nowrap flex items-center gap-2">
                    <Mail className="w-4 h-4 text-primary" />
                    {chat.email || '-'}
                  </td>
                  <td className="px-6 py-5 text-gray-700 text-sm max-w-[220px] truncate">
                    {chat.organisation || '-'}
                  </td>
                  <td
                    className="px-6 py-5 text-gray-700 text-sm max-w-[250px] truncate"
                    title={chat.otherSupport || ''}
                  >
                    {chat.otherSupport || '-'}
                  </td>
                  <td className="px-6 py-5 text-gray-600 text-sm whitespace-nowrap">
                    {new Date(chat.createdAt).toLocaleString('en-IN', {
                      dateStyle: 'medium',
                      timeStyle: 'short'
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ChatManagement;
