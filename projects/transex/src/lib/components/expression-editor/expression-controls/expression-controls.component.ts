import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomFunctionBuilderComponent } from '../custom-function-builder/custom-function-builder.component';
import { CustomFunction } from '../../../interfaces/extensibility.interfaces';

@Component({
  selector: 'lib-expression-controls',
  standalone: true,
  imports: [CommonModule, CustomFunctionBuilderComponent],
  templateUrl: './expression-controls.component.html',
  styleUrls: ['./expression-controls.component.css']
})
export class ExpressionControlsComponent {
  @Input() disabled = false;
  @Input() showCustomFunctionBuilder = false;
  @Input() hasVariables = false;
  
  @Output() toggleEditor = new EventEmitter<void>();
  @Output() clearExpression = new EventEmitter<void>();
  @Output() openFunctionsMenu = new EventEmitter<void>();
  @Output() openSymbolPicker = new EventEmitter<void>();
  @Output() openCustomFunctionBuilder = new EventEmitter<void>();
  @Output() closeCustomFunctionBuilder = new EventEmitter<void>();
  @Output() customFunctionCreated = new EventEmitter<CustomFunction>();
  @Output() openVariableManager = new EventEmitter<void>();

  onToggleEditor() {
    this.toggleEditor.emit();
  }

  onClearExpression() {
    this.clearExpression.emit();
  }

  onOpenFunctionsMenu() {
    this.openFunctionsMenu.emit();
  }

  onOpenSymbolPicker() {
    this.openSymbolPicker.emit();
  }

  onOpenCustomFunctionBuilder() {
    this.openCustomFunctionBuilder.emit();
  }

  onCloseCustomFunctionBuilder() {
    this.closeCustomFunctionBuilder.emit();
  }

  onCustomFunctionCreated(customFunction: CustomFunction) {
    this.customFunctionCreated.emit(customFunction);
  }

  onOpenVariableManager() {
    this.openVariableManager.emit();
  }
}
