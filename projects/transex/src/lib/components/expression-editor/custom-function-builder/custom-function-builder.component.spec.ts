import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CustomFunctionBuilderComponent } from './custom-function-builder.component';
import { CustomFunction } from '../../../interfaces/extensibility.interfaces';

describe('CustomFunctionBuilderComponent', () => {
  let component: CustomFunctionBuilderComponent;
  let fixture: ComponentFixture<CustomFunctionBuilderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        CustomFunctionBuilderComponent,
        FormsModule,
        CommonModule
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CustomFunctionBuilderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Component Initialization', () => {
    it('should initialize with default values', () => {
      expect(component.isVisible).toBeFalsy();
      expect(component.newFunction).toBeDefined();
      expect(component.newFunction.name).toBe('');
      expect(component.newFunction.syntax).toBe('');
      expect(component.newFunction.description).toBe('');
      expect(component.newFunction.example).toBe('');
      expect(component.newFunction.category).toBe('custom');
    });
  });

  describe('Form Validation', () => {
    it('should validate function name correctly', () => {
      // Empty name should be invalid
      component.newFunction.name = '';
      expect(component.isValidFunctionName()).toBeFalsy();

      // Valid name should be valid
      component.newFunction.name = 'myFunction';
      expect(component.isValidFunctionName()).toBeTruthy();

      // Name with numbers should be valid
      component.newFunction.name = 'func123';
      expect(component.isValidFunctionName()).toBeTruthy();

      // Name starting with number should be invalid
      component.newFunction.name = '123func';
      expect(component.isValidFunctionName()).toBeFalsy();

      // Name with special characters should be invalid
      component.newFunction.name = 'func-name';
      expect(component.isValidFunctionName()).toBeFalsy();
    });

    it('should validate function syntax correctly', () => {
      // Empty syntax should be invalid
      component.newFunction.syntax = '';
      expect(component.isValidFunctionSyntax()).toBeFalsy();

      // Non-empty syntax should be valid
      component.newFunction.syntax = 'myFunc()';
      expect(component.isValidFunctionSyntax()).toBeTruthy();
    });

    it('should validate function description correctly', () => {
      // Empty description should be invalid
      component.newFunction.description = '';
      expect(component.isValidFunctionDescription()).toBeFalsy();

      // Non-empty description should be valid
      component.newFunction.description = 'This is a test function';
      expect(component.isValidFunctionDescription()).toBeTruthy();
    });

    it('should validate complete form', () => {
      // Incomplete form should be invalid
      expect(component.isFormValid()).toBeFalsy();

      // Complete form should be valid
      component.newFunction.name = 'testFunc';
      component.newFunction.syntax = 'testFunc(x)';
      component.newFunction.description = 'Test function';
      expect(component.isFormValid()).toBeTruthy();
    });
  });

  describe('Function Name Change', () => {
    it('should auto-generate syntax when function name changes', () => {
      component.newFunction.name = 'myFunction';
      component.onFunctionNameChange();
      
      expect(component.newFunction.syntax).toBe('myFunction()');
    });

    it('should not generate syntax for empty name', () => {
      component.newFunction.name = '';
      component.newFunction.syntax = 'existing()';
      component.onFunctionNameChange();
      
      expect(component.newFunction.syntax).toBe('existing()');
    });
  });

  describe('Function Creation', () => {
    it('should create function when form is valid', () => {
      spyOn(component.functionCreated, 'emit');
      
      component.newFunction = {
        name: 'testFunc',
        syntax: 'testFunc(x)',
        description: 'Test function',
        example: 'testFunc(5)',
        category: 'custom'
      };

      component.createFunction();
      
      expect(component.functionCreated.emit).toHaveBeenCalled();
      const emittedFunction = (component.functionCreated.emit as jasmine.Spy).calls.mostRecent().args[0];
      expect(emittedFunction.name).toBe('testFunc');
      expect(emittedFunction.syntax).toBe('testFunc(x)');
      expect(emittedFunction.description).toBe('Test function');
      expect(emittedFunction.example).toBe('testFunc(5)');
      expect(emittedFunction.category).toBe('custom');
    });

    it('should not create function when form is invalid', () => {
      spyOn(component.functionCreated, 'emit');
      
      component.newFunction = {
        name: '', // Invalid - empty name
        syntax: 'testFunc(x)',
        description: 'Test function',
        category: 'custom'
      };

      component.createFunction();
      
      expect(component.functionCreated.emit).not.toHaveBeenCalled();
    });

    it('should reset form after creating function', () => {
      component.newFunction = {
        name: 'testFunc',
        syntax: 'testFunc(x)',
        description: 'Test function',
        example: 'testFunc(5)',
        category: 'custom'
      };

      component.createFunction();
      
      expect(component.newFunction.name).toBe('');
      expect(component.newFunction.syntax).toBe('');
      expect(component.newFunction.description).toBe('');
      expect(component.newFunction.example).toBe('');
      expect(component.newFunction.category).toBe('custom');
    });
  });

  describe('Modal Management', () => {
    it('should close modal and reset form', () => {
      spyOn(component.closeModal, 'emit');
      
      component.newFunction.name = 'testFunc';
      component.newFunction.syntax = 'testFunc()';
      component.newFunction.description = 'Test';

      component.closeBuilder();
      
      expect(component.closeModal.emit).toHaveBeenCalled();
      expect(component.newFunction.name).toBe('');
      expect(component.newFunction.syntax).toBe('');
      expect(component.newFunction.description).toBe('');
    });
  });

  describe('Event Emissions', () => {
    it('should emit functionCreated with correct CustomFunction object', () => {
      spyOn(component.functionCreated, 'emit');
      
      component.newFunction = {
        name: 'multiply',
        syntax: 'multiply(a, b)',
        description: 'Multiplies two numbers',
        example: 'multiply(3, 4) = 12',
        category: 'math'
      };

      component.createFunction();
      
      expect(component.functionCreated.emit).toHaveBeenCalledWith(jasmine.objectContaining({
        name: 'multiply',
        syntax: 'multiply(a, b)',
        description: 'Multiplies two numbers',
        example: 'multiply(3, 4) = 12',
        category: 'math'
      }));
    });

    it('should emit closeModal when closing', () => {
      spyOn(component.closeModal, 'emit');
      
      component.closeBuilder();
      
      expect(component.closeModal.emit).toHaveBeenCalled();
    });
  });

  describe('Edge Cases', () => {
    it('should handle whitespace in validation', () => {
      component.newFunction.name = '  ';
      expect(component.isValidFunctionName()).toBeFalsy();

      component.newFunction.syntax = '  ';
      expect(component.isValidFunctionSyntax()).toBeFalsy();

      component.newFunction.description = '  ';
      expect(component.isValidFunctionDescription()).toBeFalsy();
    });

    it('should handle empty values gracefully', () => {
      component.newFunction.name = '';
      component.newFunction.syntax = '';
      component.newFunction.description = '';

      expect(component.isValidFunctionName()).toBeFalsy();
      expect(component.isValidFunctionSyntax()).toBeFalsy();
      expect(component.isValidFunctionDescription()).toBeFalsy();
      expect(component.isFormValid()).toBeFalsy();
    });

    it('should use default values for optional fields', () => {
      component.newFunction = {
        name: 'testFunc',
        syntax: 'testFunc()',
        description: 'Test function',
        category: 'custom'
      };

      spyOn(component.functionCreated, 'emit');
      component.createFunction();

      const emittedFunction = (component.functionCreated.emit as jasmine.Spy).calls.mostRecent().args[0];
      expect(emittedFunction.example).toBe('');
      expect(emittedFunction.category).toBe('custom');
    });

    it('should handle complex function names', () => {
      component.newFunction.name = 'calculateComplexValue';
      component.onFunctionNameChange();
      
      expect(component.newFunction.syntax).toBe('calculateComplexValue()');
    });
  });
});
