import React, { useState } from 'react';

const Products: React.FC = () => {
 const [activeTab, setActiveTab] = useState('all');

 return (
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
   <div className="bg-white rounded-xl shadow-md overflow-hidden">
    <div className="p-6 border-b border-gray-200">
     <div className="flex justify-between items-center">
      <h1 className="text-2xl font-bold text-gray-900">Products</h1>
      <button className="bg-red-200">
       <span>Add New Product</span>
      </button>
     </div>
    </div>
    <div className="p-6">
     <div className="flex space-x-4 mb-6">
      <button
       className={`px-4 py-2 rounded-lg ${activeTab === 'all' ? 'bg-brand-light text-brand' : 'text-gray-600 hover:bg-gray-100'}`}
       onClick={() => setActiveTab('all')}
      >
       All
      </button>
      <button
       className={`px-4 py-2 rounded-lg ${activeTab === 'active' ? 'bg-brand-light text-brand' : 'text-gray-600 hover:bg-gray-100'}`}
       onClick={() => setActiveTab('active')}
      >
       Active
      </button>
      <button
       className={`px-4 py-2 rounded-lg ${activeTab === 'inactive' ? 'bg-brand-light text-brand' : 'text-gray-600 hover:bg-gray-100'}`}
       onClick={() => setActiveTab('inactive')}
      >
       Inactive
      </button>
     </div>
     <div className="bg-gray-50 rounded-lg p-4">
      <p className="text-gray-600">Product list will be displayed here.</p>
     </div>
    </div>
   </div>
  </div>
 );
};

export default Products; 