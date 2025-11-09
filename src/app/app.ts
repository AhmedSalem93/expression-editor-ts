import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';

import { ExpressionEditorComponent } from '../../projects/transex/src/lib/components/expression-editor/expression-editor.component';
import { ExpressionEvaluatorService } from 'transex';
import { 
  ExpressionEditorConfig, 
  ExpressionEditorConfigEnhanced,
  TypeValidationResult, 
  Variable, 
  DataType, 
  ContextType,
  FieldMappingData  
} from '../../projects/transex/src/lib/interfaces/shared.interfaces';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, ExpressionEditorComponent],
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

  currentExpression = '';
  binaryTreeForBackend: any = null;
  expression = ''; // Add this line for simple mode demo

 // Expression configurations for each context
 booleanConfig: ExpressionEditorConfigEnhanced;
 assignmentConfig: ExpressionEditorConfigEnhanced; 
 arithmeticConfig: ExpressionEditorConfigEnhanced;
 limitedConnectorConfig: ExpressionEditorConfigEnhanced;
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

  constructor(
    private evaluatorService: ExpressionEvaluatorService,
    private http: HttpClient  // Add this line
  ) {
    // Add test variables to the service for proper management
    // This ensures variables are consistently managed across all contexts
    this.testVariables.forEach(variable => {
      this.evaluatorService.addVariable(variable);
    });

        // Initialize Expression configurations - variables managed by service
    this.booleanConfig = {
      ...this.evaluatorService.getBooleanConfig(),
      variableMappings: [
        {
          frontendName: 'input.status',
          backendName: 'output.isActive'
        }
      ]
    };
    
    this.assignmentConfig = {
      ...this.evaluatorService.getAssignmentConfig(),
      variableMappings: [
        {
          frontendName: 'input.data',
          backendName: 'output.value'
        }
      ]
    };
    
    this.arithmeticConfig = {
      ...this.evaluatorService.getArithmeticConfig(),
      variableMappings: [
        {
          frontendName: 'input.price',
          backendName: 'output.total'
        }
      ]
    };
    
    this.limitedConnectorConfig = {
      ...this.evaluatorService.getLimitedConnectorConfig(false),
      allowDivision: false,
      title: 'Limited Connector with Field Mapping',
      description: 'Test field mapping: input.field[0] → output.status',
      placeholder: 'Try: (5+5)*5',
      examples: ['(5+5)*5', 'price * quantity', '10 + 20 * 3'],
      variableMappings: [
        {
          frontendName: 'input.field[0]',
          backendName: 'output.status'
        }
      ]
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
      examples: this.generalExamples,
      variableMappings: [
        {
          frontendName: 'input.value',
          backendName: 'output.result'
        }
      ]
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
  // This method receives the binary tree
  // onBinaryTreeChange(binaryTree: any) {
  //   if (binaryTree && binaryTree.success) {
  //     this.binaryTreeForBackend = binaryTree;
      
  //     // Log to console to see the binary tree
  //     //console.log('✅ Binary Tree Generated:', binaryTree);
  //     console.log('📄 JSON for Backend:', binaryTree.json);
  //     //console.log('🌳 Tree Structure:', binaryTree.tree);
      
  //     // Uncomment when you have a backend endpoint ready
  //     // this.sendToBackend(binaryTree);
  //   }
  // }
  // This method receives the field mapping data
onFieldMappingChange(fieldMapping: FieldMappingData | null) {
  if (fieldMapping) {
    // Simulate sending to backend
    this.sendFieldMappingToBackend(fieldMapping);
  }
}

sendFieldMappingToBackend(fieldMapping: FieldMappingData) {
  const backendPayload = {
    fieldName: fieldMapping.backendField,  // "output.status"
    expression: fieldMapping.expression,
    tree: JSON.parse(fieldMapping.tree.json),
    timestamp: fieldMapping.timestamp
  };
  
  console.log('📤 Sending to Backend:', backendPayload);
  
  // Uncomment when you have a backend endpoint
  // this.http.post('/api/fields/save', backendPayload).subscribe(response => {
  //   console.log('✅ Saved to backend:', response);
  // });
}

  sendToBackend(binaryTree: any) {
    // Option 1: Send the JSON string
    const jsonPayload = binaryTree.json;
    
    // Option 2: Send the tree object
    const treePayload = binaryTree.tree;
    
    // Example HTTP request
    this.http.post('/api/expressions/parse', {
      expression: binaryTree.expression,
      binaryTree: JSON.parse(binaryTree.json),
      timestamp: binaryTree.timestamp
    }).subscribe((response: any) => {  // Add type annotation
      console.log('Backend processed:', response);
    });
  }
}
