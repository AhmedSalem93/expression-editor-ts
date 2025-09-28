import { Component, Input, Output, EventEmitter, forwardRef, ViewChild } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ExpressionHeaderComponent } from './expression-header/expression-header.component';
import { DivisionToggleComponent } from './division-toggle/division-toggle.component';
import { ExpressionTextareaComponent } from './expression-textarea/expression-textarea.component';
import { ExpressionControlsComponent } from './expression-controls/expression-controls.component';
import { ExpressionInfoComponent } from './expression-info/expression-info.component';
import { FunctionsMenuComponent } from './functions-menu/functions-menu.component';
import { SymbolPickerComponent } from './symbol-picker/symbol-picker.component';
import { VariableManagerComponent } from './variable-manager/variable-manager.component';

import { ExpressionEvaluatorService } from '../../services/expression-evaluator.service';
import { ExtensionManagerService } from '../../services/extension-manager.service';
import { CustomFunction } from '../../interfaces/extensibility.interfaces';
import { 
  FunctionCategory, 
  FunctionItem, 
  SymbolCategory, 
  SymbolItem, 
  ExpressionEditorConfig,
  TypeValidationResult,
  Variable,
  ExpressionTypeResult,
  ExpressionEditorConfigEnhanced,
  DataType
} from '../../interfaces/shared.interfaces';
import { FUNCTION_CATEGORIES, SYMBOL_CATEGORIES } from '../../data/function-categories.data';

@Component({
  selector: 'lib-expression-editor',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule,
    ExpressionHeaderComponent,
    DivisionToggleComponent,
    ExpressionTextareaComponent,
    ExpressionControlsComponent,
    ExpressionInfoComponent,
    FunctionsMenuComponent,
    SymbolPickerComponent,
    VariableManagerComponent
  ],
  templateUrl: './expression-editor.component.html',
  styleUrls: ['./expression-editor.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ExpressionEditorComponent),
      multi: true
    }
  ]
})
export class ExpressionEditorComponent implements ControlValueAccessor {
  @Input() disabled = false;
  @Input() editorConfig?: ExpressionEditorConfig | ExpressionEditorConfigEnhanced;
  @Output() expressionChange = new EventEmitter<string>();
  @Output() validationChange = new EventEmitter<TypeValidationResult | null>();
  @Output() configChange = new EventEmitter<ExpressionEditorConfig | ExpressionEditorConfigEnhanced>();
  
  @ViewChild(ExpressionTextareaComponent) expressionTextarea!: ExpressionTextareaComponent;

  value = '';
  typeResult: ExpressionTypeResult | null = null;
  currentValidation: TypeValidationResult | null = null;
  
  showFunctionsMenu = false;
  showSymbolPicker = false;
  showCustomFunctionBuilder = false;
  showVariableManager = false;
  
  selectedFunction: FunctionItem | null = null;
  selectedSymbol: SymbolItem | null = null;
  selectedFunctionCategory = 'arithmetic';
  selectedSymbolCategory = 'arithmetic';
  
  private onChange = (value: string) => {};
  private onTouched = () => {};

  // Data
  functionCategories: FunctionCategory[] = [];
  symbolCategories: SymbolCategory[] = SYMBOL_CATEGORIES;

  constructor(
    private evaluatorService: ExpressionEvaluatorService,
    private extensionManager: ExtensionManagerService
  ) {
    this.initializeFunctionCategories();
  }

  private initializeFunctionCategories(): void {
    this.functionCategories = [...FUNCTION_CATEGORIES];
    this.functionCategories.push({
      name: 'custom',
      label: 'Custom Functions',
      functions: [] 
    });
  }

  get enhancedConfig(): ExpressionEditorConfigEnhanced | undefined {
    return this.editorConfig as ExpressionEditorConfigEnhanced;
  }

  get variables(): Variable[] {
    const configVariables = this.enhancedConfig?.variables || [];
    const serviceVariables = this.evaluatorService.getVariables();
    
    const mergedVariables = [...configVariables];
    
    for (const serviceVar of serviceVariables) {
      const existingIndex = mergedVariables.findIndex(v => v.name === serviceVar.name);
      if (existingIndex >= 0) {
        mergedVariables[existingIndex] = serviceVar; 
      } else {
        mergedVariables.push(serviceVar); 
      }
    }
    
    return mergedVariables;
  }

