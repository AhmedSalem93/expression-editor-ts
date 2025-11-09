import { TestBed } from '@angular/core/testing';
import { ValidationService } from './validation.service';
import { DataType, ContextType, ExpressionEditorConfig } from '../../interfaces/shared.interfaces';

describe('ValidationService', () => {
  let service: ValidationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ValidationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('validateExpressionType', () => {
    it('should validate boolean expressions in boolean context', () => {
      const config: ExpressionEditorConfig = {
        expectedResultType: DataType.BOOLEAN,
        contextType: ContextType.BOOLEAN
      };
      
      const result = service.validateExpressionType('true', DataType.BOOLEAN, config);
      
      expect(result.isValid).toBeTruthy();
      expect(result.expectedType).toBe(DataType.BOOLEAN);
      expect(result.actualType).toBe(DataType.BOOLEAN);
      expect(result.contextType).toBe(ContextType.BOOLEAN);
    });

    it('should reject non-boolean expressions in boolean context', () => {
      const config: ExpressionEditorConfig = {
        expectedResultType: DataType.BOOLEAN,
        contextType: ContextType.BOOLEAN
      };
      
      const result = service.validateExpressionType('42', DataType.INTEGER, config);
      
      expect(result.isValid).toBeFalsy();
      expect(result.expectedType).toBe(DataType.BOOLEAN);
      expect(result.actualType).toBe(DataType.INTEGER);
      expect(result.contextType).toBe(ContextType.BOOLEAN);
    });

    it('should validate assignment expressions in assignment context', () => {
      const config: ExpressionEditorConfig = {
        expectedResultType: DataType.ASSIGNMENT,
        contextType: ContextType.ASSIGNMENT
      };
      
      const result = service.validateExpressionType('x = 5', DataType.ASSIGNMENT, config);
      
      expect(result.isValid).toBeTruthy();
      expect(result.expectedType).toBe(DataType.ASSIGNMENT);
      expect(result.actualType).toBe(DataType.ASSIGNMENT);
      expect(result.contextType).toBe(ContextType.ASSIGNMENT);
    });

    it('should validate arithmetic expressions in arithmetic context', () => {
      const config: ExpressionEditorConfig = {
        expectedResultType: DataType.REAL,
        contextType: ContextType.ARITHMETIC
      };
      
      const result = service.validateExpressionType('10 + 5', DataType.INTEGER, config);
      
      expect(result.isValid).toBeTruthy();
      expect(result.expectedType).toBe(DataType.REAL);
      expect(result.actualType).toBe(DataType.INTEGER);
      expect(result.contextType).toBe(ContextType.ARITHMETIC);
    });

    it('should validate limited connector expressions', () => {
      const config: ExpressionEditorConfig = {
        expectedResultType: DataType.REAL,
        contextType: ContextType.LIMITED_CONNECTOR,
        allowDivision: false
      };
      
      const result = service.validateExpressionType('10 + 5', DataType.INTEGER, config);
      
      expect(result.isValid).toBeTruthy();
      expect(result.expectedType).toBe(DataType.REAL);
      expect(result.actualType).toBe(DataType.INTEGER);
    });

    it('should reject division in limited connector when disabled', () => {
      const config: ExpressionEditorConfig = {
        expectedResultType: DataType.REAL,
        contextType: ContextType.LIMITED_CONNECTOR,
        allowDivision: false
      };
      
      const result = service.validateExpressionType('10 / 2', DataType.REAL, config);
      
      expect(result.isValid).toBeFalsy();
    });

    it('should allow division in limited connector when enabled', () => {
      const config: ExpressionEditorConfig = {
        expectedResultType: DataType.REAL,
        contextType: ContextType.LIMITED_CONNECTOR,
        allowDivision: true
      };
      
      const result = service.validateExpressionType('10 / 2', DataType.REAL, config);
      
      expect(result.isValid).toBeTruthy();
    });

    it('should allow any type in general context', () => {
      const config: ExpressionEditorConfig = {
        expectedResultType: DataType.STRING,
        contextType: ContextType.GENERAL
      };
      
      const result = service.validateExpressionType('42', DataType.INTEGER, config);
      
      expect(result.isValid).toBeTruthy();
      expect(result.contextType).toBe(ContextType.GENERAL);
    });

    it('should handle strict validation mode', () => {
      const config: ExpressionEditorConfig = {
        expectedResultType: DataType.INTEGER,
        contextType: ContextType.ARITHMETIC,
        strictValidation: true
      };
      
      const result = service.validateExpressionType('3.14', DataType.REAL, config);
      
      expect(result.isValid).toBeFalsy();
      expect(result.expectedType).toBe(DataType.INTEGER);
      expect(result.actualType).toBe(DataType.REAL);
    });

    it('should handle non-strict validation mode', () => {
      const config: ExpressionEditorConfig = {
        expectedResultType: DataType.REAL,
        contextType: ContextType.ARITHMETIC,
        strictValidation: false
      };
      
      const result = service.validateExpressionType('42', DataType.INTEGER, config);
      
      expect(result.isValid).toBeTruthy();
    });

    it('should handle undefined config gracefully', () => {
      const config: ExpressionEditorConfig = {
        expectedResultType: DataType.INTEGER,
        contextType: ContextType.GENERAL
      };
      
      const result = service.validateExpressionType('42', DataType.INTEGER, config);
      
      expect(result.isValid).toBeTruthy();
      expect(result.contextType).toBe(ContextType.GENERAL);
    });

    it('should handle empty expressions', () => {
      const config: ExpressionEditorConfig = {
        expectedResultType: DataType.STRING,
        contextType: ContextType.GENERAL
      };
      
      const result = service.validateExpressionType('', DataType.STRING, config);
      expect(result.isValid).toBeTruthy();
    });

    it('should validate function expressions', () => {
      const config: ExpressionEditorConfig = {
        expectedResultType: DataType.FUNCTION,
        contextType: ContextType.GENERAL
      };
      
      const result = service.validateExpressionType('(x) => x * 2', DataType.FUNCTION, config);
      
      expect(result.isValid).toBeTruthy();
      expect(result.expectedType).toBe(DataType.FUNCTION);
      expect(result.actualType).toBe(DataType.FUNCTION);
    });

    it('should handle complex validation scenarios', () => {
      const config: ExpressionEditorConfig = {
        expectedResultType: DataType.BOOLEAN,
        contextType: ContextType.BOOLEAN,
        strictValidation: true
      };
      
      // Valid boolean expression
      const validResult = service.validateExpressionType('x > 5 && y < 10', DataType.BOOLEAN, config);
      expect(validResult.isValid).toBeTruthy();
      
      // Invalid type for boolean context
      const invalidResult = service.validateExpressionType('x + y', DataType.INTEGER, config);
      expect(invalidResult.isValid).toBeFalsy();
    });

    it('should handle assignment validation', () => {
      const config: ExpressionEditorConfig = {
        expectedResultType: DataType.ASSIGNMENT,
        contextType: ContextType.ASSIGNMENT
      };
      
      const validAssignment = service.validateExpressionType('output.value = input.data', DataType.ASSIGNMENT, config);
      expect(validAssignment.isValid).toBeTruthy();
      
      const invalidAssignment = service.validateExpressionType('2 + 3', DataType.INTEGER, config);
      expect(invalidAssignment.isValid).toBeFalsy();
    });

    it('should handle Math function validation in limited connector', () => {
      const config: ExpressionEditorConfig = {
        expectedResultType: DataType.REAL,
        contextType: ContextType.LIMITED_CONNECTOR,
        allowDivision: false
      };
      
      const result = service.validateExpressionType('Math.sqrt(16)', DataType.REAL, config);
      expect(result.isValid).toBeFalsy(); // Math functions not allowed in limited connector
    });

    it('should validate numeric types in arithmetic context', () => {
      const config: ExpressionEditorConfig = {
        expectedResultType: DataType.REAL,
        contextType: ContextType.ARITHMETIC
      };
      
      const integerResult = service.validateExpressionType('42', DataType.INTEGER, config);
      expect(integerResult.isValid).toBeTruthy();
      
      const realResult = service.validateExpressionType('3.14', DataType.REAL, config);
      expect(realResult.isValid).toBeTruthy();
      
      const stringResult = service.validateExpressionType('"hello"', DataType.STRING, config);
      expect(stringResult.isValid).toBeFalsy();
    });
  });
});
