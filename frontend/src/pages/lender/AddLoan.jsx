// frontend/src/pages/lender/AddLoan.jsx

import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';

const AddLoan = () => {
  const [formData, setFormData] = useState({
    consumerEmail: '',
    loanType: 'Personal',
    amount: '',
    dueDate: ''
  });
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [consumerData, setConsumerData] = useState(null);
  const [success, setSuccess] = useState(false);
  
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const { consumerEmail, loanType, amount, dueDate } = formData;
  
  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });
  
      // Get API URL from environment variable
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  const searchConsumer = async e => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const res = await axios.get(`${API_URL}/api/users/search?email=${consumerEmail}&role=consumer`, {
        headers: { 'x-auth-token': token }
      });
      
      if (res.data) {
        setConsumerData(res.data);
        setStep(2);
      } else {
        setError('Consumer not found. Please check the email address.');
      }
    } catch (err) {
      setError(err.response?.data?.msg || 'Error searching for consumer');
    } finally {
      setLoading(false);
    }
  };
  
  const submitLoan = async e => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      await axios.post(`${API_URL}/api/credit`, {
        consumerId: consumerData._id,
        loanType,
        amount: Number(amount),
        dueDate
      }, {
        headers: { 'x-auth-token': token }
      });
      
      setSuccess(true);
      setTimeout(() => {
        navigate('/lender/dashboard');
      }, 3000);
    } catch (err) {
      setError(err.response?.data?.msg || 'Error adding loan');
      setLoading(false);
    }
  };
  
  if (success) {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center px-4">
        <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
              <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="mt-3 text-lg font-medium text-gray-900">Loan added successfully!</h3>
            <p className="mt-2 text-sm text-gray-500">
              The loan information has been recorded in the system.
            </p>
            <div className="mt-4">
              <button
                onClick={() => navigate('/lender/dashboard')}
                className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Return to Dashboard
              </button>
            </div>
            <p className="mt-3 text-sm text-gray-500">Redirecting to dashboard...</p>
          </div>
        </div>
      </div>
    );
  }
  
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
          <h1 className="text-3xl font-bold text-gray-900">Add New Loan</h1>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <div className="px-4 py-5 sm:p-6">
            {error && (
              <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}
            
            {step === 1 ? (
              <>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Step 1: Find Consumer</h3>
                <form onSubmit={searchConsumer}>
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="consumerEmail">
                      Consumer Email
                    </label>
                    <input
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      id="consumerEmail"
                      type="email"
                      name="consumerEmail"
                      value={consumerEmail}
                      onChange={onChange}
                      required
                      placeholder="Enter consumer's email address"
                    />
                  </div>
                  
                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
                  >
                    {loading ? 'Searching...' : 'Search Consumer'}
                  </button>
                </form>
              </>
            ) : (
              <>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Step 2: Loan Details</h3>
                <div className="mb-6 p-4 bg-gray-50 rounded">
                  <h4 className="text-md font-medium text-gray-800">Consumer Information</h4>
                  <div className="mt-2 grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Name:</p>
                      <p className="text-sm font-medium">{consumerData.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">ID Number:</p>
                      <p className="text-sm font-medium">{consumerData.idNumber}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Email:</p>
                      <p className="text-sm font-medium">{consumerData.email}</p>
                    </div>
                  </div>
                </div>
                
                <form onSubmit={submitLoan}>
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="loanType">
                      Loan Type
                    </label>
                    <select
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      id="loanType"
                      name="loanType"
                      value={loanType}
                      onChange={onChange}
                      required
                    >
                      <option value="Personal">Personal Loan</option>
                      <option value="Home">Home Loan</option>
                      <option value="Auto">Auto Loan</option>
                      <option value="Education">Education Loan</option>
                      <option value="Credit Card">Credit Card</option>
                      <option value="Business">Business Loan</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="amount">
                      Loan Amount (M)
                    </label>
                    <input
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      id="amount"
                      type="number"
                      name="amount"
                      value={amount}
                      onChange={onChange}
                      required
                      min="1"
                      step="0.01"
                      placeholder="Enter loan amount"
                    />
                  </div>
                  
                  <div className="mb-6">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="dueDate">
                      Due Date
                    </label>
                    <input
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      id="dueDate"
                      type="date"
                      name="dueDate"
                      value={dueDate}
                      onChange={onChange}
                      required
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    >
                      {loading ? 'Adding Loan...' : 'Add Loan'}
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AddLoan;