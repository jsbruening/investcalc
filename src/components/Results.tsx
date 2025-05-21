import React, { useState } from 'react';
import { products } from '../data/products';
import GrowthChart from './GrowthChart';
import { Tabs, Tab, Box } from '@mui/material';
import { MdSavings, MdCompareArrows, MdCheckCircle } from 'react-icons/md';
import { FaChartLine, FaHeart, FaPiggyBank, FaHeartbeat, FaShieldAlt, FaInfoCircle } from 'react-icons/fa';
import { GiDuration, GiReceiveMoney } from 'react-icons/gi';
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid } from 'recharts';

interface ResultsProps {
  shortTermInvestment: number;
  intermediateInvestment: number;
  longTermInvestment: number;
  neverInvestment: number;
  age: number;
  gender: string;
  tobaccoUse: string;
}

const calculateCDReturn = (investment: number, termMonths: number, rate: number) => {
  const years = termMonths / 12;
  return investment * Math.pow(1 + rate, years);
};

const calculateAnnuityReturn = (investment: number, termYears: number, initialRate: number, bonusRate: number) => {
  const baseReturn = investment * Math.pow(1 + initialRate, termYears);
  const bonus = investment * bonusRate;
  return baseReturn + bonus;
};

const calculateLifeInsuranceReturn = (investment: number, age: number, gender: string, tobaccoUse: string) => {
  // Base rate varies by age, gender, and tobacco use
  let baseRate = 0.04; // 4% base rate

  // Age adjustments
  if (age < 30) baseRate += 0.01;
  else if (age > 60) baseRate -= 0.01;

  // Gender adjustments
  if (gender === 'female') baseRate += 0.005;

  // Tobacco use adjustments
  if (tobaccoUse === 'yes') baseRate -= 0.01;

  // Calculate return over 30 years (typical life insurance term)
  return investment * Math.pow(1 + baseRate, 30);
};

const calculateMoneyMarketReturn = (investment: number, product: any, years: number) => {
  // Get the rate for the investment amount
  const rate = getRateForInvestment(investment, product);

  // Money market accounts compound monthly
  const monthlyRate = rate / 12;
  const months = years * 12;
  return investment * Math.pow(1 + monthlyRate, months);
};

const getRateForInvestment = (investment: number, product: any) => {
  if (!product?.data) {
    return 0.04; // Default rate if product or data is undefined
  }

  // First try rateGrid
  if (product.data.rateGrid?.length) {
    const band = product.data.rateGrid.find((b: any) =>
      investment >= (b.minAmount || 0) &&
      investment <= (b.maxAmount || Infinity)
    );
    return band?.rate || product.data.rateGrid[0]?.rate || 0.04;
  }

  // Fallback to bands
  if (product.data.bands?.length) {
    const band = product.data.bands.find((b: any) =>
      investment >= (b.min || 0) &&
      investment <= (b.max || Infinity)
    );
    return band?.rate || product.data.bands[0]?.rate || 0.04;
  }

  // If no rate structure found, return a default rate
  return 0.04; // 4% default rate
};

// Helper to generate growth data for a given product
function getGrowthData({ investment, rate, termMonths, termYears, interval }: { investment: number, rate: number, termMonths?: number, termYears?: number, interval: 'month' | '6month' | 'year' }) {
  const data = [];
  if (interval === 'month' && termMonths) {
    for (let m = 0; m <= termMonths; m++) {
      const value = investment * Math.pow(1 + rate / 12, m);
      data.push({ time: m, value });
    }
  } else if (interval === '6month' && termMonths) {
    for (let m = 0; m <= termMonths; m += 6) {
      const value = investment * Math.pow(1 + rate / 12, m);
      data.push({ time: m / 12 + ' yr', value });
    }
    // Ensure last point is included
    if (termMonths % 6 !== 0) {
      const value = investment * Math.pow(1 + rate / 12, termMonths);
      data.push({ time: (termMonths / 12).toFixed(1) + ' yr', value });
    }
  } else if (interval === 'year' && termYears) {
    for (let y = 0; y <= termYears; y++) {
      const value = investment * Math.pow(1 + rate, y);
      data.push({ time: y, value });
    }
  }
  return data;
}

