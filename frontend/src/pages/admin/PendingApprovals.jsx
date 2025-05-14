// frontend/src/pages/admin/PendingApprovals.jsx
import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';

const PendingApprovals = () => {
  const [pendingLenders, setPendingLenders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();
  
  
    // Get API URL from environment variable
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';


  useEffect(() => {
    const fetchPendingLenders = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/users/pending`, {
          headers: { 'x-auth-token': token }
        });
        setPendingLenders(res.data);
        setLoading(false);
      } catch (err) {
        setError('Error fetching pending approvals');
        setLoading(false);
      }
    };
    
    fetchPendingLenders();
  }, [token]);
  
  const handleApprove = async (userId) => {
    try {
      await axios.put(`${API_URL}api/users/approve/${userId}`, {}, {
        headers: { 'x-auth-token': token }
      });
      
      setPendingLenders(pendingLenders.filter(lender => lender._id !== userId));
    } catch (err) {
      setError('Error approving lender');
    }
  };
  
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
          <h1 className="text-3xl font-bold text-gray-900">Pending Approvals</h1>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Lenders Awaiting Approval</h3>
            
            {loading ? (
              <div>Loading pending approvals...</div>
            ) : pendingLenders.length === 0 ? (
              <div className="text-gray-500 text-center py-4">No pending approvals</div>
            ) : (
              <ul className="divide-y divide-gray-200">
                {pendingLenders.map((lender) => (
                  <li key={lender._id} className="py-4">
                    <div className="flex justify-between">
                      <div>
                        <h4 className="text-lg font-medium">{lender.name}</h4>
                        <p className="text-gray-600">{lender.email}</p>
                        <p className="text-gray-600">ID: {lender.idNumber}</p>
                        <p className="text-sm text-gray-500">Registered on {new Date(lender.createdAt).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <button
                          onClick={() => handleApprove(lender._id)}
                          className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded"
                        >
                          Approve
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default PendingApprovals;