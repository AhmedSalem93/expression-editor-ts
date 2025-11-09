import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ExpressionEditorComponent } from './expression-editor.component';
import { ExpressionEvaluatorService } from '../../services/expression-evaluator/expression-evaluator.service';
import { ConfigurationService } from '../../services/configuration/configuration.service';
import { DataType, ContextType, Variable } from '../../interfaces/shared.interfaces';

describe('ExpressionEditorComponent Integration Tests', () => {
  let component: ExpressionEditorComponent;
  let fixture: ComponentFixture<ExpressionEditorComponent>;
  let evaluatorService: ExpressionEvaluatorService;
  let configurationService: ConfigurationService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        FormsModule,
        ExpressionEditorComponent
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ExpressionEditorComponent);
    component = fixture.componentInstance;
    evaluatorService = TestBed.inject(ExpressionEvaluatorService);
    configurationService = TestBed.inject(ConfigurationService);
  });

  describe('Full Mode Integration', () => {
    beforeEach(() => {
      component.simpleMode = false;
      component.editorConfig = configurationService.getBooleanConfig();
      fixture.detectChanges();
    });

    it('should render all sub-components in full mode', () => {
      const headerElement = fixture.debugElement.query(By.css('lib-expression-header'));
      const textareaElement = fixture.debugElement.query(By.css('lib-expression-textarea'));
      const controlsElement = fixture.debugElement.query(By.css('lib-expression-controls'));
      const infoElement = fixture.debugElement.query(By.css('lib-expression-info'));

      expect(headerElement).toBeTruthy();
      expect(textareaElement).toBeTruthy();
      expect(controlsElement).toBeTruthy();
      expect(infoElement).toBeTruthy();
    });

    it('should show division toggle for limited connector context', () => {
      component.editorConfig = configurationService.getLimitedConnectorConfig();
      fixture.detectChanges();

      const divisionToggle = fixture.debugElement.query(By.css('lib-division-toggle'));
      expect(divisionToggle).toBeTruthy();
    });

    it('should hide division toggle for other contexts', () => {
      component.editorConfig = configurationService.getBooleanConfig();
      fixture.detectChanges();

      const divisionToggle = fixture.debugElement.query(By.css('lib-division-toggle'));
      expect(divisionToggle).toBeFalsy();
    });
  });

  describe('Simple Mode Integration', () => {
    beforeEach(() => {
      component.simpleMode = true;
      fixture.detectChanges();
    });

    it('should render only textarea in simple mode', () => {
      const simpleEditor = fixture.debugElement.query(By.css('.simple-expression-editor'));
      const fullEditor = fixture.debugElement.query(By.css('.expression-editor-container'));

      expect(simpleEditor).toBeTruthy();
      expect(fullEditor).toBeFalsy();
    });

    it('should apply custom textarea styles in simple mode', () => {
      component.textareaStyle = {
        borderColor: '#ff0000',
        backgroundColor: '#f0f0f0',
        fontSize: '16px'
      };
      fixture.detectChanges();

      const textarea = fixture.debugElement.query(By.css('.simple-textarea'));
      const styles = textarea.nativeElement.style;

      expect(styles.borderColor).toBe('rgb(255, 0, 0)');
      expect(styles.backgroundColor).toBe('rgb(240, 240, 240)');
      expect(styles.fontSize).toBe('16px');
    });
  });

  describe('Expression Analysis Integration', () => {
    beforeEach(() => {
      component.simpleMode = false;
      fixture.detectChanges();
    });

    it('should analyze expression and emit results', fakeAsync(() => {
      spyOn(component.validationChange, 'emit');
      spyOn(component.binaryTreeChange, 'emit');

      component.onValueChange('2 + 3');
      tick(1000); // Wait for debounce

      expect(component.validationChange.emit).toHaveBeenCalled();
      expect(component.binaryTreeChange.emit).toHaveBeenCalled();
    }));

    it('should handle boolean expressions correctly', fakeAsync(() => {
      component.editorConfig = configurationService.getBooleanConfig();
      spyOn(component.validationChange, 'emit');

      component.onValueChange('status == "active"');
      tick(1000);

      expect(component.typeResult?.returnType).toBe(DataType.BOOLEAN);
      expect(component.validationChange.emit).toHaveBeenCalled();
    }));

    it('should handle assignment expressions correctly', fakeAsync(() => {
      component.editorConfig = configurationService.getAssignmentConfig();
      spyOn(component.validationChange, 'emit');

      component.onValueChange('output = input * 2');
      tick(1000);

      expect(component.typeResult?.returnType).toBe(DataType.ASSIGNMENT);
      expect(component.validationChange.emit).toHaveBeenCalled();
    }));
  });

  describe('Variable Management Integration', () => {
    beforeEach(() => {
      component.simpleMode = false;
      fixture.detectChanges();
    });

    it('should add and use variables in expressions', () => {
      const variable: Variable = {
        name: 'testVar',
        value: 42,
        type: DataType.INTEGER,
        explanation: 'Test variable'
      };

      component.onVariableCreated(variable);
      expect(evaluatorService.getVariable('testVar')).toEqual(variable);

      // Test variable usage in expression
      component.onValueChange('testVar + 10');
      expect(component.typeResult?.usedVariables).toContain(variable);
    });

    it('should remove variables correctly', () => {
      const variable: Variable = {
        name: 'tempVar',
        value: 'test',
        type: DataType.STRING,
        explanation: 'Temporary variable'
      };

      component.onVariableCreated(variable);
      expect(evaluatorService.getVariable('tempVar')).toEqual(variable);

      component.onVariableDeleted(variable);
      expect(evaluatorService.getVariable('tempVar')).toBeUndefined();
    });

    it('should insert variables at cursor position', () => {
      const variable: Variable = {
        name: 'insertVar',
        value: 100,
        type: DataType.INTEGER,
        explanation: 'Variable to insert'
      };

      spyOn(component, 'insertTextAtCursor');
      component.onVariableInserted(variable);

      expect(component.insertTextAtCursor).toHaveBeenCalledWith('insertVar');
    });

    it('should close variable manager after insertion', () => {
      const variable: Variable = {
        name: 'closeVar',
        value: 'test',
        type: DataType.STRING,
        explanation: 'Variable that closes modal'
      };

      component.showVariableManager = true;
      component.onVariableInserted(variable);

      expect(component.showVariableManager).toBeFalsy();
    });
  });

  describe('Modal Management Integration', () => {
    beforeEach(() => {
      component.simpleMode = false;
      fixture.detectChanges();
    });

    it('should open and close functions menu', () => {
      expect(component.showFunctionsMenu).toBeFalsy();

      component.onOpenFunctionsMenu();
      expect(component.showFunctionsMenu).toBeTruthy();

      component.onCloseFunctionsMenu();
      expect(component.showFunctionsMenu).toBeFalsy();
      expect(component.selectedFunction).toBeNull();
    });

    it('should open and close symbol picker', () => {
      expect(component.showSymbolPicker).toBeFalsy();

      component.onOpenSymbolPicker();
      expect(component.showSymbolPicker).toBeTruthy();

      component.onCloseSymbolPicker();
      expect(component.showSymbolPicker).toBeFalsy();
      expect(component.selectedSymbol).toBeNull();
    });

    it('should handle custom function creation', () => {
      const customFunction = {
        name: 'testFunc',
        syntax: 'testFunc(x)',
        implementation: '(x) => x * 2',
        description: 'Test function',
        category: 'custom'
      };

      spyOn(component, 'insertTextAtCursor');
      component.onCustomFunctionCreated(customFunction);

      expect(component.showCustomFunctionBuilder).toBeFalsy();
      expect(component.selectedFunctionCategory).toBe('custom');
      expect(component.insertTextAtCursor).toHaveBeenCalledWith('testFunc(x)');
    });
  });

  describe('Configuration Integration', () => {
    it('should update configuration and re-analyze expression', fakeAsync(() => {
      component.value = '5 > 3';
      const newConfig = configurationService.getArithmeticConfig();

      spyOn(component, 'analyzeExpression');
      component.onConfigChange(newConfig);

      expect(component.editorConfig).toBe(newConfig);
      expect(component.analyzeExpression).toHaveBeenCalled();
    }));

    it('should emit configuration changes', () => {
      spyOn(component.configChange, 'emit');
      const newConfig = configurationService.getBooleanConfig();

      component.onConfigChange(newConfig);

      expect(component.configChange.emit).toHaveBeenCalledWith(newConfig);
    });
  });

  describe('ControlValueAccessor Integration', () => {
    it('should implement ControlValueAccessor correctly', () => {
      const testValue = 'test expression';
      const onChangeSpy = jasmine.createSpy('onChange');
      const onTouchedSpy = jasmine.createSpy('onTouched');

      component.registerOnChange(onChangeSpy);
      component.registerOnTouched(onTouchedSpy);

      component.writeValue(testValue);
      expect(component.value).toBe(testValue);

      component.onValueChange('new value');
      expect(onChangeSpy).toHaveBeenCalledWith('new value');

      component.onTextareaBlur();
      expect(onTouchedSpy).toHaveBeenCalled();
    });

    it('should handle disabled state correctly', () => {
      expect(component.disabled).toBeFalsy();

      component.setDisabledState(true);
      expect(component.disabled).toBeTruthy();

      component.setDisabledState(false);
      expect(component.disabled).toBeFalsy();
    });
  });

  describe('Error Handling Integration', () => {
    it('should handle empty expressions gracefully', fakeAsync(() => {
      component.onValueChange('');
      tick(1000);

      expect(component.typeResult).toBeNull();
      expect(component.currentValidation).toBeNull();
    }));

    it('should handle invalid expressions gracefully', fakeAsync(() => {
      component.onValueChange('invalid @#$ expression');
      tick(1000);

      expect(component.typeResult?.success).toBeFalsy();
      expect(component.typeResult?.error).toBeDefined();
    }));
  });

  describe('Performance Integration', () => {
    it('should debounce expression analysis', fakeAsync(() => {
      spyOn(component, 'analyzeExpression');

      component.onValueChange('first');
      component.onValueChange('second');
      component.onValueChange('third');

      // Should not call analyze yet
      expect(component.analyzeExpression).not.toHaveBeenCalled();

      tick(1000);

      // Should call analyze only once after debounce
      expect(component.analyzeExpression).toHaveBeenCalledTimes(1);
    }));

    it('should clean up debounce timer on destroy', () => {
      component.onValueChange('test');
      expect(component['debounceTimer']).toBeDefined();

      component.ngOnDestroy();
      expect(component['debounceTimer']).toBeNull();
    });
  });

  describe('Accessibility Integration', () => {
    it('should have proper ARIA attributes', () => {
      component.simpleMode = false;
      fixture.detectChanges();

      const container = fixture.debugElement.query(By.css('.expression-editor-container'));
      expect(container).toBeTruthy();
    });

    it('should handle keyboard navigation', () => {
      component.simpleMode = true;
      fixture.detectChanges();

      const textarea = fixture.debugElement.query(By.css('.simple-textarea'));
      expect(textarea.nativeElement.tabIndex).not.toBe(-1);
    });
  });
});