const getProductIcon = (type: string) => {
  switch (type) {
    case 'cd': return <MdSavings style={{ color: '#2ecc71', fontSize: '1.3rem' }} />;
    case 'moneyMarket': return <FaPiggyBank style={{ color: '#4a90e2', fontSize: '1.3rem' }} />;
    case 'annuity': return <GiReceiveMoney style={{ color: '#f39c12', fontSize: '1.3rem' }} />;
    case 'lifeInsurance': return <FaShieldAlt style={{ color: '#9b59b6', fontSize: '1.3rem' }} />;
    default: return <FaChartLine style={{ color: '#8cc63f', fontSize: '1.3rem' }} />;
  }
};
const getTermBadge = (type: string, termType: string) => {
  if (type === 'cd') return 'CD';
  if (type === 'moneyMarket') return termType === 'short' ? 'Short' : termType === 'intermediate' ? 'Intermediate' : 'Long';
  if (type === 'annuity') return 'Annuity';
  if (type === 'lifeInsurance') return 'Life';
  return '';
};

// Helper to get a term circle string for each product
const getTermCircle = (product: any) => {
  if (!product) return '';
  if (product.type === 'cd' || product.termMonths) {
    const months = product.termMonths || 12;
    return `${months}m`;
  }
  if (product.type === 'annuity') {
    return `${product.data?.termYears || 0}y`;
  }
  if (product.type === 'moneyMarket') {
    if (product.termType === 'short') return '1y';
    if (product.termType === 'intermediate') return '3y';
    if (product.termType === 'long') return '5y';
    return '';
  }
  if (product.type === 'lifeInsurance') {
    return 'Life';
  }
  return '';
};

