import { TestBed } from '@angular/core/testing';
import { TypeAnalyzerService } from './type-analyzer.service';
import { VariableManagerService } from '../variable-manager/variable-manager.service';
import { ExpressionPatternService } from '../expression-pattern/expression-pattern.service';
import { DataType } from '../../interfaces/shared.interfaces';

describe('TypeAnalyzerService', () => {
  let service: TypeAnalyzerService;
  let variableManager: VariableManagerService;
  let patternService: ExpressionPatternService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        TypeAnalyzerService,
        VariableManagerService,
        ExpressionPatternService
      ]
    });
    service = TestBed.inject(TypeAnalyzerService);
    variableManager = TestBed.inject(VariableManagerService);
    patternService = TestBed.inject(ExpressionPatternService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('analyzeExpressionReturnType', () => {
    it('should detect lambda function', () => {
      const result = service.analyzeExpressionReturnType('(x, y) => x + y');
      expect(result).toBe(DataType.FUNCTION);
    });

    it('should detect assignment', () => {
      const result = service.analyzeExpressionReturnType('output = input');
      expect(result).toBe(DataType.ASSIGNMENT);
    });

    it('should detect boolean expression', () => {
      const result = service.analyzeExpressionReturnType('x > 5');
      expect(result).toBe(DataType.BOOLEAN);
    });

    it('should detect string literal', () => {
      const result = service.analyzeExpressionReturnType('"hello"');
      expect(result).toBe(DataType.STRING);
    });

    it('should detect integer', () => {
      const result = service.analyzeExpressionReturnType('42');
      expect(result).toBe(DataType.INTEGER);
    });

    it('should detect real number', () => {
      const result = service.analyzeExpressionReturnType('3.14');
      expect(result).toBe(DataType.REAL);
    });

    it('should detect integer arithmetic', () => {
      const result = service.analyzeExpressionReturnType('5 + 3');
      expect(result).toBe(DataType.INTEGER);
    });

    it('should detect real arithmetic with division', () => {
      const result = service.analyzeExpressionReturnType('10 / 2');
      expect(result).toBe(DataType.REAL);
    });

    it('should detect ternary expression', () => {
      const result = service.analyzeExpressionReturnType('x > 5 ? 10 : 20');
      expect(result).toBe(DataType.INTEGER);
    });

    it('should detect variable type', () => {
      variableManager.addVariable({
        name: 'testVar',
        value: 42,
        type: DataType.INTEGER,
        explanation: 'Test'
      });
      const result = service.analyzeExpressionReturnType('testVar');
      expect(result).toBe(DataType.INTEGER);
    });

    it('should default to REAL for unknown expressions', () => {
      const result = service.analyzeExpressionReturnType('unknownExpression');
      expect(result).toBe(DataType.REAL);
    });
  });

  describe('analyzeTernaryReturnType', () => {
    it('should return same type for matching branches', () => {
      const result = service['analyzeTernaryReturnType']('x > 5 ? 10 : 20');
      expect(result).toBe(DataType.INTEGER);
    });

    it('should return REAL for mixed numeric types', () => {
      const result = service['analyzeTernaryReturnType']('x > 5 ? 10 : 3.14');
      expect(result).toBe(DataType.REAL);
    });

    it('should return STRING for string branches', () => {
      const result = service['analyzeTernaryReturnType']('x > 5 ? "high" : "low"');
      expect(result).toBe(DataType.STRING);
    });

    it('should return null for invalid ternary', () => {
      const result = service['analyzeTernaryReturnType']('invalid');
      expect(result).toBeNull();
    });

    it('should handle nested ternary', () => {
      const result = service['analyzeTernaryReturnType']('x > 10 ? 100 : x > 5 ? 50 : 10');
      expect(result).toBe(DataType.INTEGER);
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty string', () => {
      const result = service.analyzeExpressionReturnType('');
      expect(result).toBe(DataType.REAL);
    });

    it('should handle whitespace', () => {
      const result = service.analyzeExpressionReturnType('   ');
      expect(result).toBe(DataType.REAL);
    });

    it('should handle complex expressions', () => {
      const result = service.analyzeExpressionReturnType('Math.sqrt(x * x + y * y)');
      expect(result).toBe(DataType.REAL);
    });

    it('should handle boolean literals', () => {
      expect(service.analyzeExpressionReturnType('true')).toBe(DataType.BOOLEAN);
      expect(service.analyzeExpressionReturnType('false')).toBe(DataType.BOOLEAN);
    });

    it('should handle nested field access', () => {
      const result = service.analyzeExpressionReturnType('output.value.data = input.source.field');
      expect(result).toBe(DataType.ASSIGNMENT);
    });
  });
});