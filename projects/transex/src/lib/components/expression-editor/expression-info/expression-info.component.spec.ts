import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { ExpressionInfoComponent } from './expression-info.component';
import { ExpressionTypeResult, DataType, TypeValidationResult, ContextType } from '../../../interfaces/shared.interfaces';

describe('ExpressionInfoComponent', () => {
  let component: ExpressionInfoComponent;
  let fixture: ComponentFixture<ExpressionInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ExpressionInfoComponent,
        CommonModule
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ExpressionInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Component Initialization', () => {
    it('should initialize with default values', () => {
      expect(component.value).toBe('');
      expect(component.typeResult).toBeNull();
      expect(component.currentValidation).toBeNull();
    });
  });

  describe('getReturnTypeDisplay', () => {
    it('should return empty string when typeResult is null', () => {
      component.typeResult = null;
      expect(component.getReturnTypeDisplay()).toBe('');
    });

    it('should return empty string when typeResult is unsuccessful', () => {
      component.typeResult = {
        success: false,
        returnType: DataType.INTEGER,
        error: 'Test error'
      };
      expect(component.getReturnTypeDisplay()).toBe('');
    });

    it('should return correct display for INTEGER type', () => {
      component.typeResult = {
        success: true,
        returnType: DataType.INTEGER
      };
      expect(component.getReturnTypeDisplay()).toBe('Integer');
    });

    it('should return correct display for REAL type', () => {
      component.typeResult = {
        success: true,
        returnType: DataType.REAL
      };
      expect(component.getReturnTypeDisplay()).toBe('Real');
    });

    it('should return correct display for BOOLEAN type', () => {
      component.typeResult = {
        success: true,
        returnType: DataType.BOOLEAN
      };
      expect(component.getReturnTypeDisplay()).toBe('Boolean');
    });

    it('should return correct display for STRING type', () => {
      component.typeResult = {
        success: true,
        returnType: DataType.STRING
      };
      expect(component.getReturnTypeDisplay()).toBe('String');
    });

    it('should return correct display for ASSIGNMENT type', () => {
      component.typeResult = {
        success: true,
        returnType: DataType.ASSIGNMENT
      };
      expect(component.getReturnTypeDisplay()).toBe('Assignment');
    });

    it('should return correct display for FUNCTION type', () => {
      component.typeResult = {
        success: true,
        returnType: DataType.FUNCTION
      };
      expect(component.getReturnTypeDisplay()).toBe('Function');
    });

    it('should return the raw type for unknown types', () => {
      component.typeResult = {
        success: true,
        returnType: 'UNKNOWN_TYPE' as DataType
      };
      expect(component.getReturnTypeDisplay()).toBe('UNKNOWN_TYPE');
    });
  });

  describe('shouldShowTypeInfo', () => {
    it('should return false when typeResult is null', () => {
      component.typeResult = null;
      component.currentValidation = null;
      expect(component.shouldShowTypeInfo()).toBeFalsy();
    });

    it('should return false when typeResult is unsuccessful', () => {
      component.typeResult = {
        success: false,
        returnType: DataType.INTEGER,
        error: 'Test error'
      };
      component.currentValidation = null;
      expect(component.shouldShowTypeInfo()).toBeFalsy();
    });

    it('should return true when typeResult is successful and no validation', () => {
      component.typeResult = {
        success: true,
        returnType: DataType.INTEGER
      };
      component.currentValidation = null;
      expect(component.shouldShowTypeInfo()).toBeTruthy();
    });

    it('should return true when typeResult is successful and validation is valid', () => {
      component.typeResult = {
        success: true,
        returnType: DataType.INTEGER
      };
      component.currentValidation = {
        isValid: true,
        message: 'Valid',
        expectedType: DataType.INTEGER,
        actualType: DataType.INTEGER,
        contextType: ContextType.GENERAL
      };
      expect(component.shouldShowTypeInfo()).toBeTruthy();
    });

    it('should return false when typeResult is successful but validation is invalid', () => {
      component.typeResult = {
        success: true,
        returnType: DataType.INTEGER
      };
      component.currentValidation = {
        isValid: false,
        message: 'Invalid',
        expectedType: DataType.BOOLEAN,
        actualType: DataType.INTEGER,
        contextType: ContextType.BOOLEAN
      };
      expect(component.shouldShowTypeInfo()).toBeFalsy();
    });
  });

  describe('Input Properties', () => {
    it('should accept value input', () => {
      component.value = '42 + 5';
      expect(component.value).toBe('42 + 5');
    });

    it('should accept typeResult input', () => {
      const typeResult: ExpressionTypeResult = {
        success: true,
        returnType: DataType.INTEGER,
        typeValidation: {
          isValid: true,
          message: 'Valid',
          expectedType: DataType.INTEGER,
          actualType: DataType.INTEGER,
          contextType: ContextType.GENERAL
        }
      };
      
      component.typeResult = typeResult;
      expect(component.typeResult).toBe(typeResult);
    });

    it('should accept currentValidation input', () => {
      const validation: TypeValidationResult = {
        isValid: true,
        message: 'Valid expression',
        expectedType: DataType.REAL,
        actualType: DataType.INTEGER,
        contextType: ContextType.ARITHMETIC
      };
      
      component.currentValidation = validation;
      expect(component.currentValidation).toBe(validation);
    });
  });

  describe('Complex Scenarios', () => {
    it('should handle typeResult with all properties', () => {
      component.typeResult = {
        success: true,
        returnType: DataType.BOOLEAN,
        typeValidation: {
          isValid: true,
          message: 'Valid boolean expression',
          expectedType: DataType.BOOLEAN,
          actualType: DataType.BOOLEAN,
          contextType: ContextType.BOOLEAN
        },
        usedVariables: [
          { name: 'x', value: 5, type: DataType.INTEGER, explanation: 'X variable' }
        ],
        isLambdaExpression: false
      };
      
      expect(component.getReturnTypeDisplay()).toBe('Boolean');
      expect(component.shouldShowTypeInfo()).toBeTruthy();
    });

    it('should handle error scenarios', () => {
      component.typeResult = {
        success: false,
        returnType: DataType.STRING,
        error: 'Syntax error in expression'
      };
      
      expect(component.getReturnTypeDisplay()).toBe('');
      expect(component.shouldShowTypeInfo()).toBeFalsy();
    });

    it('should handle lambda expression results', () => {
      component.typeResult = {
        success: true,
        returnType: DataType.FUNCTION,
        isLambdaExpression: true
      };
      
      expect(component.getReturnTypeDisplay()).toBe('Function');
      expect(component.shouldShowTypeInfo()).toBeTruthy();
    });
  });

  describe('Edge Cases', () => {
    it('should handle undefined returnType in successful result', () => {
      component.typeResult = {
        success: true,
        returnType: undefined as any
      };
      
      expect(component.getReturnTypeDisplay()).toBe('');
    });

    it('should handle validation with different context types', () => {
      component.typeResult = {
        success: true,
        returnType: DataType.INTEGER
      };

      // Test different validation contexts
      const contexts = [
        ContextType.GENERAL,
        ContextType.BOOLEAN,
        ContextType.ASSIGNMENT,
        ContextType.ARITHMETIC,
        ContextType.LIMITED_CONNECTOR
      ];

      contexts.forEach(contextType => {
        component.currentValidation = {
          isValid: true,
          message: 'Valid',
          expectedType: DataType.INTEGER,
          actualType: DataType.INTEGER,
          contextType: contextType
        };
        
        expect(component.shouldShowTypeInfo()).toBeTruthy();
      });
    });

    it('should handle mixed validation states', () => {
      component.typeResult = {
        success: true,
        returnType: DataType.REAL
      };

      // Valid validation
      component.currentValidation = {
        isValid: true,
        message: 'Valid',
        expectedType: DataType.REAL,
        actualType: DataType.REAL,
        contextType: ContextType.ARITHMETIC
      };
      expect(component.shouldShowTypeInfo()).toBeTruthy();

      // Invalid validation
      component.currentValidation = {
        isValid: false,
        message: 'Type mismatch',
        expectedType: DataType.BOOLEAN,
        actualType: DataType.REAL,
        contextType: ContextType.BOOLEAN
      };
      expect(component.shouldShowTypeInfo()).toBeFalsy();
    });
  });
});
