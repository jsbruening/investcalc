import React from 'react';
import { MdSavings, MdCompareArrows, MdCheckCircle } from 'react-icons/md';
import { FaPiggyBank, FaShieldAlt, FaInfoCircle } from 'react-icons/fa';
import { GiReceiveMoney } from 'react-icons/gi';

interface ProductCardProps {
 type: 'cd' | 'moneyMarket' | 'annuity' | 'lifeInsurance';
 productName: string;
 termCircle: string;
 projectedValue: number;
 investment: number;
 rate: number;
 isSelected: boolean;
 onDetailsClick: () => void;
 onCompareClick: () => void;
 termType?: string;
}

const getProductIcon = (type: string) => {
 switch (type) {
  case 'cd': return <MdSavings style={{ color: '#2ecc71', fontSize: '1.3rem' }} />;
  case 'moneyMarket': return <FaPiggyBank style={{ color: '#4a90e2', fontSize: '1.3rem' }} />;
  case 'annuity': return <GiReceiveMoney style={{ color: '#f39c12', fontSize: '1.3rem' }} />;
  case 'lifeInsurance': return <FaShieldAlt style={{ color: '#9b59b6', fontSize: '1.3rem' }} />;
  default: return null;
 }
};

const getTermBadge = (type: string, termType?: string) => {
 if (type === 'cd') return 'CD';
 if (type === 'moneyMarket') return termType === 'short' ? 'Short' : termType === 'intermediate' ? 'Intermediate' : 'Long';
 if (type === 'annuity') return 'Annuity';
 if (type === 'lifeInsurance') return 'Life';
 return '';
};

const ProductCard: React.FC<ProductCardProps> = ({
 type,
 productName,
 termCircle,
 projectedValue,
 investment,
 rate,
 isSelected,
 onDetailsClick,
 onCompareClick,
 termType
}) => {
 const growth = projectedValue - investment;

 return (
  <div className="product-card" data-type={type}>
   <div className="product-header">
    <span className="product-icon">{getProductIcon(type)}</span>
    <h4 style={{ fontSize: '1rem', fontWeight: 600, margin: 0, display: 'flex', alignItems: 'center', gap: 6 }}>
     {productName}
     <span className={`term-circle ${type}`}>{termCircle}</span>
    </h4>
    <span className="term-badge">{getTermBadge(type, termType)}</span>
   </div>
   <div className="projected-value">${Math.round(projectedValue).toLocaleString()}</div>
   <div className="growth">+${Math.round(growth).toLocaleString()}</div>
   <div className="rate">{(rate * 100).toFixed(2)}%</div>
   <div className="card-actions">
    <button
     className="details-button"
     onClick={onDetailsClick}
     title="View Details"
    >
     <FaInfoCircle />
    </button>
    <button
     className={`compare-button ${isSelected ? 'selected' : ''}`}
     onClick={onCompareClick}
     title={isSelected ? "Remove from comparison" : "Add to comparison"}
    >
     {isSelected ? <MdCheckCircle color="#8cc63f" size={20} /> : <MdCompareArrows />}
    </button>
   </div>
  </div>
 );
};

export default ProductCard; 