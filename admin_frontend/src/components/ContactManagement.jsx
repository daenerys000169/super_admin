import React, { useEffect, useState } from 'react';
import API from '../utils/axiosInstance'; // Your axios setup
import { Search, Mail, User } from 'lucide-react';

const ContactManagement = () => {
  const [contacts, setContacts] = useState([]);
  const [filteredContacts, setFilteredContacts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);

  // Fetch all contact form submissions
  useEffect(() => {
    const fetchContacts = async () => {
      setLoading(true);
      try {
        const res = await API.get('/contact/contactForms'); // Adjust API endpoint as needed
        setContacts(res.data);
        setFilteredContacts(res.data);
      } catch (error) {
        console.error('Failed to fetch contact forms:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchContacts();
  }, []);

  // Filter on search input (by name or email)
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredContacts(contacts);
      return;
    }
    const lowerSearch = searchTerm.toLowerCase();
    const filtered = contacts.filter(
      c =>
        (c.name || '').toLowerCase().includes(lowerSearch) ||
        (c.email || '').toLowerCase().includes(lowerSearch) ||
        (c.message || '').toLowerCase().includes(lowerSearch)
    );
    setFilteredContacts(filtered);
  }, [searchTerm, contacts]);

  return (
    <div className="bg-white rounded-xl  shadow-lg p-6">
      

      <div className="relative mb-4 max-w-sm">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Search by name, email, or message"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent w-full"
        />
      </div>

      {loading ? (
        <div className="text-center py-10 text-gray-500">Loading contacts...</div>
      ) : filteredContacts.length === 0 ? (
        <div className="text-center py-10 text-gray-500">No contact submissions found.</div>
      ) : (
        <div className="overflow-x-auto max-h-[500px]">
         <table className="table-auto w-full border-separate border-spacing-y-2 font-sans">
  <thead>
    <tr className="bg-yellow-50 text-secondary">
      <th className="px-6 py-4 rounded-tl-xl text-left font-semibold">User</th>
      <th className="px-6 py-4 text-left font-semibold">Message</th>
      <th className="px-6 py-4 rounded-tr-xl text-left font-semibold">Submitted At</th>
    </tr>
  </thead>
  <tbody>
    {filteredContacts.map(contact => (
      <tr
        key={contact.id}
        className="bg-white hover:bg-yellow-100 shadow rounded-xl transition mb-2"
      >
        <td className="px-6 py-5 whitespace-nowrap flex flex-col justify-center gap-1">
          <span className="flex items-center gap-2 text-secondary font-medium">
            <User className="w-4 h-4 text-primary" /> {contact.name}
          </span>
          <span className="flex items-center gap-2 text-gray-600 text-sm">
            <Mail className="w-4 h-4 text-yellow-500" /> {contact.email}
          </span>
        </td>
        <td className="px-6 py-5 text-gray-700 max-w-xs truncate cursor-pointer" title={contact.message}>
          {contact.message.length > 60 ? contact.message.slice(0, 60) + '…' : contact.message}
        </td>
        <td className="px-6 py-5 text-gray-600 text-sm whitespace-nowrap">
          {new Date(contact.createdAt).toLocaleString('en-IN')}
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

export default ContactManagement;
