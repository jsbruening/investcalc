import React from 'react';
import { useNavigate } from 'react-router-dom';
import InvestmentForm from '../components/InvestmentForm';

const CalculatorPage: React.FC = () => {
 const navigate = useNavigate();

 const handleSubmit = (data: any) => {
  // Create a compact data object
  const compactData = {
   a: data.age,                    // age
   g: data.gender,                 // gender
   t: data.tobaccoUse,             // tobaccoUse
   s: data.shortTermInvestment,    // shortTerm
   i: data.intermediateInvestment, // intermediate
   l: data.longTermInvestment,     // longTerm
   n: data.neverInvestment         // never
  };

  // Convert to base64 for a clean URL
  const encodedData = btoa(JSON.stringify(compactData));
  navigate(`/results/${encodedData}`);
 };

 return (
  <div className="max-w-2xl mx-auto mt-12 p-8 bg-white rounded-xl shadow-lg">
   <h2 className="text-2xl font-bold mb-6 text-center">Investment Calculator</h2>
   <InvestmentForm onSubmit={handleSubmit} />
  </div>
 );
};

export default CalculatorPage; 