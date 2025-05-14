// frontend/src/pages/auth/PendingApproval.jsx

import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const PendingApproval = () => {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center px-4">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full">
        <div className="text-center">
          <svg className="mx-auto h-16 w-16 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          
          <h2 className="mt-4 text-2xl font-bold text-gray-900">Account Pending Approval</h2>
          
          <p className="mt-2 text-gray-600">
            Your lender account has been registered successfully, but it needs to be approved by an administrator before you can access the system.
          </p>
          
          <p className="mt-4 text-gray-600">
            Please check back later or contact the system administrator for more information.
          </p>
          
          <div className="mt-6">
            <button
              onClick={handleLogout}
              className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Back to Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PendingApproval;