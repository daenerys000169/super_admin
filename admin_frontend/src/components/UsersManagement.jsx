import React, { useEffect, useState } from 'react';
import API from '../utils/axiosInstance'; // Your axios setup for API calls
import { Edit, Trash2, Search } from 'lucide-react';

const UsersManagement = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);

  // Fetch users from API
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const res = await API.get('auth/users');
        setUsers(res.data);
        setFilteredUsers(res.data);
      } catch (error) {
        console.error('Failed to fetch users', error);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  // Filter users on search term change
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredUsers(users);
      return;
    }
    const lowerSearch = searchTerm.toLowerCase();
    const filtered = users.filter(user =>
      (user.firstName + ' ' + user.lastName).toLowerCase().includes(lowerSearch) ||
      (user.email || '').toLowerCase().includes(lowerSearch) ||
      (user.role || '').toLowerCase().includes(lowerSearch)
    );
    setFilteredUsers(filtered);
  }, [searchTerm, users]);

  // Placeholder for edit user (you can expand)
  const handleEdit = (user) => {
    alert(`Edit user: ${user.firstName} ${user.lastName}`);
  };

  // Placeholder for delete user (confirm and then API call)
  const handleDelete = (user) => {
    if (window.confirm(`Are you sure you want to delete ${user.firstName} ${user.lastName}?`)) {
      // Implement delete API call here
      alert(`Delete user: ${user.id}`);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      {/* <h2 className="text-2xl font-semibold text-secondary font-spartan mb-6">User Management</h2> */}
      <div className="relative mb-4 w-full max-w-sm">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Search users by name, email or role..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent w-full"
        />
      </div>

      {loading ? (
        <div className="text-center py-10 text-gray-500">Loading users...</div>
      ) : filteredUsers.length === 0 ? (
        <div className="text-center py-10 text-gray-500">No users found.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left table-auto border-collapse">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-sm font-medium text-gray-700">Name</th>
                <th className="px-4 py-3 text-sm font-medium text-gray-700">Email</th>
                <th className="px-4 py-3 text-sm font-medium text-gray-700">Role</th>
                <th className="px-4 py-3 text-sm font-medium text-gray-700">Created At</th>
                <th className="px-4 py-3 text-sm font-medium text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map(user => (
                <tr key={user.id} className="border-b border-gray-100 hover:bg-yellow-50 transition-colors">
                  <td className="px-4 py-3 text-secondary font-medium">
                    {user.firstName} {user.lastName}
                  </td>
                  <td className="px-4 py-3 text-gray-700 text-sm">{user.email}</td>
                  <td className="px-4 py-3 text-gray-700 text-sm capitalize">{user.role}</td>
                  <td className="px-4 py-3 text-gray-600 text-sm">
                    {new Date(user.createdAt).toLocaleDateString('en-IN')}
                  </td>
                  <td className="px-4 py-3 text-gray-600 space-x-3">
                    <button
                      onClick={() => handleEdit(user)}
                      className="p-2 rounded-md bg-primary bg-opacity-20 text-primary hover:bg-primary hover:text-white transition-colors"
                      title="Edit User"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(user)}
                      className="p-2 rounded-md bg-red-100 text-red-600 hover:bg-red-600 hover:text-white transition-colors"
                      title="Delete User"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
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

export default UsersManagement;
