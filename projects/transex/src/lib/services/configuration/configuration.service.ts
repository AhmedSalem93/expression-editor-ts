import { Injectable } from '@angular/core';
import { 
  DataType, 
  ContextType, 
  ExpressionEditorConfig, 
  ExpressionEditorConfigEnhanced
} from '../../interfaces/shared.interfaces';

@Injectable({
  providedIn: 'root'
})
export class ConfigurationService {

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
