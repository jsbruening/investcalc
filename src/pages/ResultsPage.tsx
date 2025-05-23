import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Results from '../components/Results';

const ResultsPage: React.FC = () => {
 const navigate = useNavigate();
 const { data } = useParams();

 // Decode and extract data from URL
 let decodedData;
 try {
  decodedData = data ? JSON.parse(atob(data)) : null;
 } catch (e) {
  decodedData = null;
 }

 // Redirect to calculator if accessed directly without valid data
 useEffect(() => {
  if (!decodedData) {
   navigate('/calculator');
   return;
  }
 }, [decodedData, navigate]);

 const handleBack = () => {
  navigate('/calculator');
 };

 if (!decodedData) {
  return null; // Will redirect in useEffect
 }

 return (
  <div className="max-w-7xl mx-auto mt-12 p-8 bg-white rounded-xl shadow-lg">
   <div className="flex justify-between items-center mb-6">
    <h2 className="text-2xl font-bold">Investment Results</h2>
    <button
     type="button"
     className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 font-semibold"
     onClick={handleBack}
    >
     Back to Calculator
    </button>
   </div>
   <Results
    age={decodedData.a}
    gender={decodedData.g}
    tobaccoUse={decodedData.t}
    shortTermInvestment={decodedData.s}
    intermediateInvestment={decodedData.i}
    longTermInvestment={decodedData.l}
    neverInvestment={decodedData.n}
   />
  </div>
 );
};

export default ResultsPage; 