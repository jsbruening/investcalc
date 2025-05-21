import React, { useState, useMemo } from 'react';
import { products } from '../data/products';
import ProductCard from './ProductCard';
import ProductModal from './ProductModal';
import ComparisonModal from './ComparisonModal';
import InvestmentTabs from './InvestmentTabs';
import TotalSummary from './TotalSummary';
import AdvisorCard from './AdvisorCard';
import { FaUserTie, FaEnvelope, FaPhone, FaUserCircle } from 'react-icons/fa';

interface ResultsProps {
  shortTermInvestment: number;
  intermediateInvestment: number;
  longTermInvestment: number;
  neverInvestment: number;
  age: number;
  gender: string;
  tobaccoUse: string;
}

// Utility functions
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
  let baseRate = 0.04;
  if (age < 30) baseRate += 0.01;
  else if (age > 60) baseRate -= 0.01;
  if (gender === 'female') baseRate += 0.005;
  if (tobaccoUse === 'yes') baseRate -= 0.01;
  return investment * Math.pow(1 + baseRate, 30);
};

const calculateMoneyMarketReturn = (investment: number, product: any, years: number) => {
  const rate = getRateForInvestment(investment, product);
  const monthlyRate = rate / 12;
  const months = years * 12;
  return investment * Math.pow(1 + monthlyRate, months);
};

const getRateForInvestment = (investment: number, product: any) => {
  if (!product?.data) return 0.04;

  if (product.data.rateGrid?.length) {
    const band = product.data.rateGrid.find((b: any) =>
      investment >= (b.minAmount || 0) &&
      investment <= (b.maxAmount || Infinity)
    );
    return band?.rate || product.data.rateGrid[0]?.rate || 0.04;
  }

  if (product.data.bands?.length) {
    const band = product.data.bands.find((b: any) =>
      investment >= (b.min || 0) &&
      investment <= (b.max || Infinity)
    );
    return band?.rate || product.data.bands[0]?.rate || 0.04;
  }

  return 0.04;
};

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

// Add this helper function after the existing utility functions
const generateGrowthData = (product: any, investment: number, age: number, gender: string, tobaccoUse: string) => {
  const data = [];
  let years = 30; // Default to 30 years for comparison
  let interval = 'year';

  // Determine the term and interval based on product type
  if (product.type === 'cd' || product.termMonths) {
    years = (product.termMonths || 12) / 12;
    interval = 'month';
  } else if (product.type === 'moneyMarket') {
    years = product.termType === 'short' ? 1 : product.termType === 'intermediate' ? 3 : 5;
    interval = 'month';
  } else if (product.type === 'annuity') {
    years = product.termYears || product.data?.termYears || 5;
    interval = 'year';
  }

  // Generate data points
  if (interval === 'month') {
    const months = years * 12;
    for (let m = 0; m <= months; m++) {
      let value;
      if (product.type === 'cd' || product.termMonths) {
        value = investment * Math.pow(1 + (product.rate || 0.04), m / 12);
      } else if (product.type === 'moneyMarket') {
        const rate = getRateForInvestment(investment, product);
        value = investment * Math.pow(1 + rate / 12, m);
      }
      data.push({ x: m, value });
    }
  } else {
    for (let y = 0; y <= years; y++) {
      let value;
      if (product.type === 'annuity') {
        const rate = product.rate !== undefined ? product.rate : getRateForInvestment(investment, product);
        value = calculateAnnuityReturn(investment, y, rate, product.data?.bonusRate || 0);
      } else if (product.type === 'lifeInsurance') {
        value = calculateLifeInsuranceReturn(investment, age, gender, tobaccoUse);
      }
      data.push({ x: y, value });
    }
  }

  return data;
};

// Add CompareTab component before the Results component
const CompareTab: React.FC<{ count: number; onClick: () => void }> = ({ count, onClick }) => {
  if (count === 0) return null;

  return (
    <div className="compare-tab" onClick={onClick}>
      <img src="/clippy.png" alt="Clippy" className="compare-icon" style={{ width: 24, height: 24 }} />
      <span className="counter">{count}</span>
    </div>
  );
};

