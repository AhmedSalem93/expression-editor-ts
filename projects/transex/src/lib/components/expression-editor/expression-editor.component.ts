import { Component, Input, Output, EventEmitter, forwardRef, ViewChild, OnDestroy } from '@angular/core';
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

import { ExpressionEvaluatorService } from '../../services/expression-evaluator/expression-evaluator.service';
import { ExtensionManagerService } from '../../services/extension-manager/extension-manager.service';
import { CustomFunction } from '../../interfaces/core/extensibility.interfaces';
import { 
  FunctionCategory, 
  FunctionItem, 
  SymbolCategory, 
  SymbolItem, 
  ExpressionEditorConfig,
  TypeValidationResult,
  Variable,
  ExpressionResult,
  ExpressionEditorConfigEnhanced,
  DataType,
  BinaryTreeResult,
  TextareaStyleConfig,
  FieldMappingData
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
    VariableManagerComponent,
    SymbolPickerComponent
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
export class ExpressionEditorComponent implements ControlValueAccessor, OnDestroy {
  @Input() disabled = false;
  @Input() editorConfig?: ExpressionEditorConfig | ExpressionEditorConfigEnhanced;
  @Input() simpleMode = false;
  @Input() textareaStyle?: TextareaStyleConfig;
  @Input() placeholder?: string;
  @Output() expressionChange = new EventEmitter<string>();
  @Output() validationChange = new EventEmitter<TypeValidationResult | null>();
  @Output() configChange = new EventEmitter<ExpressionEditorConfig | ExpressionEditorConfigEnhanced>();
  @Output() binaryTreeChange = new EventEmitter<BinaryTreeResult | null>();
  @Output() fieldMappingChange = new EventEmitter<FieldMappingData | null>();

  @ViewChild(ExpressionTextareaComponent) expressionTextarea!: ExpressionTextareaComponent;

  value = '';
  typeResult: ExpressionResult | null = null;
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
  private debounceTimer: any = null;
  private debounceDelay = 1000;

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
    
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
    }
    
    this.debounceTimer = setTimeout(() => {
      this.analyzeExpression();
    }, this.debounceDelay);
  }

  onTextareaBlur() {
    this.onTouched();
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
    this.binaryTreeChange.emit(null);
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
    this.onCloseVariableManager(); // Add missing modal close call
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
      this.binaryTreeChange.emit(null);
      this.fieldMappingChange.emit(null);
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
  
    if (this.typeResult?.binaryTree) {
      const isValid = this.typeResult?.typeValidation?.isValid !== false;
      
      if (isValid && this.typeResult.binaryTree.success) {
        this.binaryTreeChange.emit(this.typeResult.binaryTree);
        
        // ✅ Emit field mapping data
        const enhancedConfig = this.editorConfig as ExpressionEditorConfigEnhanced;
        if (enhancedConfig?.variableMappings && enhancedConfig.variableMappings.length > 0) {
          const mapping = enhancedConfig.variableMappings[0];
          
          const fieldMappingData: FieldMappingData = {
            frontendField: mapping.frontendName,
            backendField: mapping.backendName,
            expression: this.value,
            tree: this.typeResult.binaryTree,
            timestamp: new Date().toISOString()
          };
          
          this.fieldMappingChange.emit(fieldMappingData);
          
          console.log('💾 Field Mapping Data:');
          console.log('  Frontend Field:', fieldMappingData.frontendField);
          console.log('  Backend Field:', fieldMappingData.backendField);
          console.log('  Expression:', fieldMappingData.expression);
          console.log('  Tree:', fieldMappingData.tree.json);
        }
      } else {
        this.binaryTreeChange.emit(null);
        this.fieldMappingChange.emit(null);
      }
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


  getTextareaStyles(): any {
    if (!this.textareaStyle) return {};
    
    return {
      '--border-color': this.textareaStyle.borderColor || '#000000',
      '--focus-border-color': this.textareaStyle.focusBorderColor || '#007bff',
      '--valid-border-color': this.textareaStyle.validBorderColor || '#28a745',
      '--error-border-color': this.textareaStyle.errorBorderColor || '#dc3545',
      'border-width': this.textareaStyle.borderWidth || '2px',
      'border-style': this.textareaStyle.borderStyle || 'solid',
      'border-radius': this.textareaStyle.borderRadius || '4px',
      'background-color': this.textareaStyle.backgroundColor || '#ffffff',
      'color': this.textareaStyle.textColor || '#000000',
      'font-size': this.textareaStyle.fontSize || '14px',
      'font-family': this.textareaStyle.fontFamily || 'monospace',
      'padding': this.textareaStyle.padding || '8px',
      'height': this.textareaStyle.height || 'auto',
      'width': this.textareaStyle.width || '100%'
    };
  }
  
  ngOnDestroy() {
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
    }
  }
}
