import React from 'react';
import { FaTimes } from 'react-icons/fa';

interface ProductModalProps {
 product: any;
 onClose: () => void;
}

const ProductModal: React.FC<ProductModalProps> = ({ product, onClose }) => {
 const renderField = (label: string, value: any) => (
  <div className="modal-field">
   <label>{label}</label>
   <span>{value}</span>
  </div>
 );

 const renderRatesTable = (rates: any[], type: 'rateGrid' | 'bands') => {
  if (!rates?.length) return null;

  const headers = type === 'rateGrid'
   ? ['Minimum Amount', 'Maximum Amount', 'Rate']
   : ['Minimum', 'Maximum', 'Rate'];

  return (
   <div className="rates-table">
    <h4>{type === 'rateGrid' ? 'Rate Grid' : 'Rate Bands'}</h4>
    <table>
     <thead>
      <tr>
       {headers.map(header => (
        <th key={header}>{header}</th>
       ))}
      </tr>
     </thead>
     <tbody>
      {rates.map((rate, index) => (
       <tr key={index}>
        <td>${(rate.minAmount || rate.min || 0).toLocaleString()}</td>
        <td>${(rate.maxAmount || rate.max || '∞').toLocaleString()}</td>
        <td>{(rate.rate * 100).toFixed(2)}%</td>
       </tr>
      ))}
     </tbody>
    </table>
   </div>
  );
 };

 return (
  <div className="modal-overlay" onClick={onClose}>
   <div className="modal-content" onClick={e => e.stopPropagation()}>
    <button className="close-button" onClick={onClose}>
     <FaTimes />
    </button>

    <div className="modal-header">
     <h3>{product.data?.productName || 'Product Details'}</h3>
    </div>

    <div className="modal-body">
     {product.data?.description && renderField('Description', product.data.description)}
     {product.data?.termYears && renderField('Term', `${product.data.termYears} years`)}
     {product.data?.bonusRate && renderField('Bonus Rate', `${(product.data.bonusRate * 100).toFixed(2)}%`)}
     {product.data?.minimumInvestment && renderField('Minimum Investment', `$${product.data.minimumInvestment.toLocaleString()}`)}

     {product.data?.rateGrid && renderRatesTable(product.data.rateGrid, 'rateGrid')}
     {product.data?.bands && renderRatesTable(product.data.bands, 'bands')}
    </div>
   </div>
  </div>
 );
};

export default ProductModal; 