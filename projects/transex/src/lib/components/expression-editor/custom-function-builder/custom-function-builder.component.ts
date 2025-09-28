import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CustomFunction } from '../../../interfaces/extensibility.interfaces';

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

  newFunction: CustomFunction = {
    name: '',
    syntax: '',
    description: '',
    example: '',
    category: 'custom'
  };

  // Validation methods
  isValidFunctionName(): boolean {
    const name = this.newFunction.name?.trim() || '';
    return name.length > 0 && /^[a-zA-Z_][a-zA-Z0-9_]*$/.test(name);
  }

  isValidFunctionSyntax(): boolean {
    const syntax = this.newFunction.syntax?.trim() || '';
    return syntax.length > 0;
  }

  isValidFunctionDescription(): boolean {
    const description = this.newFunction.description?.trim() || '';
    return description.length > 0;
  }

  isFormValid(): boolean {
    return this.isValidFunctionName() && 
           this.isValidFunctionSyntax() && 
           this.isValidFunctionDescription();
  }

  // add () after FN name
  onFunctionNameChange(): void {
    if (this.newFunction.name) {
      this.newFunction.syntax = `${this.newFunction.name}()`;
    }
  }

  closeBuilder(): void {
    this.closeModal.emit();
    this.resetForm();
  }

  createFunction(): void {
    if (!this.isFormValid()) {
      return;
    }

    const customFunction: CustomFunction = {
      name: this.newFunction.name!,
      syntax: this.newFunction.syntax!,
      description: this.newFunction.description!,
      example: this.newFunction.example || '',
      category: this.newFunction.category || 'custom',
    };

    this.functionCreated.emit(customFunction);
    this.resetForm();
  }

  private resetForm(): void {
    this.newFunction = {
      name: '',
      syntax: '',
      description: '',
      example: '',
      category: 'custom'
    };
  }
}