const mockAdvisors = [
  {
    name: "Sarah Johnson",
    email: "sarah.johnson@advisor.com",
    phone: "(555) 123-4567",
    avatar: <FaUserCircle size={48} color="#7c3aed" />
  },
  {
    name: "Michael Chen",
    email: "michael.chen@advisor.com",
    phone: "(555) 987-6543",
    avatar: <FaUserCircle size={48} color="#4a90e2" />
  }
];

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

  const handleProductSelect = (product: any, investment: number, rate: number) => {
    const id = product._id || product.data?.productName || product.productName;
    setSelectedProducts(prev => {
      if (prev.some(p => (p._id || p.data?.productName || p.productName) === id)) {
        return prev.filter(p => (p._id || p.data?.productName || p.productName) !== id);
      }
      return [...prev, { ...product, investment, rate }];
    });
  };

  const renderCDCard = (investment: number, termMonths: number, rate: number, product?: any) => {
    const result = calculateCDReturn(investment, termMonths, rate);
    const cdProduct = {
      type: 'cd',
      termMonths,
      rate,
      data: {
        productName: `${termMonths}-Month CD`,
        description: `Certificate of Deposit with ${termMonths} month term`
      },
      ...product
    };

    const isSelected = selectedProducts.some(p =>
      product ? p._id === product._id :
        p.type === 'cd' && p.termMonths === termMonths && p.rate === rate
    );

    return (
      <ProductCard
        key={cdProduct.data.productName}
        type="cd"
        productName={cdProduct.data.productName}
        termCircle={getTermCircle(cdProduct)}
        projectedValue={result}
        investment={investment}
        rate={rate}
        isSelected={isSelected}
        onDetailsClick={() => setModalProduct(cdProduct)}
        onCompareClick={() => handleProductSelect(cdProduct, investment, rate)}
      />
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

      // Attach termYears, investment, and rate for comparison
      const annuityProduct = {
        ...product,
        investment,
        rate,
        termYears: product.data.termYears,
      };

      return (
        <ProductCard
          key={product._id}
          type="annuity"
          productName={product.data.productName}
          termCircle={getTermCircle(product)}
          projectedValue={result}
          investment={investment}
          rate={rate}
          isSelected={isSelected}
          onDetailsClick={() => setModalProduct(product)}
          onCompareClick={() => handleProductSelect(annuityProduct, investment, rate)}
        />
      );
    });
  };

  const renderLifeInsuranceCard = (investment: number) => {
    const result = calculateLifeInsuranceReturn(investment, age, gender, tobaccoUse);
    const product = { type: 'lifeInsurance', investment, age, gender, tobaccoUse };

    return (
      <ProductCard
        key="life-insurance"
        type="lifeInsurance"
        productName="Whole Life Insurance"
        termCircle={getTermCircle(product)}
        projectedValue={result}
        investment={investment}
        rate={0.04}
        isSelected={selectedProducts.some(p => p.type === 'lifeInsurance')}
        onDetailsClick={() => setModalProduct(product)}
        onCompareClick={() => handleProductSelect(product, investment, 0.04)}
      />
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
          <ProductCard
            key={product._id}
            type="moneyMarket"
            productName={product.data?.productName || 'Money Market'}
            termCircle={getTermCircle(product)}
            projectedValue={result}
            investment={investment}
            rate={rate}
            isSelected={isSelected}
            onDetailsClick={() => setModalProduct(product)}
            onCompareClick={() => handleProductSelect(product, investment, rate)}
            termType={termType}
          />
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

  // Update the chartData calculation
  const chartData = useMemo(() => {
    if (selectedProducts.length === 0) return [];

    // Generate growth data for each product
    const productData = selectedProducts.map(product => {
      let investment = product.investment;  // Use the stored investment
      let name = product.data?.productName;

      // Handle CD product name
      if (product.type === 'cd') {
        name = product.data?.productName || `${product.termMonths}-Month CD`;
      } else if (!name) {
        name = product.type === 'moneyMarket' ? 'Money Market' :
          product.type === 'annuity' ? 'Annuity' :
            product.type === 'lifeInsurance' ? 'Life Insurance' : `Product ${product._id || ''}`;
      }

      return {
        name,
        data: generateGrowthData(product, investment, age, gender, tobaccoUse)
      };
    });

    // Find the maximum number of data points
    const maxPoints = Math.max(...productData.map(p => p.data.length));

    // Create unified data array
    return Array.from({ length: maxPoints }).map((_, i) => {
      const entry: any = { x: i };
      productData.forEach(product => {
        const point = product.data[i];
        if (point) {
          entry[product.name] = point.value;
        }
      });
      return entry;
    });
  }, [selectedProducts, age, gender, tobaccoUse]);  // Remove tab and investment dependencies since we use stored values

  return (
    <>
      {modalProduct && (
        <ProductModal product={modalProduct} onClose={() => setModalProduct(null)} />
      )}
      <ComparisonModal
        open={isCompareModalOpen}
        onClose={() => setIsCompareModalOpen(false)}
        selectedProducts={selectedProducts}
        chartData={chartData}
        lineColors={lineColors}
      />
      <CompareTab
        count={selectedProducts.length}
        onClick={() => setIsCompareModalOpen(true)}
      />
      <div className="advisor-contact-dropdown">
        <button className="advisor-contact-btn">
          <FaUserTie size={24} />
          Contact Advisor
        </button>
        <div className="advisor-dropdown-content">
          {mockAdvisors.map((advisor, index) => (
            <div key={index} className="advisor-card">
              <div className="advisor-avatar">
                {advisor.avatar}
              </div>
              <div className="advisor-info">
                <div className="advisor-name">{advisor.name}</div>
                <div className="advisor-contact">
                  <FaEnvelope style={{ marginRight: 6, color: '#64748b' }} />
                  <a href={`mailto:${advisor.email}`}>{advisor.email}</a>
                </div>
                <div className="advisor-contact">
                  <FaPhone style={{ marginRight: 6, color: '#64748b' }} />
                  <a href={`tel:${advisor.phone}`}>{advisor.phone}</a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="results-container">
        <h2>Investment Results</h2>
        <div className="tabs-advisor-row">
          <InvestmentTabs value={tab} onChange={setTab} />
        </div>

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
            <div className="section-title-row">
              <h3>Long Term (5+ years)</h3>
            </div>
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

        <TotalSummary
          totalInvestment={totalInvestment}
          totalReturn={totalReturn}
          totalGrowth={totalGrowth}
        />
      </div>
    </>
  );
};

export default Results; 