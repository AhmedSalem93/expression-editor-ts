import { Injectable } from '@angular/core';
import { 
  DataType, 
  ContextType, 
  ExpressionEditorConfig, 
  TypeValidationResult, 
  Variable,
  ExpressionTypeResult,
  ExpressionEditorConfigEnhanced
} from '../interfaces/shared.interfaces';
import { TypeAnalyzerService } from './type-analyzer.service';
import { ValidationService } from './validation.service';
import { VariableManagerService } from './variable-manager.service';

@Injectable({
  providedIn: 'root'
})
export class ExpressionEvaluatorService {

  constructor(
    private typeAnalyzer: TypeAnalyzerService,
    private validator: ValidationService,
    private variableManager: VariableManagerService
  ) { }

  addVariable(variable: Variable): void {
    this.variableManager.addVariable(variable);
  }

  removeVariable(name: string): void {
    this.variableManager.removeVariable(name);
  }

  getVariables(): Variable[] {
    return this.variableManager.getVariables();
  }

  getVariable(name: string): Variable | undefined {
    return this.variableManager.getVariable(name);
  }

  identifyExpressionType(expression: string, config?: ExpressionEditorConfig | ExpressionEditorConfigEnhanced): ExpressionTypeResult {
    if (!expression || expression.trim().length === 0) {
      return {
        success: false,
        error: 'Expression is empty'
      };
    }

    try {
      const usedVariables = this.variableManager.extractUsedVariables(expression);

      const returnType = this.typeAnalyzer.analyzeExpressionReturnType(expression);
      
      const trimmedExpression = expression.trim();
      const singleVariable = this.variableManager.getVariable(trimmedExpression);
      const isLambdaExpression = singleVariable?.type === DataType.FUNCTION || this.isLambdaFunction(expression);
      
      let typeValidation: TypeValidationResult | undefined;
      if (config) {
        typeValidation = this.validator.validateExpressionType(expression, returnType, config);
      }

      return {
        success: true,
        returnType: returnType,
        typeValidation: typeValidation,
        usedVariables,
        isLambdaExpression
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown analysis error'
      };
    }
  }

  private isLambdaFunction(expression: string): boolean {
    // Detect lambda function
    return /^\s*(\([^)]*\)|\w+)\s*=>\s*.+/.test(expression.trim());
  }

  getAssignmentConfig(): ExpressionEditorConfig {
    return {
      expectedResultType: DataType.ASSIGNMENT,
      contextType: ContextType.ASSIGNMENT,
      strictValidation: true,
      title: 'Assignment Expression Editor',
      description: 'Enter assignment expressions for data mapping',
      placeholder: 'Enter assignment (e.g., output = input * 2)',
      examples: [
        'output.value = input.data',
        'result = transform(source)',
        'target.field = source.value * 2',
        'destination = calculation + offset'
      ]
    };
  }

  getLimitedConnectorConfig(allowDivision: boolean = false): ExpressionEditorConfig {
    const examples = [
      'a + b',
      'price * quantity',
      'total - discount',
      '(x + y) * 2'
    ];

    if (allowDivision) {
      examples.push('amount / count', 'total / 2');
    }

    return {
      expectedResultType: DataType.REAL,
      contextType: ContextType.LIMITED_CONNECTOR,
      strictValidation: true,
      allowDivision: allowDivision,
      title: 'Limited Connector Expression Editor',
      description: allowDivision 
        ? 'Enter arithmetic expressions using +, -, *, / operations'
        : 'Enter arithmetic expressions using +, -, * operations (division disabled)',
      placeholder: allowDivision 
        ? 'Enter arithmetic expression (e.g., a + b, x * y / 2)'
        : 'Enter arithmetic expression (e.g., a + b, x * y)',
      examples: examples
    };
  }

  getBooleanConfig(): ExpressionEditorConfig {
    return {
      expectedResultType: DataType.BOOLEAN,
      contextType: ContextType.BOOLEAN,
      strictValidation: true,
      title: 'Boolean Expression Editor',
      description: 'Enter boolean expressions for conditions and state machines',
      placeholder: 'Enter boolean condition (e.g., status == "active", value > 10)',
      examples: [
        'status == "active"',
        'temperature > 25',
        'isEnabled && hasPermission',
        'count >= minValue',
        'name != null'
      ]
    };
  }

  getArithmeticConfig(): ExpressionEditorConfig {
    return {
      expectedResultType: DataType.REAL,
      contextType: ContextType.ARITHMETIC,
      strictValidation: true,
      title: 'Arithmetic Expression Editor',
      description: 'Enter mathematical expressions for calculations',
      placeholder: 'Enter a mathematical expression (e.g., price * quantity)',
      examples: [
        'price * quantity',
        '(a + b) / 2',
        'Math.sqrt(x * x + y * y)',
        'total - discount + tax',
        'Math.max(minValue, actualValue)'
      ]
    };
  }

  getConnectorConfig(): ExpressionEditorConfig {
    return this.getAssignmentConfig();
  }

  getGeneralConfig(): ExpressionEditorConfig {
    return {
      expectedResultType: DataType.REAL,
      contextType: ContextType.GENERAL,
      strictValidation: false,
      title: 'General Expression Editor',
      description: 'Enter any type of expression',
      placeholder: 'Enter your expression here...',
      examples: [
        'any expression',
        'text or numbers',
        'calculations or assignments'
      ]
    };
  }

  getPlaceholderForType(config: ExpressionEditorConfig | ExpressionEditorConfigEnhanced): string {
    switch (config.contextType) {
      case ContextType.BOOLEAN:
        return 'Enter boolean condition (e.g., status == "active", value > 10)';
      case ContextType.ASSIGNMENT:
        return 'Enter assignment (e.g., output = input * 2)';
      case ContextType.LIMITED_CONNECTOR:
        return 'Enter arithmetic expression (e.g., a + b, price * quantity)';
      case ContextType.ARITHMETIC:
        return 'Enter mathematical expression (e.g., Math.sqrt(x), (a + b) / 2)';
      case ContextType.GENERAL:
        return 'Enter your expression here...';
      default:
        return 'Enter your expression here...';
    }
  }
}
