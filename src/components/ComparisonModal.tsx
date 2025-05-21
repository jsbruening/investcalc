import React from 'react';
import { FaTimes } from 'react-icons/fa';
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid } from 'recharts';
import { MdSavings } from 'react-icons/md';
import { FaPiggyBank, FaShieldAlt } from 'react-icons/fa';
import { GiReceiveMoney } from 'react-icons/gi';

interface ComparisonModalProps {
  open: boolean;
  onClose: () => void;
  selectedProducts: any[];
  chartData: any[];
  lineColors: string[];
}

const getProductIcon = (type: string) => {
  switch (type) {
    case 'cd': return <MdSavings style={{ color: '#2ecc71', fontSize: '1.1rem', marginRight: 6 }} />;
    case 'moneyMarket': return <FaPiggyBank style={{ color: '#4a90e2', fontSize: '1.1rem', marginRight: 6 }} />;
    case 'annuity': return <GiReceiveMoney style={{ color: '#f39c12', fontSize: '1.1rem', marginRight: 6 }} />;
    case 'lifeInsurance': return <FaShieldAlt style={{ color: '#9b59b6', fontSize: '1.1rem', marginRight: 6 }} />;
    default: return null;
  }
};

const ComparisonModal: React.FC<ComparisonModalProps> = ({
  open,
  onClose,
  selectedProducts,
  chartData,
  lineColors
}) => {
  if (!open) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content comparison-modal-wide" onClick={e => e.stopPropagation()}>
        <button className="close-button" onClick={onClose}>
          <FaTimes />
        </button>

        <div className="modal-header">
          <h3>Investment Comparison</h3>
        </div>

        <div className="modal-body comparison-modal-body-flex">
          <div className="comparison-chart-flex">
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="x" />
                <YAxis />
                <Tooltip formatter={(value: number) => `$${value.toLocaleString()}`} />
                <Legend />
                {selectedProducts.map((product, index) => (
                  <Line
                    key={product._id || index}
                    type="monotone"
                    dataKey={product.data?.productName || `${product.termMonths ? product.termMonths + '-Month CD' : `Product ${index + 1}`}`}
                    stroke={lineColors[index % lineColors.length]}
                    strokeWidth={2}
                    dot={false}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="comparison-table-flex">
            <table>
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Initial Investment</th>
                  <th>Projected Value</th>
                  <th>Growth</th>
                  <th>Rate</th>
                </tr>
              </thead>
              <tbody>
                {selectedProducts.map((product, index) => {
                  const key = product.data?.productName || `${product.termMonths ? product.termMonths + '-Month CD' : `Product ${index + 1}`}`;
                  // Find the last non-undefined value for this product in chartData
                  let value = undefined;
                  if (chartData.length > 0) {
                    for (let i = chartData.length - 1; i >= 0; i--) {
                      if (typeof chartData[i][key] === 'number' && isFinite(chartData[i][key])) {
                        value = chartData[i][key];
                        break;
                      }
                    }
                  }
                  const investment = typeof product.investment === 'number' && isFinite(product.investment)
                    ? product.investment
                    : undefined;
                  const growth = value !== undefined && investment !== undefined
                    ? value - investment
                    : undefined;
                  return (
                    <tr key={product._id || index}>
                      <td>
                        {getProductIcon(product.type)}
                        {key}
                      </td>
                      <td>{investment !== undefined ? `$${investment.toLocaleString()}` : '—'}</td>
                      <td>{value !== undefined ? `$${Math.round(value).toLocaleString()}` : '—'}</td>
                      <td>{growth !== undefined ? `+$${Math.round(growth).toLocaleString()}` : '—'}</td>
                      <td>{(product.rate * 100).toFixed(2)}%</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComparisonModal; 