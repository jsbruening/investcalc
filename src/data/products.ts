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
    _id: "money-market-1",
    type: "moneyMarket",
    termType: "open",
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
        { minAmount: 0, maxAmount: 9999, rate: 0.04 },
        { minAmount: 10000, maxAmount: 49999, rate: 0.045 },
        { minAmount: 50000, maxAmount: 99999, rate: 0.048 },
        { minAmount: 100000, maxAmount: 1000000, rate: 0.051 }
      ]
    }
  },
  {
    _id: "money-market-2",
    type: "moneyMarket",
    termType: "open",
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
      institution: "WealthGuard",
      productName: "Enhanced Money Market",
      rateGrid: [
        { minAmount: 0, maxAmount: 24999, rate: 0.042 },
        { minAmount: 25000, maxAmount: 99999, rate: 0.048 },
        { minAmount: 100000, maxAmount: 249999, rate: 0.051 },
        { minAmount: 250000, maxAmount: 1000000, rate: 0.054 }
      ]
    }
  },
  {
    _id: "money-market-3",
    type: "moneyMarket",
    termType: "open",
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
      institution: "FutureGrowth",
      productName: "Elite Money Market",
      rateGrid: [
        { minAmount: 0, maxAmount: 49999, rate: 0.045 },
        { minAmount: 50000, maxAmount: 249999, rate: 0.051 },
        { minAmount: 250000, maxAmount: 499999, rate: 0.054 },
        { minAmount: 500000, maxAmount: 1000000, rate: 0.057 }
      ]
    }
  },
  {
    _id: "annuity-1",
    type: "annuity",
    termType: "fixed",
    calculatorType: "calculateAnnuityReturn",
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
        name: "termYears",
        label: "Term Years",
        type: "number",
        required: true,
        order: 3
      },
      {
        name: "bonusRate",
        label: "Bonus Rate",
        type: "number",
        required: true,
        order: 4
      },
      {
        name: "rateGrid",
        label: "Rate Grid",
        type: "grid",
        required: true,
        order: 5,
        fields: [
          { name: "minAmount", label: "Min Amount", type: "number" },
          { name: "maxAmount", label: "Max Amount", type: "number" },
          { name: "rate", label: "Rate", type: "number" }
        ]
      }
    ],
    data: {
      institution: "SecureLife",
      productName: "Secure Growth Annuity",
      termYears: 5,
      bonusRate: 0.02,
      rateGrid: [
        { minAmount: 0, maxAmount: 49999, rate: 0.045 },
        { minAmount: 50000, maxAmount: 249999, rate: 0.051 },
        { minAmount: 250000, maxAmount: 1000000, rate: 0.054 }
      ]
    }
  },
  {
    _id: "annuity-2",
    type: "annuity",
    termType: "fixed",
    calculatorType: "calculateAnnuityReturn",
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
        name: "termYears",
        label: "Term Years",
        type: "number",
        required: true,
        order: 3
      },
      {
        name: "bonusRate",
        label: "Bonus Rate",
        type: "number",
        required: true,
        order: 4
      },
      {
        name: "rateGrid",
        label: "Rate Grid",
        type: "grid",
        required: true,
        order: 5,
        fields: [
          { name: "minAmount", label: "Min Amount", type: "number" },
          { name: "maxAmount", label: "Max Amount", type: "number" },
          { name: "rate", label: "Rate", type: "number" }
        ]
      }
    ],
    data: {
      institution: "WealthGuard",
      productName: "Enhanced Income Annuity",
      termYears: 7,
      bonusRate: 0.025,
      rateGrid: [
        { minAmount: 0, maxAmount: 99999, rate: 0.048 },
        { minAmount: 100000, maxAmount: 499999, rate: 0.052 },
        { minAmount: 500000, maxAmount: 1000000, rate: 0.055 }
      ]
    }
  },
  {
    _id: "annuity-3",
    type: "annuity",
    termType: "fixed",
    calculatorType: "calculateAnnuityReturn",
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
        name: "termYears",
        label: "Term Years",
        type: "number",
        required: true,
        order: 3
      },
      {
        name: "bonusRate",
        label: "Bonus Rate",
        type: "number",
        required: true,
        order: 4
      },
      {
        name: "rateGrid",
        label: "Rate Grid",
        type: "grid",
        required: true,
        order: 5,
        fields: [
          { name: "minAmount", label: "Min Amount", type: "number" },
          { name: "maxAmount", label: "Max Amount", type: "number" },
          { name: "rate", label: "Rate", type: "number" }
        ]
      }
    ],
    data: {
      institution: "FutureGrowth",
      productName: "Elite Growth Annuity",
      termYears: 10,
      bonusRate: 0.03,
      rateGrid: [
        { minAmount: 0, maxAmount: 249999, rate: 0.051 },
        { minAmount: 250000, maxAmount: 499999, rate: 0.054 },
        { minAmount: 500000, maxAmount: 1000000, rate: 0.057 }
      ]
    }
  },
  {
    _id: "cd-1",
    type: "cd",
    termType: "fixed",
    calculatorType: "calculateCDReturn",
    schema: [
      { name: "institution", label: "Institution", type: "text", required: true, order: 1 },
      { name: "productName", label: "Product Name", type: "text", required: true, order: 2 },
      { name: "termMonths", label: "Term (Months)", type: "number", required: true, order: 3 },
      { name: "rate", label: "Rate", type: "number", required: true, order: 4 }
    ],
    data: {
      institution: "SecureBank",
      productName: "12-Month CD",
      termMonths: 12,
      rate: 0.04
    }
  },
  {
    _id: "cd-2",
    type: "cd",
    termType: "fixed",
    calculatorType: "calculateCDReturn",
    schema: [
      { name: "institution", label: "Institution", type: "text", required: true, order: 1 },
      { name: "productName", label: "Product Name", type: "text", required: true, order: 2 },
      { name: "termMonths", label: "Term (Months)", type: "number", required: true, order: 3 },
      { name: "rate", label: "Rate", type: "number", required: true, order: 4 }
    ],
    data: {
      institution: "WealthGuard",
      productName: "36-Month CD",
      termMonths: 36,
      rate: 0.045
    }
  },
  {
    _id: "cd-3",
    type: "cd",
    termType: "fixed",
    calculatorType: "calculateCDReturn",
    schema: [
      { name: "institution", label: "Institution", type: "text", required: true, order: 1 },
      { name: "productName", label: "Product Name", type: "text", required: true, order: 2 },
      { name: "termMonths", label: "Term (Months)", type: "number", required: true, order: 3 },
      { name: "rate", label: "Rate", type: "number", required: true, order: 4 }
    ],
    data: {
      institution: "FutureGrowth",
      productName: "60-Month CD",
      termMonths: 60,
      rate: 0.05
    }
  }
]; 