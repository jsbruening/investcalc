import React from 'react';

interface FormActionsProps {
 onBack: () => void;
 onNewCalculation: () => void;
}

const FormActions: React.FC<FormActionsProps> = ({ onBack, onNewCalculation }) => (
 <div className="form-actions">
  <button type="button" className="back-btn" onClick={onBack}>Back</button>
  <button type="button" className="new-btn" onClick={onNewCalculation}>New Calculation</button>
 </div>
);

export default FormActions; 