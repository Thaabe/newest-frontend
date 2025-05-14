// frontend/src/pages/lender/ViewReports.jsx

import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';

const ViewReports = () => {
  const [searchEmail, setSearchEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [consumer, setConsumer] = useState(null);
  const [creditScore, setCreditScore] = useState(null);
  const [loans, setLoans] = useState([]);
  
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();
  
  
// Get API URL from environment variable
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  const handleSearch = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      // Search for consumer
      const consumerRes = await axios.get(`${API_URL}/api/users/search?email=${searchEmail}&role=consumer`, {
        headers: { 'x-auth-token': token }
      });
      
      if (!consumerRes.data) {
        setError('Consumer not found');
        setLoading(false);
        return;
      }
      
      setConsumer(consumerRes.data);
      
      // Get credit score
      const scoreRes = await axios.get(`${API_URL}/api/credit/score/${consumerRes.data._id}`, {
        headers: { 'x-auth-token': token }
      });
      
      setCreditScore(scoreRes.data);
      
      // Get credit records
      const loansRes = await axios.get(`${API_URL}/api/credit/consumer/${consumerRes.data._id}`, {
        headers: { 'x-auth-token': token }
      });
      
      setLoans(loansRes.data);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.msg || 'Error searching for consumer');
      setLoading(false);
    }
  };
  
  const getScoreColor = (score) => {
    if (score >= 740) return 'text-green-600';
    if (score >= 670) return 'text-blue-600';
    if (score >= 580) return 'text-yellow-600';
    return 'text-red-600';
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
                onClick={() => navigate('/lender/dashboard')}
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
          <h1 className="text-3xl font-bold text-gray-900">View Credit Reports</h1>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Search Consumer</h3>
            
            {error && (
              <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}
            
            <form onSubmit={handleSearch} className="mb-6">
              <div className="flex">
                <input
                  type="email"
                  placeholder="Enter consumer email"
                  className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-l-md p-2"
                  value={searchEmail}
                  onChange={(e) => setSearchEmail(e.target.value)}
                  required
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-r-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  {loading ? 'Searching...' : 'Search'}
                </button>
              </div>
            </form>
            
            {consumer && (
              <div className="border-t border-gray-200 pt-4">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Consumer Information</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="bg-gray-50 p-4 rounded">
                    <h4 className="text-md font-medium text-gray-800 mb-2">Personal Details</h4>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="text-sm text-gray-500">Name:</div>
                      <div className="text-sm">{consumer.name}</div>
                      
                      <div className="text-sm text-gray-500">ID Number:</div>
                      <div className="text-sm">{consumer.idNumber}</div>
                      
                      <div className="text-sm text-gray-500">Email:</div>
                      <div className="text-sm">{consumer.email}</div>
                    </div>
                  </div>
                  
                  {creditScore && (
                    <div className="bg-gray-50 p-4 rounded">
                      <h4 className="text-md font-medium text-gray-800 mb-2">Credit Score</h4>
                      <div className="flex items-center justify-center">
                        <div className={`text-4xl font-bold ${getScoreColor(creditScore.score)}`}>
                          {creditScore.score}
                        </div>
                        <div className="ml-4">
                          <div className={`text-lg font-medium ${getScoreColor(creditScore.score)}`}>
                            {creditScore.rating}
                          </div>
                          <div className="text-sm text-gray-500">
                            {creditScore.factors.latePayments} late payments
                          </div>
                          <div className="text-sm text-gray-500">
                            {creditScore.factors.defaults} defaults
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                
                <h3 className="text-lg font-medium text-gray-900 mb-4">Loan History</h3>
                
                {loans.length === 0 ? (
                  <div className="text-gray-500 text-center py-4">No loan records found for this consumer</div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Loan Type
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Amount
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Due Date
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Lender
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {loans.map((loan) => (
                          <tr key={loan._id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {loan.loanType}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              ${loan.amount.toLocaleString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {new Date(loan.dueDate).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {loan.lender.name}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                ${loan.paymentStatus === 'Paid' ? 'bg-green-100 text-green-800' : 
                                  loan.paymentStatus === 'Outstanding' ? 'bg-yellow-100 text-yellow-800' : 
                                  'bg-red-100 text-red-800'}`}
                              >
                                {loan.paymentStatus}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ViewReports;