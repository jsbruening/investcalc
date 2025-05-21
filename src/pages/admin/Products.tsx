import React, { useState } from 'react';
import { products } from '../../data/products';
import type { Product } from '../../data/products';
import { Tabs, Tab, Box } from '@mui/material';
import '../../App.css';
import './Products.css';
import SavingsIcon from '@mui/icons-material/Savings';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TimelineIcon from '@mui/icons-material/Timeline';
import ShieldIcon from '@mui/icons-material/Shield';

type ProductType = 'cd' | 'moneyMarket' | 'annuity' | 'lifeInsurance';

interface EditModalProps {
  product: Product;
  onClose: () => void;
  onSave: (updatedProduct: Product) => void;
}

const EditModal: React.FC<EditModalProps> = ({ product, onClose, onSave }) => {
  const [editedProduct, setEditedProduct] = useState<Product>(product);

  const handleSave = () => {
    onSave(editedProduct);
    onClose();
  };

  // Dynamic field renderer based on schema
  const renderFields = () => {
    // Ensure schema exists and is an array
    if (!product?.schema || !Array.isArray(product.schema)) {
      return null;
    }

    return product.schema.map((field: any) => {
      if (!field || typeof field !== 'object') {
        return null;
      }

      if (field.type === 'grid' && field.fields && Array.isArray(field.fields)) {
        const gridData = editedProduct.data?.[field.name] || [];
        return (
          <div className="form-group" key={field.name}>
            <label>{field.label || field.name}</label>
            <div className="rate-grid">
              <table>
                <thead>
                  <tr>
                    {field.fields.map((col: any) => (
                      <th key={col.name}>{col.label || col.name}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {Array.isArray(gridData) && gridData.map((row: any, rowIndex: number) => (
                    <tr key={rowIndex}>
                      {field.fields.map((col: any) => (
                        <td key={col.name}>
                          <input
                            type={col.type === 'number' ? 'number' : 'text'}
                            value={row?.[col.name] ?? ''}
                            onChange={e => {
                              const newGrid = [...gridData];
                              newGrid[rowIndex] = {
                                ...row,
                                [col.name]: col.type === 'number' ? Number(e.target.value) || 0 : e.target.value
                              };
                              setEditedProduct({
                                ...editedProduct,
                                data: {
                                  ...(editedProduct.data || {}),
                                  [field.name]: newGrid
                                }
                              });
                            }}
                          />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      }

      // Regular input field
      return (
        <div className="form-group" key={field.name}>
          <label>{field.label || field.name}</label>
          <input
            type={field.type || 'text'}
            value={editedProduct.data?.[field.name] ?? ''}
            onChange={e => {
              const value = field.type === 'number'
                ? Number(e.target.value) || 0
                : e.target.value;
              setEditedProduct({
                ...editedProduct,
                data: {
                  ...(editedProduct.data || {}),
                  [field.name]: value
                }
              });
            }}
          />
        </div>
      );
    }).filter(Boolean); // Remove any null fields
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Edit {product?.type?.toUpperCase() || 'Product'}</h3>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">
          {renderFields()}
        </div>
        <div className="modal-footer">
          <button className="cancel-button secondary" onClick={onClose}>Cancel</button>
          <button className="save-button primary" onClick={handleSave}>Save Changes</button>
        </div>
      </div>
    </div>
  );
};

const Products: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ProductType>('cd');
  const [searchQuery, setSearchQuery] = useState('');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);

  const tabs = [
    { id: 'cd', label: 'Certificates of Deposit', icon: '🏦' },
    { id: 'moneyMarket', label: 'Money Market', icon: '💵' },
    { id: 'annuity', label: 'Annuities', icon: '📈' },
    { id: 'lifeInsurance', label: 'Life Insurance', icon: '🛡️' },
  ];

  const handleTabChange = (event: React.SyntheticEvent, newValue: ProductType) => {
    setActiveTab(newValue);
  };

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

  const getRateDisplay = (product: Product) => {
    if (product.data?.rateGrid?.length) {
      const minRate = Math.min(...product.data.rateGrid.map((b: { rate: number }) => b.rate));
      const maxRate = Math.max(...product.data.rateGrid.map((b: { rate: number }) => b.rate));
      return `${(minRate * 100).toFixed(2)}% - ${(maxRate * 100).toFixed(2)}%`;
    }
    if (product.data?.bands?.length) {
      const minRate = Math.min(...product.data.bands.map((b: { rate: number }) => b.rate));
      const maxRate = Math.max(...product.data.bands.map((b: { rate: number }) => b.rate));
      return `${(minRate * 100).toFixed(2)}% - ${(maxRate * 100).toFixed(2)}%`;
    }
    return product.data?.rate ? `${(product.data.rate * 100).toFixed(2)}%` : 'N/A';
  };

  const getTermDisplay = (product: Product) => {
    if (product.type === 'cd' && product.data?.termMonths) {
      return `${product.data.termMonths} months`;
    } else if (product.type === 'annuity' && product.data?.termYears) {
      return `${product.data.termYears} years`;
    } else if (product.type === 'moneyMarket') {
      return 'Variable';
    } else if (product.type === 'lifeInsurance') {
      return 'Lifetime';
    }
    return 'N/A';
  };

  const getProductName = (product: Product) => {
    if (product.type === 'cd') return 'Certificate of Deposit';
    return product.data?.productName || 'Unnamed Product';
  };

  const getInstitution = (product: Product) => {
    return product.data?.carrier || product.data?.institution || 'N/A';
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
  };

  const handleSaveEdit = (updatedProduct: Product) => {
    // Here you would typically make an API call to update the product
    console.log('Saving updated product:', updatedProduct);
    setEditingProduct(null);
  };

  const handleExport = () => {
    const productsToExport = sortedProducts;
    const headers = [
      'Product Type',
      'Product Name',
      'Institution/Carrier',
      'Term',
      'Rate Range',
      'Status'
    ];

    const rows = productsToExport.map(product => [
      product.type.toUpperCase(),
      getProductName(product),
      getInstitution(product),
      getTermDisplay(product),
      getRateDisplay(product),
      'Active'
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `products_${activeTab}_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div>
      <h2>Product Management</h2>
      <p>Manage your investment products and their rates</p>
      <button className="add-product-button primary">
        <span className="icon">+</span>
        Add New Product
      </button>
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
        <Tabs
          value={tabs.findIndex(t => t.id === activeTab)}
          onChange={(_, v) => setActiveTab(tabs[v].id as ProductType)}
          aria-label="Product Type Tabs"
          sx={{
            '.MuiTabs-indicator': {
              backgroundColor: 'var(--color-primary)',
              height: 4,
              borderRadius: 2,
            },
            minHeight: 0,
          }}
        >
          <Tab
            icon={<SavingsIcon sx={{ fontSize: 20, mr: 1 }} />} iconPosition="start"
            label="Certificates of Deposit"
            sx={{
              textTransform: 'none',
              fontWeight: 600,
              fontSize: '1rem',
              color: activeTab === 'cd' ? 'var(--color-primary)' : '#64748b',
              minHeight: 0,
              '&.Mui-selected': {
                color: 'var(--color-primary)',
              },
              '&:hover': {
                background: 'rgba(140,198,63,0.08)',
                color: 'var(--color-primary)',
              },
            }}
          />
          <Tab
            icon={<TrendingUpIcon sx={{ fontSize: 20, mr: 1 }} />} iconPosition="start"
            label="Money Market"
            sx={{
              textTransform: 'none',
              fontWeight: 600,
              fontSize: '1rem',
              color: activeTab === 'moneyMarket' ? 'var(--color-primary)' : '#64748b',
              minHeight: 0,
              '&.Mui-selected': {
                color: 'var(--color-primary)',
              },
              '&:hover': {
                background: 'rgba(140,198,63,0.08)',
                color: 'var(--color-primary)',
              },
            }}
          />
          <Tab
            icon={<TimelineIcon sx={{ fontSize: 20, mr: 1 }} />} iconPosition="start"
            label="Annuities"
            sx={{
              textTransform: 'none',
              fontWeight: 600,
              fontSize: '1rem',
              color: activeTab === 'annuity' ? 'var(--color-primary)' : '#64748b',
              minHeight: 0,
              '&.Mui-selected': {
                color: 'var(--color-primary)',
              },
              '&:hover': {
                background: 'rgba(140,198,63,0.08)',
                color: 'var(--color-primary)',
              },
            }}
          />
          <Tab
            icon={<ShieldIcon sx={{ fontSize: 20, mr: 1 }} />} iconPosition="start"
            label="Life Insurance"
            sx={{
              textTransform: 'none',
              fontWeight: 600,
              fontSize: '1rem',
              color: activeTab === 'lifeInsurance' ? 'var(--color-primary)' : '#64748b',
              minHeight: 0,
              '&.Mui-selected': {
                color: 'var(--color-primary)',
              },
              '&:hover': {
                background: 'rgba(140,198,63,0.08)',
                color: 'var(--color-primary)',
              },
            }}
          />
        </Tabs>
      </Box>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '2rem 0' }}>
        <div style={{ maxWidth: 350, width: '100%' }}>
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: 8, border: '1px solid var(--color-border)' }}
          />
        </div>
        <button className="toolbar-button secondary" onClick={handleExport}>
          <span className="icon">📥</span>
          Export
        </button>
      </div>
      <div style={{ width: '100%' }}>
        <table style={{ width: '100%' }}>
          <thead>
            <tr>
              <th onClick={() => requestSort('productName')}>
                Product Name
                {sortConfig?.key === 'productName' && (
                  <span className="sort-icon">{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>
                )}
              </th>
              <th onClick={() => requestSort('institution')}>
                Institution
                {sortConfig?.key === 'institution' && (
                  <span className="sort-icon">{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>
                )}
              </th>
              <th onClick={() => requestSort('term')}>
                Term
                {sortConfig?.key === 'term' && (
                  <span className="sort-icon">{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>
                )}
              </th>
              <th onClick={() => requestSort('rate')}>
                Rate
                {sortConfig?.key === 'rate' && (
                  <span className="sort-icon">{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>
                )}
              </th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedProducts.map((product, index) => (
              <tr key={index}>
                <td>{getProductName(product)}</td>
                <td>{getInstitution(product)}</td>
                <td>{getTermDisplay(product)}</td>
                <td>{getRateDisplay(product)}</td>
                <td>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button
                      className="action-button edit"
                      onClick={() => handleEdit(product)}
                      title="Edit"
                    >
                      ✏️
                    </button>
                    <button
                      className="action-button delete"
                      onClick={() => console.log('Delete product:', product)}
                      title="Delete"
                    >
                      🗑️
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {editingProduct && (
        <EditModal
          product={editingProduct}
          onClose={() => setEditingProduct(null)}
          onSave={handleSaveEdit}
        />
      )}
    </div>
  );
};

export default Products; 