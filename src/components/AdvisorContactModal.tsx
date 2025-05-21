import React from 'react';
import { FaUserCircle, FaEnvelope, FaPhone } from 'react-icons/fa';

interface AdvisorContactModalProps {
 open: boolean;
 onClose: () => void;
}

const mockAdvisors = [
 {
  name: "Sarah Johnson",
  email: "sarah.johnson@advisor.com",
  phone: "(555) 123-4567",
  avatar: <FaUserCircle size={48} color="#7c3aed" />
 },
 {
  name: "Michael Chen",
  email: "michael.chen@advisor.com",
  phone: "(555) 987-6543",
  avatar: <FaUserCircle size={48} color="#4a90e2" />
 }
];

const AdvisorContactModal: React.FC<AdvisorContactModalProps> = ({ open, onClose }) => {
 if (!open) return null;

 return (
  <div className="modal-overlay" onClick={onClose}>
   <div className="modal-content advisor-modal" onClick={e => e.stopPropagation()}>
    <button className="close-button" onClick={onClose}>&times;</button>
    <h3>Contact an Advisor</h3>
    <div className="advisor-cards">
     {mockAdvisors.map((advisor, index) => (
      <div key={index} className="advisor-card">
       <div className="advisor-avatar">
        {advisor.avatar}
       </div>
       <div className="advisor-info">
        <div className="advisor-name">{advisor.name}</div>
        <div className="advisor-contact">
         <FaEnvelope style={{ marginRight: 6, color: '#64748b' }} />
         <a href={`mailto:${advisor.email}`}>{advisor.email}</a>
        </div>
        <div className="advisor-contact">
         <FaPhone style={{ marginRight: 6, color: '#64748b' }} />
         <a href={`tel:${advisor.phone}`}>{advisor.phone}</a>
        </div>
       </div>
      </div>
     ))}
    </div>
   </div>
  </div>
 );
};

export default AdvisorContactModal; 