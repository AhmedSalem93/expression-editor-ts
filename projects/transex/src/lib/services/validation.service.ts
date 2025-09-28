import { Injectable } from '@angular/core';
import { 
  DataType, 
  ContextType, 
  ExpressionEditorConfig, 
  TypeValidationResult, 
  ExpressionEditorConfigEnhanced
} from '../interfaces/shared.interfaces';

@Injectable({
  providedIn: 'root'
})
export class ValidationService {

  validateExpressionType(expression: string, returnType: DataType, config: ExpressionEditorConfig | ExpressionEditorConfigEnhanced): TypeValidationResult {
    switch (config.contextType) {
      case ContextType.BOOLEAN:
        return this.validateBooleanContext(expression, returnType, config);
      case ContextType.ASSIGNMENT:
        return this.validateAssignmentContext(expression, returnType, config);
      case ContextType.ARITHMETIC:
        return this.validateArithmeticContext(expression, returnType, config);
      case ContextType.LIMITED_CONNECTOR:
        return this.validateLimitedConnectorContext(expression, returnType, config);
      case ContextType.GENERAL:
        return {
          isValid: true,
          message: 'Expression is valid',
          expectedType: config.expectedResultType,
          actualType: returnType,
          contextType: config.contextType
        };
      default:
        return {
          isValid: true,
          message: 'Expression is valid',
          expectedType: config.expectedResultType,
          actualType: returnType,
          contextType: config.contextType
        };
    }
  }

  private validateBooleanContext(expression: string, returnType: DataType, config: ExpressionEditorConfig | ExpressionEditorConfigEnhanced): TypeValidationResult {
    const isLambdaFunction = this.isLambdaFunction(expression);
    if (isLambdaFunction) {
      return {
        isValid: false,
        message: 'Lambda functions are not allowed in boolean context. Use boolean expressions like "status == \'active\'" or "temperature > 25"',
        expectedType: DataType.BOOLEAN,
        actualType: DataType.FUNCTION,
        contextType: config.contextType
      };
    }

    const isBoolean = returnType === DataType.BOOLEAN;
    
    return {
      isValid: isBoolean,
      message: isBoolean ? 'Valid boolean expression' : 'Expression must return a boolean value',
      expectedType: DataType.BOOLEAN,
      actualType: returnType,
      contextType: config.contextType
    };
  }

  private validateAssignmentContext(expression: string, returnType: DataType, config: ExpressionEditorConfig | ExpressionEditorConfigEnhanced): TypeValidationResult {
    const isLambdaFunction = this.isLambdaFunction(expression);
    if (isLambdaFunction) {
      return {
        isValid: false,
        message: 'Lambda functions are not allowed in assignment context. Use assignment expressions like "output.value = input.data"',
        expectedType: DataType.ASSIGNMENT,
        actualType: DataType.FUNCTION,
        contextType: config.contextType
      };
    }

    const isAssignment = returnType === DataType.ASSIGNMENT;
    
    return {
      isValid: isAssignment,
      message: isAssignment ? 'Valid assignment expression' : 'Expression must be an assignment (e.g., field = value)',
      expectedType: DataType.ASSIGNMENT,
      actualType: returnType,
      contextType: config.contextType
    };
  }

  private validateArithmeticContext(expression: string, returnType: DataType, config: ExpressionEditorConfig | ExpressionEditorConfigEnhanced): TypeValidationResult {
    const isLambdaFunction = this.isLambdaFunction(expression);
    if (isLambdaFunction) {
      return {
        isValid: false,
        message: 'Lambda functions are not allowed in arithmetic context. Use mathematical expressions like "price * quantity"',
        expectedType: DataType.REAL,
        actualType: DataType.FUNCTION,
        contextType: config.contextType
      };
    }

    const isNumeric = returnType === DataType.INTEGER || returnType === DataType.REAL;
    
    return {
      isValid: isNumeric,
      message: isNumeric ? 'Valid arithmetic expression' : 'Expression must return a numeric value',
      expectedType: DataType.REAL,
      actualType: returnType,
      contextType: config.contextType
    };
  }

  private validateLimitedConnectorContext(expression: string, returnType: DataType, config: ExpressionEditorConfig | ExpressionEditorConfigEnhanced): TypeValidationResult {
    const isLambdaFunction = this.isLambdaFunction(expression);
    if (isLambdaFunction) {
      return {
        isValid: false,
        message: 'Lambda functions are not allowed in limited connector context. Use simple arithmetic expressions like "a + b"',
        expectedType: DataType.REAL,
        actualType: DataType.FUNCTION,
        contextType: ContextType.LIMITED_CONNECTOR
      };
    }

    const hasOnlyAllowedOperators = this.hasOnlyAllowedArithmeticOperators(expression, config);
    const isNumeric = returnType === DataType.INTEGER || returnType === DataType.REAL;
    
    const hasDivision = expression.includes('/');
    const divisionAllowed = config.allowDivision !== false;
    
    return {
      isValid: hasOnlyAllowedOperators && isNumeric && (divisionAllowed || !hasDivision),
      message: !divisionAllowed && hasDivision
        ? 'Division (/) operator is not allowed in this context'
        : hasOnlyAllowedOperators && isNumeric 
          ? 'Valid limited connector expression' 
          : 'Expression must use only allowed operators and return a numeric value',
      expectedType: DataType.REAL,
      actualType: returnType,
      contextType: ContextType.LIMITED_CONNECTOR
    };
  }

  private hasOnlyAllowedArithmeticOperators(expression: string, config: ExpressionEditorConfig | ExpressionEditorConfigEnhanced): boolean {
    // Check for disallowed function calls like Math.sqrt, Math.pow, etc.
    if (/Math\.|[a-zA-Z_][a-zA-Z0-9_]*\s*\(/.test(expression)) {
      return false;
    }
    
    // Remove numbers, parentheses, spaces, field names, and commas
    const operators = expression.replace(/[\d\w\s().,]/g, '');
    
    if (config.allowDivision === false) {
      // Only allow +, -, * (no division)
      return /^[+\-*]*$/.test(operators);
    } else {
      // Allow +, -, *, /
      return /^[+\-*/]*$/.test(operators);
    }
  }

  private isLambdaFunction(expression: string): boolean {
    // Detect lambda function patterns like (x, y) => x + y or x => x * 2
    return /^\s*(\([^)]*\)|\w+)\s*=>\s*.+/.test(expression.trim());
  }
}
