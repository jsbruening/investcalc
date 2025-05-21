import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './styles/design-system.css'
import './App.css'
import Results from './components/Results'
import './components/Results.css'
import AppLayout from './components/AdminLayout'
import Products from './pages/admin/Products'
import InvestmentForm from './components/InvestmentForm'
import Sidebar from './components/Sidebar'
import FormActions from './components/FormActions'
import { MdPersonAdd } from 'react-icons/md'

function App() {
  const [showResults, setShowResults] = useState(false)
  const [shortTermInvestment, setShortTermInvestment] = useState<number>(0)
  const [intermediateInvestment, setIntermediateInvestment] = useState<number>(0)
  const [longTermInvestment, setLongTermInvestment] = useState<number>(0)
  const [neverInvestment, setNeverInvestment] = useState<number>(0)
  const [age, setAge] = useState<number>(0)
  const [gender, setGender] = useState<string>('')
  const [tobaccoUse, setTobaccoUse] = useState<string>('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setShowResults(true)
  }

  const handleBack = () => {
    setShowResults(false)
  }

  const handleNewCalculation = () => {
    setShowResults(false)
    setShortTermInvestment(0)
    setIntermediateInvestment(0)
    setLongTermInvestment(0)
    setNeverInvestment(0)
    setAge(0)
    setGender('')
    setTobaccoUse('')
  }

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
    <BrowserRouter>
      <AppLayout>
        <Routes>
          <Route path="/admin/products" element={<Products />} />
          <Route path="/" element={
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
              <div className="calculator-layout">
                <Sidebar />
                <section className="form-section">
                  <h2 className="form-title">Investment Information</h2>
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
                    onDebug={() => {
                      setAge(30);
                      setGender('male');
                      setTobaccoUse('no');
                      setShortTermInvestment(50000);
                      setIntermediateInvestment(50000);
                      setLongTermInvestment(50000);
                      setNeverInvestment(50000);
                      setShowResults(true);
                    }}
                    formatNumber={formatNumber}
                    handleInvestmentChange={handleInvestmentChange}
                  />
                </section>
              </div>
            )
          } />
        </Routes>
      </AppLayout>
    </BrowserRouter>
  )
}

export default App
