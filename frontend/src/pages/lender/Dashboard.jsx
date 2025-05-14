// frontend/src/pages/lender/Dashboard.jsx

import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';

const LenderDashboard = () => {
  const [stats, setStats] = useState({
    totalLoans: 0,
    outstandingLoans: 0,
    paidLoans: 0,
    defaultedLoans: 0
  });
  const [recentLoans, setRecentLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const { user, logout, token } = useContext(AuthContext);
  const navigate = useNavigate();
  
// Get API URL from environment variable
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  useEffect(() => {
    const fetchData = async () => {
      try {
        const loansRes = await axios.get(`${API_URL}/api/credit/lender`, {
          headers: { 'x-auth-token': token }
        });
        
        // Calculate stats
        const loans = loansRes.data;
        const outstandingLoans = loans.filter(loan => loan.paymentStatus === 'Outstanding').length;
        const paidLoans = loans.filter(loan => loan.paymentStatus === 'Paid').length;
        const defaultedLoans = loans.filter(loan => loan.paymentStatus === 'Defaulted').length;
        
        setStats({
          totalLoans: loans.length,
          outstandingLoans,
          paidLoans,
          defaultedLoans
        });
        
        // Get recent loans (last 5)
        setRecentLoans(loans.slice(0, 5));
        
        setLoading(false);
      } catch (err) {
        setError('Error fetching data');
        setLoading(false);
      }
    };
    
    fetchData();
  }, [token]);
  
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
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/lender/add-loan')}
                className="px-3 py-2 rounded text-sm text-indigo-600 hover:text-indigo-900"
              >
                Add Loan
              </button>
              <button
                onClick={() => navigate('/lender/view-reports')}
                className="px-3 py-2 rounded text-sm text-indigo-600 hover:text-indigo-900"
              >
                View Reports
              </button>
              <span className="text-gray-700">|</span>
              <span className="text-gray-700">{user.name}</span>
              <button
                onClick={logout}
                className="px-3 py-2 rounded text-sm text-red-600 hover:text-red-900"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>
      
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900"></h1>
          <h1 className="text-3xl font-bold text-gray-900">Lender Dashboard</h1>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {loading ? (
          <div>Loading dashboard data...</div>
        ) : error ? (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-blue-500 rounded-md p-3">
                      <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          Total Loans
                        </dt>
                        <dd>
                          <div className="text-lg font-medium text-gray-900">
                            {stats.totalLoans}
                          </div>
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-yellow-500 rounded-md p-3">
                      <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          Outstanding Loans
                        </dt>
                        <dd>
                          <div className="text-lg font-medium text-gray-900">
                            {stats.outstandingLoans}
                          </div>
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-green-500 rounded-md p-3">
                      <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          Paid Loans
                        </dt>
                        <dd>
                          <div className="text-lg font-medium text-gray-900">
                            {stats.paidLoans}
                          </div>
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-red-500 rounded-md p-3">
                      <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          Defaulted Loans
                        </dt>
                        <dd>
                          <div className="text-lg font-medium text-gray-900">
                            {stats.defaultedLoans}
                          </div>
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-8">
              <div className="bg-white shadow overflow-hidden sm:rounded-md">
                <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Recent Loans
                  </h3>
                  <button
                    onClick={() => navigate('/lender/add-loan')}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Add New Loan
                  </button>
                </div>
                <ul className="divide-y divide-gray-200">
                  {recentLoans.length === 0 ? (
                    <li className="px-4 py-4 sm:px-6">
                      <p className="text-gray-500 text-center">No loans recorded yet</p>
                    </li>
                  ) : (
                    recentLoans.map((loan) => (
                      <li key={loan._id} className="px-4 py-4 sm:px-6">
                        <div className="flex items-center justify-between">
                          <div className="flex flex-col">
                            <div className="text-sm font-medium text-indigo-600">
                              {loan.consumer.name} - {loan.loanType} Loan
                            </div>
                            <div className="text-sm text-gray-500">
                              Amount: M{loan.amount.toLocaleString()}
                            </div>
                            <div className="text-sm text-gray-500">
                              Due: {new Date(loan.dueDate).toLocaleDateString()}
                            </div>
                          </div>
                          <div className="flex flex-col">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                              ${loan.paymentStatus === 'Paid' ? 'bg-green-100 text-green-800' : 
                                loan.paymentStatus === 'Outstanding' ? 'bg-yellow-100 text-yellow-800' : 
                                'bg-red-100 text-red-800'}`}
                            >
                              {loan.paymentStatus}
                            </span>
                          </div>
                        </div>
                      </li>
                    ))
                  )}
                </ul>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default LenderDashboard;