import React from 'react';
import { FaUserCircle, FaEnvelope, FaPhone } from 'react-icons/fa';

const AdvisorCard: React.FC = () => (
 <div className="advisor-card">
  <div className="advisor-avatar">
   <FaUserCircle size={56} color="#7c3aed" />
  </div>
  <div className="advisor-info">
   <div className="advisor-name">Jordan Smith</div>
   <div className="advisor-contact">
    <FaEnvelope style={{ marginRight: 6, color: '#64748b' }} />
    <a href="mailto:jordan.smith@advisor.com">jordan.smith@advisor.com</a>
   </div>
   <div className="advisor-contact">
    <FaPhone style={{ marginRight: 6, color: '#64748b' }} />
    <a href="tel:5551234567">(555) 123-4567</a>
   </div>
  </div>
 </div>
);

export default AdvisorCard; 