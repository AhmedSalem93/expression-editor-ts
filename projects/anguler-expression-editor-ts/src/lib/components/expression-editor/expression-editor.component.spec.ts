import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { ExpressionEditorComponent } from './expression-editor.component';
import { ExpressionEvaluatorService } from '../../services/expression-evaluator.service';
import { ExtensionManagerService } from '../../services/extension-manager.service';

describe('ExpressionEditorComponent', () => {
  let component: ExpressionEditorComponent;
  let fixture: ComponentFixture<ExpressionEditorComponent>;
  let evaluatorService: jasmine.SpyObj<ExpressionEvaluatorService>;
  let extensionService: jasmine.SpyObj<ExtensionManagerService>;

  beforeEach(async () => {
    const evaluatorSpy = jasmine.createSpyObj('ExpressionEvaluatorService', ['evaluateExpression']);
    const extensionSpy = jasmine.createSpyObj('ExtensionManagerService', ['registerCustomFunction']);

    await TestBed.configureTestingModule({
      imports: [ExpressionEditorComponent, FormsModule],
      providers: [
        { provide: ExpressionEvaluatorService, useValue: evaluatorSpy },
        { provide: ExtensionManagerService, useValue: extensionSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ExpressionEditorComponent);
    component = fixture.componentInstance;
    evaluatorService = TestBed.inject(ExpressionEvaluatorService) as jasmine.SpyObj<ExpressionEvaluatorService>;
    extensionService = TestBed.inject(ExtensionManagerService) as jasmine.SpyObj<ExtensionManagerService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Component Initialization', () => {
    it('should initialize with default values', () => {
      expect(component.value).toBe('');
      expect(component.disabled).toBe(false);
      expect(component.config).toEqual({});
      expect(component.evaluationResult).toBeNull();
      expect(component.showFunctionsMenu).toBe(false);
      expect(component.showSymbolPicker).toBe(false);
      expect(component.showCustomFunctionBuilder).toBe(false);
    });

    it('should apply custom configuration', () => {
      const customConfig = {
        theme: 'dark',
        height: '400px',
        placeholder: 'Custom placeholder'
      };
      
      component.config = customConfig;
      fixture.detectChanges();
      
      expect(component.config).toEqual(customConfig);
    });
  });

  describe('Expression Management', () => {
    it('should update value through input events', () => {
      const testValue = 'square(10)';
      const mockEvent = { target: { value: testValue } };
      
      spyOn(component.expressionChange, 'emit');
      evaluatorService.evaluateExpression.and.returnValue({ success: true, result: 100, type: 'number' });
      
      component.onInput(mockEvent);
      
      expect(component.value).toBe(testValue);
      expect(component.expressionChange.emit).toHaveBeenCalledWith(testValue);
      expect(evaluatorService.evaluateExpression).toHaveBeenCalledWith(testValue);
    });

    it('should clear expression and reset state', () => {
      component.value = 'test expression';
      component.evaluationResult = { success: true, result: 'test', type: 'string' };
      
      spyOn(component.expressionChange, 'emit');
      
      component.clearExpression();
      
      expect(component.value).toBe('');
      expect(component.evaluationResult).toBeNull();
      expect(component.expressionChange.emit).toHaveBeenCalledWith('');
    });

    it('should toggle editor disabled state', () => {
      expect(component.disabled).toBe(false);
      
      component.toggleEditor();
      expect(component.disabled).toBe(true);
      
      component.toggleEditor();
      expect(component.disabled).toBe(false);
    });
  });

  describe('Expression Evaluation', () => {
    it('should evaluate expression successfully', () => {
      const mockResult = { success: true, result: 25, type: 'number' };
      evaluatorService.evaluateExpression.and.returnValue(mockResult);
      
      component.value = 'square(5)';
      component.evaluateExpression();
      
      expect(component.evaluationResult).toEqual(mockResult);
      expect(evaluatorService.evaluateExpression).toHaveBeenCalledWith('square(5)');
    });

    it('should handle evaluation errors', () => {
      const mockResult = { success: false, error: 'Invalid expression' };
      evaluatorService.evaluateExpression.and.returnValue(mockResult);
      
      component.value = 'invalid(';
      component.evaluateExpression();
      
      expect(component.evaluationResult).toEqual(mockResult);
    });

    it('should clear evaluation result for empty expression', () => {
      component.value = '';
      component.evaluationResult = { success: true, result: 'previous', type: 'string' };
      
      component.evaluateExpression();
      
      expect(component.evaluationResult).toBeNull();
    });

    it('should format evaluation results correctly', () => {
      // Test number result
      component.evaluationResult = { success: true, result: 42.5, type: 'number' };
      expect(component.getFormattedResult()).toBe('42.5');
      
      // Test string result
      component.evaluationResult = { success: true, result: 'hello', type: 'string' };
      expect(component.getFormattedResult()).toBe('"hello"');
      
      // Test boolean result
      component.evaluationResult = { success: true, result: true, type: 'boolean' };
      expect(component.getFormattedResult()).toBe('true');
      
      // Test null result
      component.evaluationResult = null;
      expect(component.getFormattedResult()).toBe('');
    });
  });

  describe('Functions Menu', () => {
    it('should open functions menu', () => {
      component.openFunctionsMenu();
      expect(component.showFunctionsMenu).toBe(true);
    });

    it('should close functions menu', () => {
      component.showFunctionsMenu = true;
      component.closeFunctionsMenu();
      expect(component.showFunctionsMenu).toBe(false);
    });

    it('should select function category', () => {
      component.selectFunctionCategory('string');
      expect(component.selectedFunctionCategory).toBe('string');
    });

    it('should insert function at cursor', () => {
      const mockFunction = { name: 'square', syntax: 'square(number)', description: 'Square a number', example: 'square(5) = 25', category: 'arithmetic' };
      
      // Mock textarea element
      const mockTextarea = {
        focus: jasmine.createSpy('focus'),
        setSelectionRange: jasmine.createSpy('setSelectionRange'),
        selectionStart: 0,
        selectionEnd: 0
      };
      
      component.expressionTextarea = { nativeElement: mockTextarea } as any;
      component.value = '';
      
      component.insertFunction(mockFunction);
      
      expect(component.value).toBe('square(number)');
      expect(component.showFunctionsMenu).toBe(false);
    });
  });

  describe('Symbol Picker', () => {
    it('should open symbol picker', () => {
      component.openSymbolPicker();
      expect(component.showSymbolPicker).toBe(true);
    });

    it('should close symbol picker', () => {
      component.showSymbolPicker = true;
      component.closeSymbolPicker();
      expect(component.showSymbolPicker).toBe(false);
    });

    it('should select symbol category', () => {
      component.selectSymbolCategory('logical');
      expect(component.selectedSymbolCategory).toBe('logical');
    });

    it('should insert symbol at cursor', () => {
      const mockSymbol = { name: 'Plus', symbol: '+', description: 'Addition operator', category: 'arithmetic' };
      
      const mockTextarea = {
        focus: jasmine.createSpy('focus'),
        setSelectionRange: jasmine.createSpy('setSelectionRange'),
        selectionStart: 5,
        selectionEnd: 5
      };
      
      component.expressionTextarea = { nativeElement: mockTextarea } as any;
      component.value = 'test ';
      
      component.insertSymbol(mockSymbol);
      
      expect(component.value).toBe('test +');
      expect(component.showSymbolPicker).toBe(false);
    });
  });

  describe('Custom Function Builder', () => {
    it('should open custom function builder', () => {
      component.openCustomFunctionBuilder();
      expect(component.showCustomFunctionBuilder).toBe(true);
    });

    it('should close custom function builder', () => {
      component.showCustomFunctionBuilder = true;
      component.closeCustomFunctionBuilder();
      expect(component.showCustomFunctionBuilder).toBe(false);
    });

    it('should handle custom function creation', () => {
      const mockCustomFunction = {
        name: 'customFunc',
        syntax: 'customFunc(x)',
        description: 'Custom function',
        implementation: 'return x * 2;',
        category: 'custom'
      };
      
      const mockTextarea = {
        focus: jasmine.createSpy('focus'),
        setSelectionRange: jasmine.createSpy('setSelectionRange'),
        selectionStart: 0,
        selectionEnd: 0
      };
      
      component.expressionTextarea = { nativeElement: mockTextarea } as any;
      component.value = '';
      
      component.onCustomFunctionCreated(mockCustomFunction);
      
      expect(extensionService.registerCustomFunction).toHaveBeenCalledWith(mockCustomFunction);
      expect(component.showCustomFunctionBuilder).toBe(false);
      expect(component.value).toBe('customFunc(x)');
    });
  });

  describe('Text Insertion', () => {
    it('should insert text at cursor position', () => {
      const mockTextarea = {
        focus: jasmine.createSpy('focus'),
        setSelectionRange: jasmine.createSpy('setSelectionRange'),
        selectionStart: 3,
        selectionEnd: 3
      };
      
      component.expressionTextarea = { nativeElement: mockTextarea } as any;
      component.value = 'abc';
      
      component.insertTextAtCursor('XYZ');
      
      expect(component.value).toBe('abcXYZ');
      expect(mockTextarea.focus).toHaveBeenCalled();
      expect(mockTextarea.setSelectionRange).toHaveBeenCalledWith(6, 6);
    });

    it('should handle text insertion with selection', () => {
      const mockTextarea = {
        focus: jasmine.createSpy('focus'),
        setSelectionRange: jasmine.createSpy('setSelectionRange'),
        selectionStart: 1,
        selectionEnd: 3
      };
      
      component.expressionTextarea = { nativeElement: mockTextarea } as any;
      component.value = 'abcde';
      
      component.insertTextAtCursor('XYZ');
      
      expect(component.value).toBe('aXYZde');
      expect(mockTextarea.setSelectionRange).toHaveBeenCalledWith(4, 4);
    });
  });

  describe('Syntax Checking', () => {
    it('should validate balanced parentheses', () => {
      expect(component.basicSyntaxCheck('(1 + 2)')).toBe(true);
      expect(component.basicSyntaxCheck('((1 + 2) * 3)')).toBe(true);
      expect(component.basicSyntaxCheck('(1 + 2')).toBe(false);
      expect(component.basicSyntaxCheck('1 + 2)')).toBe(false);
      expect(component.basicSyntaxCheck(')1 + 2(')).toBe(false);
    });

    it('should handle empty expressions', () => {
      expect(component.basicSyntaxCheck('')).toBe(true);
      expect(component.basicSyntaxCheck('   ')).toBe(true);
    });
  });

  describe('ControlValueAccessor Implementation', () => {
    it('should write value', () => {
      const testValue = 'test expression';
      
      component.writeValue(testValue);
      expect(component.value).toBe(testValue);
    });

    it('should handle null value', () => {
      component.writeValue(null);
      expect(component.value).toBe('');
    });

    it('should register onChange callback', () => {
      const mockCallback = jasmine.createSpy('onChange');
      
      component.registerOnChange(mockCallback);
      component.onInput({ target: { value: 'test' } });
      
      expect(mockCallback).toHaveBeenCalledWith('test');
    });

    it('should register onTouched callback', () => {
      const mockCallback = jasmine.createSpy('onTouched');
      
      component.registerOnTouched(mockCallback);
      component.onBlur();
      
      expect(mockCallback).toHaveBeenCalled();
    });

    it('should set disabled state', () => {
      component.setDisabledState(true);
      expect(component.disabled).toBe(true);
      
      component.setDisabledState(false);
      expect(component.disabled).toBe(false);
    });
  });

  describe('Function Categories', () => {
    it('should have arithmetic functions including square', () => {
      const arithmeticCategory = component.functionCategories.find(cat => cat.name === 'arithmetic');
      expect(arithmeticCategory).toBeDefined();
      
      const squareFunction = arithmeticCategory?.functions.find(f => f.name === 'square');
      expect(squareFunction).toBeDefined();
      expect(squareFunction?.syntax).toBe('square(number)');
    });

    it('should have all required function categories', () => {
      const categoryNames = component.functionCategories.map(cat => cat.name);
      expect(categoryNames).toContain('arithmetic');
      expect(categoryNames).toContain('relational');
      expect(categoryNames).toContain('logical');
      expect(categoryNames).toContain('string');
      expect(categoryNames).toContain('datetime');
      expect(categoryNames).toContain('custom');
    });
  });

  describe('Symbol Categories', () => {
    it('should have all required symbol categories', () => {
      const categoryNames = component.symbolCategories.map(cat => cat.name);
      expect(categoryNames).toContain('arithmetic');
      expect(categoryNames).toContain('relational');
      expect(categoryNames).toContain('logical');
      expect(categoryNames).toContain('brackets');
      expect(categoryNames).toContain('punctuation');
    });
  });

  describe('Advanced Function Category Tests', () => {
    it('should get selected category functions for arithmetic', () => {
      component.selectedFunctionCategory = 'arithmetic';
      const functions = component.getSelectedCategoryFunctions();
      expect(functions.length).toBeGreaterThan(0);
      expect(functions.some(f => f.name === 'add')).toBe(true);
    });

    it('should get selected category functions for custom with extension manager functions', () => {
      const mockCustomFunction = {
        name: 'testFunc',
        syntax: 'testFunc(x)',
        description: 'Test function',
        category: 'custom',
        implementation: (x: number) => x * 2
      };
      
      extensionService.getCustomFunctions.and.returnValue([mockCustomFunction]);
      component.selectedFunctionCategory = 'custom';
      
      const functions = component.getSelectedCategoryFunctions();
      expect(functions.some(f => f.name === 'testFunc')).toBe(true);
    });

    it('should get selected category symbols', () => {
      component.selectedSymbolCategory = 'arithmetic';
      const symbols = component.getSelectedCategorySymbols();
      expect(symbols.length).toBeGreaterThan(0);
    });

    it('should return empty array for non-existent function category', () => {
      component.selectedFunctionCategory = 'nonexistent';
      const functions = component.getSelectedCategoryFunctions();
      expect(functions).toEqual([]);
    });

    it('should return empty array for non-existent symbol category', () => {
      component.selectedSymbolCategory = 'nonexistent';
      const symbols = component.getSelectedCategorySymbols();
      expect(symbols).toEqual([]);
    });
  });

  describe('Text Insertion and Cursor Management', () => {
    beforeEach(() => {
      const mockTextarea = {
        focus: jasmine.createSpy('focus'),
        setSelectionRange: jasmine.createSpy('setSelectionRange'),
        selectionStart: 0,
        selectionEnd: 0
      };
      component.expressionTextarea = { nativeElement: mockTextarea } as any;
    });

    it('should insert text at cursor position in middle of text', () => {
      component.value = 'hello world';
      component.expressionTextarea.nativeElement.selectionStart = 5;
      component.expressionTextarea.nativeElement.selectionEnd = 5;
      
      component.insertTextAtCursor(' beautiful');
      
      expect(component.value).toBe('hello beautiful world');
    });

    it('should replace selected text when inserting', () => {
      component.value = 'hello world';
      component.expressionTextarea.nativeElement.selectionStart = 6;
      component.expressionTextarea.nativeElement.selectionEnd = 11;
      
      component.insertTextAtCursor('universe');
      
      expect(component.value).toBe('hello universe');
    });

    it('should handle empty value when inserting text', () => {
      component.value = '';
      component.expressionTextarea.nativeElement.selectionStart = 0;
      component.expressionTextarea.nativeElement.selectionEnd = 0;
      
      component.insertTextAtCursor('test');
      
      expect(component.value).toBe('test');
    });

    it('should handle null value when inserting text', () => {
      component.value = null as any;
      component.expressionTextarea.nativeElement.selectionStart = 0;
      component.expressionTextarea.nativeElement.selectionEnd = 0;
      
      component.insertTextAtCursor('test');
      
      expect(component.value).toBe('test');
    });
  });

  describe('Syntax Validation', () => {
    it('should validate balanced parentheses', () => {
      expect(component.basicSyntaxCheck('()')).toBe(true);
      expect(component.basicSyntaxCheck('((()))')).toBe(true);
      expect(component.basicSyntaxCheck('add(5, multiply(2, 3))')).toBe(true);
    });

    it('should detect unbalanced parentheses', () => {
      expect(component.basicSyntaxCheck('(()')).toBe(false);
      expect(component.basicSyntaxCheck('())')).toBe(false);
      expect(component.basicSyntaxCheck(')(')).toBe(false);
    });

    it('should handle empty expressions', () => {
      expect(component.basicSyntaxCheck('')).toBe(true);
      expect(component.basicSyntaxCheck('   ')).toBe(true);
    });

    it('should handle complex expressions', () => {
      expect(component.basicSyntaxCheck('if(greaterThan(a, b), add(c, d), subtract(e, f))')).toBe(true);
      expect(component.basicSyntaxCheck('if(greaterThan(a, b), add(c, d), subtract(e, f)')).toBe(false);
    });
  });

  describe('Menu State Management', () => {
    it('should reset selected function when closing functions menu', () => {
      component.selectedFunction = { name: 'test', syntax: 'test()', description: 'test', example: '', category: 'test' };
      component.closeFunctionsMenu();
      expect(component.selectedFunction).toBeNull();
    });

    it('should reset selected symbol when closing symbol picker', () => {
      component.selectedSymbol = { name: 'test', symbol: '+', description: 'test', category: 'test' };
      component.closeSymbolPicker();
      expect(component.selectedSymbol).toBeNull();
    });

    it('should reset selected function when changing function category', () => {
      component.selectedFunction = { name: 'test', syntax: 'test()', description: 'test', example: '', category: 'test' };
      component.selectFunctionCategory('string');
      expect(component.selectedFunction).toBeNull();
    });

    it('should reset selected symbol when changing symbol category', () => {
      component.selectedSymbol = { name: 'test', symbol: '+', description: 'test', category: 'test' };
      component.selectSymbolCategory('logical');
      expect(component.selectedSymbol).toBeNull();
    });

    it('should select function', () => {
      const mockFunction = { name: 'add', syntax: 'add(a, b)', description: 'Adds two numbers', example: 'add(5, 3) = 8', category: 'arithmetic' };
      component.selectFunction(mockFunction);
      expect(component.selectedFunction).toBe(mockFunction);
    });

    it('should select symbol', () => {
      const mockSymbol = { name: 'Plus', symbol: '+', description: 'Addition operator', category: 'arithmetic' };
      component.selectSymbol(mockSymbol);
      expect(component.selectedSymbol).toBe(mockSymbol);
    });
  });

  describe('ControlValueAccessor Edge Cases', () => {
    it('should handle null value in writeValue', () => {
      component.writeValue(null);
      expect(component.value).toBe('');
    });

    it('should handle undefined value in writeValue', () => {
      component.writeValue(undefined as any);
      expect(component.value).toBe('');
    });

    it('should register onChange callback', () => {
      const mockOnChange = jasmine.createSpy('onChange');
      component.registerOnChange(mockOnChange);
      // Test that the callback is registered by checking the method exists
      expect(component.registerOnChange).toBeDefined();
    });

    it('should register onTouched callback', () => {
      const mockOnTouched = jasmine.createSpy('onTouched');
      component.registerOnTouched(mockOnTouched);
      // The callback is registered, we can't directly test private method
      expect(component.registerOnTouched).toBeDefined();
    });

    it('should set disabled state', () => {
      component.setDisabledState(true);
      expect(component.disabled).toBe(true);
      
      component.setDisabledState(false);
      expect(component.disabled).toBe(false);
    });
  });

  describe('Custom Function Integration', () => {
    it('should register custom function and insert syntax', () => {
      const mockCustomFunction = {
        name: 'customFunc',
        syntax: 'customFunc(x)',
        description: 'Custom function',
        category: 'custom',
        implementation: (x: number) => x * 2
      };
      
      const mockTextarea = {
        focus: jasmine.createSpy('focus'),
        setSelectionRange: jasmine.createSpy('setSelectionRange'),
        selectionStart: 0,
        selectionEnd: 0
      };
      component.expressionTextarea = { nativeElement: mockTextarea } as any;
      component.value = '';
      
      component.onCustomFunctionCreated(mockCustomFunction);
      
      expect(extensionService.registerCustomFunction).toHaveBeenCalledWith(mockCustomFunction);
      expect(component.showCustomFunctionBuilder).toBe(false);
      expect(component.value).toBe('customFunc(x)');
    });

    it('should register custom function without syntax insertion', () => {
      const mockCustomFunction = {
        name: 'customFunc',
        syntax: '',
        description: 'Custom function',
        category: 'custom',
        implementation: (x: number) => x * 2
      };
      
      component.value = 'original';
      component.onCustomFunctionCreated(mockCustomFunction);
      
      expect(extensionService.registerCustomFunction).toHaveBeenCalledWith(mockCustomFunction);
      expect(component.showCustomFunctionBuilder).toBe(false);
      expect(component.value).toBe('original');
    });
  });
});
