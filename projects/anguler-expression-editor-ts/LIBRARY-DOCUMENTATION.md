# Angular Expression Editor Library

## Overview

The Angular Expression Editor is a powerful, standalone Angular component library that provides a rich interface for creating, editing, and evaluating mathematical and logical expressions. It features a modern UI with customizable themes, built-in function libraries, custom function creation capabilities, and comprehensive validation.

## Features

### Core Functionality
- **Rich Expression Input**: Multi-line textarea with syntax validation
- **Real-time Evaluation**: Live expression evaluation with result display
- **Parentheses Matching**: Automatic syntax checking and validation
- **Clear/Reset**: Easy clearing of editor content

### Mathematical Functions
- **Basic Arithmetic**: `+`, `-`, `*`, `/`, `%`
- **Advanced Math**: `abs()`, `ceil()`, `floor()`, `round()`, `max()`, `min()`
- **Power & Roots**: `pow()`, `sqrt()`
- **Trigonometry**: `sin()`, `cos()`, `tan()`
- **Logarithms**: `log()`, `exp()`

### Logical Operations
- **Comparisons**: `>`, `<`, `>=`, `<=`, `==`, `!=`
- **Logic**: `&&` (AND), `||` (OR), `!` (NOT)
- **Conditionals**: `if()` statements

### String Functions
- **Manipulation**: `length()`, `substring()`, `indexOf()`
- **Case Conversion**: `toLowerCase()`, `toUpperCase()`
- **Whitespace**: `trim()`

### Custom Functions
- **Dynamic Creation**: Inline custom function builder
- **Parameter Support**: Define custom parameters
- **Testing Interface**: Built-in function testing
- **Category Organization**: Automatic categorization

### Modern UI
- **Clean Design**: White background with colored button system
- **Color-coded Buttons**: Red (disable), Green (functions), Blue (symbols), Purple (custom)
- **Popup Menus**: Interactive function and symbol pickers
- **Responsive Layout**: Modern typography with rounded corners and shadows

## Installation

### Prerequisites
- Angular 15+ 
- Node.js 18+
- TypeScript 4.8+

### Install the Library

```bash
npm install angular-expression-editor
```

## Basic Usage

### 1. Import the Component

```typescript
// app.component.ts
import { Component } from '@angular/core';
import { ExpressionEditorComponent } from 'angular-expression-editor';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ExpressionEditorComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  expression: string = '';
  evaluationResult: any = null;

  onExpressionChange(value: string) {
    this.expression = value;
    console.log('Expression changed:', value);
  }

  onEvaluationChange(result: any) {
    this.evaluationResult = result;
    console.log('Evaluation result:', result);
  }
}
```

### 2. Add to Template

```html
<!-- app.component.html -->
<div class="app-container">
  <h1>Expression Editor Demo</h1>
  
  <lib-expression-editor
    [value]="expression"
    (valueChange)="onExpressionChange($event)"
    (evaluationResultChange)="onEvaluationChange($event)"
    placeholder="Enter your expression here..."
    [rows]="5">
  </lib-expression-editor>

  <div class="result-section" *ngIf="evaluationResult">
    <h3>Result:</h3>
    <p><strong>Value:</strong> {{ evaluationResult.result }}</p>
    <p><strong>Type:</strong> {{ evaluationResult.type }}</p>
    <p><strong>Success:</strong> {{ evaluationResult.success }}</p>
  </div>
</div>
```

### 3. Add Styling

```css
/* app.component.css */
.app-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

h1 {
  color: #333;
  text-align: center;
  margin-bottom: 30px;
}

.result-section {
  margin-top: 20px;
  padding: 15px;
  background-color: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #e9ecef;
}

.result-section h3 {
  margin-top: 0;
  color: #495057;
}

.result-section p {
  margin: 5px 0;
  color: #6c757d;
}
```

## Advanced Usage

### Custom Configuration

```typescript
// app.component.ts
import { ExpressionEditorConfig } from 'angular-expression-editor';

export class AppComponent {
  config: ExpressionEditorConfig = {
    title: 'Advanced Expression Editor',
    description: 'Create complex mathematical expressions',
    placeholder: 'Enter your formula...',
    rows: 8,
    showHeader: true,
    showFooter: true,
    enableValidation: true,
    theme: {
      background: '#ffffff',
      foreground: '#333333',
      border: '#dee2e6',
      buttonBackground: '#007bff',
      buttonHover: '#0056b3',
      modalBackground: '#ffffff',
      modalOverlay: 'rgba(0,0,0,0.5)'
    }
  };
}
```

### Reactive Forms Integration

```typescript
// reactive-form.component.ts
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ExpressionEditorComponent } from 'angular-expression-editor';

@Component({
  selector: 'app-reactive-form',
  standalone: true,
  imports: [ReactiveFormsModule, ExpressionEditorComponent],
  template: `
    <form [formGroup]="form" (ngSubmit)="onSubmit()">
      <div class="form-group">
        <label>Expression:</label>
        <lib-expression-editor
          formControlName="expression"
          placeholder="Enter expression..."
          [rows]="4">
        </lib-expression-editor>
      </div>
      
      <button type="submit" [disabled]="form.invalid">
        Submit
      </button>
    </form>
  `
})
export class ReactiveFormComponent {
  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      expression: ['', [Validators.required]]
    });
  }

  onSubmit() {
    if (this.form.valid) {
      console.log('Form submitted:', this.form.value);
    }
  }
}
```

