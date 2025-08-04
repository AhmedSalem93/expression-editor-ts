import { ExpressionEditorExtension } from '../interfaces/extensibility.interfaces';

// Example Math Extension
export const MathExtension: ExpressionEditorExtension = {
  name: 'Math Extension',
  version: '1.0.0',
  description: 'Advanced mathematical functions for expressions',
  
  customFunctions: [
    {
      name: 'sin',
      syntax: 'sin(angle)',
      description: 'Returns the sine of an angle (in radians)',
      example: 'sin(3.14159/2) = 1',
      category: 'trigonometry',
      implementation: (angle: number) => Math.sin(angle)
    },
    {
      name: 'cos',
      syntax: 'cos(angle)',
      description: 'Returns the cosine of an angle (in radians)',
      example: 'cos(0) = 1',
      category: 'trigonometry',
      implementation: (angle: number) => Math.cos(angle)
    },
    {
      name: 'tan',
      syntax: 'tan(angle)',
      description: 'Returns the tangent of an angle (in radians)',
      example: 'tan(3.14159/4) ≈ 1',
      category: 'trigonometry',
      implementation: (angle: number) => Math.tan(angle)
    },
    {
      name: 'log',
      syntax: 'log(number)',
      description: 'Returns the natural logarithm of a number',
      example: 'log(2.718) ≈ 1',
      category: 'logarithmic',
      implementation: (num: number) => Math.log(num)
    },
    {
      name: 'log10',
      syntax: 'log10(number)',
      description: 'Returns the base-10 logarithm of a number',
      example: 'log10(100) = 2',
      category: 'logarithmic',
      implementation: (num: number) => Math.log10(num)
    },
    {
      name: 'factorial',
      syntax: 'factorial(n)',
      description: 'Returns the factorial of a number',
      example: 'factorial(5) = 120',
      category: 'arithmetic',
      implementation: (n: number) => {
        if (n < 0) return NaN;
        if (n === 0 || n === 1) return 1;
        let result = 1;
        for (let i = 2; i <= n; i++) {
          result *= i;
        }
        return result;
      }
    }
  ],

  customFunctionCategories: [
    {
      name: 'trigonometry',
      label: 'Trigonometry',
      functions: [] // Will be populated by the functions above
    },
    {
      name: 'logarithmic',
      label: 'Logarithmic',
      functions: [] // Will be populated by the functions above
    }
  ],

  customSymbols: [
    {
      name: 'Pi',
      symbol: 'π',
      description: 'Mathematical constant Pi (3.14159...)',
      category: 'constants'
    },
    {
      name: 'Euler',
      symbol: 'e',
      description: 'Mathematical constant e (2.71828...)',
      category: 'constants'
    }
  ],

  customSymbolCategories: [
    {
      name: 'constants',
      label: 'Constants',
      symbols: [] // Will be populated by the symbols above
    }
  ],

  customVariables: {
    PI: Math.PI,
    E: Math.E,
    SQRT2: Math.SQRT2,
    SQRT1_2: Math.SQRT1_2,
    LN2: Math.LN2,
    LN10: Math.LN10,
    LOG2E: Math.LOG2E,
    LOG10E: Math.LOG10E
  }
};
