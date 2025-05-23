import React from 'react';
import { MdClose } from 'react-icons/md';

interface ProductModalProps {
 product: {
  type: string;
  name: string;
  termCircle: string;
  projectedValue: number;
  investment: number;
  rate: number;
  data?: any;
 };
 onClose: () => void;
}

const ProductModal: React.FC<ProductModalProps> = ({
 product,
 onClose
}) => {
 const productDetails = [
  { label: 'Product Name', value: product.name },
  { label: 'Type', value: product.type.charAt(0).toUpperCase() + product.type.slice(1) },
  { label: 'Term', value: product.termCircle },
  { label: 'Current Investment', value: `$${product.investment.toLocaleString()}` },
  { label: 'Current Rate', value: `${(product.rate * 100).toFixed(2)}%` },
  { label: 'Projected Value', value: `$${Math.round(product.projectedValue).toLocaleString()}` },
  { label: 'Growth', value: `$${Math.round(product.projectedValue - product.investment).toLocaleString()}` }
 ];

 const renderRateGrid = () => {
  if (!product.data?.rateGrid?.length) return null;

  return (
   <div className="mt-6">
    <h3 className="text-lg font-semibold text-gray-900 mb-4">Rate Grid</h3>
    <div className="bg-gray-50 rounded-lg overflow-hidden">
     <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-gray-100">
       <tr>
        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Min Amount</th>
        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Max Amount</th>
        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rate</th>
       </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
       {product.data.rateGrid.map((band: any, index: number) => (
        <tr key={index} className="hover:bg-gray-50">
         <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
          ${band.minAmount.toLocaleString()}
         </td>
         <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
          ${band.maxAmount.toLocaleString()}
         </td>
         <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
          {(band.rate * 100).toFixed(2)}%
         </td>
        </tr>
       ))}
      </tbody>
     </table>
    </div>
   </div>
  );
 };

 return (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
   <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
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

     <div className="space-y-6">
      <div>
       <h3 className="text-lg font-semibold text-gray-900 mb-4">Product Details</h3>
       <div className="bg-gray-50 rounded-lg p-4 space-y-3">
        {productDetails.map(({ label, value }) => (
         <div key={label} className="flex justify-between">
          <span className="text-gray-600">{label}</span>
          <span className="font-medium text-gray-900">{value}</span>
         </div>
        ))}
       </div>
      </div>

      {renderRateGrid()}
     </div>
    </div>
   </div>
  </div>
 );
};

export default ProductModal; 