const Results: React.FC<ResultsProps> = ({
  shortTermInvestment,
  intermediateInvestment,
  longTermInvestment,
  neverInvestment,
  age,
  gender,
  tobaccoUse,
}) => {
  const [modalProduct, setModalProduct] = useState<any | null>(null);
  const [tab, setTab] = useState(0);
  const [selectedProducts, setSelectedProducts] = useState<any[]>([]);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);
  const cdProduct = products.find(p => p.type === 'cd');
  const annuityProducts = products.filter(p => p.type === 'annuity');
  const moneyMarketProducts = products.filter(p => p.type === 'moneyMarket');

  const handleProductSelect = (product: any) => {
    setSelectedProducts(prev => {
      // If product is already selected, remove it
      if (prev.some(p => p._id === product._id)) {
        return prev.filter(p => p._id !== product._id);
      }
      // Otherwise add it
      return [...prev, product];
    });
  };

  const renderCDCard = (investment: number, termMonths: number, rate: number, product?: any) => {
    const result = calculateCDReturn(investment, termMonths, rate);
    const isSelected = selectedProducts.some(p =>
      product ? p._id === product._id :
        p.type === 'cd' && p.termMonths === termMonths && p.rate === rate
    );
    return (
      <div className="product-card" data-type="cd">
        <div className="product-header">
          <span className="product-icon">{getProductIcon('cd')}</span>
          <h4 style={{ fontSize: '1rem', fontWeight: 600, margin: 0, display: 'flex', alignItems: 'center', gap: 6 }}>
            {product?.data?.productName || 'Certificate of Deposit'}
            <span className={`term-circle cd`}>{getTermCircle(product || { termMonths })}</span>
          </h4>
          <span className="term-badge">CD</span>
        </div>
        <div className="projected-value">${Math.round(result).toLocaleString()}</div>
        <div className="growth">+${Math.round(result - investment).toLocaleString()}</div>
        <div className="rate">{(rate * 100).toFixed(2)}%</div>
        <div className="card-actions">
          <button
            className="details-button"
            onClick={() => setModalProduct(product || { type: 'cd', termMonths, rate })}
            title="View Details"
          >
            <FaInfoCircle />
          </button>
          <button
            className={`compare-button ${isSelected ? 'selected' : ''}`}
            onClick={() => handleProductSelect(product || { type: 'cd', termMonths, rate })}
            title={isSelected ? "Remove from comparison" : "Add to comparison"}
          >
            {isSelected ? <MdCheckCircle color="#8cc63f" size={20} /> : <MdCompareArrows />}
          </button>
        </div>
      </div>
    );
  };

  const renderAnnuityCards = (investment: number) => {
    return annuityProducts.map((product) => {
      const rate = getRateForInvestment(investment, product);
      const result = calculateAnnuityReturn(
        investment,
        product.data.termYears,
        rate,
        product.data.bonusRate
      );
      const isSelected = selectedProducts.some(p => p._id === product._id);
      return (
        <div key={product._id} className="product-card" data-type="annuity">
          <div className="product-header">
            <span className="product-icon">{getProductIcon('annuity')}</span>
            <h4 style={{ fontSize: '1rem', fontWeight: 600, margin: 0, display: 'flex', alignItems: 'center', gap: 6 }}>
              {product.data.productName}
              <span className={`term-circle annuity`}>{getTermCircle(product)}</span>
            </h4>
            <span className="term-badge">Annuity</span>
          </div>
          <div className="projected-value">${Math.round(result).toLocaleString()}</div>
          <div className="growth">+${Math.round(result - investment).toLocaleString()}</div>
          <div className="rate">{(rate * 100).toFixed(2)}%</div>
          <div className="card-actions">
            <button
              className="details-button"
              onClick={() => setModalProduct(product)}
              title="View Details"
            >
              <FaInfoCircle />
            </button>
            <button
              className={`compare-button ${isSelected ? 'selected' : ''}`}
              onClick={() => handleProductSelect(product)}
              title={isSelected ? "Remove from comparison" : "Add to comparison"}
            >
              {isSelected ? <MdCheckCircle color="#8cc63f" size={20} /> : <MdCompareArrows />}
            </button>
          </div>
        </div>
      );
    });
  };

  const renderLifeInsuranceCard = (investment: number) => {
    const result = calculateLifeInsuranceReturn(investment, age, gender, tobaccoUse);
    const product = { type: 'lifeInsurance', investment, age, gender, tobaccoUse };
    return (
      <div className="product-card" data-type="lifeInsurance">
        <div className="product-header">
          <span className="product-icon">{getProductIcon('lifeInsurance')}</span>
          <h4 style={{ fontSize: '1rem', fontWeight: 600, margin: 0, display: 'flex', alignItems: 'center', gap: 6 }}>
            Whole Life Insurance
            <span className={`term-circle lifeInsurance`}>{getTermCircle(product)}</span>
          </h4>
          <span className="term-badge">Life</span>
        </div>
        <div className="projected-value">${Math.round(result).toLocaleString()}</div>
        <button
          className="details-button"
          onClick={() => setModalProduct(product)}
          title="View Details"
        >
          <FaInfoCircle />
        </button>
      </div>
    );
  };

  const renderMoneyMarketCards = (investment: number, termType: string) => {
    return moneyMarketProducts
      .filter(product => product.termType === termType)
      .map((product) => {
        const years = termType === 'short' ? 1 : termType === 'intermediate' ? 3 : 5;
        const result = calculateMoneyMarketReturn(investment, product, years);
        const rate = getRateForInvestment(investment, product);
        const isSelected = selectedProducts.some(p => p._id === product._id);
        return (
          <div key={product._id} className="product-card" data-type="moneyMarket">
            <div className="product-header">
              <span className="product-icon">{getProductIcon('moneyMarket')}</span>
              <h4 style={{ fontSize: '1rem', fontWeight: 600, margin: 0, display: 'flex', alignItems: 'center', gap: 6 }}>
                {product.data?.productName || 'Money Market'}
                <span className={`term-circle moneyMarket`}>{getTermCircle(product)}</span>
              </h4>
              <span className="term-badge">{getTermBadge('moneyMarket', termType)}</span>
            </div>
            <div className="projected-value">${Math.round(result).toLocaleString()}</div>
            <div className="growth">+${Math.round(result - investment).toLocaleString()}</div>
            <div className="rate">{(rate * 100).toFixed(2)}%</div>
            <div className="card-actions">
              <button
                className="details-button"
                onClick={() => setModalProduct(product)}
                title="View Details"
              >
                <FaInfoCircle />
              </button>
              <button
                className={`compare-button ${isSelected ? 'selected' : ''}`}
                onClick={() => handleProductSelect(product)}
                title={isSelected ? "Remove from comparison" : "Add to comparison"}
              >
                {isSelected ? <MdCheckCircle color="#8cc63f" size={20} /> : <MdCompareArrows />}
              </button>
            </div>
          </div>
        );
      });
  };

  const totalInvestment = shortTermInvestment + intermediateInvestment + longTermInvestment + neverInvestment;
  const totalReturn =
    calculateCDReturn(shortTermInvestment, 12, 0.04) +
    calculateCDReturn(intermediateInvestment, 36, 0.045) +
    annuityProducts.reduce((sum, product) => {
      const rate = getRateForInvestment(longTermInvestment, product);
      return sum + calculateAnnuityReturn(longTermInvestment, product.data.termYears, rate, product.data.bonusRate);
    }, 0) +
    calculateLifeInsuranceReturn(neverInvestment, age, gender, tobaccoUse);
  const totalGrowth = totalReturn - totalInvestment;

  const lineColors = ['#8cc63f', '#4a90e2', '#f39c12', '#9b59b6'];

  // Helper to get a label for each product
  const getProductLabel = (product: any) => {
    if (product.data?.productName) return product.data.productName;
    if (product.type === 'cd') return `${product.termMonths || 0}mo CD`;
    if (product.type === 'lifeInsurance') return 'Life Insurance';
    if (product.type === 'annuity') return product.data?.productName || 'Annuity';
    if (product.type === 'moneyMarket') return product.data?.productName || 'Money Market';
    return 'Product';
  };

  // Helper to get growth data for each product
  const getComparisonGrowthData = (product: any, investment: number, age: number, gender: string, tobaccoUse: string) => {
    if (product.type === 'cd' || product.termMonths) {
      const months = product.termMonths || 12;
      const rate = product.rate || 0.04;
      return getGrowthData({ investment, rate, termMonths: months, interval: 'month' });
    }
    if (product.type === 'moneyMarket') {
      // Use 5 years for long, 3 for intermediate, 1 for short
      let years = 1;
      if (product.termType === 'intermediate') years = 3;
      if (product.termType === 'long') years = 5;
      const rate = getRateForInvestment(investment, product);
      return getGrowthData({ investment, rate, termMonths: years * 12, interval: 'month' });
    }
    if (product.type === 'annuity') {
      const rate = getRateForInvestment(investment, product);
      return getGrowthData({ investment, rate, termYears: product.data.termYears, interval: 'year' });
    }
    if (product.type === 'lifeInsurance') {
      // Use 30 years for life insurance
      let baseRate = 0.04;
      if (age < 30) baseRate += 0.01;
      else if (age > 60) baseRate -= 0.01;
      if (gender === 'female') baseRate += 0.005;
      if (tobaccoUse === 'yes') baseRate -= 0.01;
      return getGrowthData({ investment, rate: baseRate, termYears: 30, interval: 'year' });
    }
    return [];
  };

  // Modal component
  const ProductModal = ({ product, onClose }: { product: any, onClose: () => void }) => {
    if (!product) return null;
    // Helper to render fields
    const renderField = (label: string, value: any) => (
      <div className="modal-field">
        <span className="modal-label">{label}</span>
        <span className="modal-value">{value}</span>
      </div>
    );
    // Helper to render a rates table
    const renderRatesTable = (rates: any[], type: 'rateGrid' | 'bands') => {
      if (!rates || !rates.length) return null;
      return (
        <div className="modal-rates-table-wrapper">
          <h3 className="modal-table-title">Rates</h3>
          <table className="modal-rates-table">
            <thead>
              <tr>
                <th>Min Amount</th>
                <th>Max Amount</th>
                <th>Rate</th>
              </tr>
            </thead>
            <tbody>
              {rates.map((row, i) => (
                <tr key={i}>
                  <td>{row.minAmount !== undefined ? `$${row.minAmount.toLocaleString()}` : row.min !== undefined ? `$${row.min.toLocaleString()}` : '-'}</td>
                  <td>{row.maxAmount !== undefined ? `$${row.maxAmount.toLocaleString()}` : row.max !== undefined ? `$${row.max.toLocaleString()}` : '-'}</td>
                  <td>{row.rate !== undefined ? `${(row.rate * 100).toFixed(2)}%` : '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    };
    // CD
    if (product.type === 'cd' || product.termMonths) {
      return (
        <div className="modal-overlay" onClick={onClose}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={onClose}>&times;</button>
            <h2>Certificate of Deposit</h2>
            <div className="modal-details-grid">
              {renderField('Term', `${product.termMonths || 0} months`)}
              {renderField('Rate', product.rate ? `${(product.rate * 100).toFixed(2)}%` : '—')}
            </div>
            {renderRatesTable(product.data?.rateGrid, 'rateGrid')}
            {renderRatesTable(product.data?.bands, 'bands')}
          </div>
        </div>
      );
    }
    // Money Market
    if (product.type === 'moneyMarket') {
      return (
        <div className="modal-overlay" onClick={onClose}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={onClose}>&times;</button>
            <h2>{product.data?.productName || 'Money Market Account'}</h2>
            <div className="modal-details-grid">
              {renderField('Institution', product.data?.institution || '—')}
              {renderField('Minimum Balance', `$${(product.data?.minimumBalance || 0).toLocaleString()}`)}
              {renderField('Compounding', 'Monthly')}
              {renderField('Type', 'Money Market Account')}
            </div>
            {renderRatesTable(product.data?.rateGrid, 'rateGrid')}
            {renderRatesTable(product.data?.bands, 'bands')}
          </div>
        </div>
      );
    }
    // Annuity
    if (product.type === 'annuity') {
      return (
        <div className="modal-overlay" onClick={onClose}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={onClose}>&times;</button>
            <h2>{product.data?.productName || 'Annuity'}</h2>
            <div className="modal-details-grid">
              {renderField('Carrier', product.data?.carrier || '—')}
              {renderField('Term', `${product.data?.termYears || 0} years`)}
              {renderField('Bonus Rate', product.data?.bonusRate ? `${(product.data.bonusRate * 100).toFixed(2)}%` : '—')}
              {renderField('Guarantee', product.data?.guaranteePeriod ? `${product.data.guaranteePeriod} years` : '—')}
            </div>
            {renderRatesTable(product.data?.rateGrid, 'rateGrid')}
            {renderRatesTable(product.data?.bands, 'bands')}
          </div>
        </div>
      );
    }
    // Life Insurance
    if (product.type === 'lifeInsurance') {
      return (
        <div className="modal-overlay" onClick={onClose}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={onClose}>&times;</button>
            <h2>Whole Life Insurance</h2>
            <div className="modal-details-grid">
              {renderField('Term', 'Lifetime')}
              {renderField('Base Rate', '4.00%')}
              {renderField('Age', product.age)}
              {renderField('Gender', product.gender)}
              {renderField('Tobacco Use', product.tobaccoUse === 'yes' ? 'Yes' : 'No')}
              {renderField('Age Adjustment', product.age < 30 ? '+1.00%' : product.age > 60 ? '-1.00%' : '0.00%')}
              {renderField('Gender Adjustment', product.gender === 'female' ? '+0.50%' : '0.00%')}
              {renderField('Tobacco Adjustment', product.tobaccoUse === 'yes' ? '-1.00%' : '0.00%')}
            </div>
          </div>
        </div>
      );
    }
    // Fallback
    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content" onClick={e => e.stopPropagation()}>
          <button className="modal-close" onClick={onClose}>&times;</button>
          <h2>Product Details</h2>
          <div className="modal-details-grid">
            {Object.entries(product).map(([key, value]) => renderField(key, typeof value === 'object' ? JSON.stringify(value) : String(value)))}
          </div>
        </div>
      </div>
    );
  };

  // Add the floating compare tab
  const CompareTab = () => {
    if (selectedProducts.length === 0) return null;

    return (
      <div className="compare-tab" onClick={() => setIsCompareModalOpen(true)}>
        <img src="/clippy.png" alt="Clippy" className="compare-icon" style={{ width: 24, height: 24 }} />
        <span className="counter">{selectedProducts.length}</span>
      </div>
    );
  };

  // Add CompareModal shell
  const CompareModal = ({ open, onClose }: { open: boolean, onClose: () => void }) => {
    if (!open) return null;
    // Prepare chart data
    const chartLines = selectedProducts.map((product, idx) => {
      let investment = 0;
      if (product.type === 'cd') investment = tab === 0 ? shortTermInvestment : tab === 1 ? intermediateInvestment : longTermInvestment;
      if (product.type === 'moneyMarket') investment = tab === 0 ? shortTermInvestment : tab === 1 ? intermediateInvestment : longTermInvestment;
      if (product.type === 'annuity') investment = longTermInvestment;
      if (product.type === 'lifeInsurance') investment = neverInvestment;
      const data = getComparisonGrowthData(product, investment, age, gender, tobaccoUse);
      return { label: getProductLabel(product), color: lineColors[idx % lineColors.length], data };
    });
    // Find the longest data length for x-axis
    const maxLength = Math.max(...chartLines.map(l => l.data.length));
    // Build a unified data array for recharts
    const chartData = Array.from({ length: maxLength }).map((_, i) => {
      const entry: any = { x: i };
      chartLines.forEach((line, idx) => {
        entry[line.label] = line.data[i]?.value || null;
        if (line.data[i]?.time !== undefined) entry.x = line.data[i].time;
      });
      return entry;
    });
    // Custom dot for the last valid point of each line, with collision avoidance for labels
    const EndDot = (props: any) => {
      const { cx, cy, index, data, dataKey, stroke, chartLines } = props;
      const lastValidIndex = [...data].reverse().findIndex((d: any) => d[dataKey] !== null && d[dataKey] !== undefined);
      const trueLastIndex = lastValidIndex === -1 ? -1 : data.length - 1 - lastValidIndex;
      if (index !== trueLastIndex) return null;
      const value = data[index][dataKey];
      const isFarRight = index === data.length - 1;

      // Alternate label position above/below if endpoints are close vertically
      let labelYOffset = -8; // default: above
      if (chartLines && props.x !== undefined && props.y !== undefined && props.width !== undefined && props.height !== undefined && props.yDomain && props.yDomain[0] !== undefined && props.yDomain[1] !== undefined) {
        // Calculate all endpoint Y positions
        const allPoints = chartLines.map((line: any) => {
          const lastIdx = [...data].reverse().findIndex((d: any) => d[line.label] !== null && d[line.label] !== undefined);
          const idx = lastIdx === -1 ? -1 : data.length - 1 - lastIdx;
          return {
            cy: data[idx] && data[idx][line.label] !== null ? props.y + (1 - (data[idx][line.label] - props.yDomain[0]) / (props.yDomain[1] - props.yDomain[0])) * props.height : null,
            label: line.label
          };
        });
        // Sort by cy so stacking is consistent
        const sortedPoints = allPoints.filter((pt: any) => pt.cy !== null).sort((a: any, b: any) => (a.cy as number) - (b.cy as number));
        // Find this label's index in the sorted stack
        const thisIdx = sortedPoints.findIndex((pt: any) => pt.label === dataKey);
        // If any other label is within 24px vertically, alternate above/below
        let closeCount = 0;
        for (let i = 0; i < sortedPoints.length; i++) {
          if (i !== thisIdx && Math.abs((sortedPoints[thisIdx].cy as number) - (sortedPoints[i].cy as number)) < 24) {
            closeCount++;
          }
        }
        if (closeCount > 0) {
          // Even index: above, Odd index: below
          labelYOffset = (thisIdx % 2 === 0) ? -18 : 22;
        }
      }

      return (
        <g>
          <circle cx={cx} cy={cy} r={6} fill={stroke} stroke="#fff" strokeWidth={2} />
          <text x={isFarRight ? cx - 8 : cx + 8} y={cy + labelYOffset} fontSize="0.95rem" fill={stroke} fontWeight="bold" alignmentBaseline="middle" textAnchor={isFarRight ? 'end' : 'start'}>{`$${Math.round(value).toLocaleString()}`}</text>
        </g>
      );
    };
    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content" onClick={e => e.stopPropagation()}>
          <button className="modal-close" onClick={onClose}>&times;</button>
          <h2>Compare Products</h2>
          <div style={{ width: '100%', height: 340, margin: '2rem 0' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="x" tick={{ fontSize: 13 }} label={{ value: 'Time', position: 'insideBottom', offset: -5 }} />
                <YAxis tickFormatter={v => `$${Math.round(v).toLocaleString()}`} tick={{ fontSize: 13 }} label={{ value: 'Growth ($)', angle: -90, position: 'insideLeft', offset: 10 }} />
                <Tooltip formatter={(v: string | number) => `$${Math.round(Number(v)).toLocaleString()}`} />
                <Legend />
                {chartLines.map((line, idx) => (
                  <Line
                    key={line.label}
                    type="monotone"
                    dataKey={line.label}
                    stroke={line.color}
                    strokeWidth={3}
                    dot={<EndDot dataKey={line.label} data={chartData} stroke={line.color} chartLines={chartLines} />}
                    activeDot={{ r: 7 }}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      {modalProduct && (
        <ProductModal product={modalProduct} onClose={() => setModalProduct(null)} />
      )}
      <CompareModal open={isCompareModalOpen} onClose={() => setIsCompareModalOpen(false)} />
      <CompareTab />
      <div className="results-container">
        <h2>Investment Results</h2>
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
          <Tabs
            value={tab}
            onChange={(_, v) => setTab(v)}
            aria-label="Investment Term Tabs"
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
              icon={<MdSavings style={{ fontSize: 22, marginRight: 8, color: '#8cc63f' }} />} iconPosition="start"
              label="Short Term"
              sx={{
                textTransform: 'none',
                fontWeight: 600,
                fontSize: '1rem',
                color: tab === 0 ? 'var(--color-primary)' : '#64748b',
                minHeight: 0,
                '&.Mui-selected': {
                  color: 'var(--color-primary)',
                },
                '&:hover': {
                  background: 'rgba(140,198,63,0.08)',
                  color: 'var(--color-primary)',
                },
                '&.Mui-focusVisible': {
                  outline: '2px solid var(--color-primary)',
                  outlineOffset: '2px',
                  background: 'rgba(140,198,63,0.10)',
                },
              }}
            />
            <Tab
              icon={<FaChartLine style={{ fontSize: 20, marginRight: 8, color: '#4a90e2' }} />} iconPosition="start"
              label="Intermediate Term"
              sx={{
                textTransform: 'none',
                fontWeight: 600,
                fontSize: '1rem',
                color: tab === 1 ? 'var(--color-primary)' : '#64748b',
                minHeight: 0,
                '&.Mui-selected': {
                  color: 'var(--color-primary)',
                },
                '&:hover': {
                  background: 'rgba(140,198,63,0.08)',
                  color: 'var(--color-primary)',
                },
                '&.Mui-focusVisible': {
                  outline: '2px solid var(--color-primary)',
                  outlineOffset: '2px',
                  background: 'rgba(140,198,63,0.10)',
                },
              }}
            />
            <Tab
              icon={<GiDuration style={{ fontSize: 22, marginRight: 8, color: '#f39c12' }} />} iconPosition="start"
              label="Long Term"
              sx={{
                textTransform: 'none',
                fontWeight: 600,
                fontSize: '1rem',
                color: tab === 2 ? 'var(--color-primary)' : '#64748b',
                minHeight: 0,
                '&.Mui-selected': {
                  color: 'var(--color-primary)',
                },
                '&:hover': {
                  background: 'rgba(140,198,63,0.08)',
                  color: 'var(--color-primary)',
                },
                '&.Mui-focusVisible': {
                  outline: '2px solid var(--color-primary)',
                  outlineOffset: '2px',
                  background: 'rgba(140,198,63,0.10)',
                },
              }}
            />
            <Tab
              icon={<FaShieldAlt style={{ fontSize: 20, marginRight: 8, color: '#9b59b6' }} />} iconPosition="start"
              label="Maybe Never / Leave On"
              sx={{
                textTransform: 'none',
                fontWeight: 600,
                fontSize: '1rem',
                color: tab === 3 ? 'var(--color-primary)' : '#64748b',
                minHeight: 0,
                '&.Mui-selected': {
                  color: 'var(--color-primary)',
                },
                '&:hover': {
                  background: 'rgba(140,198,63,0.08)',
                  color: 'var(--color-primary)',
                },
                '&.Mui-focusVisible': {
                  outline: '2px solid var(--color-primary)',
                  outlineOffset: '2px',
                  background: 'rgba(140,198,63,0.10)',
                },
              }}
            />
          </Tabs>
        </Box>
        {tab === 0 && (
          <div className="investment-section">
            <h3>Short Term (Less than 1 year)</h3>
            <div className="product-cards">
              {renderMoneyMarketCards(shortTermInvestment, 'short')}
              {renderCDCard(shortTermInvestment, 12, 0.04)}
            </div>
          </div>
        )}
        {tab === 1 && (
          <div className="investment-section">
            <h3>Intermediate Term (2 to 5 years)</h3>
            <div className="product-cards">
              {renderMoneyMarketCards(intermediateInvestment, 'intermediate')}
              {renderCDCard(intermediateInvestment, 36, 0.045)}
            </div>
          </div>
        )}
        {tab === 2 && (
          <div className="investment-section">
            <h3>Long Term (5+ years)</h3>
            <div className="subsection">
              <h4>Fixed Rate Options</h4>
              <div className="product-cards">
                {renderMoneyMarketCards(longTermInvestment, 'long')}
                {renderCDCard(longTermInvestment, 60, 0.05)}
              </div>
            </div>
            <div className="subsection">
              <h4>Annuity Options</h4>
              <div className="product-cards">
                {renderAnnuityCards(longTermInvestment)}
              </div>
            </div>
          </div>
        )}
        {tab === 3 && (
          <div className="investment-section">
            <h3>Maybe Never / Leave On</h3>
            <div className="product-cards">
              {renderLifeInsuranceCard(neverInvestment)}
            </div>
          </div>
        )}
        <div className="total-results">
          <h3>Total Investment Summary</h3>
          <p>Total Investment: ${totalInvestment.toLocaleString()}</p>
          <p>Total Projected Return: ${Math.round(totalReturn).toLocaleString()}</p>
          <p>Total Growth: ${Math.round(totalGrowth).toLocaleString()}</p>
        </div>
      </div>
    </>
  );
};

export default Results; 