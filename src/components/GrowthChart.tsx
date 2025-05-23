import React from 'react';
import {
 LineChart,
 Line,
 XAxis,
 YAxis,
 CartesianGrid,
 Tooltip,
 Legend,
 ResponsiveContainer
} from 'recharts';

interface GrowthChartProps {
 data: {
  year: number;
  shortTerm: number;
  intermediateTerm: number;
  longTerm: number;
  lifeInsurance: number;
 }[];
}

const GrowthChart: React.FC<GrowthChartProps> = ({ data }) => {
 const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-US', {
   style: 'currency',
   currency: 'USD',
   minimumFractionDigits: 0,
   maximumFractionDigits: 0
  }).format(value);
 };

 const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
   return (
    <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200">
     <p className="text-sm font-medium text-gray-900 mb-2">Year {label}</p>
     <div className="space-y-1">
      {payload.map((entry: any) => (
       <div key={entry.name} className="flex items-center gap-2">
        <div
         className="w-3 h-3 rounded-full"
         style={{ backgroundColor: entry.color }}
        />
        <span className="text-sm text-gray-600">{entry.name}:</span>
        <span className="text-sm font-medium text-gray-900">
         {formatCurrency(entry.value)}
        </span>
       </div>
      ))}
     </div>
    </div>
   );
  }
  return null;
 };

 return (
  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
   <h3 className="text-lg font-semibold text-gray-900 mb-6">Investment Growth Over Time</h3>

   <div className="h-[400px]">
    <ResponsiveContainer width="100%" height="100%">
     <LineChart
      data={data}
      margin={{
       top: 5,
       right: 30,
       left: 20,
       bottom: 5
      }}
     >
      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
      <XAxis
       dataKey="year"
       stroke="#6b7280"
       tick={{ fill: '#6b7280' }}
       tickLine={{ stroke: '#d1d5db' }}
      />
      <YAxis
       stroke="#6b7280"
       tick={{ fill: '#6b7280' }}
       tickLine={{ stroke: '#d1d5db' }}
       tickFormatter={formatCurrency}
      />
      <Tooltip content={<CustomTooltip />} />
      <Legend
       wrapperStyle={{
        paddingTop: '20px'
       }}
      />
      <Line
       type="monotone"
       dataKey="shortTerm"
       name="Short Term"
       stroke="#3b82f6"
       strokeWidth={2}
       dot={{ r: 4 }}
       activeDot={{ r: 6 }}
      />
      <Line
       type="monotone"
       dataKey="intermediateTerm"
       name="Intermediate Term"
       stroke="#10b981"
       strokeWidth={2}
       dot={{ r: 4 }}
       activeDot={{ r: 6 }}
      />
      <Line
       type="monotone"
       dataKey="longTerm"
       name="Long Term"
       stroke="#8b5cf6"
       strokeWidth={2}
       dot={{ r: 4 }}
       activeDot={{ r: 6 }}
      />
      <Line
       type="monotone"
       dataKey="lifeInsurance"
       name="Life Insurance"
       stroke="#f59e0b"
       strokeWidth={2}
       dot={{ r: 4 }}
       activeDot={{ r: 6 }}
      />
     </LineChart>
    </ResponsiveContainer>
   </div>

   <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
    <div className="bg-blue-50 p-4 rounded-lg">
     <h4 className="text-sm font-medium text-blue-900">Short Term</h4>
     <p className="mt-1 text-2xl font-semibold text-blue-700">
      {formatCurrency(data[data.length - 1].shortTerm)}
     </p>
    </div>
    <div className="bg-green-50 p-4 rounded-lg">
     <h4 className="text-sm font-medium text-green-900">Intermediate Term</h4>
     <p className="mt-1 text-2xl font-semibold text-green-700">
      {formatCurrency(data[data.length - 1].intermediateTerm)}
     </p>
    </div>
    <div className="bg-purple-50 p-4 rounded-lg">
     <h4 className="text-sm font-medium text-purple-900">Long Term</h4>
     <p className="mt-1 text-2xl font-semibold text-purple-700">
      {formatCurrency(data[data.length - 1].longTerm)}
     </p>
    </div>
    <div className="bg-yellow-50 p-4 rounded-lg">
     <h4 className="text-sm font-medium text-yellow-900">Life Insurance</h4>
     <p className="mt-1 text-2xl font-semibold text-yellow-700">
      {formatCurrency(data[data.length - 1].lifeInsurance)}
     </p>
    </div>
   </div>
  </div>
 );
};

export default GrowthChart; 