### Custom Functions Example

```typescript
// custom-functions.component.ts
export class CustomFunctionsComponent {
  onCustomFunctionCreated(functionData: any) {
    console.log('New custom function created:', functionData);
    // The function is automatically available in the editor
  }
}
```

```html
<!-- custom-functions.component.html -->
<lib-expression-editor
  (customFunctionCreated)="onCustomFunctionCreated($event)"
  placeholder="Try creating custom functions...">
</lib-expression-editor>
```

## API Reference

### Component Inputs

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `value` | `string` | `''` | Current expression value |
| `placeholder` | `string` | `'Enter expression...'` | Placeholder text |
| `rows` | `number` | `4` | Number of textarea rows |
| `disabled` | `boolean` | `false` | Disable the editor |
| `config` | `ExpressionEditorConfig` | `{}` | Advanced configuration |

### Component Outputs

| Event | Type | Description |
|-------|------|-------------|
| `valueChange` | `string` | Emitted when expression changes |
| `evaluationResultChange` | `EvaluationResult` | Emitted when evaluation result changes |
| `validationChange` | `boolean` | Emitted when validation status changes |
| `customFunctionCreated` | `CustomFunction` | Emitted when custom function is created |

### Interfaces

#### EvaluationResult
```typescript
interface EvaluationResult {
  success: boolean;
  result?: any;
  type?: string;
  error?: string;
}
```

#### CustomFunction
```typescript
interface CustomFunction {
  name: string;
  syntax: string;
  description: string;
  example?: string;
  category: string;
  implementation: (...args: any[]) => any;
}
```

#### ExpressionEditorConfig
```typescript
interface ExpressionEditorConfig {
  title?: string;
  description?: string;
  placeholder?: string;
  rows?: number;
  showHeader?: boolean;
  showFooter?: boolean;
  enableValidation?: boolean;
  theme?: ThemeConfig;
  allowedCategories?: string[];
  disabledFunctions?: string[];
}
```

## Expression Examples

### Mathematical Expressions
```javascript
// Basic arithmetic
2 + 3 * 4
(10 - 5) / 2

// Advanced math
sqrt(16) + pow(2, 3)
abs(-5) + max(1, 2, 3)

// Trigonometry
sin(0) + cos(0)
```

### Logical Expressions
```javascript
// Comparisons
5 > 3 && 2 < 4
!(false || true)

// Conditionals
if(5 > 3, "greater", "less")
```

### String Operations
```javascript
// String functions
length("hello")
substring("hello", 1, 3)
toUpperCase("world")
```

### Custom Functions
```javascript
// After creating custom functions
myCustomAdd(5, 10)
calculateTax(100, 0.08)
```

## Styling and Theming

### CSS Custom Properties
```css
lib-expression-editor {
  --editor-background: #ffffff;
  --editor-border: #dee2e6;
  --editor-text: #333333;
  --button-primary: #007bff;
  --button-success: #28a745;
  --button-danger: #dc3545;
  --button-warning: #ffc107;
}
```

### Custom CSS Classes
```css
.expression-editor-container {
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.expression-editor-textarea {
  font-family: 'Monaco', 'Menlo', monospace;
  font-size: 14px;
  line-height: 1.5;
}
```

## Testing

### Unit Testing Custom Functions
```typescript
// custom-function.spec.ts
import { TestBed } from '@angular/core/testing';
import { ExtensionManagerService } from 'angular-expression-editor';

describe('Custom Functions', () => {
  let service: ExtensionManagerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExtensionManagerService);
  });

  it('should register custom function', () => {
    const customFunction = {
      name: 'testAdd',
      syntax: 'testAdd(a, b)',
      description: 'Adds two numbers',
      category: 'Custom',
      implementation: (a: number, b: number) => a + b
    };

    service.registerCustomFunction(customFunction);
    const functions = service.getCustomFunctions();
    
    expect(functions).toContain(jasmine.objectContaining({
      name: 'testAdd'
    }));
  });
});
```

## Troubleshooting

### Common Issues

1. **Expression not evaluating**: Check for syntax errors and ensure all parentheses are matched
2. **Custom functions not appearing**: Verify the function was created successfully and check the Functions Menu
3. **Styling issues**: Ensure CSS is properly imported and custom properties are set
4. **Performance**: For complex expressions, consider debouncing evaluation

### Debug Mode
```typescript
// Enable debug logging
localStorage.setItem('expression-editor-debug', 'true');
```

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## License

MIT License - see LICENSE file for details.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## Changelog

### v1.0.0
- Initial release
- Basic expression editing and evaluation
- Mathematical and logical functions
- Custom function creation
- Modern UI with theming support
