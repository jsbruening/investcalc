import React from 'react';
import { MdSavings } from 'react-icons/md';
import { FaPiggyBank, FaShieldAlt } from 'react-icons/fa';
import { GiReceiveMoney } from 'react-icons/gi';

interface TotalSummaryProps {
 shortTermInvestment: number;
 intermediateInvestment: number;
 longTermInvestment: number;
 neverInvestment: number;
}

const TotalSummary: React.FC<TotalSummaryProps> = ({
 shortTermInvestment,
 intermediateInvestment,
 longTermInvestment,
 neverInvestment,
}) => {
 const totalInvestment = shortTermInvestment + intermediateInvestment + longTermInvestment + neverInvestment;

 const summaryItems = [
  {
   label: 'Short Term',
   value: shortTermInvestment,
   icon: <MdSavings className="w-6 h-6 text-green-500" />,
   color: 'bg-green-50'
  },
  {
   label: 'Intermediate Term',
   value: intermediateInvestment,
   icon: <FaPiggyBank className="w-6 h-6 text-blue-500" />,
   color: 'bg-blue-50'
  },
  {
   label: 'Long Term',
   value: longTermInvestment,
   icon: <GiReceiveMoney className="w-6 h-6 text-yellow-500" />,
   color: 'bg-yellow-50'
  },
  {
   label: 'Life Insurance',
   value: neverInvestment,
   icon: <FaShieldAlt className="w-6 h-6 text-purple-500" />,
   color: 'bg-purple-50'
  }
 ];

 return (
  <div className="bg-white rounded-lg shadow-sm">
   <div className="p-6">
    <h3 className="text-lg font-semibold text-gray-900 mb-6">Investment Summary</h3>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
     {summaryItems.map(({ label, value, icon, color }) => (
      <div key={label} className={`${color} rounded-lg p-4`}>
       <div className="flex items-center gap-3 mb-2">
        {icon}
        <span className="text-sm font-medium text-gray-900">{label}</span>
       </div>
       <div className="text-2xl font-bold text-gray-900">
        ${value.toLocaleString()}
       </div>
       <div className="text-sm text-gray-500">
        {((value / totalInvestment) * 100).toFixed(1)}% of total
       </div>
      </div>
     ))}
    </div>

    <div className="mt-6 pt-6 border-t border-gray-200">
     <div className="flex justify-between items-center">
      <span className="text-lg font-medium text-gray-900">Total Investment</span>
      <span className="text-2xl font-bold text-gray-900">
       ${totalInvestment.toLocaleString()}
      </span>
     </div>
    </div>
   </div>
  </div>
 );
};

export default TotalSummary; 