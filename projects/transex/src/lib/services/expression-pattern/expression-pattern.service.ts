import { Injectable } from '@angular/core';

export interface PatternMatch {
  isMatch: boolean;
  confidence: number; // 0-1 scale
  details?: any;
}

@Injectable({
  providedIn: 'root'
})
export class ExpressionPatternService {

  isLambdaFunction(expression: string): PatternMatch {
    const trimmed = expression.trim();
    const lambdaPattern = /^\s*(\([^)]*\)|\w+)\s*=>\s*.+/;
    const isMatch = lambdaPattern.test(trimmed);
    
    return {
      isMatch,
      confidence: isMatch ? 0.95 : 0,
      details: { pattern: 'lambda', expression: trimmed }
    };
  }

  isFieldAssignment(expression: string): PatternMatch {
    const trimmed = expression.trim();
    // Updated regex to avoid matching == (equals comparison)
    const assignmentPattern = /^[a-zA-Z_$][a-zA-Z0-9_$]*(\.[a-zA-Z_$][a-zA-Z0-9_$]*)*\s*=(?!=)\s*.+/;
    const isMatch = assignmentPattern.test(trimmed);
    
    return {
      isMatch,
      confidence: isMatch ? 0.9 : 0,
      details: { pattern: 'assignment', expression: trimmed }
    };
  }

  isTernaryExpression(expression: string): PatternMatch {
    const trimmed = expression.trim();
    const ternaryPattern = /.*\?.*:.*/;
    const isMatch = ternaryPattern.test(trimmed);
    
    return {
      isMatch,
      confidence: isMatch ? 0.85 : 0,
      details: { pattern: 'ternary', expression: trimmed }
    };
  }

  isBooleanExpression(expression: string): PatternMatch {
    const trimmed = expression.trim();
    
    // Boolean literals
    if (/^(true|false)$/i.test(trimmed)) {
      return {
        isMatch: true,
        confidence: 1.0,
        details: { pattern: 'boolean_literal', subtype: 'literal' }
      };
    }
    
    // Comparison operators
    if (/[<>=!]=?|[<>]/.test(trimmed)) {
      return {
        isMatch: true,
        confidence: 0.9,
        details: { pattern: 'boolean_expression', subtype: 'comparison' }
      };
    }
    
    // Logical operators
    if (/&&|\|\||!/.test(trimmed)) {
      return {
        isMatch: true,
        confidence: 0.85,
        details: { pattern: 'boolean_expression', subtype: 'logical' }
      };
    }
    
    return { isMatch: false, confidence: 0 };
  }

  isStringLiteral(expression: string): PatternMatch {
    const trimmed = expression.trim();
    const stringPattern = /^(['"`]).*\1$/;
    const isMatch = stringPattern.test(trimmed);
    
    return {
      isMatch,
      confidence: isMatch ? 1.0 : 0,
      details: { pattern: 'string_literal', expression: trimmed }
    };
  }

  isNumericExpression(expression: string): PatternMatch {
    const trimmed = expression.trim();
    
    // Pure number
    if (/^\d+(\.\d+)?$/.test(trimmed)) {
      return {
        isMatch: true,
        confidence: 1.0,
        details: { pattern: 'numeric', subtype: 'literal' }
      };
    }
    
    // Contains arithmetic operators
    if (/[+\-*/%]/.test(trimmed)) {
      return {
        isMatch: true,
        confidence: 0.8,
        details: { pattern: 'numeric', subtype: 'arithmetic' }
      };
    }
    
    // Math functions
    if (/Math\.\w+\(/.test(trimmed)) {
      return {
        isMatch: true,
        confidence: 0.9,
        details: { pattern: 'numeric', subtype: 'math_function' }
      };
    }
    
    return { isMatch: false, confidence: 0 };
  }

  willReturnInteger(expression: string): PatternMatch {
    const trimmed = expression.trim();
    
    // Pure integer
    if (/^\d+$/.test(trimmed)) {
      return {
        isMatch: true,
        confidence: 1.0,
        details: { pattern: 'integer', subtype: 'literal' }
      };
    }
    
    // Contains division or decimal
    if (/[\/.]/.test(trimmed)) {
      return {
        isMatch: false,
        confidence: 0,
        details: { pattern: 'real', reason: 'contains_division_or_decimal' }
      };
    }
    
    // Integer arithmetic operations
    if (/^[\d\s+\-*()]+$/.test(trimmed)) {
      return {
        isMatch: true,
        confidence: 0.9,
        details: { pattern: 'integer', subtype: 'arithmetic' }
      };
    }
    
    // Math functions that return integers
    const integerMathFunctions = ['Math.abs', 'Math.ceil', 'Math.floor', 'Math.round', 'Math.trunc'];
    for (const func of integerMathFunctions) {
      if (trimmed.includes(func)) {
        return {
          isMatch: true,
          confidence: 0.85,
          details: { pattern: 'integer', subtype: 'math_function', function: func }
        };
      }
    }
    
    return { isMatch: false, confidence: 0 };
  }

  containsArithmeticOperators(expression: string): PatternMatch {
    const trimmed = expression.trim();
    const arithmeticPattern = /[+\-*/%]/;
    const isMatch = arithmeticPattern.test(trimmed);
    
    const operators = trimmed.match(/[+\-*/%]/g) || [];
    
    return {
      isMatch,
      confidence: isMatch ? 0.8 : 0,
      details: { 
        pattern: 'arithmetic_operators', 
        operators: operators,
        count: operators.length 
      }
    };
  }

  hasOnlyIntegerArguments(expression: string): PatternMatch {
    const trimmed = expression.trim();
    
    // Extract function arguments
    const functionMatch = trimmed.match(/\w+\(([^)]+)\)/);
    if (!functionMatch) {
      return { isMatch: false, confidence: 0 };
    }
    
    const args = functionMatch[1].split(',').map(arg => arg.trim());
    const allInteger = args.every(arg => /^\d+$/.test(arg));
    
    return {
      isMatch: allInteger,
      confidence: allInteger ? 0.9 : 0,
      details: { 
        pattern: 'integer_arguments', 
        arguments: args,
        allInteger 
      }
    };
  }

  analyzeComplexity(expression: string): {
    level: 'simple' | 'moderate' | 'complex' | 'very_complex';
    score: number;
    factors: string[];
  } {
    const trimmed = expression.trim();
    let score = 0;
    const factors: string[] = [];
    
    // Length factor
    if (trimmed.length > 50) {
      score += 2;
      factors.push('long_expression');
    }
    
    // Nested parentheses
    const parenDepth = this.getMaxParenthesesDepth(trimmed);
    if (parenDepth > 2) {
      score += parenDepth;
      factors.push('deep_nesting');
    }
    
    // Function calls
    const functionCalls = (trimmed.match(/\w+\(/g) || []).length;
    if (functionCalls > 2) {
      score += functionCalls;
      factors.push('multiple_functions');
    }
    
    // Operators
    const operators = (trimmed.match(/[+\-*/%=<>!&|]/g) || []).length;
    if (operators > 3) {
      score += Math.floor(operators / 2);
      factors.push('many_operators');
    }
    
    // Variables
    const variables = (trimmed.match(/[a-zA-Z_$][a-zA-Z0-9_$]*/g) || []).length;
    if (variables > 3) {
      score += Math.floor(variables / 2);
      factors.push('many_variables');
    }
    
    let level: 'simple' | 'moderate' | 'complex' | 'very_complex';
    if (score <= 2) level = 'simple';
    else if (score <= 5) level = 'moderate';
    else if (score <= 10) level = 'complex';
    else level = 'very_complex';
    
    return { level, score, factors };
  }

  private getMaxParenthesesDepth(expression: string): number {
    let maxDepth = 0;
    let currentDepth = 0;
    
    for (const char of expression) {
      if (char === '(') {
        currentDepth++;
        maxDepth = Math.max(maxDepth, currentDepth);
      } else if (char === ')') {
        currentDepth--;
      }
    }
    
    return maxDepth;
  }

  extractPatterns(expression: string): PatternMatch[] {
    const patterns: PatternMatch[] = [];
    
    patterns.push(this.isLambdaFunction(expression));
    patterns.push(this.isFieldAssignment(expression));
    patterns.push(this.isTernaryExpression(expression));
    patterns.push(this.isBooleanExpression(expression));
    patterns.push(this.isStringLiteral(expression));
    patterns.push(this.isNumericExpression(expression));
    patterns.push(this.containsArithmeticOperators(expression));
    
    return patterns.filter(pattern => pattern.isMatch);
  }
}
