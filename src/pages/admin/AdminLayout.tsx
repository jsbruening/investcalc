import React from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { FaHome, FaUsers, FaChartLine, FaCog, FaSignOutAlt } from 'react-icons/fa';

const AdminLayout: React.FC = () => {
 const location = useLocation();
 const navigate = useNavigate();

 const handleSignOut = () => {
  // Add sign out logic here
  navigate('/login');
 };

 return (
  <div className="min-h-screen bg-gray-100">
   {/* Sidebar */}
   <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-lg">
    <div className="flex flex-col h-full">
     {/* Logo */}
     <div className="flex items-center justify-center h-16 border-b">
      <h1 className="text-xl font-bold text-gray-800">Admin Panel</h1>
     </div>

     {/* Navigation */}
     <nav className="flex-1 px-4 py-4 space-y-1">
      <Link
       to="/admin"
       className={`flex items-center px-4 py-2 text-sm font-medium rounded-md ${location.pathname === '/admin'
         ? 'bg-green-100 text-green-700'
         : 'text-gray-600 hover:bg-gray-50'
        }`}
      >
       <FaHome className="mr-3 h-5 w-5" />
       Dashboard
      </Link>
      <Link
       to="/admin/products"
       className={`flex items-center px-4 py-2 text-sm font-medium rounded-md ${location.pathname === '/admin/products'
         ? 'bg-green-100 text-green-700'
         : 'text-gray-600 hover:bg-gray-50'
        }`}
      >
       <FaChartLine className="mr-3 h-5 w-5" />
       Products
      </Link>
      <Link
       to="/admin/users"
       className={`flex items-center px-4 py-2 text-sm font-medium rounded-md ${location.pathname === '/admin/users'
         ? 'bg-green-100 text-green-700'
         : 'text-gray-600 hover:bg-gray-50'
        }`}
      >
       <FaUsers className="mr-3 h-5 w-5" />
       Users
      </Link>
      <Link
       to="/admin/settings"
       className={`flex items-center px-4 py-2 text-sm font-medium rounded-md ${location.pathname === '/admin/settings'
         ? 'bg-green-100 text-green-700'
         : 'text-gray-600 hover:bg-gray-50'
        }`}
      >
       <FaCog className="mr-3 h-5 w-5" />
       Settings
      </Link>
     </nav>

     {/* Sign Out Button */}
     <div className="p-4 border-t">
      <button
       onClick={handleSignOut}
       className="flex items-center w-full px-4 py-2 text-sm font-medium text-red-600 rounded-md hover:bg-red-50"
      >
       <FaSignOutAlt className="mr-3 h-5 w-5" />
       Sign Out
      </button>
     </div>
    </div>
   </div>

   {/* Main Content */}
   <div className="pl-64">
    <main className="p-8">
     <Outlet />
    </main>
   </div>
  </div>
 );
};

export default AdminLayout; 