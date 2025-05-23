interface FormData {
  age: number;
  gender: string;
  tobaccoUse: string;
  shortTermInvestment: number;
  intermediateInvestment: number;
  longTermInvestment: number;
  neverInvestment: number;
}

interface Product {
  id: string;
  type: 'cd' | 'moneyMarket' | 'annuity' | 'lifeInsurance';
  name: string;
  termCircle: string;
  projectedValue: number;
  investment: number;
  rate: number;
  termType?: string;
}

export const calculateProducts = (formData: FormData): Product[] => {
  const { age, gender, tobaccoUse, shortTermInvestment, intermediateInvestment, longTermInvestment, neverInvestment } = formData;

  // Calculate rates based on age, gender, and tobacco use
  const baseRate = 0.05; // 5% base rate
  const ageFactor = age < 30 ? 0.02 : age < 50 ? 0.01 : 0;
  const genderFactor = gender === 'female' ? 0.01 : 0;
  const tobaccoFactor = tobaccoUse === 'yes' ? -0.02 : 0;

  const adjustedRate = baseRate + ageFactor + genderFactor + tobaccoFactor;

  // Generate products
  const products: Product[] = [];

  // Short-term CD
  if (shortTermInvestment > 0) {
    products.push({
      id: 'cd-short',
      type: 'cd',
      name: 'Short-term CD',
      termCircle: '1Y',
      investment: shortTermInvestment,
      projectedValue: shortTermInvestment * (1 + adjustedRate),
      rate: adjustedRate,
      termType: 'short'
    });
  }

  // Intermediate-term CD
  if (intermediateInvestment > 0) {
    products.push({
      id: 'cd-intermediate',
      type: 'cd',
      name: 'Intermediate-term CD',
      termCircle: '3Y',
      investment: intermediateInvestment,
      projectedValue: intermediateInvestment * Math.pow(1 + adjustedRate, 3),
      rate: adjustedRate,
      termType: 'intermediate'
    });
  }

  // Long-term CD
  if (longTermInvestment > 0) {
    products.push({
      id: 'cd-long',
      type: 'cd',
      name: 'Long-term CD',
      termCircle: '5Y',
      investment: longTermInvestment,
      projectedValue: longTermInvestment * Math.pow(1 + adjustedRate, 5),
      rate: adjustedRate,
      termType: 'long'
    });
  }

  // Money Market Account
  if (shortTermInvestment > 0) {
    products.push({
      id: 'money-market-short',
      type: 'moneyMarket',
      name: 'Money Market Account',
      termCircle: '1Y',
      investment: shortTermInvestment,
      projectedValue: shortTermInvestment * (1 + adjustedRate * 0.8),
      rate: adjustedRate * 0.8,
      termType: 'short'
    });
  }

  // Annuity
  if (neverInvestment > 0) {
    products.push({
      id: 'annuity',
      type: 'annuity',
      name: 'Fixed Annuity',
      termCircle: '10Y',
      investment: neverInvestment,
      projectedValue: neverInvestment * Math.pow(1 + adjustedRate * 1.2, 10),
      rate: adjustedRate * 1.2
    });
  }

  // Life Insurance
  if (neverInvestment > 0) {
    products.push({
      id: 'life-insurance',
      type: 'lifeInsurance',
      name: 'Whole Life Insurance',
      termCircle: '20Y',
      investment: neverInvestment,
      projectedValue: neverInvestment * Math.pow(1 + adjustedRate * 1.5, 20),
      rate: adjustedRate * 1.5
    });
  }

  return products;
}; 