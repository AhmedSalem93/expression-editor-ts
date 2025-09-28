import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Variable, DataType } from '../../../interfaces/shared.interfaces';

@Component({
  selector: 'lib-variable-manager',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './variable-manager.component.html',
  styleUrls: ['./variable-manager.component.css']
})
export class VariableManagerComponent {
  @Input() variables: Variable[] = [];
  @Input() allowVariableCreation = true;
  @Input() showVariableManager = false;
  
  @Output() variableSelected = new EventEmitter<Variable>();
  @Output() variableInserted = new EventEmitter<Variable>();
  @Output() variableCreated = new EventEmitter<Variable>();
  @Output() variableDeleted = new EventEmitter<Variable>();
  @Output() closeVariableManager = new EventEmitter<void>();

  selectedVariable: Variable | null = null;
  showCreateForm = false;

  // New variable form
  newVariable: Variable = {
    name: '',
    value: '',
    type: DataType.STRING,
    explanation: '',
  };

  DataType = DataType;

  onVariableSelected(variable: Variable) {
    this.selectedVariable = variable;
    this.variableSelected.emit(variable);
  }

  onInsertVariable(variable: Variable) {
    this.variableInserted.emit(variable);
  }

  onDeleteVariable(variable: Variable, event: Event) {
    // Stop event propagation to prevent variable selection
    event.stopPropagation();
    event.preventDefault();
    
    // Use setTimeout to ensure the event handling is complete before showing confirm
    setTimeout(() => {
      const confirmed = window.confirm(`Are you sure you want to delete variable "${variable.name}"?\n\nThis action cannot be undone.`);
      if (confirmed) {
        this.variableDeleted.emit(variable);
        
        // Clear selection if deleted variable was selected
        if (this.selectedVariable === variable) {
          this.selectedVariable = null;
        }
      }
    }, 10);
  }

  onShowCreateForm() {
    this.showCreateForm = true;
    this.resetNewVariableForm();
  }

  onHideCreateForm() {
    this.showCreateForm = false;
    this.resetNewVariableForm();
  }

  onCreateVariable() {
    if (this.isValidNewVariable()) {
      const variable: Variable = {
        name: this.newVariable.name!,
        value: this.parseVariableValue(this.newVariable.value!, this.newVariable.type!),
        type: this.newVariable.type!,
        explanation: this.newVariable.explanation!,
      };

      this.variableCreated.emit(variable);
      this.onHideCreateForm();
    }
  }

  onClose() {
    this.closeVariableManager.emit();
    this.selectedVariable = null;
    this.showCreateForm = false;
  }

  // Public methods used in template
  public isValidNewVariable(): boolean {
    return !!(
      this.newVariable.name?.trim() &&
      this.newVariable.value !== undefined &&
      this.newVariable.explanation?.trim() &&
      this.newVariable.type
    );
  }

  public getValuePlaceholder(): string {
    switch (this.newVariable.type) {
      case DataType.BOOLEAN:
        return 'true or false';
      case DataType.INTEGER:
        return 'e.g., 42, -10, 0';
      case DataType.REAL:
        return 'e.g., 3.14, -2.5, 0.0';
      case DataType.FUNCTION:
        return 'e.g., (x, y) => x + y, (n) => n * 2';
      case DataType.STRING:
      default:
        return 'e.g., "Hello World", "active"';
    }
  }

  public getVariableTypeLabel(type: DataType): string {
    switch (type) {
      case DataType.BOOLEAN: return 'Boolean';
      case DataType.INTEGER: return 'Integer';
      case DataType.REAL: return 'Real';
      case DataType.STRING: return 'String';
      case DataType.ASSIGNMENT: return 'Assignment';
      case DataType.FUNCTION: return 'Function';
      default: return 'Unknown';
    }
  }

  public getVariableValueDisplay(variable: Variable): string {
    if (variable.type === DataType.STRING) {
      return `"${variable.value}"`;
    }
    if (variable.type === DataType.FUNCTION) {
      return `${variable.value}`;
    }
    return String(variable.value);
  }

  // Private helper methods
  private resetNewVariableForm() {
    this.newVariable = {
      name: '',
      value: '',
      type: DataType.STRING,
      explanation: '',
    };
  }

  private parseVariableValue(value: any, type: DataType): any {
    switch (type) {
      case DataType.BOOLEAN:
        return value === 'true' || value === true;
      case DataType.INTEGER:
        return parseInt(value, 10);
      case DataType.REAL:
        return parseFloat(value);
      case DataType.FUNCTION:
        return String(value); // Keep function as string for lambda expressions
      case DataType.STRING:
      default:
        return String(value);
    }
  }
}
