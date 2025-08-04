import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CustomFunction } from '../../interfaces/extensibility.interfaces';

@Component({
  selector: 'lib-custom-function-builder',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './custom-function-builder.component.html',
  styleUrls: ['./custom-function-builder.component.css']
})
export class CustomFunctionBuilderComponent {
  @Input() isVisible = false;
  @Output() functionCreated = new EventEmitter<CustomFunction>();
  @Output() closeModal = new EventEmitter<void>();
  @Output() cancelled = new EventEmitter<void>();

  newFunction: Partial<CustomFunction> = {
    name: '',
    syntax: '',
    description: '',
    example: '',
    category: 'custom'
  };

  functionCode = '';
  testInput = '';
  testResult: { success: boolean; message: string } | null = null;
  showTestSection = false;

  // Getter/setter properties for backward compatibility with tests
  get functionName(): string {
    return this.newFunction.name || '';
  }

  set functionName(value: string) {
    this.newFunction.name = value;
  }

  get functionDescription(): string {
    return this.newFunction.description || '';
  }

  set functionDescription(value: string) {
    this.newFunction.description = value;
  }

  get functionSyntax(): string {
    return this.newFunction.syntax || '';
  }

  set functionSyntax(value: string) {
    this.newFunction.syntax = value;
  }

  get functionImplementation(): string {
    return this.functionCode;
  }

  set functionImplementation(value: string) {
    this.functionCode = value;
  }

  get testExpression(): string {
    return this.testInput;
  }

  set testExpression(value: string) {
    this.testInput = value;
  }

  // Validation methods
  isValidFunctionName(): boolean {
    const name = this.functionName.trim();
    return name.length > 0 && /^[a-zA-Z_][a-zA-Z0-9_]*$/.test(name);
  }

  isValidImplementation(): boolean {
    const implementation = this.functionImplementation.trim();
    if (!implementation) return false;
    
    try {
      new Function('...args', implementation);
      return true;
    } catch {
      return false;
    }
  }

  // Toggle test section
  toggleTestSection(): void {
    this.showTestSection = !this.showTestSection;
  }

  // Cancel function
  cancel(): void {
    this.resetForm();
    this.cancelled.emit();
  }

  // Auto-generate syntax when function name changes
  onFunctionNameChange(): void {
    if (this.functionName) {
      this.functionSyntax = `${this.functionName}()`;
    }
  }

  closeBuilder(): void {
    this.closeModal.emit();
    this.resetForm();
  }

  createFunction(): void {
    if (!this.newFunction.name || !this.newFunction.syntax || !this.newFunction.description || !this.functionCode) {
      return;
    }

    try {
      // Create the function implementation from the code
      const implementation = new Function('...args', this.functionCode) as (...args: any[]) => any;
      
      const customFunction: CustomFunction = {
        name: this.newFunction.name!,
        syntax: this.newFunction.syntax!,
        description: this.newFunction.description!,
        example: this.newFunction.example || '',
        category: this.newFunction.category || 'custom',
        implementation: implementation
      };

      this.functionCreated.emit(customFunction);
      this.resetForm();
    } catch (error) {
      console.error('Error creating function:', error);
      this.testResult = {
        success: false,
        message: 'Error creating function: ' + (error as Error).message
      };
    }
  }

  testFunction(): void {
    if (!this.functionCode.trim()) {
      this.testResult = {
        success: false,
        message: 'Please enter function code first'
      };
      return;
    }

    try {
      // Create a test function from the code
      const testFunc = new Function('...args', this.functionCode) as (...args: any[]) => any;
      
      // Parse test input (simple parsing for numbers and strings)
      let testArgs: any[] = [];
      if (this.testInput.trim()) {
        // Simple parsing - split by comma and convert numbers
        testArgs = this.testInput.split(',').map(arg => {
          const trimmed = arg.trim();
          const num = Number(trimmed);
          return isNaN(num) ? trimmed : num;
        });
      }

      const result = testFunc(...testArgs);
      this.testResult = {
        success: true,
        message: `${result} (type: ${typeof result})`
      };
    } catch (error) {
      this.testResult = {
        success: false,
        message: 'Error: ' + (error as Error).message
      };
    }
  }

  private resetForm(): void {
    this.newFunction = {
      name: '',
      syntax: '',
      description: '',
      example: '',
      category: 'custom'
    };
    this.functionCode = '';
    this.testInput = '';
    this.testResult = null;
  }
}
