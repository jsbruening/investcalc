import React from 'react';
import { MdSavings } from 'react-icons/md';
import { FaPiggyBank, FaShieldAlt } from 'react-icons/fa';
import { GiReceiveMoney } from 'react-icons/gi';

interface InvestmentTabsProps {
      activeTab: number;
      onTabChange: (index: number) => void;
      shortTermInvestment: number;
      intermediateInvestment: number;
      longTermInvestment: number;
      neverInvestment: number;
}

const InvestmentTabs: React.FC<InvestmentTabsProps> = ({
      activeTab,
      onTabChange,
      shortTermInvestment,
      intermediateInvestment,
      longTermInvestment,
      neverInvestment,
}) => {
      const tabs = [
            {
                  label: 'Short Term',
                  icon: <MdSavings className="w-5 h-5" />,
                  value: shortTermInvestment,
                  color: 'text-green-500'
            },
            {
                  label: 'Intermediate Term',
                  icon: <FaPiggyBank className="w-5 h-5" />,
                  value: intermediateInvestment,
                  color: 'text-blue-500'
            },
            {
                  label: 'Long Term',
                  icon: <GiReceiveMoney className="w-5 h-5" />,
                  value: longTermInvestment,
                  color: 'text-yellow-500'
            },
            {
                  label: 'Life Insurance',
                  icon: <FaShieldAlt className="w-5 h-5" />,
                  value: neverInvestment,
                  color: 'text-purple-500'
            }
      ];

      return (
            <div className="border-b border-gray-200">
                  <nav className="flex -mb-px space-x-8" aria-label="Tabs">
                        {tabs.map((tab, index) => (
                              <button
                                    key={tab.label}
                                    onClick={() => onTabChange(index)}
                                    className={`
              group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm
              ${activeTab === index
                                                ? 'border-green-500 text-green-600'
                                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                          }
            `}
                              >
                                    {tab.label}
                                    {tab.count > 0 && (
                                          <span className="ml-2 bg-gray-100 text-gray-600 py-0.5 px-2 rounded-full text-xs">
                                                {tab.count}
                                          </span>
                                    )}
                              </button>
                        ))}
                  </nav>
            </div>
      );
};

export default InvestmentTabs; 