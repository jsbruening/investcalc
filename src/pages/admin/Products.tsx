import React, { useState } from 'react';
import { products } from '../../data/products';
import type { Product } from '../../data/products';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';

// Product types for tabs
const tabs = [
  { id: 'cd', label: 'Certificates of Deposit' },
  { id: 'moneyMarket', label: 'Money Market' },
  { id: 'annuity', label: 'Annuities' },
  { id: 'lifeInsurance', label: 'Life Insurance' },
];

type ProductType = 'cd' | 'moneyMarket' | 'annuity' | 'lifeInsurance';

const Products: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ProductType>('cd');
  const [searchQuery, setSearchQuery] = useState('');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);

  // Filter products based on active tab and search query
  const filteredProducts = products.filter(product => {
    const matchesType = product.type === activeTab;
    const matchesSearch = searchQuery === '' ||
      (product.data?.productName?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
      (product.data?.carrier?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
      (product.data?.institution?.toLowerCase() || '').includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  // Sort products if sortConfig is set
  const sortedProducts = React.useMemo(() => {
    if (!sortConfig) return filteredProducts;
    return [...filteredProducts].sort((a, b) => {
      const aValue = a.data?.[sortConfig.key] || '';
      const bValue = b.data?.[sortConfig.key] || '';
      if (aValue < bValue) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }, [filteredProducts, sortConfig]);

  const requestSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  return (
    <div className="bg-gray-50 min-h-[calc(100vh-4rem)]">
      <div className="max-w-4xl mx-auto mt-12 p-8 bg-white rounded-xl shadow-lg">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Products</h1>
          <button
            className="flex items-center gap-2 px-4 py-2 rounded-md bg-brand text-white font-semibold shadow hover:bg-green-700 transition-colors duration-200"
          >
            <FaPlus className="w-4 h-4" />
            Add New Product
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as ProductType)}
              className={`px-4 py-2 rounded-md font-medium text-sm transition-colors duration-200
                ${activeTab === tab.id
                  ? 'bg-green-100 text-green-800 shadow'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}
              `}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search and Export Row */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full md:w-72 px-4 py-2 rounded-md border border-gray-300 focus:border-brand focus:ring-brand text-sm"
          />
          <button className="flex items-center gap-2 px-4 py-2 rounded-md bg-gray-100 text-gray-700 font-medium border border-gray-300 hover:bg-gray-200 transition-colors duration-200">
            <span>Export</span>
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => requestSort('productName')}>
                  Product Name
                  {sortConfig?.key === 'productName' && (
                    <span className="ml-1">{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>
                  )}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => requestSort('institution')}>
                  Institution
                  {sortConfig?.key === 'institution' && (
                    <span className="ml-1">{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>
                  )}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => requestSort('term')}>
                  Term
                  {sortConfig?.key === 'term' && (
                    <span className="ml-1">{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>
                  )}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => requestSort('rate')}>
                  Rate
                  {sortConfig?.key === 'rate' && (
                    <span className="ml-1">{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>
                  )}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedProducts.map((product, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{product.data?.productName || 'Unnamed Product'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{product.data?.carrier || product.data?.institution || 'N/A'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{product.data?.termMonths ? `${product.data.termMonths} months` : product.data?.termYears ? `${product.data.termYears} years` : product.type === 'moneyMarket' ? 'Variable' : product.type === 'lifeInsurance' ? 'Lifetime' : 'N/A'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{product.data?.rate ? `${(product.data.rate * 100).toFixed(2)}%` : 'N/A'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="flex gap-2">
                      <button className="text-blue-600 hover:text-blue-900"><FaEdit /></button>
                      <button className="text-red-600 hover:text-red-900"><FaTrash /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Products; 