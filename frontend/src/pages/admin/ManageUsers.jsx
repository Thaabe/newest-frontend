// frontend/src/pages/admin/ManageUsers.jsx

import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  
  const { user, token } = useContext(AuthContext);
  const navigate = useNavigate();
  
    // Get API URL from environment variable
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';


  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/users`, {
          headers: { 'x-auth-token': token }
        });
        setUsers(res.data);
        setLoading(false);
      } catch (err) {
        setError('Error fetching users');
        setLoading(false);
      }
    };
    
    fetchUsers();
  }, [token]);
  
  const handleApprove = async (userId) => {
    try {
      await axios.put(`${API_URL}/api/users/approve/${userId}`, {}, {
        headers: { 'x-auth-token': token }
      });
      
      setUsers(users.map(user => 
        user._id === userId ? { ...user, isApproved: true } : user
      ));
    } catch (err) {
      setError('Error approving user');
    }
  };
  
  const handleDelete = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await axios.delete(`${API_URL}/api/users/${userId}`, {
          headers: { 'x-auth-token': token }
        });
        
        setUsers(users.filter(user => user._id !== userId));
      } catch (err) {
        setError('Error deleting user');
      }
    }
  };
  
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    
    return matchesSearch && matchesRole;
  });
  
  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <h2 className="text-2xl font-bold text-gray-800">Credit Bureau</h2>
              </div>
            </div>
            <div className="flex items-center">
              <button
                onClick={() => navigate('/admin/dashboard')}
                className="px-3 py-2 rounded text-sm text-indigo-600 hover:text-indigo-900"
              >
                Dashboard
              </button>
            </div>
          </div>
        </div>
      </nav>
      
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">Manage Users</h1>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        <div className="mb-6 flex flex-col sm:flex-row gap-4 justify-between">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search by name or email"
              className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md p-2"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex-none">
            <select
              className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md p-2"
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
            >
              <option value="all">All Roles</option>
              <option value="consumer">Consumers</option>
              <option value="lender">Lenders</option>
              <option value="admin">Admins</option>
            </select>
          </div>
        </div>
        
        {loading ? (
          <div>Loading users...</div>
        ) : (
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200">
              {filteredUsers.length === 0 ? (
                <li className="px-6 py-4 text-center text-gray-500">No users found</li>
              ) : (
                filteredUsers.map((u) => (
                  <li key={u._id} className="px-6 py-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center">
                          <div className="flex-shrink-0">
                            <div className={`h-10 w-10 rounded-full flex items-center justify-center text-white
                              ${u.role === 'admin' ? 'bg-purple-500' : u.role === 'lender' ? 'bg-blue-500' : 'bg-green-500'}`}>
                              {u.name.charAt(0).toUpperCase()}
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {u.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {u.email}
                            </div>
                            <div className="text-sm text-gray-500">
                              Role: <span className="capitalize">{u.role}</span>
                              {u.role === 'lender' && (
                                <span className={`ml-2 ${u.isApproved ? 'text-green-500' : 'text-yellow-500'}`}>
                                  ({u.isApproved ? 'Approved' : 'Pending Approval'})
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        {u.role === 'lender' && !u.isApproved && (
                          <button
                            onClick={() => handleApprove(u._id)}
                            className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                          >
                            Approve
                          </button>
                        )}
                        
                        {u._id !== user.id && (
                          <button
                            onClick={() => handleDelete(u._id)}
                            className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                          >
                            Delete
                          </button>
                        )}
                      </div>
                    </div>
                  </li>
                ))
              )}
            </ul>
          </div>
        )}
      </main>
    </div>
  );
};

export default ManageUsers;