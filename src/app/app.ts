import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ExpressionEditorComponent } from '../../projects/transex/src/lib/components/expression-editor/expression-editor.component';
import { ExpressionEvaluatorService } from '../../projects/transex/src/lib/services/expression-evaluator.service';
import { 
  ExpressionEditorConfig, 
  ExpressionEditorConfigEnhanced,
  TypeValidationResult, 
  Variable, 
  DataType, 
  ContextType 
} from '../../projects/transex/src/lib/interfaces/shared.interfaces';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule, ExpressionEditorComponent],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class AppComponent {
  // Expression values for each context
  booleanExpression = '';
  assignmentExpression = ''; 
  arithmeticExpression = '';
  limitedConnectorExpression = ''; 
  generalExpression = '';

  // Expression configurations for each context
  booleanConfig: ExpressionEditorConfig;
  assignmentConfig: ExpressionEditorConfig; 
  arithmeticConfig: ExpressionEditorConfig;
  limitedConnectorConfig: ExpressionEditorConfig;
  generalConfig: ExpressionEditorConfigEnhanced;

  // Validation results for each context
  booleanValidation: TypeValidationResult | null = null;
  assignmentValidation: TypeValidationResult | null = null; 
  arithmeticValidation: TypeValidationResult | null = null;
  limitedConnectorValidation: TypeValidationResult | null = null; 
  generalValidation: TypeValidationResult | null = null;

  // Test examples for each context
  booleanExamples = [
    'status == "active"',
    'temperature > 25',
    'isEnabled && hasPermission',
    'count >= 10 || priority == "high"',
    'name != null'
  ];

  assignmentExamples = [ 
    'output.value = input.data',
    'result = transform(source)',
    'target.name = source.title',
    'destination.amount = source.price * quantity',
    'output.status = input.isValid ? "success" : "error"'
  ];

  arithmeticExamples = [
    'price * quantity',
    '(a + b) / 2',
    'Math.sqrt(x * x + y * y)',
    'total - discount + tax',
    'Math.max(minValue, actualValue)'
  ];

  limitedConnectorExamples = [ 
    'a + b',
    'price * quantity',
    '(total - discount) / 2',
    'value1 * value2 + value3'
  ];

  limitedConnectorNoDivExamples = [
    'a + b',
    'price * quantity',
    'total - discount',
    'value1 * value2 + value3'
  ];

  // General examples with lambda functions, boolean, assignment, and arithmetic
  generalExamples = [
    // Lambda Functions
    '(x, y) => x + y',
    '(price, quantity) => price * quantity',
    '(value, min, max) => value >= min && value <= max',
    'x => x * x',
    '(a, b) => Math.max(a, b)',
    
    // Boolean Expressions
    'temperature > 25',
    'status == "active"',
    'isEnabled && hasPermission',
    'count >= 10 || priority == "high"',
    
    // Assignment Expressions
    'output.value = input.data',
    'result = transform(source)',
    'target.name = source.title',
    
    // Arithmetic Expressions
    'price * quantity',
    '(a + b) / 2',
    'Math.sqrt(x * x + y * y)',
    'total - discount + tax',
    
    // Variable Usage
    'price * quantity + tax',
    'temperature > 25 ? "hot" : "cold"',
    'Math.round(price * quantity * 1.2)'
  ];

  // Variable examples for testing
  testVariables: Variable[] = [
    {
      name: 'price',
      value: 19.99,
      type: DataType.REAL,
      explanation: 'Product unit price in currency',
      example: 'price * quantity'
    },
    {
      name: 'quantity',
      value: 3,
      type: DataType.INTEGER,
      explanation: 'Number of items to purchase',
      example: 'price * quantity'
    },
    {
      name: 'temperature',
      value: 25.5,
      type: DataType.REAL,
      explanation: 'Current temperature in Celsius',
      example: 'temperature > 30'
    },
    {
      name: 'status',
      value: 'active',
      type: DataType.STRING,
      explanation: 'Current system status',
      example: 'status == "active"'
    },
    {
      name: 'isEnabled',
      value: true,
      type: DataType.BOOLEAN,
      explanation: 'Whether the feature is enabled',
      example: 'isEnabled && hasPermission'
    },
    {
      name: 'count',
      value: 42,
      type: DataType.INTEGER,
      explanation: 'Total number of processed items',
      example: 'count > 50'
    }
  ];

  constructor(private evaluatorService: ExpressionEvaluatorService) {
    // Add test variables to the service for proper management
    // This ensures variables are consistently managed across all contexts
    this.testVariables.forEach(variable => {
      this.evaluatorService.addVariable(variable);
    });

    // Initialize Expression configurations - variables managed by service
    this.booleanConfig = {
      ...this.evaluatorService.getBooleanConfig()
    };
    this.assignmentConfig = {
      ...this.evaluatorService.getAssignmentConfig()
    };
    this.arithmeticConfig = {
      ...this.evaluatorService.getArithmeticConfig()
    };
    this.limitedConnectorConfig = {
      ...this.evaluatorService.getLimitedConnectorConfig()
    };

    // Initialize General configuration with enhanced features
    this.generalConfig = {
      expectedResultType: DataType.REAL,
      contextType: ContextType.GENERAL,
      strictValidation: false,
      allowVariableCreation: true,
      title: 'General Expression Editor with Variables',
      description: 'Create expressions and lambda functions using variables. Supports syntax like (x, y) => x + y',
      placeholder: 'Enter expression or lambda function (e.g., (x, y) => x + y) or use variables like price * quantity',
      examples: this.generalExamples
    };
    // Trigger recompilation and ensure the file is properly saved
  }

  // Validation change handlers
  onBooleanValidationChange(validation: TypeValidationResult | null) {
    this.booleanValidation = validation;
  }

  onAssignmentValidationChange(validation: TypeValidationResult | null) { 
    this.assignmentValidation = validation;
  }

  onArithmeticValidationChange(validation: TypeValidationResult | null) {
    this.arithmeticValidation = validation;
  }

  onLimitedConnectorValidationChange(validation: TypeValidationResult | null) { 
    this.limitedConnectorValidation = validation;
  }

  onLimitedConnectorNoDivValidationChange(validation: TypeValidationResult | null) { 
    this.limitedConnectorValidation = validation;
  }

  onGeneralValidationChange(validation: TypeValidationResult | null) {
    this.generalValidation = validation;
  }

  onLimitedConnectorConfigChange(config: ExpressionEditorConfig) {
    this.limitedConnectorConfig = config;
  }

  // Example selection handlers
  selectBooleanExample(example: string) {
    this.booleanExpression = example;
  }

  selectAssignmentExample(example: string) { 
    this.assignmentExpression = example;
  }

  selectArithmeticExample(example: string) {
    this.arithmeticExpression = example;
  }

  selectLimitedConnectorExample(example: string) { 
    this.limitedConnectorExpression = example;
  }

  selectLimitedConnectorNoDivExample(example: string) {
    this.limitedConnectorExpression = example;
  }

  selectGeneralExample(example: string) {
    this.generalExpression = example;
  }
}
