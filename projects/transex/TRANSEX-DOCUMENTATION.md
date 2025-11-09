
## Table of Contents

1. [High-Level Overview](#high-level-overview)
2. [Core Functionality](#core-functionality)
3. [Context Types & Usage](#context-types--usage)
4. [Configuration & Customization](#configuration--customization)
5. [User Workflows](#user-workflows)
6. [Architecture Overview](#architecture-overview)
7. [Component Documentation](#component-documentation)
8. [Service Documentation](#service-documentation)
9. [Testing](#testing)
10. [Best Practices](#best-practices)

---

## High-Level Overview

### What is TransEx?

TransEx is a powerful, context-aware Angular expression editor library designed for building, validating, and analyzing mathematical, boolean, and assignment expressions in real-time. It provides a rich UI with syntax validation, type inference, variable management, and extensible function libraries.

### Key Features

- ✅ **Multi-Context Support**: Boolean, Assignment, Arithmetic, Limited Connector, General
- ✅ **Real-Time Validation**: Context-specific validation with detailed error messages
- ✅ **Type Inference**: Automatic detection of expression return types (Boolean, Integer, Real, String, etc.)
- ✅ **Binary Tree Parsing**: Converts expressions to structured AST for analysis
- ✅ **Variable Management**: Create, manage, and use custom variables
- ✅ **Function Library**: Built-in mathematical, string, and logical functions
- ✅ **Symbol Picker**: Quick insertion of operators and symbols
- ✅ **Two Modes**: Full-featured editor or simple textarea mode
- ✅ **Form Integration**: Implements ControlValueAccessor for Angular forms
- ✅ **Standalone Components**: Modern Angular architecture


## Core Functionality

### Expression Analysis Pipeline
User Input → Tokenization → Parsing → Type Analysis → Validation → Result Display


1. **Tokenization**: Breaks expression into tokens (operators, variables, literals, functions)
2. **Parsing**: Builds binary tree (AST) with operator precedence
3. **Type Analysis**: Infers return type (Boolean, Integer, Real, String, etc.)
4. **Validation**: Checks against context rules (allowed operators, expected types)
5. **Display**: Shows validation status, type info, and evaluation results

### Supported Expression Types

- **Arithmetic**: `price * quantity`, `(a + b) / 2`, `Math.sqrt(x * x + y * y)`
- **Boolean**: `status == "active"`, `temperature > 25`, `isEnabled && hasPermission`
- **Assignment**: `output.value = input.data`, `result = calculation * 2`
- **Ternary**: `x > 10 ? "high" : "low"`
- **Lambda**: `(x, y) => x + y`, `x => x * 2`
- **Function Calls**: `Math.max(a, b)`, `subtract(10, 5)`

---

## Context Types & Usage

### 1. Boolean Context

**Purpose**: For conditions, state machines, and guard expressions

**Expected Result**: Boolean (true/false)

**Allowed Operations**:
- Comparison: `==`, `!=`, `<`, `>`, `<=`, `>=`
- Logical: `&&`, `||`, `!`
- Boolean literals: `true`, `false`

**Usage Example**:
```typescript
import { ExpressionEditorComponent } from 'transex';

[Component({](cci:4://file://Component({:0:0-0:0)
  standalone: true,
  imports: [ExpressionEditorComponent],
  template: `
    <lib-expression-editor
      [(ngModel)]="condition"
      [editorConfig]="booleanConfig"
      (validationChange)="onValidation($event)">
    </lib-expression-editor>
  `
})


2. Assignment Context
Purpose: For data mapping, field assignments, and transformations

Expected Result: Assignment operation

Allowed Operations:

Field assignment: output.field = value
Nested fields: result.data.value = input.source
Right-hand side can be any expression
Usage Example:

@Component({
  template: `
    <lib-expression-editor
      [(ngModel)]="mapping"
      [editorConfig]="assignmentConfig">
    </lib-expression-editor>
  `
})
export class DataMappingComponent {
  mapping = 'output.temperature = input.sensorValue * 1.8 + 32';
  assignmentConfig = this.evaluator.getAssignmentConfig();
}


3. Arithmetic Context
Purpose: For mathematical calculations and numeric expressions

Expected Result: Integer or Real number

Allowed Operations:

Arithmetic: +, -, *, /, %
Math functions: Math.sqrt(), Math.max(), Math.min(), etc.
Parentheses for grouping

4. Limited Connector Context
Purpose: For restricted arithmetic operations with optional division control

Expected Result: Integer or Real number

Allowed Operations:

Basic arithmetic: +, -, *
Division / (optional, controlled by toggle)
Parentheses for grouping
Special Feature: Division Toggle

Users can enable/disable division operation
Default: Division disabled
UI shows current allowed operations
Usage Example:

@Component({
  template: `
    <lib-expression-editor
      [(ngModel)]="expression"
      [editorConfig]="limitedConfig">
    </lib-expression-editor>
  `
})
export class ConnectorComponent {
  expression = 'input1 + input2 * 2';
  allowDivision = false;
  
  get limitedConfig() {
    return this.evaluator.getLimitedConnectorConfig(this.allowDivision);
  }
}


5. General Context
Purpose: Flexible editor without specific validation rules

Expected Result: Any type

Allowed Operations: All operations allowed

Use When:

You need maximum flexibility
Custom validation will be applied elsewhere
Prototyping or testing expressions
Configuration & Customization
Basic Configuration
Every context has a configuration object:



export interface ExpressionEditorConfig {
  expectedResultType: DataType;        // Expected return type
  contextType: ContextType;            // Context (BOOLEAN, ASSIGNMENT, etc.)
  title?: string;                      // Editor title
  description?: string;                // Help text
  placeholder?: string;                // Input placeholder
  allowDivision?: boolean;             // For LIMITED_CONNECTOR only
}

Creating Custom Configurations

// Custom boolean config with specific title
const customBooleanConfig: ExpressionEditorConfig = {
  expectedResultType: DataType.BOOLEAN,
  contextType: ContextType.BOOLEAN,
  title: 'Guard Condition Editor',
  description: 'Define when this guard should activate',
  placeholder: 'Enter condition (e.g., temperature > threshold)'
};

// Custom arithmetic config
const customArithmeticConfig: ExpressionEditorConfig = {
  expectedResultType: DataType.REAL,
  contextType: ContextType.ARITHMETIC,
  title: 'Price Calculator',
  description: 'Calculate final price with discounts and taxes',
  placeholder: 'Enter formula'
};
-------

Simple Mode vs Full Mode
Full Mode (default):

Complete UI with header, controls, info panel
Function menu, symbol picker, variable manager
Validation display, type information

Simple Mode:
Just a textarea with validation
Minimal UI for embedded scenarios
Custom styling support

// Simple mode with custom styling
@Component({
  template: `
    <lib-expression-editor
      [(ngModel)]="expression"
      [simpleMode]="true"
      [textareaStyle]="customStyle">
    </lib-expression-editor>
  `
})
export class EmbeddedEditorComponent {
  expression = '';
  customStyle = {
    borderColor: '#4CAF50',
    backgroundColor: '#f5f5f5',
    fontSize: '14px',
    minHeight: '60px'
  };
}
-------

Variable Management
Adding Variables:

const priceVariable: Variable = {
  name: 'price',
  value: 99.99,
  type: DataType.REAL,
  explanation: 'Product price in USD'
};

this.evaluator.addVariable(priceVariable);

Using Variables in Expressions:

// Variables are automatically detected and validated
const expression = 'price * quantity - discount';
const result = this.evaluator.identifyExpressionType(expression);

console.log('Used variables:', result.usedVariables);
// Output: [{ name: 'price', ... }, { name: 'quantity', ... }, { name: 'discount', ... }]

-------
Event Handling

@Component({
  template: `
    <lib-expression-editor
      [(ngModel)]="expression"
      [editorConfig]="config"
      (expressionChange)="onExpressionChange($event)"
      (validationChange)="onValidationChange($event)"
      (binaryTreeChange)="onTreeChange($event)"
      (configChange)="onConfigChange($event)">
    </lib-expression-editor>
  `
})
export class EventHandlingComponent {
  expression = '';
  config = this.evaluator.getBooleanConfig();
  
  onExpressionChange(expr: string) {
    console.log('Expression changed:', expr);
  }
  
  onValidationChange(validation: TypeValidationResult) {
    if (!validation.isValid) {
      console.error('Validation error:', validation.message);
    }
  }
  
  onTreeChange(tree: BinaryTreeResult) {
    if (tree.success) {
      console.log('Binary tree:', tree.json);
    }
  }
  
  onConfigChange(newConfig: ExpressionEditorConfig) {
    console.log('Config updated:', newConfig);
  }
}
-------


User Workflows

Workflow 1: Creating a Boolean Expression

1. User opens editor with Boolean context
   ↓
2. Editor displays:
   - Title: "Boolean Expression Editor"
   - Description: "Enter boolean expressions for conditions"
   - Allowed operators: ==, !=, <, >, <=, >=, &&, ||, !
   ↓
3. User types: "temperature > 25"
   ↓
4. System processes (debounced 500ms):
   - Tokenizes: [variable 'temperature', operator '>', literal '25']
   - Parses to binary tree
   - Analyzes type: BOOLEAN
   - Validates: ✓ Valid (comparison operator allowed in boolean context)
   ↓
5. UI updates:
   - Validation: ✓ Valid
   - Return Type: Boolean
   - No errors displayed
   ↓
6. User adds: " && humidity < 80"
   Full expression: "temperature > 25 && humidity < 80"
   ↓
7. System re-processes:
   - Tokenizes full expression
   - Parses with operator precedence (> before &&)
   - Type: BOOLEAN
   - Validates: ✓ Valid
   ↓
8. Expression ready for use in application



Workflow 2: Creating an Assignment with Variables

1. User opens editor with Assignment context
   ↓
2. User clicks "Manage Variables" button
   ↓
3. Variable Manager modal opens
   ↓
4. User creates variables:
   - Name: "celsius", Type: Real, Value: 25
   - Name: "fahrenheit", Type: Real, Value: 0
   ↓
5. User closes variable manager
   ↓
6. User types: "fahrenheit = celsius * 1.8 + 32"
   ↓
7. System processes:
   - Detects assignment pattern (= operator)
   - Extracts used variables: [celsius, fahrenheit]
   - Type: ASSIGNMENT
   - Validates: ✓ Valid assignment expression
   ↓
8. UI shows:
   - Used Variables: celsius, fahrenheit
   - Return Type: Assignment
   - Validation: ✓ Valid
   ↓
9. Expression can be saved and executed



Workflow 3: Using Functions and Symbols

1. User opens editor with Arithmetic context
   ↓
2. User clicks "Functions" button
   ↓
3. Functions menu opens with categories:
   - Mathematical
   - Trigonometric
   - Statistical
   - String
   - Custom
   ↓
4. User selects "Mathematical" → "Math.sqrt"
   ↓
5. Function syntax inserted at cursor: "Math.sqrt()"
   Cursor positioned inside parentheses
   ↓
6. User types: "x * x + y * y"
   Full: "Math.sqrt(x * x + y * y)"
   ↓
7. User clicks "Symbols" button
   ↓
8. Symbol picker opens with grid of operators
   ↓
9. User clicks "÷" symbol
   ↓
10. User types: "2"
    Full: "Math.sqrt(x * x + y * y) / 2"
    ↓
11. System validates:
    - Type: REAL (division produces real number)
    - All operators allowed in arithmetic context
    - ✓ Valid
    ↓
12. Expression ready for calculation


Workflow 4: Limited Connector with Division Toggle

1. User opens editor with Limited Connector context
   ↓
2. UI displays:
   - Division toggle (unchecked by default)
   - Allowed operations: +, -, *
   ↓
3. User types: "input1 + input2 * 2"
   ↓
4. System validates: ✓ Valid (only allowed operators used)
   ↓
5. User types: " / 3"
   Full: "input1 + input2 * 2 / 3"
   ↓
6. System validates: ✗ Invalid
   Error: "Division operator (/) is not allowed in this context"
   ↓
7. User sees error message and red validation indicator
   ↓
8. User enables division toggle
   ↓
9. System re-validates: ✓ Valid
   Allowed operations updated: +, -, *, /
   ↓
10. Expression now valid and ready to use



Workflow 5: Form Integration

1. Developer creates Angular reactive form:
   formulaForm = new FormGroup({
     expression: new FormControl('', Validators.required)
   });
   ↓
2. Binds expression editor to form control:
   <lib-expression-editor formControlName="expression">
   ↓
3. User enters expression in editor
   ↓
4. Editor implements ControlValueAccessor:
   - writeValue() updates internal value
   - onChange() notifies form of changes
   - onTouched() marks control as touched
   ↓
5. Form validation runs:
   - Required validator checks if expression exists
   - Custom validators can check validation result
   ↓
6. Form submit:
   - Access expression: this.formulaForm.value.expression
   - Expression is validated and ready for backend


-------


Architecture Overview
Component Structure

ExpressionEditorComponent (Main Orchestrator)
├── ExpressionHeaderComponent (Title & Description)
├── DivisionToggleComponent (Limited Connector Only)
├── ExpressionTextareaComponent (Input & Validation Display)
├── ExpressionControlsComponent (Action Buttons)
├── ExpressionInfoComponent (Type & Evaluation Results)
├── FunctionsMenuComponent (Function Picker Modal)
├── SymbolPickerComponent (Symbol Picker Modal)
├── VariableManagerComponent (Variable CRUD Modal)
└── CustomFunctionBuilderComponent (Custom Function Creator)

Service Layer

ExpressionEvaluatorService (Main Orchestrator)
├── TypeAnalyzerService (Type Inference)
├── ValidationService (Context Validation)
├── VariableManagerService (Variable CRUD)
├── BinaryTreeParserService (AST Generation)
│   └── TokenizerService (Tokenization)
├── ConfigurationService (Config Management)
└── ExpressionPatternService (Pattern Detection)

Data Flow
User Input
    ↓
ExpressionTextareaComponent
    ↓
ExpressionEditorComponent.onValueChange()
    ↓
Debounce (500ms)
    ↓
ExpressionEvaluatorService.identifyExpressionType()
    ↓
┌─────────────────────────────────────────┐
│ TokenizerService.tokenize()             │
│ BinaryTreeParserService.parseExpression()│
│ TypeAnalyzerService.analyzeType()       │
│ VariableManagerService.extractUsed()    │
│ ValidationService.validate()            │
└─────────────────────────────────────────┘
    ↓
ExpressionResult
    ↓
┌─────────────────────────────────────────┐
│ ExpressionInfoComponent (Display Type)  │
│ ExpressionTextareaComponent (Validation)│
│ Event Emitters (Notify Parent)          │
└─────────────────────────────────────────┘


-------


Component Documentation

## ExpressionEditorComponent
Location: src/lib/components/expression-editor/expression-editor.component.ts

Purpose: Main orchestrator component that coordinates all sub-components and services

Key Properties:

value: string - Current expression text
editorConfig: ExpressionEditorConfig - Current context configuration
simpleMode: boolean - Toggle between full and simple mode
disabled: boolean - Disable editor input
textareaStyle: any - Custom styles for simple mode
typeResult: ExpressionResult | null - Analysis result
currentValidation: TypeValidationResult | null - Validation result
Key Methods:

onValueChange(value: string): Handles expression changes, triggers debounced analysis
analyzeExpression(): Orchestrates type analysis and validation
insertTextAtCursor(text: string): Inserts text at current cursor position
onOpenFunctionsMenu(): Opens function picker modal
onOpenSymbolPicker(): Opens symbol picker modal
onFunctionSelected(func: FunctionItem): Handles function selection
onSymbolSelected(symbol: SymbolItem): Handles symbol selection
onVariableCreated(variable: Variable): Adds new variable
onVariableDeleted(variable: Variable): Removes variable
onVariableInserted(variable: Variable): Inserts variable name at cursor
clearExpression(): Clears the expression
writeValue(value: any): ControlValueAccessor implementation
registerOnChange(fn: any): ControlValueAccessor implementation
registerOnTouched(fn: any): ControlValueAccessor implementation
Events:

[Output()](cci:4://file://Output():0:0-0:0) expressionChange: EventEmitter<string> - Expression text changed
[Output()](cci:4://file://Output():0:0-0:0) validationChange: EventEmitter<TypeValidationResult> - Validation result changed
[Output()](cci:4://file://Output():0:0-0:0) binaryTreeChange: EventEmitter<BinaryTreeResult> - Binary tree generated
[Output()](cci:4://file://Output():0:0-0:0) configChange: EventEmitter<ExpressionEditorConfig> - Configuration changed

##
## ExpressionHeaderComponent
Location: src/lib/components/expression-editor/expression-header/

Purpose: Displays context-specific title and description

Inputs:

[Input()](cci:4://file://Input():0:0-0:0) title: string - Editor title
[Input()](cci:4://file://Input():0:0-0:0) description: string - Help text

## ExpressionTextareaComponent
Location: src/lib/components/expression-editor/expression-textarea/

Purpose: Main input area with validation display

Inputs:

[Input()](cci:4://file://Input():0:0-0:0) value: string - Expression text
[Input()](cci:4://file://Input():0:0-0:0) placeholder: string - Input placeholder
[Input()](cci:4://file://Input():0:0-0:0) disabled: boolean - Disable input
[Input()](cci:4://file://Input():0:0-0:0) validation: TypeValidationResult | null - Validation result
Outputs:

[Output()](cci:4://file://Output():0:0-0:0) valueChange: EventEmitter<string> - Text changed
[Output()](cci:4://file://Output():0:0-0:0) blur: EventEmitter<void> - Input lost focus
Key Features:

Implements ControlValueAccessor
Displays validation messages
Color-coded validation status (green/red border)
Auto-resize based on content


## ExpressionControlsComponent
Location: src/lib/components/expression-editor/expression-controls/

Purpose: Action buttons for opening modals and clearing expression

Outputs:

[Output()](cci:4://file://Output():0:0-0:0) openFunctions: EventEmitter<void> - Open functions menu
[Output()](cci:4://file://Output():0:0-0:0) openSymbols: EventEmitter<void> - Open symbol picker
[Output()](cci:4://file://Output():0:0-0:0) openVariables: EventEmitter<void> - Open variable manager
[Output()](cci:4://file://Output():0:0-0:0) openCustomFunction: EventEmitter<void> - Open custom function builder
[Output()](cci:4://file://Output():0:0-0:0) clear: EventEmitter<void> - Clear expression


## ExpressionInfoComponent
Location: src/lib/components/expression-editor/expression-info/

Purpose: Displays expression type information and evaluation results

Inputs:

[Input()](cci:4://file://Input():0:0-0:0) typeResult: ExpressionResult | null - Analysis result
[Input()](cci:4://file://Input():0:0-0:0) currentValidation: TypeValidationResult | null - Validation result
Key Methods:

shouldShowTypeInfo(): boolean - Determines if type info should be displayed (only when valid)
getDataTypeName(type: DataType): string - Converts DataType enum to display name


## DivisionToggleComponent
Location: src/lib/components/expression-editor/division-toggle/

Purpose: Toggle division operator for Limited Connector context

Inputs:

[Input()](cci:4://file://Input():0:0-0:0) allowDivision: boolean - Current division state
Outputs:

[Output()](cci:4://file://Output():0:0-0:0) divisionToggle: EventEmitter<boolean> - Division state changed
Features:

Checkbox for enabling/disabling division
Status indicator showing current allowed operations
Only visible in LIMITED_CONNECTOR context


## FunctionsMenuComponent
Location: src/lib/components/expression-editor/functions-menu/

Purpose: Modal for selecting functions from categorized list

Inputs:

[Input()](cci:4://file://Input():0:0-0:0) show: boolean - Show/hide modal
[Input()](cci:4://file://Input():0:0-0:0) selectedCategory: string - Currently selected category
Outputs:

[Output()](cci:4://file://Output():0:0-0:0) functionSelected: EventEmitter<FunctionItem> - Function selected
[Output()](cci:4://file://Output():0:0-0:0) close: EventEmitter<void> - Modal closed
Features:

Categorized function list (Mathematical, Trigonometric, Statistical, String, Custom)
Search/filter functionality
Function syntax and description display

## SymbolPickerComponent
Location: src/lib/components/expression-editor/symbol-picker/

Purpose: Modal for selecting mathematical and logical symbols

Inputs:

[Input()](cci:4://file://Input():0:0-0:0) show: boolean - Show/hide modal
Outputs:

[Output()](cci:4://file://Output():0:0-0:0) symbolSelected: EventEmitter<SymbolItem> - Symbol selected
[Output()](cci:4://file://Output():0:0-0:0) close: EventEmitter<void> - Modal closed
Features:

Grid layout of symbols
Categories: Arithmetic, Comparison, Logical, Special
Click to insert symbol


## VariableManagerComponent
Location: src/lib/components/expression-editor/variable-manager/

Purpose: Modal for managing variables (CRUD operations)

Inputs:

[Input()](cci:4://file://Input():0:0-0:0) show: boolean - Show/hide modal
[Input()](cci:4://file://Input():0:0-0:0) variables: Variable[] - Current variables list
Outputs:

[Output()](cci:4://file://Output():0:0-0:0) variableCreated: EventEmitter<Variable> - New variable created
[Output()](cci:4://file://Output():0:0-0:0) variableDeleted: EventEmitter<Variable> - Variable deleted
[Output()](cci:4://file://Output():0:0-0:0) variableInserted: EventEmitter<Variable> - Variable inserted into expression
[Output()](cci:4://file://Output():0:0-0:0) close: EventEmitter<void> - Modal closed
Features:

Create new variables with name, type, value, explanation
Delete existing variables
Insert variable name into expression
List of all available variables


## CustomFunctionBuilderComponent
Location: src/lib/components/expression-editor/custom-function-builder/

Purpose: Modal for creating custom functions

Inputs:

[Input()](cci:4://file://Input():0:0-0:0) show: boolean - Show/hide modal
Outputs:

[Output()](cci:4://file://Output():0:0-0:0) functionCreated: EventEmitter<CustomFunction> - Custom function created
[Output()](cci:4://file://Output():0:0-0:0) close: EventEmitter<void> - Modal closed
Features:

Define function name, syntax, implementation
Add description
Validate function syntax
Save to custom functions category

-------
## Service Details (How logic is implemented)

- **ExpressionEvaluatorService** 
  - `identifyExpressionType(expression, config?)`: returns `ExpressionResult` with `returnType`, `usedVariables`, optional `binaryTree`, and optional `typeValidation`.
  - Skips AST for lambda/ternary to keep parsing simple; still infers types.
  - Variable operations: `addVariable`, `removeVariable`, `getVariables`, `getVariable`.
  - Config presets and `getPlaceholderForType`.
  - Mapping helpers: `transformToBackend`, `transformToFrontend` for variable name translations.

- **TypeAnalyzerService** 
  - Detects lambda → FUNCTION; assignment → ASSIGNMENT; ternary → branch inference; boolean patterns → BOOLEAN; string → STRING; numeric → INTEGER/REAL; single variable → variable type.
  - Integer detection accounts for integer-only operations and functions; division or decimals promote to REAL.



- **ValidationService** 
  - `validateExpressionType(expr, type, config)` routes to context-specific validation:
    - Boolean: only boolean ops; type must be BOOLEAN.
    - Assignment: must be assignment; type must be ASSIGNMENT.
    - Arithmetic: numeric ops/functions; type must be INTEGER or REAL.
    - Limited Connector: only `+ - *` and `/` if allowed; rejects function calls (e.g., `Math.*`).
    - General: permissive.

- **VariableManagerService**
  - In-memory store with CRUD; `extractUsedVariables(expr)` finds used variable references.

- **BinaryTreeParserService** (AST)
  - Operator precedence parser for `|| && == != < > <= >= = + - * /` plus unary `+ - !`, parentheses, literals, variables, and function calls (with argument lists).
  - Returns `ParseResult` with both `tree` and pretty `json` string.

- **ConfigurationService**
  - Provides preset `ExpressionEditorConfig` for each context and placeholder strings.

- **ExpressionPatternService**
  - Regex-based helpers: detect lambda, field assignment, ternary, boolean/numeric patterns, integer returns, arithmetic presence, etc.
  - Note: Confidence/complexity were removed to simplify API.

---

## Testing

* Jasmine/Karma unit and integration tests
* Component integration covers modes, events, validation, variable management, modals, debounce
* Service tests cover parser, tokenizer, type analysis, validation
* Coverage target: >80%
