import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ExpressionEditorComponent } from './expression-editor.component';
import { ExpressionEvaluatorService } from '../../services/expression-evaluator.service';
import { ExtensionManagerService } from '../../services/extension-manager.service';

// Import all sub-components with correct paths
import { ExpressionHeaderComponent } from './expression-header/expression-header.component';
import { DivisionToggleComponent } from './division-toggle/division-toggle.component';
import { ExpressionTextareaComponent } from './expression-textarea/expression-textarea.component';
import { ExpressionControlsComponent } from './expression-controls/expression-controls.component';
import { ExpressionInfoComponent } from './expression-info/expression-info.component';
import { FunctionsMenuComponent } from './functions-menu/functions-menu.component';
import { SymbolPickerComponent } from './symbol-picker/symbol-picker.component';
import { CustomFunctionBuilderComponent } from './custom-function-builder/custom-function-builder.component';
import { VariableManagerComponent } from './variable-manager/variable-manager.component';

import { DataType, ContextType, TypeValidationResult, ExpressionTypeResult } from '../../interfaces/shared.interfaces';
import { CustomFunction } from '../../interfaces/extensibility.interfaces';

describe('ExpressionEditorComponent', () => {
  let component: ExpressionEditorComponent;
  let fixture: ComponentFixture<ExpressionEditorComponent>;
  let evaluatorService: jasmine.SpyObj<ExpressionEvaluatorService>;
  let extensionService: jasmine.SpyObj<ExtensionManagerService>;

  beforeEach(async () => {
    const evaluatorSpy = jasmine.createSpyObj('ExpressionEvaluatorService', [
      'identifyExpressionType',
      'getPlaceholderForType',
      'getBooleanConfig',
      'getAssignmentConfig',
      'getArithmeticConfig',
      'getLimitedConnectorConfig',
      'getVariables',
      'addVariable',
      'removeVariable'
    ]);

    const extensionSpy = jasmine.createSpyObj('ExtensionManagerService', [
      'getCustomFunctions',
      'registerCustomFunction'
    ]);

    await TestBed.configureTestingModule({
      imports: [
        ExpressionEditorComponent, 
        ExpressionHeaderComponent,
        DivisionToggleComponent,
        ExpressionTextareaComponent,
        ExpressionControlsComponent,
        ExpressionInfoComponent,
        FunctionsMenuComponent,
        SymbolPickerComponent,
        CustomFunctionBuilderComponent,
        VariableManagerComponent,
        FormsModule, 
        CommonModule
      ],
      providers: [
        { provide: ExpressionEvaluatorService, useValue: evaluatorSpy },
        { provide: ExtensionManagerService, useValue: extensionSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ExpressionEditorComponent);
    component = fixture.componentInstance;
    evaluatorService = TestBed.inject(ExpressionEvaluatorService) as jasmine.SpyObj<ExpressionEvaluatorService>;
    extensionService = TestBed.inject(ExtensionManagerService) as jasmine.SpyObj<ExtensionManagerService>;

    // Setup default spy returns
    evaluatorService.identifyExpressionType.and.returnValue({
      success: true,
      returnType: DataType.REAL,
      typeValidation: {
        isValid: true,
        message: 'Valid',
        expectedType: DataType.REAL,
        contextType: ContextType.GENERAL
      }
    });
    evaluatorService.getPlaceholderForType.and.returnValue('Enter expression...');
    evaluatorService.getVariables.and.returnValue([]);
    extensionService.getCustomFunctions.and.returnValue([]);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Custom Function Builder', () => {
    it('should handle custom function creation', () => {
      spyOn(component, 'onCloseCustomFunctionBuilder');
      spyOn(component, 'insertTextAtCursor');
      const customFunction: CustomFunction = {
        name: 'testFunc',
        syntax: 'testFunc(x)',
        description: 'Test function',
        category: 'custom'
      };
      
      component.onCustomFunctionCreated(customFunction);
      
      expect(extensionService.registerCustomFunction).toHaveBeenCalledWith(customFunction);
      expect(component.onCloseCustomFunctionBuilder).toHaveBeenCalled();
      expect(component.selectedFunctionCategory).toBe('custom');
      expect(component.insertTextAtCursor).toHaveBeenCalledWith('testFunc(x)');
    });
  });
});
