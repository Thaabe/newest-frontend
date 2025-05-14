// frontend/src/pages/consumer/Dashboard.jsx

import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';

const ConsumerDashboard = () => {
 const [creditData, setCreditData] = useState({
   score: null,
   totalLoans: 0,
   outstandingAmount: 0,
   loansByType: {},
   recentLoans: []
 });
 const [loading, setLoading] = useState(true);
 const [error, setError] = useState('');
 
 const { user, logout, token } = useContext(AuthContext);
 const navigate = useNavigate();
 
 
    // Get API URL from environment variable
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

 useEffect(() => {
   const fetchData = async () => {
     try {
       // Get credit score
       const scoreRes = await axios.get(`${API_URL}/api/credit/score/${user.id}`, {
         headers: { 'x-auth-token': token }
       });
       
       // Get credit records
       const loansRes = await axios.get(`${API_URL}/api/credit/consumer/${user.id}`, {
         headers: { 'x-auth-token': token }
       });
       
       const loans = loansRes.data;
       
       // Calculate statistics
       const loansByType = {};
       let outstandingAmount = 0;
       
       loans.forEach(loan => {
         // Count by loan type
         loansByType[loan.loanType] = (loansByType[loan.loanType] || 0) + 1;
         
         // Sum outstanding amounts
         if (loan.paymentStatus === 'Outstanding') {
           outstandingAmount += loan.amount;
         }
       });
       
       setCreditData({
         score: scoreRes.data,
         totalLoans: loans.length,
         outstandingAmount,
         loansByType,
         recentLoans: loans.slice(0, 5) // Get first 5 loans
       });
       
       setLoading(false);
     } catch (err) {
       setError('Error fetching credit data');
       setLoading(false);
     }
   };
   
   fetchData();
 }, [token, user.id]);
 
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
           <div className="flex items-center space-x-4">
             <button
               onClick={() => navigate('/consumer/view-report')}
               className="px-3 py-2 rounded text-sm text-indigo-600 hover:text-indigo-900"
             >
               View Full Report
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
         <h1 className="text-3xl font-bold text-gray-900">My Credit Dashboard</h1>
       </div>
     </header>
     
     <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      
       {loading ? (
         <div>Loading your credit information...</div>
       ) : error ? (
         <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
           {error}
         </div>
       ) : (
         <>
           <div className="bg-white overflow-hidden shadow rounded-lg mb-6">
             <div className="px-4 py-5 sm:p-6">
               <h3 className="text-lg font-medium text-gray-900 mb-4">Credit Score</h3>
               <div className="flex items-center justify-center">
                 {creditData.score ? (
                   <>
                     <div className={`text-6xl font-bold ${getScoreColor(creditData.score.score)}`}>
                       {creditData.score.score}
                     </div>
                     <div className="ml-8">
                       <div className={`text-2xl font-medium ${getScoreColor(creditData.score.score)}`}>
                         {creditData.score.rating}
                       </div>
                       <div className="mt-2 text-sm text-gray-500">
                         {creditData.score.factors ? (
                           <>
                             <p>Late Payments: {creditData.score.factors.latePayments || 0}</p>
                             <p>Defaults: {creditData.score.factors.defaults || 0}</p>
                             <p>Total Records: {creditData.score.factors.totalRecords || 0}</p>
                           </>
                         ) : (
                           <p>No detailed credit factors available</p>
                         )}
                       </div>
                     </div>
                   </>
                 ) : (
                   <div className="text-xl text-gray-500">No credit history available yet</div>
                 )}
               </div>
             </div>
           </div>
           
           <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
             <div className="bg-white overflow-hidden shadow rounded-lg">
               <div className="px-4 py-5 sm:p-6">
                 <div className="flex items-center">
                   <div className="flex-shrink-0 bg-indigo-500 rounded-md p-3">
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
                           {creditData.totalLoans}
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
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                     </svg>
                   </div>
                   <div className="ml-5 w-0 flex-1">
                     <dl>
                       <dt className="text-sm font-medium text-gray-500 truncate">
                         Outstanding Amount
                       </dt>
                       <dd>
                         <div className="text-lg font-medium text-gray-900">
                           M{creditData.outstandingAmount.toLocaleString()}
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
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                     </svg>
                   </div>
                   <div className="ml-5 w-0 flex-1">
                     <dl>
                       <dt className="text-sm font-medium text-gray-500 truncate">
                         Credit Report
                       </dt>
                       <dd>
                         <div className="text-lg font-medium text-gray-900">
                           <button
                             onClick={() => navigate('/consumer/view-report')}
                             className="text-indigo-600 hover:text-indigo-900"
                           >
                             View Details
                           </button>
                         </div>
                       </dd>
                     </dl>
                   </div>
                 </div>
               </div>
             </div>
           </div>
           
           <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2">
             <div className="bg-white overflow-hidden shadow rounded-lg">
               <div className="px-4 py-5 sm:p-6">
                 <h3 className="text-lg font-medium text-gray-900 mb-4">Loan Types</h3>
                 {Object.keys(creditData.loansByType).length === 0 ? (
                   <p className="text-gray-500 text-center">No loans recorded</p>
                 ) : (
                   <div className="space-y-2">
                     {Object.entries(creditData.loansByType).map(([type, count]) => (
                       <div key={type} className="flex items-center">
                         <div className="w-1/3 text-sm text-gray-500">{type}</div>
                         <div className="w-2/3 flex items-center">
                           <div 
                             className="bg-indigo-600 h-4 rounded-full" 
                             style={{ width: `${Math.min(count / creditData.totalLoans * 100, 100)}%` }}
                           />
                           <span className="ml-2 text-sm text-gray-700">{count}</span>
                         </div>
                       </div>
                     ))}
                   </div>
                 )}
               </div>
             </div>
             
             <div className="bg-white overflow-hidden shadow rounded-lg">
               <div className="px-4 py-5 sm:p-6">
                 <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Loans</h3>
                 {creditData.recentLoans.length === 0 ? (
                   <p className="text-gray-500 text-center">No loans recorded</p>
                 ) : (
                   <div className="flow-root">
                     <ul className="-mb-8">
                       {creditData.recentLoans.map((loan, index) => (
                         <li key={loan._id}>
                           <div className="relative pb-8">
                             {index !== creditData.recentLoans.length - 1 ? (
                               <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true" />
                             ) : null}
                             <div className="relative flex space-x-3">
                               <div>
                                 <span className={`h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white
                                   ${loan.paymentStatus === 'Paid' ? 'bg-green-500' : 
                                     loan.paymentStatus === 'Outstanding' ? 'bg-yellow-500' : 
                                     'bg-red-500'}`}
                                 >
                                   <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                     {loan.paymentStatus === 'Paid' ? (
                                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                     ) : (
                                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                     )}
                                   </svg>
                                 </span>
                               </div>
                               <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                                 <div>
                                   <p className="text-sm text-gray-500">
                                     {loan.loanType} Loan - <span className="font-medium text-gray-900">M{loan.amount.toLocaleString()}</span>
                                   </p>
                                   <p className="text-xs text-gray-500">
                                     Due: {new Date(loan.dueDate).toLocaleDateString()}
                                   </p>
                                 </div>
                                 <div className="text-right text-sm whitespace-nowrap text-gray-500">
                                   <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                     ${loan.paymentStatus === 'Paid' ? 'bg-green-100 text-green-800' : 
                                       loan.paymentStatus === 'Outstanding' ? 'bg-yellow-100 text-yellow-800' : 
                                       'bg-red-100 text-red-800'}`}
                                   >
                                     {loan.paymentStatus}
                                   </span>
                                 </div>
                               </div>
                             </div>
                           </div>
                         </li>
                       ))}
                     </ul>
                   </div>
                 )}
               </div>
             </div>
           </div>
         </>
       )}
     </main>
   </div>
 );
};

export default ConsumerDashboard;