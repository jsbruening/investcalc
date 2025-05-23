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
                      <button
                        onClick={() => setEditingProduct(product)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <FaEdit />
                      </button>
                      <button className="text-red-600 hover:text-red-900"><FaTrash /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Edit Modal */}
      {editingProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-xl font-bold">Edit Product</h2>
              <button
                onClick={() => setEditingProduct(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Product Name</label>
                  <input
                    type="text"
                    value={editingProduct.data?.productName || ''}
                    onChange={(e) => setEditingProduct({
                      ...editingProduct,
                      data: { ...editingProduct.data, productName: e.target.value }
                    })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand focus:ring-brand h-12 px-4"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Institution</label>
                  <input
                    type="text"
                    value={editingProduct.data?.institution || editingProduct.data?.carrier || ''}
                    onChange={(e) => setEditingProduct({
                      ...editingProduct,
                      data: { ...editingProduct.data, institution: e.target.value }
                    })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand focus:ring-brand h-12 px-4"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Rate</label>
                  <input
                    type="number"
                    step="0.01"
                    value={editingProduct.data?.rate ? editingProduct.data.rate * 100 : ''}
                    onChange={(e) => setEditingProduct({
                      ...editingProduct,
                      data: { ...editingProduct.data, rate: parseFloat(e.target.value) / 100 }
                    })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand focus:ring-brand h-12 px-4"
                  />
                </div>

                {editingProduct.type === 'cd' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Term (Months)</label>
                    <input
                      type="number"
                      value={editingProduct.data?.termMonths || ''}
                      onChange={(e) => setEditingProduct({
                        ...editingProduct,
                        data: { ...editingProduct.data, termMonths: parseInt(e.target.value) }
                      })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand focus:ring-brand h-12 px-4"
                    />
                  </div>
                )}

                {editingProduct.type === 'annuity' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Term (Years)</label>
                    <input
                      type="number"
                      value={editingProduct.data?.termYears || ''}
                      onChange={(e) => setEditingProduct({
                        ...editingProduct,
                        data: { ...editingProduct.data, termYears: parseInt(e.target.value) }
                      })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand focus:ring-brand h-12 px-4"
                    />
                  </div>
                )}

                {/* Rate Bands Grid */}
                {(editingProduct.type === 'annuity' || editingProduct.type === 'moneyMarket' || editingProduct.type === 'lifeInsurance') && (
                  <div className="mt-6">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-medium text-gray-900">Rate Bands</h3>
                      <button
                        onClick={() => {
                          const newBand = editingProduct.type === 'lifeInsurance'
                            ? { age: 30, gender: 'Male', tobaccoUse: 'No', rate: 0 }
                            : { min: 0, max: 0, rate: 0 };
                          setEditingProduct({
                            ...editingProduct,
                            data: {
                              ...editingProduct.data,
                              rateGrid: [...(editingProduct.data?.rateGrid || []), newBand]
                            }
                          });
                        }}
                        className="px-3 py-1 text-sm bg-green-100 text-green-700 rounded-md hover:bg-green-200"
                      >
                        Add Band
                      </button>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50 sticky top-0">
                          <tr>
                            {editingProduct.type === 'lifeInsurance' ? (
                              <>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Age</th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Gender</th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Tobacco Use</th>
                              </>
                            ) : (
                              <>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Min Amount</th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Max Amount</th>
                              </>
                            )}
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Rate (%)</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {(editingProduct.data?.rateGrid || []).map((band: any, index: number) => (
                            <tr key={index}>
                              {editingProduct.type === 'lifeInsurance' ? (
                                <>
                                  <td className="px-4 py-2">
                                    <input
                                      type="number"
                                      value={band.age || ''}
                                      onChange={(e) => {
                                        const newRateGrid = [...(editingProduct.data?.rateGrid || [])];
                                        newRateGrid[index] = { ...band, age: parseInt(e.target.value) };
                                        setEditingProduct({
                                          ...editingProduct,
                                          data: { ...editingProduct.data, rateGrid: newRateGrid }
                                        });
                                      }}
                                      className="w-full rounded-md border-gray-300 shadow-sm focus:border-brand focus:ring-brand h-12 px-4"
                                    />
                                  </td>
                                  <td className="px-4 py-2">
                                    <select
                                      value={band.gender || 'Male'}
                                      onChange={(e) => {
                                        const newRateGrid = [...(editingProduct.data?.rateGrid || [])];
                                        newRateGrid[index] = { ...band, gender: e.target.value };
                                        setEditingProduct({
                                          ...editingProduct,
                                          data: { ...editingProduct.data, rateGrid: newRateGrid }
                                        });
                                      }}
                                      className="w-full rounded-md border-gray-300 shadow-sm focus:border-brand focus:ring-brand h-12 px-4"
                                    >
                                      <option value="Male">Male</option>
                                      <option value="Female">Female</option>
                                    </select>
                                  </td>
                                  <td className="px-4 py-2">
                                    <select
                                      value={band.tobaccoUse || 'No'}
                                      onChange={(e) => {
                                        const newRateGrid = [...(editingProduct.data?.rateGrid || [])];
                                        newRateGrid[index] = { ...band, tobaccoUse: e.target.value };
                                        setEditingProduct({
                                          ...editingProduct,
                                          data: { ...editingProduct.data, rateGrid: newRateGrid }
                                        });
                                      }}
                                      className="w-full rounded-md border-gray-300 shadow-sm focus:border-brand focus:ring-brand h-12 px-4"
                                    >
                                      <option value="No">No</option>
                                      <option value="Yes">Yes</option>
                                    </select>
                                  </td>
                                </>
                              ) : (
                                <>
                                  <td className="px-4 py-2">
                                    <input
                                      type="text"
                                      value={(band.min || band.minAmount) !== undefined ? (band.min || band.minAmount).toLocaleString() : ''}
                                      onChange={(e) => {
                                        const value = e.target.value.replace(/[^0-9]/g, '');
                                        const newRateGrid = [...(editingProduct.data?.rateGrid || [])];
                                        newRateGrid[index] = { ...band, min: value ? parseFloat(value) : 0 };
                                        setEditingProduct({
                                          ...editingProduct,
                                          data: { ...editingProduct.data, rateGrid: newRateGrid }
                                        });
                                      }}
                                      className="w-full rounded-md border-gray-300 shadow-sm focus:border-brand focus:ring-brand h-12 px-4"
                                    />
                                  </td>
                                  <td className="px-4 py-2">
                                    <input
                                      type="text"
                                      value={(band.max || band.maxAmount) !== undefined ? (band.max || band.maxAmount).toLocaleString() : ''}
                                      onChange={(e) => {
                                        const value = e.target.value.replace(/[^0-9]/g, '');
                                        const newRateGrid = [...(editingProduct.data?.rateGrid || [])];
                                        newRateGrid[index] = { ...band, max: value ? parseFloat(value) : 0 };
                                        setEditingProduct({
                                          ...editingProduct,
                                          data: { ...editingProduct.data, rateGrid: newRateGrid }
                                        });
                                      }}
                                      className="w-full rounded-md border-gray-300 shadow-sm focus:border-brand focus:ring-brand h-12 px-4"
                                    />
                                  </td>
                                </>
                              )}
                              <td className="px-4 py-2">
                                <input
                                  type="text"
                                  value={band.rate !== undefined ? (band.rate * 100).toFixed(2) : ''}
                                  onChange={(e) => {
                                    const value = e.target.value.replace(/[^0-9.]/g, '');
                                    const newRateGrid = [...(editingProduct.data?.rateGrid || [])];
                                    newRateGrid[index] = { ...band, rate: value ? parseFloat(value) / 100 : 0 };
                                    setEditingProduct({
                                      ...editingProduct,
                                      data: { ...editingProduct.data, rateGrid: newRateGrid }
                                    });
                                  }}
                                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-brand focus:ring-brand h-12 px-4"
                                />
                              </td>
                              <td className="px-4 py-2">
                                <button
                                  onClick={() => {
                                    const newRateGrid = editingProduct.data?.rateGrid?.filter((_: any, i: number) => i !== index) || [];
                                    setEditingProduct({
                                      ...editingProduct,
                                      data: { ...editingProduct.data, rateGrid: newRateGrid }
                                    });
                                  }}
                                  className="text-red-600 hover:text-red-900"
                                >
                                  <FaTrash className="w-4 h-4" />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end gap-2 p-6 border-t">
              <button
                onClick={() => setEditingProduct(null)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  // Here you would typically update the product in your backend
                  console.log('Saving product:', editingProduct);
                  setEditingProduct(null);
                }}
                className="px-4 py-2 text-sm font-medium text-white bg-brand rounded-md hover:bg-green-700"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products; 