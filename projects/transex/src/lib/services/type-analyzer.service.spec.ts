import { TestBed } from '@angular/core/testing';
import { TypeAnalyzerService } from './type-analyzer.service';
import { DataType } from '../interfaces/shared.interfaces';

describe('TypeAnalyzerService', () => {
  let service: TypeAnalyzerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TypeAnalyzerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('analyzeExpressionReturnType', () => {
    it('should identify integer expressions', () => {
      expect(service.analyzeExpressionReturnType('42')).toBe(DataType.INTEGER);
      expect(service.analyzeExpressionReturnType('10 + 5')).toBe(DataType.INTEGER);
      expect(service.analyzeExpressionReturnType('subtract(10, 5)')).toBe(DataType.INTEGER);
      expect(service.analyzeExpressionReturnType('Math.abs(-5)')).toBe(DataType.INTEGER);
    });

    it('should identify real expressions', () => {
      expect(service.analyzeExpressionReturnType('3.14')).toBe(DataType.REAL);
      expect(service.analyzeExpressionReturnType('10.5 + 2.3')).toBe(DataType.REAL);
      expect(service.analyzeExpressionReturnType('10 / 3')).toBe(DataType.REAL);
      expect(service.analyzeExpressionReturnType('Math.sqrt(16)')).toBe(DataType.REAL);
    });

    it('should identify boolean expressions', () => {
      expect(service.analyzeExpressionReturnType('true')).toBe(DataType.BOOLEAN);
      expect(service.analyzeExpressionReturnType('false')).toBe(DataType.BOOLEAN);
      expect(service.analyzeExpressionReturnType('5 > 3')).toBe(DataType.BOOLEAN);
      expect(service.analyzeExpressionReturnType('x == y')).toBe(DataType.BOOLEAN);
      expect(service.analyzeExpressionReturnType('enabled && active')).toBe(DataType.BOOLEAN);
    });

    it('should identify string expressions', () => {
      expect(service.analyzeExpressionReturnType('"hello"')).toBe(DataType.STRING);
      expect(service.analyzeExpressionReturnType("'world'")).toBe(DataType.STRING);
      expect(service.analyzeExpressionReturnType('"hello" + " world"')).toBe(DataType.STRING);
    });

    it('should identify assignment expressions', () => {
      expect(service.analyzeExpressionReturnType('x = 5')).toBe(DataType.ASSIGNMENT);
      expect(service.analyzeExpressionReturnType('output.value = input.data')).toBe(DataType.ASSIGNMENT);
      expect(service.analyzeExpressionReturnType('result = transform(source)')).toBe(DataType.ASSIGNMENT);
    });

    it('should identify function expressions', () => {
      expect(service.analyzeExpressionReturnType('(x) => x * 2')).toBe(DataType.FUNCTION);
      expect(service.analyzeExpressionReturnType('(a, b) => a + b')).toBe(DataType.FUNCTION);
    });

    it('should handle ternary expressions', () => {
      expect(service.analyzeExpressionReturnType('condition ? 5 : 10')).toBe(DataType.INTEGER);
      expect(service.analyzeExpressionReturnType('condition ? 3.14 : 2.71')).toBe(DataType.REAL);
      expect(service.analyzeExpressionReturnType('condition ? true : false')).toBe(DataType.BOOLEAN);
      expect(service.analyzeExpressionReturnType('condition ? "yes" : "no"')).toBe(DataType.STRING);
    });

    it('should handle complex expressions', () => {
      expect(service.analyzeExpressionReturnType('Math.max(10, 20)')).toBe(DataType.REAL);
      expect(service.analyzeExpressionReturnType('add(5, multiply(2, 3))')).toBe(DataType.INTEGER);
      expect(service.analyzeExpressionReturnType('(x + y) * 2')).toBe(DataType.INTEGER);
    });

    it('should handle edge cases', () => {
      expect(service.analyzeExpressionReturnType('')).toBe(DataType.STRING);
      expect(service.analyzeExpressionReturnType('   ')).toBe(DataType.STRING);
      expect(service.analyzeExpressionReturnType('unknown_expression')).toBe(DataType.STRING);
    });

    it('should handle mixed type expressions', () => {
      // String concatenation with numbers should return string
      expect(service.analyzeExpressionReturnType('"Value: " + 42')).toBe(DataType.STRING);
      
      // Arithmetic with variables should return appropriate type
      expect(service.analyzeExpressionReturnType('x + 5')).toBe(DataType.INTEGER);
      expect(service.analyzeExpressionReturnType('x + 5.5')).toBe(DataType.REAL);
    });

    it('should handle parentheses correctly', () => {
      expect(service.analyzeExpressionReturnType('(10 + 5) * 2')).toBe(DataType.INTEGER);
      expect(service.analyzeExpressionReturnType('(3.14 + 2.71) / 2')).toBe(DataType.REAL);
      expect(service.analyzeExpressionReturnType('(x > 5) && (y < 10)')).toBe(DataType.BOOLEAN);
    });

    it('should handle function calls with different argument types', () => {
      expect(service.analyzeExpressionReturnType('add(5, 10)')).toBe(DataType.INTEGER);
      expect(service.analyzeExpressionReturnType('add(5.5, 10.2)')).toBe(DataType.REAL);
      expect(service.analyzeExpressionReturnType('subtract(20, 8)')).toBe(DataType.INTEGER);
      expect(service.analyzeExpressionReturnType('multiply(3, 7)')).toBe(DataType.INTEGER);
    });

    it('should handle Math functions correctly', () => {
      expect(service.analyzeExpressionReturnType('Math.ceil(4.2)')).toBe(DataType.INTEGER);
      expect(service.analyzeExpressionReturnType('Math.floor(4.8)')).toBe(DataType.INTEGER);
      expect(service.analyzeExpressionReturnType('Math.round(4.5)')).toBe(DataType.INTEGER);
      expect(service.analyzeExpressionReturnType('Math.sin(1.57)')).toBe(DataType.REAL);
      expect(service.analyzeExpressionReturnType('Math.cos(0)')).toBe(DataType.REAL);
    });

    it('should handle comparison operators', () => {
      expect(service.analyzeExpressionReturnType('5 > 3')).toBe(DataType.BOOLEAN);
      expect(service.analyzeExpressionReturnType('10 <= 20')).toBe(DataType.BOOLEAN);
      expect(service.analyzeExpressionReturnType('x != y')).toBe(DataType.BOOLEAN);
      expect(service.analyzeExpressionReturnType('status === "active"')).toBe(DataType.BOOLEAN);
    });

    it('should handle logical operators', () => {
      expect(service.analyzeExpressionReturnType('true && false')).toBe(DataType.BOOLEAN);
      expect(service.analyzeExpressionReturnType('enabled || disabled')).toBe(DataType.BOOLEAN);
      expect(service.analyzeExpressionReturnType('!isActive')).toBe(DataType.BOOLEAN);
    });
  });
});
