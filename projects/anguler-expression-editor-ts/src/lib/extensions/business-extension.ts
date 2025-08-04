import { ExpressionEditorExtension } from '../interfaces/extensibility.interfaces';

// Example Business/Finance Extension
export const BusinessExtension: ExpressionEditorExtension = {
  name: 'Business Extension',
  version: '1.0.0',
  description: 'Business and financial functions for expressions',
  
  customFunctions: [
    {
      name: 'percentage',
      syntax: 'percentage(value, total)',
      description: 'Calculates percentage of value from total',
      example: 'percentage(25, 100) = 25',
      category: 'finance',
      implementation: (value: number, total: number) => (value / total) * 100
    },
    {
      name: 'discount',
      syntax: 'discount(price, discountPercent)',
      description: 'Calculates discounted price',
      example: 'discount(100, 20) = 80',
      category: 'finance',
      implementation: (price: number, discountPercent: number) => price * (1 - discountPercent / 100)
    },
    {
      name: 'tax',
      syntax: 'tax(amount, taxRate)',
      description: 'Calculates tax amount',
      example: 'tax(100, 8.5) = 8.5',
      category: 'finance',
      implementation: (amount: number, taxRate: number) => amount * (taxRate / 100)
    },
    {
      name: 'compound',
      syntax: 'compound(principal, rate, time)',
      description: 'Calculates compound interest',
      example: 'compound(1000, 5, 2) = 1102.5',
      category: 'finance',
      implementation: (principal: number, rate: number, time: number) => 
        principal * Math.pow(1 + rate / 100, time)
    },
    {
      name: 'average',
      syntax: 'average(...numbers)',
      description: 'Calculates average of numbers',
      example: 'average(10, 20, 30) = 20',
      category: 'statistics',
      implementation: (...numbers: number[]) => 
        numbers.reduce((sum, num) => sum + num, 0) / numbers.length
    },
    {
      name: 'median',
      syntax: 'median(...numbers)',
      description: 'Calculates median of numbers',
      example: 'median(1, 2, 3, 4, 5) = 3',
      category: 'statistics',
      implementation: (...numbers: number[]) => {
        const sorted = numbers.sort((a, b) => a - b);
        const mid = Math.floor(sorted.length / 2);
        return sorted.length % 2 === 0 
          ? (sorted[mid - 1] + sorted[mid]) / 2 
          : sorted[mid];
      }
    }
  ],

  customFunctionCategories: [
    {
      name: 'finance',
      label: 'Finance',
      functions: []
    },
    {
      name: 'statistics',
      label: 'Statistics',
      functions: []
    }
  ],

  customSymbols: [
    {
      name: 'Dollar',
      symbol: '$',
      description: 'Dollar currency symbol',
      category: 'currency'
    },
    {
      name: 'Euro',
      symbol: '€',
      description: 'Euro currency symbol',
      category: 'currency'
    },
    {
      name: 'Percent',
      symbol: '%',
      description: 'Percentage symbol',
      category: 'business'
    }
  ],

  customSymbolCategories: [
    {
      name: 'currency',
      label: 'Currency',
      symbols: []
    },
    {
      name: 'business',
      label: 'Business',
      symbols: []
    }
  ],

  customVariables: {
    TAX_RATE: 8.5,
    DISCOUNT_RATE: 10,
    INTEREST_RATE: 5.0
  }
};
