import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './styles/design-system.css'
import './App.css'
import Results from './components/Results'
import './components/Results.css'
import AppLayout from './components/AdminLayout'
import Products from './pages/admin/Products'

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
                <div className="form-actions">
                  <button type="button" className="back-btn" onClick={handleBack}>Back</button>
                  <button type="button" className="new-btn" onClick={handleNewCalculation}>New Calculation</button>
                </div>
              </>
            ) : (
              <div className="calculator-layout">
                <aside className="sidebar">
                  <h2>Add Investment Information</h2>
                  <p>Start by adding the Client's investment goals and additional information. Once they've been added investment opportunities will be calculated and displayed.</p>
                </aside>
                <section className="form-section">
                  <h2 className="form-title">Investment Information</h2>
                  <form className="info-form" onSubmit={handleSubmit}>
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
                        onClick={() => {
                          setAge(30);
                          setGender('male');
                          setTobaccoUse('no');
                          setShortTermInvestment(50000);
                          setIntermediateInvestment(50000);
                          setLongTermInvestment(50000);
                          setNeverInvestment(50000);
                          setShowResults(true);
                        }}
                      >
                        Debug
                      </button>
                      <button type="submit" className="next-btn">Calculate</button>
                    </div>
                  </form>
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
