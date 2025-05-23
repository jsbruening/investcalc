import React from 'react';
import { MdSavings } from 'react-icons/md';
import { FaPiggyBank, FaShieldAlt, FaChartLine, FaInfoCircle, FaBalanceScale } from 'react-icons/fa';
import { GiReceiveMoney } from 'react-icons/gi';

interface ProductCardProps {
  type: string;
  productName: string;
  termCircle: string;
  projectedValue: number;
  investment: number;
  rate: number;
  isSelected?: boolean;
  onDetailsClick: () => void;
  onCompareClick: () => void;
  termType?: string;
}

const ProductCard: React.FC<ProductCardProps> = ({
  type,
  productName,
  termCircle,
  projectedValue,
  investment,
  rate,
  isSelected = false,
  onDetailsClick,
  onCompareClick,
  termType
}) => {
  const getProductIcon = () => {
    switch (type) {
      case 'cd':
        return <MdSavings className="w-6 h-6 text-green-500" />;
      case 'moneyMarket':
        return <FaPiggyBank className="w-6 h-6 text-blue-500" />;
      case 'annuity':
        return <GiReceiveMoney className="w-6 h-6 text-yellow-500" />;
      case 'lifeInsurance':
        return <FaShieldAlt className="w-6 h-6 text-purple-500" />;
      default:
        return null;
    }
  };

  const getProductColor = () => {
    switch (type) {
      case 'cd':
        return 'green';
      case 'moneyMarket':
        return 'blue';
      case 'annuity':
        return 'yellow';
      case 'lifeInsurance':
        return 'purple';
      default:
        return 'gray';
    }
  };

  // Get background color class for each product type
  const getProductBgClass = () => {
    switch (type) {
      case 'cd':
        return 'bg-green-50';
      case 'moneyMarket':
        return 'bg-blue-50';
      case 'annuity':
        return 'bg-yellow-50';
      case 'lifeInsurance':
        return 'bg-purple-50';
      default:
        return 'bg-gray-50';
    }
  };

  // Map product type to border color
  const borderColorMap: Record<string, string> = {
    cd: 'rgba(34,197,94,0.7)', // green-500
    moneyMarket: 'rgba(59,130,246,0.7)', // blue-500
    annuity: 'rgba(245,158,11,0.7)', // yellow-500
    lifeInsurance: 'rgba(139,92,246,0.7)', // purple-500
    default: 'rgba(107,114,128,0.7)', // gray-500
  };
  const borderColor = borderColorMap[type] || borderColorMap.default;
  const borderStyle = {
    borderLeft: `8px solid ${borderColor}`,
  };
  const shadowClass = `shadow-[0_4px_24px_0_rgba(34,197,94,0.10)]`;
  const bgClass = getProductBgClass();

  // Icon overlay style
  const overlayIconStyle: React.CSSProperties = {
    position: 'absolute',
    top: 24,
    right: 24,
    opacity: 0.12,
    pointerEvents: 'none',
    zIndex: 0,
    transform: 'scale(2.5) rotate(45deg)',
    lineHeight: 1,
  };

  // Get a large icon for overlay
  const overlayIcon = React.cloneElement(
    getProductIcon() as React.ReactElement,
    { size: 180, width: 180, height: 180 } as any
  );

  const growth = projectedValue - investment;
  const growthPercentage = ((growth / investment) * 100).toFixed(1);

  return (
    <div
      className={`relative rounded-lg border-2 transition-all duration-200 ${bgClass} ${shadowClass} ${isSelected ? 'border-green-500 shadow-md' : ''} hover:shadow-md`}
      style={borderStyle}
    >
      {/* Icon overlay */}
      <div style={overlayIconStyle}>{overlayIcon}</div>
      <div className="p-4 pb-14 relative z-10">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-base font-semibold text-gray-900">{productName}</h3>
            <div className="flex items-center gap-1 mt-0.5">
              <span className="text-xs text-gray-500">Term:</span>
              <span className="px-1.5 py-0.5 bg-white rounded-full text-xs font-medium text-gray-700 border border-gray-200">
                {termCircle}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mt-4">
          <div>
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <FaChartLine className="w-3 h-3" />
              <span>Investment</span>
            </div>
            <div className="mt-0.5 text-base font-semibold text-gray-900">
              ${investment.toLocaleString()}
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <FaInfoCircle className="w-3 h-3" />
              <span>Rate</span>
            </div>
            <div className="mt-0.5 text-base font-semibold text-gray-900">
              {(rate * 100).toFixed(2)}%
            </div>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-gray-100">
          <div className="flex justify-between items-center">
            <div>
              <div className="text-xs text-gray-500">Projected Value</div>
              <div className="text-lg font-bold text-gray-900">
                ${Math.round(projectedValue).toLocaleString()}
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs text-gray-500">Growth</div>
              <div className="text-lg font-bold text-green-600">
                +${Math.round(growth).toLocaleString()}
              </div>
              <div className="text-xs text-green-600">({growthPercentage}%)</div>
            </div>
          </div>
        </div>

        {/* Action buttons bottom right */}
        <div className="absolute bottom-4 right-4 flex gap-2 z-20">
          <button
            onClick={onCompareClick}
            className={`
              p-2 rounded-full transition-colors duration-200 shadow-sm
              ${isSelected
                ? 'bg-green-100 text-green-600 hover:bg-green-200'
                : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
              }
            `}
            title="Compare"
          >
            <FaBalanceScale className="w-5 h-5" />
          </button>
          <button
            onClick={onDetailsClick}
            className="p-2 rounded-full bg-gray-100 text-gray-400 hover:bg-gray-200 transition-colors duration-200 shadow-sm"
            title="View Details"
          >
            <FaInfoCircle className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard; 