  onValueChange(value: string) {
    this.value = value;
    this.onChange(this.value);
    this.expressionChange.emit(this.value);
    this.analyzeExpression();
  }

  onTextareaBlur() {
    this.onTouched();
    this.analyzeExpression();
  }

  onToggleEditor() {
    this.disabled = !this.disabled;
  }

  onClearExpression() {
    this.value = '';
    this.onChange(this.value);
    this.expressionChange.emit(this.value);
    this.typeResult = null;
    this.validationChange.emit(null);
  }

  onConfigChange(newConfig: ExpressionEditorConfig | ExpressionEditorConfigEnhanced) {
    this.editorConfig = newConfig;
    this.configChange.emit(newConfig);
    if (this.value.trim()) this.analyzeExpression();
  }

  onOpenFunctionsMenu() { this.showFunctionsMenu = true; }
  onCloseFunctionsMenu() { 
    this.showFunctionsMenu = false;
    this.selectedFunction = null;
  }
  onFunctionCategorySelected(category: string) {
    this.selectedFunctionCategory = category;
    this.selectedFunction = null;
  }
  onFunctionSelected(func: FunctionItem) { this.selectedFunction = func; }
  onFunctionInserted(func: FunctionItem) {
    this.insertTextAtCursor(func.syntax);
    this.onCloseFunctionsMenu();
  }

  onOpenSymbolPicker() { this.showSymbolPicker = true; }
  onCloseSymbolPicker() {
    this.showSymbolPicker = false;
    this.selectedSymbol = null;
  }
  onSymbolCategorySelected(category: string) {
    this.selectedSymbolCategory = category;
    this.selectedSymbol = null;
  }
  onSymbolSelected(symbol: SymbolItem) { this.selectedSymbol = symbol; }
  onSymbolInserted(symbol: SymbolItem) {
    this.insertTextAtCursor(symbol.symbol);
    this.onCloseSymbolPicker();
  }

  onOpenCustomFunctionBuilder() { this.showCustomFunctionBuilder = true; }
  onCloseCustomFunctionBuilder() { this.showCustomFunctionBuilder = false; }
  onCustomFunctionCreated(customFunction: CustomFunction) {
    this.extensionManager.registerCustomFunction(customFunction);
    this.onCloseCustomFunctionBuilder();
    this.selectedFunctionCategory = 'custom';
    if (customFunction.syntax) {
      this.insertTextAtCursor(customFunction.syntax);
    }
  }

  onOpenVariableManager() { this.showVariableManager = true; }
  onCloseVariableManager() { this.showVariableManager = false; }
  onVariableSelected(variable: Variable) {
  }
  onVariableInserted(variable: Variable) {
    const textToInsert = variable.type === DataType.FUNCTION 
      ? `${variable.name}()` 
      : variable.name;
    
    this.insertTextAtCursor(textToInsert);
    this.onCloseVariableManager();
  }
  onVariableCreated(variable: Variable) {
    this.evaluatorService.addVariable(variable);
  }
  onVariableDeleted(variable: Variable) {
    this.evaluatorService.removeVariable(variable.name);
  }

  insertTextAtCursor(text: string) {
    if (this.expressionTextarea) {
      this.expressionTextarea.insertTextAtCursor(text);
    }
  }

  analyzeExpression() {
    if (!this.value.trim()) {
      this.typeResult = null;
      this.currentValidation = null;
      this.validationChange.emit(null);
      return;
    }

    this.typeResult = this.evaluatorService.identifyExpressionType(this.value, this.editorConfig);
    
    if (this.typeResult?.typeValidation) {
      this.currentValidation = this.typeResult.typeValidation;
      this.validationChange.emit(this.typeResult.typeValidation);
    } else {
      this.currentValidation = null;
      this.validationChange.emit(null);
    }
  }

  writeValue(value: string | null): void {
    this.value = value || '';
    if (this.value) {
      this.analyzeExpression();
    }
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}
