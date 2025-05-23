import React from 'react';
import { FaBars, FaBell, FaSearch, FaUserCircle } from 'react-icons/fa';

interface NavbarProps {
      onMenuClick: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onMenuClick }) => {
      return (
            <nav className="bg-white border-b border-gray-200">
                  <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
                        <div className="flex items-center justify-between h-16">
                              {/* Left side */}
                              <div className="flex items-center">
                                    <button
                                          onClick={onMenuClick}
                                          className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-green-500 lg:hidden"
                                    >
                                          <FaBars className="w-6 h-6" />
                                    </button>

                                    {/* Search */}
                                    <div className="hidden md:block ml-4">
                                          <div className="relative">
                                                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                                      <FaSearch className="w-5 h-5 text-gray-400" />
                                                </div>
                                                <input
                                                      type="text"
                                                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-green-500 focus:border-green-500 sm:text-sm"
                                                      placeholder="Search"
                                                />
                                          </div>
                                    </div>
                              </div>

                              {/* Right side */}
                              <div className="flex items-center gap-4">
                                    {/* Notifications */}
                                    <button
                                          type="button"
                                          className="p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                                    >
                                          <span className="sr-only">View notifications</span>
                                          <FaBell className="w-6 h-6" />
                                    </button>

                                    {/* Profile dropdown */}
                                    <div className="relative">
                                          <button
                                                type="button"
                                                className="flex items-center gap-2 p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                                          >
                                                <span className="sr-only">Open user menu</span>
                                                <FaUserCircle className="w-8 h-8" />
                                                <span className="hidden md:block text-sm font-medium text-gray-700">John Doe</span>
                                          </button>
                                    </div>
                              </div>
                        </div>
                  </div>
            </nav>
      );
};

export default Navbar; 