import React from 'react';

interface InvestmentFormProps {
 age: number;
 setAge: React.Dispatch<React.SetStateAction<number>>;
 gender: string;
 setGender: (g: string) => void;
 tobaccoUse: string;
 setTobaccoUse: (t: string) => void;
 shortTermInvestment: number;
 setShortTermInvestment: React.Dispatch<React.SetStateAction<number>>;
 intermediateInvestment: number;
 setIntermediateInvestment: React.Dispatch<React.SetStateAction<number>>;
 longTermInvestment: number;
 setLongTermInvestment: React.Dispatch<React.SetStateAction<number>>;
 neverInvestment: number;
 setNeverInvestment: React.Dispatch<React.SetStateAction<number>>;
 onSubmit: (e: React.FormEvent) => void;
 onDebug: () => void;
 formatNumber: (v: string) => string;
 handleInvestmentChange: (v: string, setter: React.Dispatch<React.SetStateAction<number>>) => void;
}

const InvestmentForm: React.FC<InvestmentFormProps> = ({
 age, setAge, gender, setGender, tobaccoUse, setTobaccoUse,
 shortTermInvestment, setShortTermInvestment,
 intermediateInvestment, setIntermediateInvestment,
 longTermInvestment, setLongTermInvestment,
 neverInvestment, setNeverInvestment,
 onSubmit, onDebug, formatNumber, handleInvestmentChange
}) => (
 <form className="info-form" onSubmit={onSubmit}>
  <div className="form-columns">
   <div className="form-col left">
    <div className="input-group">
     <label htmlFor="age">Customer Age</label>
     <input
      type="number"
      id="age"
      value={age === 0 ? '' : age}
      onChange={(e) => setAge(Number(e.target.value))}
      min="0"
      max="120"
      placeholder="00"
      required
     />
    </div>
    <div className="input-group">
     <label>Gender</label>
     <div className="radio-group">
      <label><input type="radio" name="gender" value="male" checked={gender === 'male'} onChange={() => setGender('male')} required /> Male</label>
      <label><input type="radio" name="gender" value="female" checked={gender === 'female'} onChange={() => setGender('female')} required /> Female</label>
     </div>
    </div>
    <div className="input-group">
     <label>Tobacco Use</label>
     <div className="radio-group">
      <label><input type="radio" name="tobacco" value="yes" checked={tobaccoUse === 'yes'} onChange={() => setTobaccoUse('yes')} required /> Yes</label>
      <label><input type="radio" name="tobacco" value="no" checked={tobaccoUse === 'no'} onChange={() => setTobaccoUse('no')} required /> No</label>
     </div>
    </div>
   </div>
   <div className="form-col right">
    <div className="input-group">
     <label htmlFor="shortTerm">Short Term (Less than 1 year)</label>
     <input
      type="text"
      id="shortTerm"
      value={shortTermInvestment === 0 ? '' : formatNumber(shortTermInvestment.toString())}
      onChange={(e) => handleInvestmentChange(e.target.value, setShortTermInvestment)}
      placeholder="$0"
      required
     />
    </div>
    <div className="input-group">
     <label htmlFor="intermediate">Intermediate Term (2 to 5 years)</label>
     <input
      type="text"
      id="intermediate"
      value={intermediateInvestment === 0 ? '' : formatNumber(intermediateInvestment.toString())}
      onChange={(e) => handleInvestmentChange(e.target.value, setIntermediateInvestment)}
      placeholder="$0"
      required
     />
    </div>
    <div className="input-group">
     <label htmlFor="longTerm">Long Term (5+ years)</label>
     <input
      type="text"
      id="longTerm"
      value={longTermInvestment === 0 ? '' : formatNumber(longTermInvestment.toString())}
      onChange={(e) => handleInvestmentChange(e.target.value, setLongTermInvestment)}
      placeholder="$0"
      required
     />
    </div>
    <div className="input-group">
     <label htmlFor="never">Maybe Never / Leave On</label>
     <input
      type="text"
      id="never"
      value={neverInvestment === 0 ? '' : formatNumber(neverInvestment.toString())}
      onChange={(e) => handleInvestmentChange(e.target.value, setNeverInvestment)}
      placeholder="$0"
      required
     />
    </div>
   </div>
  </div>
  <div className="form-actions">
   <button
    type="button"
    className="next-btn"
    style={{ background: '#64748b', marginRight: '1rem' }}
    onClick={onDebug}
   >
    Debug
   </button>
   <button type="submit" className="next-btn">Calculate</button>
  </div>
 </form>
);

export default InvestmentForm; 