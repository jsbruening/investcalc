import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaSignOutAlt, FaUserCircle } from 'react-icons/fa';
import { Home, Calculator, Package } from 'lucide-react';

const navLinks = [
      { label: 'Dashboard', to: '/', icon: <Home className="w-5 h-5 text-brand" /> },
      { label: 'Calculator', to: '/calculator', icon: <Calculator className="w-5 h-5 text-brand" /> },
      { label: 'Products', to: '/products', icon: <Package className="w-5 h-5 text-brand" /> },
];

const TopNavBar: React.FC = () => {
      const location = useLocation();

      return (
            <nav className="bg-white border-b border-gray-200 shadow-md sticky top-0 z-50 rounded-b-xl">
                  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center justify-between h-20">
                              {/* Logo + App Name */}
                              <div className="flex items-center gap-3">
                                    <img src="/logo.png" alt="Raisin Logo" className="w-10 h-10 rounded object-contain" />
                                    <span className="text-2xl font-extrabold tracking-tight text-brand" style={{ color: '#6b8e00' }}>Raisin</span>
                              </div>

                              {/* Nav Links */}
                              <div className="flex items-center gap-6">
                                    {navLinks.map(link => {
                                          const isActive = location.pathname === link.to;
                                          return (
                                                <Link
                                                      key={link.to}
                                                      to={link.to}
                                                      className={`relative flex flex-col items-center px-4 py-2 text-base font-medium transition ${isActive ? 'text-brand font-bold' : 'text-gray-600 hover:text-brand'}`}
                                                      style={{ minWidth: 80, height: '40px' }}
                                                >
                                                      <div className="flex items-center gap-2">
                                                            {link.icon}
                                                            <span>{link.label}</span>
                                                      </div>
                                                      {isActive && (
                                                            <span className="absolute bottom-0 left-0 w-full h-1.5 rounded-full" style={{ background: '#6b8e00' }} />
                                                      )}
                                                </Link>
                                          );
                                    })}
                              </div>

                              {/* Divider */}
                              <div className="h-8 w-px bg-gray-200 mx-6 hidden md:block" />

                              {/* User Info & Sign Out */}
                              <div className="flex items-center gap-4">
                                    <div className="flex items-center gap-2">
                                          <FaUserCircle className="w-7 h-7 text-gray-400" />
                                          <span className="hidden md:block text-sm font-medium text-gray-700">John Doe</span>
                                    </div>
                                    <button className="flex items-center gap-1 px-3 py-2 rounded-full text-base font-medium text-brand hover:bg-brand-light transition">
                                          <FaSignOutAlt className="w-5 h-5" />
                                          <span className="hidden sm:inline">Sign Out</span>
                                    </button>
                              </div>
                        </div>
                  </div>
            </nav>
      );
};

export default TopNavBar; 