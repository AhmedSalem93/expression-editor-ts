import { FunctionCategory, SymbolCategory } from '../interfaces/shared.interfaces';

 //Contains all built-in function definitions organized by category
export const FUNCTION_CATEGORIES: FunctionCategory[] = [
  {
    name: 'arithmetic',
    label: 'Arithmetic',
    functions: [
      { 
        name: 'add', 
        syntax: 'add(a, b)', 
        description: 'Adds two numbers', 
        example: 'add(5, 3) = 8', 
        category: 'arithmetic' 
      },
      { 
        name: 'subtract', 
        syntax: 'subtract(a, b)', 
        description: 'Subtracts second number from first', 
        example: 'subtract(10, 3) = 7', 
        category: 'arithmetic' 
      },
      { 
        name: 'multiply', 
        syntax: 'multiply(a, b)', 
        description: 'Multiplies two numbers', 
        example: 'multiply(4, 5) = 20', 
        category: 'arithmetic' 
      },
      { 
        name: 'divide', 
        syntax: 'divide(a, b)', 
        description: 'Divides first number by second', 
        example: 'divide(15, 3) = 5', 
        category: 'arithmetic' 
      },
      { 
        name: 'power', 
        syntax: 'power(base, exponent)', 
        description: 'Raises base to the power of exponent', 
        example: 'power(2, 3) = 8', 
        category: 'arithmetic' 
      },
      { 
        name: 'square', 
        syntax: 'square(number)', 
        description: 'Returns the square of a number', 
        example: 'square(5) = 25', 
        category: 'arithmetic' 
      },
      { 
        name: 'sqrt', 
        syntax: 'sqrt(number)', 
        description: 'Returns square root of number', 
        example: 'sqrt(16) = 4', 
        category: 'arithmetic' 
      },
      { 
        name: 'abs', 
        syntax: 'abs(number)', 
        description: 'Returns absolute value', 
        example: 'abs(-5) = 5', 
        category: 'arithmetic' 
      }
    ]
  },
  {
    name: 'relational',
    label: 'Relational',
    functions: [
      { 
        name: 'equals', 
        syntax: 'equals(a, b)', 
        description: 'Checks if two values are equal', 
        example: 'equals(5, 5) = true', 
        category: 'relational' 
      },
      { 
        name: 'greaterThan', 
        syntax: 'greaterThan(a, b)', 
        description: 'Checks if first value is greater than second', 
        example: 'greaterThan(10, 5) = true', 
        category: 'relational' 
      },
      { 
        name: 'lessThan', 
        syntax: 'lessThan(a, b)', 
        description: 'Checks if first value is less than second', 
        example: 'lessThan(3, 8) = true', 
        category: 'relational' 
      },
      { 
        name: 'greaterThanOrEqual', 
        syntax: 'greaterThanOrEqual(a, b)', 
        description: 'Checks if first value is greater than or equal to second', 
        example: 'greaterThanOrEqual(5, 5) = true', 
        category: 'relational' 
      },
      { 
        name: 'lessThanOrEqual', 
        syntax: 'lessThanOrEqual(a, b)', 
        description: 'Checks if first value is less than or equal to second', 
        example: 'lessThanOrEqual(3, 5) = true', 
        category: 'relational' 
      }
    ]
  },
  {
    name: 'logical',
    label: 'Logical',
    functions: [
      { 
        name: 'and', 
        syntax: 'and(a, b)', 
        description: 'Logical AND operation', 
        example: 'and(true, false) = false', 
        category: 'logical' 
      },
      { 
        name: 'or', 
        syntax: 'or(a, b)', 
        description: 'Logical OR operation', 
        example: 'or(true, false) = true', 
        category: 'logical' 
      },
      { 
        name: 'not', 
        syntax: 'not(value)', 
        description: 'Logical NOT operation', 
        example: 'not(true) = false', 
        category: 'logical' 
      },
      { 
        name: 'if', 
        syntax: 'if(condition, trueValue, falseValue)', 
        description: 'Conditional expression', 
        example: 'if(greaterThan(5, 3), "yes", "no") = "yes"', 
        category: 'logical' 
      }
    ]
  },
  {
    name: 'string',
    label: 'String',
    functions: [
      { 
        name: 'concat', 
        syntax: 'concat(str1, str2)', 
        description: 'Concatenates two strings', 
        example: 'concat("Hello", " World") = "Hello World"', 
        category: 'string' 
      },
      { 
        name: 'length', 
        syntax: 'length(string)', 
        description: 'Returns length of string', 
        example: 'length("Hello") = 5', 
        category: 'string' 
      },
      { 
        name: 'substring', 
        syntax: 'substring(string, start, end)', 
        description: 'Extracts substring', 
        example: 'substring("Hello", 1, 4) = "ell"', 
        category: 'string' 
      },
      { 
        name: 'toUpperCase', 
        syntax: 'toUpperCase(string)', 
        description: 'Converts to uppercase', 
        example: 'toUpperCase("hello") = "HELLO"', 
        category: 'string' 
      },
      { 
        name: 'toLowerCase', 
        syntax: 'toLowerCase(string)', 
        description: 'Converts to lowercase', 
        example: 'toLowerCase("HELLO") = "hello"', 
        category: 'string' 
      }
    ]
  }
];

