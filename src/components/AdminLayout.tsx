import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './AdminLayout.css';

interface AdminLayoutProps {
 children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
 const location = useLocation();

 const isActive = (path: string) => {
  return location.pathname === path;
 };

 return (
  <div className="admin-layout">
   <aside className="admin-sidebar">
    <div className="sidebar-content">
     <div className="sidebar-header">
      <h2>Investment App</h2>
     </div>
     <nav className="sidebar-nav">
      <Link
       to="/"
       className={`nav-item ${isActive('/') ? 'active' : ''}`}
      >
       <i className="fas fa-calculator"></i>
       Calculator
      </Link>
      <Link
       to="/admin/products"
       className={`nav-item ${isActive('/admin/products') ? 'active' : ''}`}
      >
       <i className="fas fa-lock"></i>
       Admin
      </Link>
     </nav>
    </div>
   </aside>
   <div className="main-content">
    {children}
   </div>
  </div>
 );
};

export default AdminLayout; 