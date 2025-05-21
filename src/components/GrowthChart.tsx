import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

interface GrowthChartProps {
 data: { time: string | number; value: number }[];
 initialInvestment: number;
 width?: number;
 height?: number;
}

const GrowthChart: React.FC<GrowthChartProps> = ({ data, initialInvestment, width = 220, height = 90 }) => {
 return (
  <div style={{ width: '100%', height }}>
   <ResponsiveContainer width="100%" height="100%">
    <LineChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
     <XAxis dataKey="time" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
     <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} width={40} domain={['auto', 'auto']} />
     <Tooltip formatter={(v: number) => `$${v.toLocaleString()}`} labelFormatter={l => `Time: ${l}`} />
     <ReferenceLine y={initialInvestment} stroke="#94a3b8" strokeDasharray="3 3" label={{ value: 'Initial', position: 'left', fontSize: 10, fill: '#94a3b8' }} />
     <Line type="monotone" dataKey="value" stroke="#8cc63f" strokeWidth={2} dot={false} />
    </LineChart>
   </ResponsiveContainer>
  </div>
 );
};

export default GrowthChart; 