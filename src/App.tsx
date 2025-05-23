import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import TopNavBar from './components/TopNavBar';
import Products from './pages/admin/Products';
import CalculatorPage from './pages/CalculatorPage';
import Dashboard from './pages/Dashboard';
import ResultsPage from './pages/ResultsPage';

const App: React.FC = () => {
  return (
    <Router>
      <TopNavBar />
      <div className="mt-12 min-h-[calc(100vh-4rem)] bg-gray-50">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/calculator" element={<CalculatorPage />} />
          <Route path="/products" element={<Products />} />
          <Route path="/results/:data" element={<ResultsPage />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
