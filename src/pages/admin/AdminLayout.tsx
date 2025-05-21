import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import '../../App.css';
import './AdminLayout.css';

const AdminLayout: React.FC = () => {
 return (
  <div className="admin-layout">
   <aside className="admin-sidebar">
    <div className="admin-sidebar-header">
     <h2>Admin Panel</h2>
    </div>
    <nav className="admin-nav">
     <Link to="/admin/dashboard" className="admin-nav-item">
      <span className="icon">📊</span>
      Dashboard
     </Link>
     <Link to="/admin/products" className="admin-nav-item">
      <span className="icon">💼</span>
      Products
     </Link>
     <Link to="/admin/users" className="admin-nav-item">
      <span className="icon">👥</span>
      Users
     </Link>
     <Link to="/admin/settings" className="admin-nav-item">
      <span className="icon">⚙️</span>
      Settings
     </Link>
    </nav>
   </aside>
   <main className="admin-content">
    <header className="admin-header">
     <h1>Admin Dashboard</h1>
     <div className="admin-header-actions">
      <button className="admin-button">Help</button>
      <button className="admin-button">Logout</button>
     </div>
    </header>
    <div className="admin-main">
     <Outlet />
    </div>
   </main>
  </div>
 );
};

export default AdminLayout; 