export type ProductSchemaField = {
  name: string;
  label: string;
  type: string;
  required?: boolean;
  order?: number;
  validation?: string;
  errorMessage?: string;
  fields?: {
    name: string;
    label: string;
    type: string;
    options?: string[];
  }[];
};

export type Product = {
  _id?: string;
  type: string;
  termType: string;
  calculatorType: string;
  schema: ProductSchemaField[];
  data?: any;
};

export const products: Product[] = [
  {
    _id: "annuity-1",
    type: "annuity",
    termType: "long",
    calculatorType: "calculateAnnuityReturn",
    schema: [
      { name: "carrier", label: "Carrier", type: "text" },
      { name: "productName", label: "Product Name", type: "text" },
      { name: "termYears", label: "Term (Years)", type: "number" },
      { name: "initialRate", label: "Initial Rate", type: "number" },
      { name: "bonusRate", label: "Bonus Rate", type: "number" },
      { name: "guaranteePeriod", label: "Guarantee Period", type: "number" },
      {
        name: "rateGrid",
        label: "Rate Grid",
        type: "grid",
        required: true,
        order: 7,
        fields: [
          { name: "minAmount", label: "Min Amount", type: "number" },
          { name: "maxAmount", label: "Max Amount", type: "number" },
          { name: "rate", label: "Rate", type: "number" }
        ]
      }
    ],
    data: {
      carrier: "SecureLife",
      productName: "Golden Nest Egg",
      termYears: 10,
      initialRate: 0.035,
      bonusRate: 0.01,
      guaranteePeriod: 5,
      rateGrid: [
        { minAmount: 0, maxAmount: 49999, rate: 0.03 },
        { minAmount: 50000, maxAmount: 99999, rate: 0.035 },
        { minAmount: 100000, maxAmount: 1000000, rate: 0.04 }
      ]
    }
  },
  {
    _id: "annuity-2",
    type: "annuity",
    termType: "long",
    calculatorType: "calculateAnnuityReturn",
    schema: [
      { name: "carrier", label: "Carrier", type: "text" },
      { name: "productName", label: "Product Name", type: "text" },
      { name: "termYears", label: "Term (Years)", type: "number" },
      { name: "initialRate", label: "Initial Rate", type: "number" },
      { name: "bonusRate", label: "Bonus Rate", type: "number" },
      { name: "guaranteePeriod", label: "Guarantee Period", type: "number" },
      {
        name: "rateGrid",
        label: "Rate Grid",
        type: "grid",
        required: true,
        order: 7,
        fields: [
          { name: "minAmount", label: "Min Amount", type: "number" },
          { name: "maxAmount", label: "Max Amount", type: "number" },
          { name: "rate", label: "Rate", type: "number" }
        ]
      }
    ],
    data: {
      carrier: "FutureGuard",
      productName: "Silver Lining Plus",
      termYears: 15,
      initialRate: 0.04,
      bonusRate: 0.015,
      guaranteePeriod: 7,
      rateGrid: [
        { minAmount: 0, maxAmount: 99999, rate: 0.035 },
        { minAmount: 100000, maxAmount: 249999, rate: 0.04 },
        { minAmount: 250000, maxAmount: 1000000, rate: 0.045 }
      ]
    }
  },
  {
    _id: "annuity-3",
    type: "annuity",
    termType: "long",
    calculatorType: "calculateAnnuityReturn",
    schema: [
      { name: "carrier", label: "Carrier", type: "text" },
      { name: "productName", label: "Product Name", type: "text" },
      { name: "termYears", label: "Term (Years)", type: "number" },
      { name: "initialRate", label: "Initial Rate", type: "number" },
      { name: "bonusRate", label: "Bonus Rate", type: "number" },
      { name: "guaranteePeriod", label: "Guarantee Period", type: "number" },
      {
        name: "rateGrid",
        label: "Rate Grid",
        type: "grid",
        required: true,
        order: 7,
        fields: [
          { name: "minAmount", label: "Min Amount", type: "number" },
          { name: "maxAmount", label: "Max Amount", type: "number" },
          { name: "rate", label: "Rate", type: "number" }
        ]
      }
    ],
    data: {
      carrier: "WealthShield",
      productName: "Platinum Legacy",
      termYears: 20,
      initialRate: 0.042,
      bonusRate: 0.02,
      guaranteePeriod: 10,
      rateGrid: [
        { minAmount: 0, maxAmount: 249999, rate: 0.038 },
        { minAmount: 250000, maxAmount: 499999, rate: 0.042 },
        { minAmount: 500000, maxAmount: 1000000, rate: 0.046 }
      ]
    }
  },
  {
    _id: "annuity-4",
    type: "annuity",
    termType: "long",
    calculatorType: "calculateAnnuityReturn",
    schema: [
      { name: "carrier", label: "Carrier", type: "text" },
      { name: "productName", label: "Product Name", type: "text" },
      { name: "termYears", label: "Term (Years)", type: "number" },
      { name: "initialRate", label: "Initial Rate", type: "number" },
      { name: "bonusRate", label: "Bonus Rate", type: "number" },
      { name: "guaranteePeriod", label: "Guarantee Period", type: "number" },
      {
        name: "rateGrid",
        label: "Rate Grid",
        type: "grid",
        required: true,
        order: 7,
        fields: [
          { name: "minAmount", label: "Min Amount", type: "number" },
          { name: "maxAmount", label: "Max Amount", type: "number" },
          { name: "rate", label: "Rate", type: "number" }
        ]
      }
    ],
    data: {
      carrier: "RetirementPlus",
      productName: "Diamond Horizon",
      termYears: 25,
      initialRate: 0.045,
      bonusRate: 0.025,
      guaranteePeriod: 12,
      rateGrid: [
        { minAmount: 0, maxAmount: 499999, rate: 0.04 },
        { minAmount: 500000, maxAmount: 999999, rate: 0.045 },
        { minAmount: 1000000, maxAmount: 2000000, rate: 0.05 }
      ]
    }
  },
  {
    type: "cd",
    termType: "short",
    calculatorType: "calculateCDReturn",
    schema: [
      {
        name: "institution",
        label: "Institution",
        type: "text",
        required: true,
        order: 1,
        validation: "^[\\w\\s]{2,50}$",
        errorMessage: "Institution name is required"
      },
      {
        name: "productName",
        label: "Product Name",
        type: "text",
        required: true,
        order: 2,
        validation: "^[\\w\\s]{2,50}$",
        errorMessage: "Product name is required"
      },
      {
        name: "rateGrid",
        label: "Rate Grid",
        type: "grid",
        required: true,
        order: 3,
        fields: [
          { name: "termMonths", label: "Term (Months)", type: "number" },
          { name: "minAmount", label: "Min Amount", type: "number" },
          { name: "maxAmount", label: "Max Amount", type: "number" },
          { name: "rate", label: "Rate", type: "number" }
        ]
      }
    ],
    data: {
      institution: "SecureBank",
      productName: "Premium CD",
      rateGrid: [
        { termMonths: 3, minAmount: 0, maxAmount: 9999, rate: 0.035 },
        { termMonths: 3, minAmount: 10000, maxAmount: 49999, rate: 0.04 },
        { termMonths: 3, minAmount: 50000, maxAmount: 1000000, rate: 0.042 },
        { termMonths: 6, minAmount: 0, maxAmount: 9999, rate: 0.04 },
        { termMonths: 6, minAmount: 10000, maxAmount: 49999, rate: 0.045 },
        { termMonths: 6, minAmount: 50000, maxAmount: 1000000, rate: 0.047 },
        { termMonths: 12, minAmount: 0, maxAmount: 9999, rate: 0.045 },
        { termMonths: 12, minAmount: 10000, maxAmount: 49999, rate: 0.05 },
        { termMonths: 12, minAmount: 50000, maxAmount: 1000000, rate: 0.052 }
      ]
    }
  },
  {
    _id: "money-market-1",
    type: "moneyMarket",
    termType: "short",
    calculatorType: "calculateMoneyMarketReturn",
    schema: [
      {
        name: "institution",
        label: "Institution",
        type: "text",
        required: true,
        order: 1
      },
      {
        name: "productName",
        label: "Product Name",
        type: "text",
        required: true,
        order: 2
      },
      {
        name: "rateGrid",
        label: "Rate Grid",
        type: "grid",
        required: true,
        order: 3,
        fields: [
          { name: "minAmount", label: "Min Amount", type: "number" },
          { name: "maxAmount", label: "Max Amount", type: "number" },
          { name: "rate", label: "Rate", type: "number" }
        ]
      }
    ],
    data: {
      institution: "SecureBank",
      productName: "Premium Money Market",
      rateGrid: [
        { minAmount: 0, maxAmount: 9999, rate: 0.035 },
        { minAmount: 10000, maxAmount: 49999, rate: 0.042 },
        { minAmount: 50000, maxAmount: 99999, rate: 0.045 },
        { minAmount: 100000, maxAmount: 1000000, rate: 0.048 }
      ]
    }
  },
  {
    _id: "money-market-2",
    type: "moneyMarket",
    termType: "intermediate",
    calculatorType: "calculateMoneyMarketReturn",
    schema: [
      {
        name: "institution",
        label: "Institution",
        type: "text",
        required: true,
        order: 1
      },
      {
        name: "productName",
        label: "Product Name",
        type: "text",
        required: true,
        order: 2
      },
      {
        name: "baseRate",
        label: "Base Rate",
        type: "number",
        required: true,
        order: 3
      },
      {
        name: "minimumBalance",
        label: "Minimum Balance",
        type: "number",
        required: true,
        order: 4
      }
    ],
    data: {
      institution: "WealthGuard",
      productName: "Enhanced Money Market",
      baseRate: 0.045,
      minimumBalance: 25000,
      bands: [
        { min: 0, max: 24999, rate: 0.038 },
        { min: 25000, max: 99999, rate: 0.045 },
        { min: 100000, max: 249999, rate: 0.048 },
        { min: 250000, max: 1000000, rate: 0.051 }
      ]
    }
  },
  {
    _id: "money-market-3",
    type: "moneyMarket",
    termType: "long",
    calculatorType: "calculateMoneyMarketReturn",
    schema: [
      {
        name: "institution",
        label: "Institution",
        type: "text",
        required: true,
        order: 1
      },
      {
        name: "productName",
        label: "Product Name",
        type: "text",
        required: true,
        order: 2
      },
      {
        name: "baseRate",
        label: "Base Rate",
        type: "number",
        required: true,
        order: 3
      },
      {
        name: "minimumBalance",
        label: "Minimum Balance",
        type: "number",
        required: true,
        order: 4
      }
    ],
    data: {
      institution: "FutureGrowth",
      productName: "Elite Money Market",
      baseRate: 0.048,
      minimumBalance: 50000,
      bands: [
        { min: 0, max: 49999, rate: 0.042 },
        { min: 50000, max: 249999, rate: 0.048 },
        { min: 250000, max: 499999, rate: 0.051 },
        { min: 500000, max: 1000000, rate: 0.054 }
      ]
    }
  },
  {
    _id: "life-insurance-1",
    type: "lifeInsurance",
    termType: "long",
    calculatorType: "calculateLifeInsuranceReturn",
    schema: [
      {
        name: "carrier",
        label: "Carrier",
        type: "text",
        required: true,
        order: 1
      },
      {
        name: "productName",
        label: "Product Name",
        type: "text",
        required: true,
        order: 2
      },
      {
        name: "underwritingGrid",
        label: "Underwriting Grid",
        type: "grid",
        required: true,
        order: 3,
        fields: [
          { name: "age", label: "Age", type: "number" },
          { name: "gender", label: "Gender", type: "select", options: ["Male", "Female"] },
          { name: "tobaccoUse", label: "Tobacco Use", type: "select", options: ["Yes", "No"] },
          { name: "rate", label: "Rate", type: "number" }
        ]
      }
    ],
    data: {
      carrier: "SecureLife",
      productName: "Whole Life Plus",
      underwritingGrid: [
        { age: 30, gender: "Male", tobaccoUse: "No", rate: 0.04 },
        { age: 30, gender: "Male", tobaccoUse: "Yes", rate: 0.06 },
        { age: 30, gender: "Female", tobaccoUse: "No", rate: 0.035 },
        { age: 30, gender: "Female", tobaccoUse: "Yes", rate: 0.055 },
        { age: 40, gender: "Male", tobaccoUse: "No", rate: 0.05 },
        { age: 40, gender: "Male", tobaccoUse: "Yes", rate: 0.07 },
        { age: 40, gender: "Female", tobaccoUse: "No", rate: 0.045 },
        { age: 40, gender: "Female", tobaccoUse: "Yes", rate: 0.065 }
      ]
    }
  },
  {
    _id: "life-insurance-2",
    type: "lifeInsurance",
    termType: "long",
    calculatorType: "calculateLifeInsuranceReturn",
    schema: [
      {
        name: "carrier",
        label: "Carrier",
        type: "text",
        required: true,
        order: 1
      },
      {
        name: "productName",
        label: "Product Name",
        type: "text",
        required: true,
        order: 2
      },
      {
        name: "underwritingGrid",
        label: "Underwriting Grid",
        type: "grid",
        required: true,
        order: 3,
        fields: [
          { name: "age", label: "Age", type: "number" },
          { name: "gender", label: "Gender", type: "select", options: ["Male", "Female"] },
          { name: "tobaccoUse", label: "Tobacco Use", type: "select", options: ["Yes", "No"] },
          { name: "rate", label: "Rate", type: "number" }
        ]
      }
    ],
    data: {
      carrier: "FutureGuard",
      productName: "Universal Life Elite",
      underwritingGrid: [
        { age: 30, gender: "Male", tobaccoUse: "No", rate: 0.045 },
        { age: 30, gender: "Male", tobaccoUse: "Yes", rate: 0.065 },
        { age: 30, gender: "Female", tobaccoUse: "No", rate: 0.04 },
        { age: 30, gender: "Female", tobaccoUse: "Yes", rate: 0.06 },
        { age: 40, gender: "Male", tobaccoUse: "No", rate: 0.055 },
        { age: 40, gender: "Male", tobaccoUse: "Yes", rate: 0.075 },
        { age: 40, gender: "Female", tobaccoUse: "No", rate: 0.05 },
        { age: 40, gender: "Female", tobaccoUse: "Yes", rate: 0.07 }
      ]
    }
  }
]; 