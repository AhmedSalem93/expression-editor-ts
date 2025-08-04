import { Component, Input, Output, EventEmitter, forwardRef, ViewChild, ElementRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CustomFunctionBuilderComponent } from '../custom-function-builder/custom-function-builder.component';
import { ExpressionEvaluatorService } from '../../services/expression-evaluator.service';
import { ExtensionManagerService } from '../../services/extension-manager.service';
import { CustomFunction } from '../../interfaces/extensibility.interfaces';
import { 
  FunctionCategory, 
  FunctionItem, 
  SymbolCategory, 
  SymbolItem, 
  EvaluationResult 
} from '../../interfaces/shared.interfaces';
import { FUNCTION_CATEGORIES, SYMBOL_CATEGORIES } from '../../data/function-categories.data';

@Component({
  selector: 'lib-expression-editor',
  standalone: true,
  imports: [CommonModule, FormsModule, CustomFunctionBuilderComponent],
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
  @Input() config: any = {};
  @Input() disabled = false;
  @Output() expressionChange = new EventEmitter<string>();

  @ViewChild('expressionTextarea') expressionTextarea!: ElementRef<HTMLTextAreaElement>;

  value = '';
  evaluationResult: EvaluationResult | null = null;
  
  // Menu states
  showFunctionsMenu = false;
  showSymbolPicker = false;
  showCustomFunctionBuilder = false;
  
  // Selected items in menus
  selectedFunction: FunctionItem | null = null;
  selectedSymbol: SymbolItem | null = null;
  selectedFunctionCategory = 'arithmetic';
  selectedSymbolCategory = 'arithmetic';
  
  private onChange = (value: string) => {};
  private onTouched = () => {};

  // Data from external files 
  functionCategories: FunctionCategory[] = [];
  symbolCategories: SymbolCategory[] = SYMBOL_CATEGORIES;

  constructor(
    private evaluatorService: ExpressionEvaluatorService,
    private extensionManager: ExtensionManagerService
  ) {
    
    // Initialize function categories with built-in functions plus custom category
    this.initializeFunctionCategories();
  }

  private initializeFunctionCategories(): void {
    // Load built-in categories from external file
    this.functionCategories = [...FUNCTION_CATEGORIES];
    
    // Add custom functions category
    this.functionCategories.push({
      name: 'custom',
      label: 'Custom Functions',
      functions: [] 
    });
  }

  onInput(event: any) {
    this.value = event.target.value;
    this.onChange(this.value);
    this.expressionChange.emit(this.value);
    this.evaluateExpression();
  }

  onBlur() {
    this.onTouched();
  }

  toggleEditor() {
    this.disabled = !this.disabled;
  }

  clearExpression() {
    this.value = '';
    this.onChange(this.value);
    this.expressionChange.emit(this.value);
    this.evaluationResult = null;
  }

  // Expression evaluation
  evaluateExpression() {
    if (!this.value.trim()) {
      this.evaluationResult = null;
      return;
    }

    this.evaluationResult = this.evaluatorService.evaluateExpression(this.value);
  }

  getFormattedResult(): string {
    if (!this.evaluationResult?.success) return '';
    
    const result = this.evaluationResult.result;
    if (typeof result === 'number') {
      return Number.isInteger(result) ? result.toString() : result.toFixed(6).replace(/\.?0+$/, '');
    }
    return String(result);
  }

  // Functions Menu
  openFunctionsMenu() {
    this.showFunctionsMenu = true;
  }

  closeFunctionsMenu() {
    this.showFunctionsMenu = false;
    this.selectedFunction = null;
  }

  selectFunctionCategory(category: string) {
    this.selectedFunctionCategory = category;
    this.selectedFunction = null;
  }

  selectFunction(func: FunctionItem) {
    this.selectedFunction = func;
  }

  getSelectedCategoryFunctions(): FunctionItem[] {
    const category = this.functionCategories.find(c => c.name === this.selectedFunctionCategory);
    let functions = category ? category.functions : [];
    
    // Add custom functions if 'custom' category is selected
    if (this.selectedFunctionCategory === 'custom') {
      const customFunctions = this.extensionManager.getCustomFunctions();
      const customFunctionItems: FunctionItem[] = customFunctions.map(cf => ({
        name: cf.name,
        syntax: cf.syntax,
        description: cf.description,
        example: cf.example || '',
        category: 'custom'
      }));
      functions = [...customFunctionItems];
    }
    
    return functions;
  }

  insertFunction(func: FunctionItem) {
    this.insertTextAtCursor(func.syntax);
    this.closeFunctionsMenu();
  }

  // Symbol Picker
  openSymbolPicker() {
    this.showSymbolPicker = true;
  }

  closeSymbolPicker() {
    this.showSymbolPicker = false;
    this.selectedSymbol = null;
  }

  selectSymbolCategory(category: string) {
    this.selectedSymbolCategory = category;
    this.selectedSymbol = null;
  }

  selectSymbol(symbol: SymbolItem) {
    this.selectedSymbol = symbol;
  }

  getSelectedCategorySymbols(): SymbolItem[] {
    const category = this.symbolCategories.find(c => c.name === this.selectedSymbolCategory);
    return category ? category.symbols : [];
  }

  insertSymbol(symbol: SymbolItem) {
    this.insertTextAtCursor(symbol.symbol);
    this.closeSymbolPicker();
  }

  // Helper method to insert text at cursor position
  insertTextAtCursor(text: string) {
    const textarea = this.expressionTextarea.nativeElement;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const currentValue = this.value || '';
    
    this.value = currentValue.substring(0, start) + text + currentValue.substring(end);
    this.onChange(this.value);
    this.expressionChange.emit(this.value);
    
    // Set cursor position after inserted text
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + text.length, start + text.length);
    });
  }

  basicSyntaxCheck(expression: string): boolean {
    if (!expression.trim()) return true;
    
    let openParens = 0;
    for (const char of expression) {
      if (char === '(') openParens++;
      if (char === ')') openParens--;
      if (openParens < 0) return false;
    }
    return openParens === 0;
  }

  // Custom Function Builder methods
  openCustomFunctionBuilder(): void {
    this.showCustomFunctionBuilder = true;
  }

  closeCustomFunctionBuilder(): void {
    this.showCustomFunctionBuilder = false;
  }

  onCustomFunctionCreated(customFunction: CustomFunction) {
    // Register the custom function with the extension manager
    this.extensionManager.registerCustomFunction(customFunction);
    
    // Close the builder
    this.closeCustomFunctionBuilder();
    
    // Switch to custom functions tab to show the new function
    this.selectedFunctionCategory = 'custom';
    
    // Optionally insert the function into the editor
    if (customFunction.syntax) {
      this.insertTextAtCursor(customFunction.syntax);
    }
  }

  // Check if custom functions tab should show "Create Function" button
  isCustomFunctionsCategory(): boolean {
    return this.selectedFunctionCategory === 'custom';
  }

  // ControlValueAccessor implementation
  writeValue(value: string | null): void {
    this.value = value || '';
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
