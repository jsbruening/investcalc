import { useState } from 'react';
import InvestmentForm from '../components/InvestmentForm';
import Results from '../components/Results';
import FormActions from '../components/FormActions';

const CalculatorPage = () => {
 const [showResults, setShowResults] = useState(false);
 const [shortTermInvestment, setShortTermInvestment] = useState<number>(0);
 const [intermediateInvestment, setIntermediateInvestment] = useState<number>(0);
 const [longTermInvestment, setLongTermInvestment] = useState<number>(0);
 const [neverInvestment, setNeverInvestment] = useState<number>(0);
 const [age, setAge] = useState<number>(0);
 const [gender, setGender] = useState<string>('');
 const [tobaccoUse, setTobaccoUse] = useState<string>('');

 const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();
  setShowResults(true);
 };

 const handleBack = () => {
  setShowResults(false);
 };

 const handleNewCalculation = () => {
  setShowResults(false);
  setShortTermInvestment(0);
  setIntermediateInvestment(0);
  setLongTermInvestment(0);
  setNeverInvestment(0);
  setAge(0);
  setGender('');
  setTobaccoUse('');
 };

 const formatNumber = (value: string): string => {
  const numbers = value.replace(/\D/g, '');
  return numbers.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
 };

 const handleInvestmentChange = (
  value: string,
  setter: React.Dispatch<React.SetStateAction<number>>
 ) => {
  const numericValue = parseInt(value.replace(/,/g, '')) || 0;
  setter(numericValue);
 };

 return (
  showResults ? (
   <>
    <Results
     shortTermInvestment={shortTermInvestment}
     intermediateInvestment={intermediateInvestment}
     longTermInvestment={longTermInvestment}
     neverInvestment={neverInvestment}
     age={age}
     gender={gender}
     tobaccoUse={tobaccoUse}
    />
    <FormActions onBack={handleBack} onNewCalculation={handleNewCalculation} />
   </>
  ) : (
   <div className="flex justify-center items-center min-h-screen bg-gray-50">
    <div className="w-full max-w-2xl p-6 bg-white rounded-xl shadow-lg">
     <h2 className="text-2xl font-bold mb-6 text-center">Investment Calculator</h2>
     <InvestmentForm
      age={age}
      setAge={setAge}
      gender={gender}
      setGender={setGender}
      tobaccoUse={tobaccoUse}
      setTobaccoUse={setTobaccoUse}
      shortTermInvestment={shortTermInvestment}
      setShortTermInvestment={setShortTermInvestment}
      intermediateInvestment={intermediateInvestment}
      setIntermediateInvestment={setIntermediateInvestment}
      longTermInvestment={longTermInvestment}
      setLongTermInvestment={setLongTermInvestment}
      neverInvestment={neverInvestment}
      setNeverInvestment={setNeverInvestment}
      onSubmit={handleSubmit}
      onDebug={() => { }}
      formatNumber={formatNumber}
      handleInvestmentChange={handleInvestmentChange}
     />
    </div>
   </div>
  )
 );
};

export default CalculatorPage; 