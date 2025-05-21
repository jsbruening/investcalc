import React from 'react';

interface TotalSummaryProps {
 totalInvestment: number;
 totalReturn: number;
 totalGrowth: number;
}

const TotalSummary: React.FC<TotalSummaryProps> = ({
 totalInvestment,
 totalReturn,
 totalGrowth
}) => {
 return (
  <div className="total-results">
   <h3>Total Investment Summary</h3>
   <p>Total Investment: ${totalInvestment.toLocaleString()}</p>
   <p>Total Projected Return: ${Math.round(totalReturn).toLocaleString()}</p>
   <p>Total Growth: ${Math.round(totalGrowth).toLocaleString()}</p>
  </div>
 );
};

export default TotalSummary; 