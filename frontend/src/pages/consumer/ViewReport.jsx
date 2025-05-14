// frontend/src/pages/consumer/ViewReport.jsx

import React, { useState, useEffect, useContext, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';

const ViewReport = () => {
 const [creditData, setCreditData] = useState({
   score: null,
   loans: []
 });
 const [loading, setLoading] = useState(true);
 const [error, setError] = useState('');
 const reportRef = useRef(null);
 
 const { user, token } = useContext(AuthContext);
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
       
       setCreditData({
         score: scoreRes.data,
         loans: loansRes.data
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
 
 const handleDownloadReport = () => {
   const reportContent = reportRef.current.innerHTML;
   
   // Create a Blob with the HTML content
   const blob = new Blob([`
     <html>
       <head>
         <title>Credit Report - ${user.name}</title>
         <style>
           body { font-family: Arial, sans-serif; margin: 20px; }
           h1, h2, h3 { color: #333; }
           table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
           th, td { padding: 8px; text-align: left; border-bottom: 1px solid #ddd; }
           th { background-color: #f2f2f2; }
           .score { font-size: 36px; font-weight: bold; }
           .good { color: green; }
           .fair { color: orange; }
           .poor { color: red; }
           .header { margin-bottom: 20px; }
         </style>
       </head>
       <body>
         ${reportContent}
       </body>
     </html>
   `], { type: 'text/html' });
   
   // Create a URL for the Blob
   const url = URL.createObjectURL(blob);
   
   // Create a link to download the file
   const a = document.createElement('a');
   a.href = url;
   a.download = `credit_report_${user.name.replace(/\s+/g, '_')}_${new Date().toISOString().slice(0, 10)}.html`;
   
   // Click the link to trigger the download
   a.click();
   
   // Release the URL object
   URL.revokeObjectURL(url);
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
               onClick={() => navigate('/consumer/dashboard')}
               className="px-3 py-2 rounded text-sm text-indigo-600 hover:text-indigo-900"
             >
               Dashboard
             </button>
           </div>
         </div>
       </div>
     </nav>
     
     <header className="bg-white shadow">
       <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
         <h1 className="text-3xl font-bold text-gray-900">My Credit Report</h1>
         <button
           onClick={handleDownloadReport}
           className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded inline-flex items-center"
           disabled={loading}
         >
           <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
           </svg>
           Download Report
         </button>
       </div>
     </header>
     
     <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
       {loading ? (
         <div>Loading your credit report...</div>
       ) : error ? (
         <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
           {error}
         </div>
       ) : (
         <div className="bg-white shadow overflow-hidden sm:rounded-lg">
           <div className="px-4 py-5 sm:px-6" ref={reportRef}>
             <div className="mb-8 flex justify-between items-center">
               <div>
                 <h2 className="text-2xl font-bold text-gray-900">Credit Report</h2>
                 <p className="mt-1 text-sm text-gray-500">
                   Generated on {new Date().toLocaleDateString()} for {user.name}
                 </p>
               </div>
               <div>
                 <p className="text-sm text-gray-500">ID Number</p>
                 <p className="text-lg font-medium">{user.idNumber}</p>
               </div>
             </div>
             
             <div className="mb-8">
               <h3 className="text-lg font-medium text-gray-900 mb-4">Credit Score Summary</h3>
               <div className="bg-gray-50 p-6 rounded-lg">
                 <div className="flex flex-col sm:flex-row items-center justify-between">
                   <div className="flex flex-col items-center mb-4 sm:mb-0">
                     {creditData.score ? (
                       <>
                         <div className={`text-6xl font-bold ${getScoreColor(creditData.score.score)}`}>
                           {creditData.score.score}
                         </div>
                         <div className={`text-xl font-medium ${getScoreColor(creditData.score.score)}`}>
                           {creditData.score.rating}
                         </div>
                       </>
                     ) : (
                       <div className="text-xl text-gray-500">No credit history</div>
                     )}
                   </div>
                   
                   {creditData.score && (
                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                       <div className="text-center sm:text-left">
                         <h4 className="text-sm font-medium text-gray-500">Factors affecting your score</h4>
                         {creditData.score.factors ? (
                           <ul className="mt-2 text-sm text-gray-700">
                             {creditData.score.factors.latePayments > 0 && (
                               <li className="text-red-600">
                                 • {creditData.score.factors.latePayments} late payment(s)
                               </li>
                             )}
                             {creditData.score.factors.defaults > 0 && (
                               <li className="text-red-600">
                                 • {creditData.score.factors.defaults} defaulted loan(s)
                               </li>
                             )}
                             {creditData.score.factors.outstandingDebt > 0 && (
                               <li>
                                 • Outstanding debt: M{creditData.score.factors.outstandingDebt.toLocaleString()}
                               </li>
                             )}
                             {(creditData.score.factors.latePayments === 0 && 
                               creditData.score.factors.defaults === 0) && (
                               <li className="text-green-600">
                                 • Good payment history
                               </li>
                             )}
                           </ul>
                         ) : (
                           <p className="mt-2 text-sm text-gray-700">No detailed credit factors available</p>
                         )}
                       </div>
                       
                       <div className="text-center sm:text-left">
                         <h4 className="text-sm font-medium text-gray-500">Score Range</h4>
                         <div className="mt-2 w-full bg-gray-200 rounded-full h-2.5">
                           <div className="bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 h-2.5 rounded-full" />
                         </div>
                         <div className="flex justify-between text-xs mt-1">
                           <span>Poor (300)</span>
                           <span>Fair (580)</span>
                           <span>Good (670)</span>
                           <span>Excellent (850)</span>
                         </div>
                       </div>
                     </div>
                   )}
                 </div>
               </div>
             </div>
             
             <div className="mb-8">
               <h3 className="text-lg font-medium text-gray-900 mb-4">Loan History</h3>
               {creditData.loans.length === 0 ? (
                 <p className="text-gray-500 text-center py-4">No loan records found</p>
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
                       {creditData.loans.map((loan) => (
                         <tr key={loan._id}>
                           <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                             {loan.loanType}
                           </td>
                           <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                             M{loan.amount.toLocaleString()}
                           </td>
                           <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                             {new Date(loan.dueDate).toLocaleDateString()}
                           </td>
                           <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                             {loan.lender && loan.lender.name ? loan.lender.name : 'Unknown'}
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
             
             <div className="mb-8">
               <h3 className="text-lg font-medium text-gray-900 mb-4">Payment History</h3>
               {creditData.loans.length === 0 ? (
                 <p className="text-gray-500 text-center py-4">No payment history available</p>
               ) : (
                 <div className="space-y-6">
                   {creditData.loans.map((loan) => (
                     <div key={loan._id} className="bg-gray-50 p-4 rounded-lg">
                       <h4 className="font-medium text-gray-800 mb-2">
                         {loan.loanType} Loan - M{loan.amount.toLocaleString()} (Due: {new Date(loan.dueDate).toLocaleDateString()})
                       </h4>
                       <div className="overflow-x-auto">
                         <table className="min-w-full divide-y divide-gray-200">
                           <thead className="bg-white">
                             <tr>
                               <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                 Date
                               </th>
                               <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                 Status
                               </th>
                               <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                 Amount Paid
                               </th>
                             </tr>
                           </thead>
                           <tbody className="bg-white divide-y divide-gray-200">
                             {loan.paymentHistory && loan.paymentHistory.length > 0 ? (
                               loan.paymentHistory.map((payment, index) => (
                                 <tr key={index}>
                                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                     {new Date(payment.date).toLocaleDateString()}
                                   </td>
                                   <td className="px-6 py-4 whitespace-nowrap">
                                     <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                       ${payment.status === 'Paid' ? 'bg-green-100 text-green-800' : 
                                         payment.status === 'Outstanding' ? 'bg-yellow-100 text-yellow-800' : 
                                         'bg-red-100 text-red-800'}`}
                                     >
                                       {payment.status}
                                     </span>
                                   </td>
                                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                     M{payment.amount ? payment.amount.toLocaleString() : '0'}
                                   </td>
                                 </tr>
                               ))
                             ) : (
                               <tr>
                                 <td colSpan="3" className="px-6 py-4 text-center text-sm text-gray-500">
                                   No payment history records
                                 </td>
                               </tr>
                             )}
                           </tbody>
                         </table>
                       </div>
                     </div>
                   ))}
                 </div>
               )}
             </div>
             
             <div>
               <h3 className="text-lg font-medium text-gray-900 mb-4">Credit Bureau Statement</h3>
               <p className="text-sm text-gray-500">
                 This report shows a summary of your credit status, loans, and payment history as recorded in our system.
                 Your credit score is calculated based on your payment history, outstanding debt, and other factors.
                 If you believe there are inaccuracies in this report, please contact the relevant lender or our support team.
               </p>
               <p className="text-sm text-gray-500 mt-2">
                 Report generated on {new Date().toLocaleDateString()} by Credit Bureau Management System.
               </p>
             </div>
           </div>
         </div>
       )}
     </main>
   </div>
 );
};

export default ViewReport;