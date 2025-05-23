import React, { useState, useMemo } from 'react';
import { products } from '../data/products';
import ProductCard from './ProductCard';
import ProductModal from './ProductModal';
import ComparisonModal from './ComparisonModal';
import InvestmentTabs from './InvestmentTabs';
import TotalSummary from './TotalSummary';
import AdvisorCard from './AdvisorCard';
import { FaUserTie, FaEnvelope, FaPhone, FaUserCircle } from 'react-icons/fa';
import { MdSavings } from 'react-icons/md';
import { FaPiggyBank, FaShieldAlt } from 'react-icons/fa';
import { GiReceiveMoney } from 'react-icons/gi';
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
  const rate = 0.04; // Default rate
  return investment * Math.pow(1 + rate, 30);
};

const calculateMoneyMarketReturn = (investment: number, rate: number) => {
  return investment * Math.pow(1 + rate, 30); // Show 30-year projection
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
    <div
      className="fixed right-0 top-1/2 -translate-y-1/2 bg-green-600 text-white rounded-l-lg px-4 py-3 shadow-lg flex items-center gap-2 cursor-pointer transition-all hover:bg-green-700 z-50 backdrop-blur-sm"
      onClick={onClick}
    >
      <img src="/clippy.png" alt="Clippy" className="w-6 h-6" />
      <span className="bg-white text-green-600 rounded-full px-2 py-0.5 text-sm font-semibold min-w-[24px] text-center">
        {count}
      </span>
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
    let id;
    if (product.type === 'cd') {
      id = `cd-${product.termMonths}-${product.rate}`;
    } else {
      id = product._id || product.data?.productName || product.productName;
    }
    setSelectedProducts(prev => {
      if (prev.some(p => {
        if (product.type === 'cd') {
          return `cd-${p.termMonths}-${p.rate}` === id;
        } else {
          return (p._id || p.data?.productName || p.productName) === id;
        }
      })) {
        return prev.filter(p => {
          if (product.type === 'cd') {
            return `cd-${p.termMonths}-${p.rate}` !== id;
          } else {
            return (p._id || p.data?.productName || p.productName) !== id;
          }
        });
      }
      // Calculate projectedValue for the selected product
      let projectedValue = product.projectedValue;
      if (projectedValue === undefined) {
        if (product.type === 'cd') {
          projectedValue = calculateCDReturn(investment, product.termMonths, rate);
        } else if (product.type === 'annuity') {
          projectedValue = calculateAnnuityReturn(investment, product.data.termYears, rate, product.data.bonusRate);
        } else if (product.type === 'moneyMarket') {
          const years = product.termType === 'short' ? 1 : product.termType === 'intermediate' ? 3 : 5;
          projectedValue = calculateMoneyMarketReturn(investment, rate);
        } else if (product.type === 'lifeInsurance') {
          projectedValue = calculateLifeInsuranceReturn(investment, age, gender, tobaccoUse);
        }
      }
      return [...prev, { ...product, investment, rate, projectedValue }];
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

    const cdId = `cd-${termMonths}-${rate}`;
    const isSelected = selectedProducts.some(p => p.type === 'cd' && `cd-${p.termMonths}-${p.rate}` === cdId);

    return (
      <ProductCard
        key={`cd-${termMonths}-${rate}`}
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
      .filter(product => product.termType === 'open')
      .map((product) => {
        const rate = getRateForInvestment(investment, product);
        const result = calculateMoneyMarketReturn(investment, rate);
        const isSelected = selectedProducts.some(p => p._id === product._id);

        // Attach investment and rate for comparison
        const moneyMarketProduct = {
          ...product,
          investment,
          rate,
        };

        return (
          <ProductCard
            key={product._id}
            type="moneyMarket"
            productName={product.data.productName}
            termCircle={getTermCircle(product)}
            projectedValue={result}
            investment={investment}
            rate={rate}
            isSelected={isSelected}
            onDetailsClick={() => setModalProduct(product)}
            onCompareClick={() => handleProductSelect(moneyMarketProduct, investment, rate)}
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

  const getProductIcon = (type: string) => {
    switch (type) {
      case 'cd': return <MdSavings className="text-green-500 text-xl" />;
      case 'moneyMarket': return <FaPiggyBank className="text-blue-500 text-xl" />;
      case 'annuity': return <GiReceiveMoney className="text-yellow-500 text-xl" />;
      case 'lifeInsurance': return <FaShieldAlt className="text-purple-500 text-xl" />;
      default: return null;
    }
  };

  const years = Array.from({ length: 20 }, (_, i) => i + 1);
  const chartDataLine = {
    labels: years.map(year => `Year ${year}`),
    datasets: [
      {
        label: 'Short Term',
        data: years.map(year => shortTermInvestment * Math.pow(1.05, year)),
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.5)',
        tension: 0.4
      },
      {
        label: 'Intermediate Term',
        data: years.map(year => intermediateInvestment * Math.pow(1.06, year)),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        tension: 0.4
      },
      {
        label: 'Long Term',
        data: years.map(year => longTermInvestment * Math.pow(1.07, year)),
        borderColor: 'rgb(245, 158, 11)',
        backgroundColor: 'rgba(245, 158, 11, 0.5)',
        tension: 0.4
      },
      {
        label: 'Never Term',
        data: years.map(year => neverInvestment * Math.pow(1.08, year)),
        borderColor: 'rgb(139, 92, 246)',
        backgroundColor: 'rgba(139, 92, 246, 0.5)',
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
        text: 'Investment Growth Projection'
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

  const investmentSummary = [
    { label: 'Short Term', value: shortTermInvestment, type: 'cd' },
    { label: 'Intermediate Term', value: intermediateInvestment, type: 'cd' },
    { label: 'Long Term', value: longTermInvestment, type: 'cd' },
    { label: 'Never Term', value: neverInvestment, type: 'lifeInsurance' }
  ];

  // New tab labels
  const termTabs = ['Short Term', 'Intermediate Term', 'Long Term', 'Maybe Never'];

  // Helper to filter products for each tab
  const getProductsForTab = (tabIdx: number) => {
    switch (tabIdx) {
      case 0: // Short Term
        return [
          // CDs < 24 months
          ...products.filter(p => p.type === 'cd' && ((p.data?.termMonths ?? 12) < 24)),
          // Money Markets (open)
          ...products.filter(p => p.type === 'moneyMarket'),
        ];
      case 1: // Intermediate Term
        return [
          // CDs 24 <= termMonths < 60
          ...products.filter(p => p.type === 'cd' && ((p.data?.termMonths ?? 12) >= 24 && (p.data?.termMonths ?? 12) < 60)),
          // Money Markets (open)
          ...products.filter(p => p.type === 'moneyMarket'),
        ];
      case 2: // Long Term
        return [
          // CDs >= 60 months
          ...products.filter(p => p.type === 'cd' && ((p.data?.termMonths ?? 12) >= 60)),
          // Money Markets (open)
          ...products.filter(p => p.type === 'moneyMarket'),
          // Annuities
          ...products.filter(p => p.type === 'annuity'),
        ];
      case 3: // Maybe Never
        return [
          // Life Insurance only
          ...products.filter(p => p.type === 'lifeInsurance'),
        ];
      default:
        return [];
    }
  };

  return (
    <div className="w-full px-2 md:px-8">
      <div className="p-6 w-full">
        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {termTabs.map((label, idx) => (
            <button
              key={label}
              onClick={() => setTab(idx)}
              className={`px-4 py-2 rounded ${tab === idx ? 'bg-gray-200 font-bold' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="mb-8">
          <div className="space-y-8">
            {/* CDs Section */}
            {getProductsForTab(tab).filter(product => product.type === 'cd').length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <MdSavings className="w-5 h-5 text-green-500" />
                  <h3 className="text-lg font-semibold text-gray-900">Certificates of Deposit</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {getProductsForTab(tab)
                    .filter(product => product.type === 'cd')
                    .map(product => {
                      const termMonths = product.data?.termMonths ?? 12;
                      const rate = product.data?.rate ?? 0.04;
                      return renderCDCard(
                        tab === 0 ? shortTermInvestment : tab === 1 ? intermediateInvestment : longTermInvestment,
                        termMonths,
                        rate,
                        product
                      );
                    })}
                </div>
              </div>
            )}

            {/* Money Market Section */}
            {getProductsForTab(tab).filter(product => product.type === 'moneyMarket').length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <FaPiggyBank className="w-5 h-5 text-blue-500" />
                  <h3 className="text-lg font-semibold text-gray-900">Money Market Accounts</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {getProductsForTab(tab)
                    .filter(product => product.type === 'moneyMarket')
                    .map(product => {
                      if (product._id === 'money-market-1') {
                        const investment = tab === 0 ? shortTermInvestment : tab === 1 ? intermediateInvestment : longTermInvestment;
                        return renderMoneyMarketCards(investment, 'open');
                      }
                      return null;
                    })}
                </div>
              </div>
            )}

            {/* Annuities Section */}
            {tab === 2 && annuityProducts.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <GiReceiveMoney className="w-5 h-5 text-yellow-500" />
                  <h3 className="text-lg font-semibold text-gray-900">Annuities</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {renderAnnuityCards(longTermInvestment)}
                </div>
              </div>
            )}

            {/* Life Insurance Section */}
            {tab === 3 && (
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <FaShieldAlt className="w-5 h-5 text-purple-500" />
                  <h3 className="text-lg font-semibold text-gray-900">Life Insurance</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {renderLifeInsuranceCard(neverInvestment)}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <CompareTab count={selectedProducts.length} onClick={() => setIsCompareModalOpen(true)} />

      {modalProduct && (
        <ProductModal
          product={{
            type: modalProduct.type,
            name: modalProduct.data?.productName || modalProduct.productName || 'Product',
            termCircle: getTermCircle(modalProduct),
            projectedValue: modalProduct.projectedValue || 0,
            investment: modalProduct.investment || shortTermInvestment,
            rate: modalProduct.rate || 0,
            data: modalProduct.data
          }}
          onClose={() => setModalProduct(null)}
        />
      )}

      {isCompareModalOpen && (
        <ComparisonModal
          products={selectedProducts.map(p => ({
            name: p.data?.productName || p.productName || p.name || 'Product',
            type: p.type,
            projectedValue: p.projectedValue,
            investment: p.investment,
            rate: p.rate,
            ...(p.type === 'cd' && { termMonths: p.termMonths }),
            ...(p.type === 'annuity' && { termYears: p.termYears }),
          }))}
          onClose={() => setIsCompareModalOpen(false)}
          age={age}
          gender={gender}
          tobaccoUse={tobaccoUse}
        />
      )}
    </div>
  );
};

export default Results; 