// Symbol Categories Data
export const SYMBOL_CATEGORIES: SymbolCategory[] = [
  {
    name: 'arithmetic',
    label: 'Arithmetic',
    symbols: [
      { name: 'Plus', symbol: '+', description: 'Addition operator', category: 'arithmetic' },
      { name: 'Minus', symbol: '-', description: 'Subtraction operator', category: 'arithmetic' },
      { name: 'Multiply', symbol: '*', description: 'Multiplication operator', category: 'arithmetic' },
      { name: 'Divide', symbol: '/', description: 'Division operator', category: 'arithmetic' },
      { name: 'Modulo', symbol: '%', description: 'Modulo operator', category: 'arithmetic' },
      { name: 'Power', symbol: '**', description: 'Exponentiation operator', category: 'arithmetic' }
    ]
  },
  {
    name: 'relational',
    label: 'Relational',
    symbols: [
      { name: 'Equal', symbol: '==', description: 'Equality operator', category: 'relational' },
      { name: 'Not Equal', symbol: '!=', description: 'Inequality operator', category: 'relational' },
      { name: 'Greater Than', symbol: '>', description: 'Greater than operator', category: 'relational' },
      { name: 'Less Than', symbol: '<', description: 'Less than operator', category: 'relational' },
      { name: 'Greater Equal', symbol: '>=', description: 'Greater than or equal operator', category: 'relational' },
      { name: 'Less Equal', symbol: '<=', description: 'Less than or equal operator', category: 'relational' }
    ]
  },
  {
    name: 'logical',
    label: 'Logical',
    symbols: [
      { name: 'AND', symbol: '&&', description: 'Logical AND operator', category: 'logical' },
      { name: 'OR', symbol: '||', description: 'Logical OR operator', category: 'logical' },
      { name: 'NOT', symbol: '!', description: 'Logical NOT operator', category: 'logical' },
      { name: 'Ternary If', symbol: '?:', description: 'Short if syntax (condition ? true : false)', category: 'logical' },
      { name: 'Question Mark', symbol: '?', description: 'Ternary operator condition part', category: 'logical' },
      { name: 'Colon', symbol: ':', description: 'Ternary operator separator', category: 'logical' }
    ]
  },
  {
    name: 'brackets',
    label: 'Brackets',
    symbols: [
      { name: 'Parentheses', symbol: '()', description: 'Grouping parentheses', category: 'brackets' },
      { name: 'Square Brackets', symbol: '[]', description: 'Square brackets', category: 'brackets' },
      { name: 'Curly Braces', symbol: '{}', description: 'Curly braces', category: 'brackets' },
      { name: 'Open Paren', symbol: '(', description: 'Opening parenthesis', category: 'brackets' },
      { name: 'Close Paren', symbol: ')', description: 'Closing parenthesis', category: 'brackets' }
    ]
  },
  {
    name: 'punctuation',
    label: 'Punctuation',
    symbols: [
      { name: 'Comma', symbol: ',', description: 'Comma separator', category: 'punctuation' },
      { name: 'Semicolon', symbol: ';', description: 'Semicolon', category: 'punctuation' },
      { name: 'Colon', symbol: ':', description: 'Colon', category: 'punctuation' },
      { name: 'Question Mark', symbol: '?', description: 'Question mark', category: 'punctuation' },
      { name: 'Dot', symbol: '.', description: 'Dot/period', category: 'punctuation' }
    ]
  }
];
