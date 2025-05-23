import React from 'react';
import { MdClose } from 'react-icons/md';
import { Line } from 'react-chartjs-2';
import {
 Chart as ChartJS,
 CategoryScale,
 LinearScale,
 PointElement,
 LineElement,
 Title,
 Tooltip,
 Legend
} from 'chart.js';
import type { ChartOptions } from 'chart.js';

ChartJS.register(
 CategoryScale,
 LinearScale,
 PointElement,
 LineElement,
 Title,
 Tooltip,
 Legend
);

interface ProductModalProps {
 product: {
  type: string;
  name: string;
  termCircle: string;
  projectedValue: number;
  investment: number;
  rate: number;
 };
 investment: number;
 age: number;
 gender: string;
 tobaccoUse: string;
 onClose: () => void;
}

const ProductModal: React.FC<ProductModalProps> = ({
 product,
 investment,
 age,
 gender,
 tobaccoUse,
 onClose
}) => {
 const years = Array.from({ length: 20 }, (_, i) => i + 1);
 const projectedValues = years.map(year => {
  const multiplier = Math.pow(1 + product.rate, year);
  return product.investment * multiplier;
 });

 const chartData = {
  labels: years.map(year => `Year ${year}`),
  datasets: [
   {
    label: 'Projected Value',
    data: projectedValues,
    borderColor: 'rgb(34, 197, 94)',
    backgroundColor: 'rgba(34, 197, 94, 0.5)',
    tension: 0.4
   }
  ]
 };

 const chartOptions: ChartOptions<'line'> = {
  responsive: true,
  plugins: {
   legend: {
    position: 'top' as const,
   },
   title: {
    display: true,
    text: 'Projected Growth Over Time'
   }
  },
  scales: {
   y: {
    beginAtZero: true,
    ticks: {
     callback: (value) => `$${value.toLocaleString()}`
    }
   }
  }
 };

 const customerInfo = [
  { label: 'Age', value: age },
  { label: 'Gender', value: gender },
  { label: 'Tobacco Use', value: tobaccoUse }
 ];

 const productDetails = [
  { label: 'Investment Amount', value: `$${product.investment.toLocaleString()}` },
  { label: 'Projected Value', value: `$${Math.round(product.projectedValue).toLocaleString()}` },
  { label: 'Growth', value: `$${Math.round(product.projectedValue - product.investment).toLocaleString()}` },
  { label: 'Rate', value: `${(product.rate * 100).toFixed(2)}%` }
 ];

 return (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
   <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
    <div className="p-6">
     <div className="flex justify-between items-start mb-6">
      <div>
       <h2 className="text-2xl font-bold text-gray-900">{product.name}</h2>
       <p className="text-sm text-gray-500">Term: {product.termCircle}</p>
      </div>
      <button
       onClick={onClose}
       className="text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 rounded-md"
      >
       <MdClose className="w-6 h-6" />
      </button>
     </div>

     <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div>
       <h3 className="text-lg font-semibold text-gray-900 mb-4">Customer Information</h3>
       <div className="bg-gray-50 rounded-lg p-4 space-y-3">
        {customerInfo.map(({ label, value }) => (
         <div key={label} className="flex justify-between">
          <span className="text-gray-600">{label}</span>
          <span className="font-medium text-gray-900">{value}</span>
         </div>
        ))}
       </div>

       <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-4">Product Details</h3>
       <div className="bg-gray-50 rounded-lg p-4 space-y-3">
        {productDetails.map(({ label, value }) => (
         <div key={label} className="flex justify-between">
          <span className="text-gray-600">{label}</span>
          <span className="font-medium text-gray-900">{value}</span>
         </div>
        ))}
       </div>
      </div>

      <div>
       <h3 className="text-lg font-semibold text-gray-900 mb-4">Growth Projection</h3>
       <div className="bg-gray-50 rounded-lg p-4">
        <Line data={chartData} options={chartOptions} />
       </div>
      </div>
     </div>
    </div>
   </div>
  </div>
 );
};

export default ProductModal; 