## 🎯 What is OktoFlow TransEx?

**OktoFlow TransEx** is an Angular library that provides a sophisticated expression editor component with:

- **Context-aware validation** for different expression types (boolean, assignment, arithmetic, etc.)
- **Real-time type inference** to detect return types (Boolean, Integer, Real, String, etc.)
- **Abstract Syntax Tree (AST) generation** for backend processing
- **Built-in functions** (mathematical, logical, string operations)
- **Custom function builder** to create user-defined functions
- **Variable management** with type-safe variable creation
- **Symbol picker** for quick insertion of operators and symbols
- **Simple mode** for basic textarea input with validation
- **Full Angular Forms integration** (ControlValueAccessor)

Perfect for building formula editors, condition builders, data transformation tools, and expression-based workflows.

---

## ✨ Features

- ✅ **5 Context Types**: Boolean, Assignment, Arithmetic, Limited Connector, General
- ✅ **Type Inference**: Automatic detection of Integer, Real, Boolean, String, Assignment types
- ✅ **AST Generation**: Binary tree output for backend expression processing
- ✅ **Built-in Functions**: 30+ mathematical, logical, and string functions
- ✅ **Custom Functions**: Create and manage user-defined functions
- ✅ **Variable Manager**: Type-safe variable creation and management
- ✅ **Symbol Picker**: Quick access to operators and mathematical symbols
- ✅ **Simple Mode**: Lightweight textarea-only mode
- ✅ **Reactive Forms**: Full ControlValueAccessor implementation
- ✅ **Customizable Styling**: Configure colors, borders, fonts, and more
- ✅ **Real-time Validation**: Instant feedback on expression validity
- ✅ **TypeScript Support**: Full type definitions included

---

## 📦 Installation

### Install via npm:
npm install oktoflow-transex

#######
Peer Dependencies: 
npm install @angular/common@^19.0.0 @angular/core@^19.0.0 @angular/forms@^19.0.0

######
#######
oktoflow- integration:

Add to tsconfig.json under compilerOptions:
"skipLibCheck": true,
"skipDefaultLibCheck": true,


######

```bash



🚀 Quick Start
1. Import the Component
Since OktoFlow TransEx uses standalone components, import directly into your component:

import { Component } from '@angular/core';
import { ExpressionEditorComponent } from 'oktoflow-transex';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ExpressionEditorComponent],
  template: `
    <lib-expression-editor
      [(ngModel)]="expression"
      [editorConfig]="config">
    </lib-expression-editor>
  `
})
export class AppComponent {
  expression = '';
  config = {
    expectedResultType: 'Boolean',
    contextType: 'boolean',
    title: 'Condition Builder',
    description: 'Enter a boolean expression'
  };
}   
###########################################
📖 Usage Examples
###########################################
###########################################
Complete Working Example
###########################################
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ExpressionEditorComponent, ExpressionEvaluatorService, DataType } from 'oktoflow-transex';

@Component({
  selector: 'app-complete-example',
  standalone: true,
  imports: [FormsModule, ExpressionEditorComponent],
  template: `
    <div class="container">
      <h1>OktoFlow TransEx Demo</h1>
      
      <!-- Boolean Context -->
      <section>
        <h2>Boolean Expression (Guard)</h2>
        <lib-expression-editor
          [(ngModel)]="booleanExpr"
          [editorConfig]="booleanConfig"
          (validationChange)="onBooleanValidation($event)">
        </lib-expression-editor>
        <p class="status" [class.valid]="booleanValid">
          {{ booleanValid ? '✓ Valid' : '✗ Invalid' }}
        </p>
      </section>

      <!-- Assignment Context -->
      <section>
        <h2>Assignment Expression (Data Mapping)</h2>
        <lib-expression-editor
          [(ngModel)]="assignmentExpr"
          [editorConfig]="assignmentConfig"
          (binaryTreeChange)="onTreeGenerated($event)">
        </lib-expression-editor>
        <details>
          <summary>View Generated AST</summary>
          <pre>{{ astJson }}</pre>
        </details>
      </section>

      <!-- Arithmetic Context -->
      <section>
        <h2>Arithmetic Expression</h2>
        <lib-expression-editor
          [(ngModel)]="arithmeticExpr"
          [editorConfig]="arithmeticConfig">
        </lib-expression-editor>
      </section>

      <!-- Simple Mode -->
      <section>
        <h2>Simple Mode</h2>
        <lib-expression-editor
          [(ngModel)]="simpleExpr"
          [simpleMode]="true"
          [placeholder]="'Enter expression...'"
          [editorConfig]="simpleConfig">
        </lib-expression-editor>
      </section>
    </div>
  `,
  styles: [`
    .container { max-width: 1200px; margin: 0 auto; padding: 20px; }
    section { margin-bottom: 40px; padding: 20px; border: 1px solid #ddd; border-radius: 8px; }
    h1 { color: #007bff; }
    h2 { color: #333; margin-bottom: 15px; }
    .status { font-weight: bold; margin-top: 10px; }
    .status.valid { color: #28a745; }
    pre { background: #f8f9fa; padding: 15px; border-radius: 4px; overflow-x: auto; }
  `]
})
export class CompleteExampleComponent {
  // Boolean
  booleanExpr = 'temperature > 25 && status == "active"';
  booleanConfig: any;
  booleanValid = false;

  // Assignment
  assignmentExpr = 'output.value = input.data * 2';
  assignmentConfig: any;
  astJson = '';

  // Arithmetic
  arithmeticExpr = '(price * quantity) - discount';
  arithmeticConfig: any;

  // Simple
  simpleExpr = '';
  simpleConfig: any;

  constructor(private evaluator: ExpressionEvaluatorService) {
    this.booleanConfig = this.evaluator.getBooleanConfig();
    this.assignmentConfig = this.evaluator.getAssignmentConfig();
    this.arithmeticConfig = this.evaluator.getArithmeticConfig();
    this.simpleConfig = {
      expectedResultType: DataType.ANY,
      contextType: 'general'
    };
  }

  onBooleanValidation(result: any) {
    this.booleanValid = result?.isValid || false;
  }

  onTreeGenerated(tree: any) {
    if (tree && tree.success) {
      this.astJson = JSON.stringify(tree.tree, null, 2);
    }
  }
}

###########################################
🎨 Styling & Customization
Custom Textarea Styling
###########################################
import { Component } from '@angular/core';
import { ExpressionEditorComponent, TextareaStyleConfig } from 'oktoflow-transex';

@Component({
  selector: 'app-styled-editor',
  standalone: true,
  imports: [ExpressionEditorComponent],
  template: `
    <lib-expression-editor
      [(ngModel)]="expression"
      [textareaStyle]="customStyle"
      [editorConfig]="config">
    </lib-expression-editor>
  `
})
export class StyledEditorComponent {
  expression = '';
  config = { expectedResultType: 'Boolean', contextType: 'boolean' };
  
  customStyle: TextareaStyleConfig = {
    borderColor: '#007bff',
    focusBorderColor: '#0056b3',
    errorBorderColor: '#dc3545',
    validBorderColor: '#28a745',
    borderWidth: '2px',
    borderStyle: 'solid',
    borderRadius: '8px',
    padding: '12px',
    fontSize: '14px',
    fontFamily: 'monospace',
    backgroundColor: '#f8f9fa',
    textColor: '#212529',
    minHeight: '100px'
  };
}
