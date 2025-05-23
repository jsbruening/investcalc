import React from 'react';
import { MdClose } from 'react-icons/md';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Label,
  ReferenceLine, LabelList
} from 'recharts';

interface ComparisonModalProps {
  products: Array<{
    name: string;
    type: string;
    projectedValue: number;
    investment: number;
    rate: number;
    termMonths?: number;
    termYears?: number;
  }>;
  age: number;
  gender: string;
  tobaccoUse: string;
  onClose: () => void;
}

const ComparisonModal: React.FC<ComparisonModalProps> = ({
  products,
  age,
  gender,
  tobaccoUse,
  onClose
}) => {
  // Find the longest term among only CDs and annuities
  const maxTerm = Math.max(
    ...products
      .filter(product => product.type === 'cd' || product.type === 'annuity')
      .map(product =>
        product.type === 'cd'
          ? (product.termMonths || 12) / 12
          : product.type === 'annuity'
            ? product.termYears || 10
            : 0
      ),
    1 // fallback to at least 1 year if no term-based products
  );

  // Generate chart data
  const chartData = Array.from({ length: maxTerm + 1 }, (_, year) => {
    const entry: { year: number;[key: string]: number | null } = { year };

    products.forEach(product => {
      let value: number | null = null;

      // Calculate value based on product type
      if (product.type === 'cd') {
        const termYears = (product.termMonths || 12) / 12;
        if (year <= termYears) {
          value = product.investment * Math.pow(1 + product.rate, year);
        }
      } else if (product.type === 'annuity') {
        const termYears = product.termYears || 10;
        const bonusRate = (product as any).bonusRate || 0;
        if (year <= termYears) {
          value = product.investment * Math.pow(1 + product.rate, year) + product.investment * bonusRate;
        }
      } else if (product.type === 'moneyMarket') {
        value = product.investment * Math.pow(1 + product.rate, year);
      } else if (product.type === 'lifeInsurance') {
        const rate = product.rate || 0.04;
        value = product.investment * Math.pow(1 + rate, year);
      }

      entry[product.name] = value;
    });

    return entry;
  });

  const lineColors = [
    '#8cc63f', '#4a90e2', '#f39c12', '#9b59b6', '#e74c3c', '#16a085', '#34495e', '#e67e22', '#2ecc71', '#1abc9c'
  ];

  const customerInfo = [
    { label: 'Age', value: age },
    { label: 'Gender', value: gender },
    { label: 'Tobacco Use', value: tobaccoUse }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-[80rem] w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-start mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Product Comparison</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 rounded-md"
            >
              <MdClose className="w-6 h-6" />
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-9 gap-8">
            <div className="lg:col-span-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Growth Projection (Years)</h3>
              <div className="bg-gray-50 rounded-lg p-4" style={{ height: 450 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData} margin={{ top: 40, right: 80, left: 40, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="year">
                      <Label value="Years" offset={-5} position="insideBottom" />
                    </XAxis>
                    <YAxis tickFormatter={v => `$${v.toLocaleString()}`} />
                    <Tooltip formatter={(v: number) => `$${Math.round(v).toLocaleString()}`} />
                    <Legend />
                    {products.map((product, idx) => (
                      <Line
                        key={product.name}
                        type="monotone"
                        dataKey={product.name}
                        stroke={lineColors[idx % lineColors.length]}
                        strokeWidth={3}
                        dot={(props: any) => {
                          const year = props.payload.year;
                          const value = props.payload[product.name];
                          const term = product.type === 'cd'
                            ? (product.termMonths || 12) / 12
                            : product.type === 'annuity'
                              ? (product.termYears || 10)
                              : maxTerm;
                          if (
                            value != null &&
                            (year === 0 || year === term || year % 5 === 0)
                          ) {
                            return <circle cx={props.cx} cy={props.cy} r={4} fill={lineColors[idx % lineColors.length]} />;
                          }
                          return <circle cx={props.cx} cy={props.cy} r={0} />;
                        }}
                        activeDot={{ r: 8 }}
                        connectNulls={false}
                      >
                        <LabelList
                          dataKey={product.name}
                          content={(props) => {
                            const { index, value, x, y } = props;
                            const lastIndex = chartData
                              .map((d) => d[product.name])
                              .reduce((acc, v, i) => (v != null ? i : acc), 0);
                            const idxNum = typeof index === 'number' ? index : (typeof index === 'string' ? parseInt(index, 10) : -1);
                            if (
                              idxNum === lastIndex &&
                              value != null &&
                              typeof x === 'number' &&
                              typeof y === 'number'
                            ) {
                              return (
                                <text
                                  x={x}
                                  y={y}
                                  dy={-10}
                                  fontSize={12}
                                  fill={String(lineColors[idx % lineColors.length])}
                                  textAnchor="middle"
                                  fontWeight="bold"
                                >
                                  ${Math.round(Number(value)).toLocaleString()}
                                </text>
                              );
                            }
                            return null;
                          }}
                        />
                      </Line>
                    ))}
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="lg:col-span-5">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Detailed Comparison</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Investment</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Projected Value</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Growth</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rate</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {products.map((product, idx) => {
                      const term = product.type === 'cd'
                        ? (product.termMonths || 12) / 12
                        : product.type === 'annuity'
                          ? (product.termYears || 10)
                          : maxTerm;

                      let projectedValue = 0;
                      if (product.type === 'cd') {
                        projectedValue = product.investment * Math.pow(1 + product.rate, term);
                      } else if (product.type === 'moneyMarket') {
                        projectedValue = product.investment * Math.pow(1 + product.rate, term);
                      } else if (product.type === 'annuity') {
                        const bonusRate = (product as any).bonusRate || 0;
                        projectedValue = product.investment * Math.pow(1 + product.rate, term) + product.investment * bonusRate;
                      } else if (product.type === 'lifeInsurance') {
                        const rate = product.rate || 0.04;
                        projectedValue = product.investment * Math.pow(1 + rate, term);
                      }

                      const growth = projectedValue - product.investment;

                      return (
                        <tr key={`${product.type}-${product.name}-${product.investment}-${product.rate}-${idx}`} className="hover:bg-gray-50">
                          <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900">{product.name}</td>
                          <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">${product.investment.toLocaleString()}</td>
                          <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">${Math.round(projectedValue).toLocaleString()}</td>
                          <td className="px-4 py-2 whitespace-nowrap text-sm text-green-600">+${Math.round(growth).toLocaleString()}</td>
                          <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{(product.rate * 100).toFixed(2)}%</td>
                        </tr>
                      );
                    })}
                    {/* Totals Row */}
                    <tr className="font-bold bg-gray-100">
                      <td className="px-4 py-2">Totals</td>
                      <td className="px-4 py-2">${products.reduce((sum, p) => sum + (p.investment || 0), 0).toLocaleString()}</td>
                      <td className="px-4 py-2">${products.reduce((sum, p) => {
                        const term = p.type === 'cd'
                          ? (p.termMonths || 12) / 12
                          : p.type === 'annuity'
                            ? (p.termYears || 10)
                            : maxTerm;

                        let projectedValue = 0;
                        if (p.type === 'cd') {
                          projectedValue = p.investment * Math.pow(1 + p.rate, term);
                        } else if (p.type === 'moneyMarket') {
                          projectedValue = p.investment * Math.pow(1 + p.rate, term);
                        } else if (p.type === 'annuity') {
                          const bonusRate = (p as any).bonusRate || 0;
                          projectedValue = p.investment * Math.pow(1 + p.rate, term) + p.investment * bonusRate;
                        } else if (p.type === 'lifeInsurance') {
                          const rate = p.rate || 0.04;
                          projectedValue = p.investment * Math.pow(1 + rate, term);
                        }
                        return sum + Math.round(projectedValue);
                      }, 0).toLocaleString()}</td>
                      <td className="px-4 py-2 text-green-600">+${products.reduce((sum, p) => {
                        const term = p.type === 'cd'
                          ? (p.termMonths || 12) / 12
                          : p.type === 'annuity'
                            ? (p.termYears || 10)
                            : maxTerm;

                        let projectedValue = 0;
                        if (p.type === 'cd') {
                          projectedValue = p.investment * Math.pow(1 + p.rate, term);
                        } else if (p.type === 'moneyMarket') {
                          projectedValue = p.investment * Math.pow(1 + p.rate, term);
                        } else if (p.type === 'annuity') {
                          const bonusRate = (p as any).bonusRate || 0;
                          projectedValue = p.investment * Math.pow(1 + p.rate, term) + p.investment * bonusRate;
                        } else if (p.type === 'lifeInsurance') {
                          const rate = p.rate || 0.04;
                          projectedValue = p.investment * Math.pow(1 + rate, term);
                        }
                        return sum + Math.round(projectedValue - p.investment);
                      }, 0).toLocaleString()}</td>
                      <td className="px-4 py-2"></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComparisonModal; 