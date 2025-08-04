import { TestBed } from '@angular/core/testing';
import { ExpressionEvaluatorService } from './expression-evaluator.service';

describe('ExpressionEvaluatorService', () => {
  let service: ExpressionEvaluatorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExpressionEvaluatorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('Expression Evaluation', () => {
    it('should handle empty expressions', () => {
      const result = service.evaluateExpression('');
      expect(result.success).toBe(false);
      expect(result.error).toBe('Empty expression');
    });

    it('should handle whitespace-only expressions', () => {
      const result = service.evaluateExpression('   ');
      expect(result.success).toBe(false);
      expect(result.error).toBe('Empty expression');
    });

    it('should evaluate arithmetic functions', () => {
      // Test add function
      let result = service.evaluateExpression('add(5, 3)');
      expect(result.success).toBe(true);
      expect(result.result).toBe(8);
      expect(result.type).toBe('number');

      // Test subtract function
      result = service.evaluateExpression('subtract(10, 3)');
      expect(result.success).toBe(true);
      expect(result.result).toBe(7);

      // Test multiply function
      result = service.evaluateExpression('multiply(4, 5)');
      expect(result.success).toBe(true);
      expect(result.result).toBe(20);

      // Test divide function
      result = service.evaluateExpression('divide(15, 3)');
      expect(result.success).toBe(true);
      expect(result.result).toBe(5);

      // Test power function
      result = service.evaluateExpression('power(2, 3)');
      expect(result.success).toBe(true);
      expect(result.result).toBe(8);

      // Test square function
      result = service.evaluateExpression('square(5)');
      expect(result.success).toBe(true);
      expect(result.result).toBe(25);

      // Test sqrt function
      result = service.evaluateExpression('sqrt(16)');
      expect(result.success).toBe(true);
      expect(result.result).toBe(4);

      // Test abs function
      result = service.evaluateExpression('abs(-5)');
      expect(result.success).toBe(true);
      expect(result.result).toBe(5);
    });

    it('should evaluate relational functions', () => {
      // Test equals function
      let result = service.evaluateExpression('equals(5, 5)');
      expect(result.success).toBe(true);
      expect(result.result).toBe(true);
      expect(result.type).toBe('boolean');

      result = service.evaluateExpression('equals(5, 3)');
      expect(result.success).toBe(true);
      expect(result.result).toBe(false);

      // Test greaterThan function
      result = service.evaluateExpression('greaterThan(10, 5)');
      expect(result.success).toBe(true);
      expect(result.result).toBe(true);

      // Test lessThan function
      result = service.evaluateExpression('lessThan(3, 8)');
      expect(result.success).toBe(true);
      expect(result.result).toBe(true);

      // Test greaterThanOrEqual function
      result = service.evaluateExpression('greaterThanOrEqual(5, 5)');
      expect(result.success).toBe(true);
      expect(result.result).toBe(true);

      // Test lessThanOrEqual function
      result = service.evaluateExpression('lessThanOrEqual(3, 5)');
      expect(result.success).toBe(true);
      expect(result.result).toBe(true);
    });

    it('should evaluate logical functions', () => {
      // Test and function
      let result = service.evaluateExpression('and(true, false)');
      expect(result.success).toBe(true);
      expect(result.result).toBe(false);

      result = service.evaluateExpression('and(true, true)');
      expect(result.success).toBe(true);
      expect(result.result).toBe(true);

      // Test or function
      result = service.evaluateExpression('or(true, false)');
      expect(result.success).toBe(true);
      expect(result.result).toBe(true);

      result = service.evaluateExpression('or(false, false)');
      expect(result.success).toBe(true);
      expect(result.result).toBe(false);

      // Test not function
      result = service.evaluateExpression('not(true)');
      expect(result.success).toBe(true);
      expect(result.result).toBe(false);

      result = service.evaluateExpression('not(false)');
      expect(result.success).toBe(true);
      expect(result.result).toBe(true);

      // Test if function
      result = service.evaluateExpression('if(greaterThan(5, 3), "yes", "no")');
      expect(result.success).toBe(true);
      expect(result.result).toBe('yes');
    });

    it('should evaluate string functions', () => {
      // Test concat function
      let result = service.evaluateExpression('concat("Hello", " World")');
      expect(result.success).toBe(true);
      expect(result.result).toBe('Hello World');
      expect(result.type).toBe('string');

      // Test length function
      result = service.evaluateExpression('length("Hello")');
      expect(result.success).toBe(true);
      expect(result.result).toBe(5);

      // Test substring function
      result = service.evaluateExpression('substring("Hello", 1, 3)');
      expect(result.success).toBe(true);
      expect(result.result).toBe('ell');

      // Test toUpper function
      result = service.evaluateExpression('toUpper("hello")');
      expect(result.success).toBe(true);
      expect(result.result).toBe('HELLO');

      // Test toLower function
      result = service.evaluateExpression('toLower("HELLO")');
      expect(result.success).toBe(true);
      expect(result.result).toBe('hello');
    });

    it('should evaluate date functions', () => {
      // Test now function
      let result = service.evaluateExpression('now()');
      expect(result.success).toBe(true);
      expect(typeof result.result).toBe('string');
      expect(result.result).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/);

      // Test today function
      result = service.evaluateExpression('today()');
      expect(result.success).toBe(true);
      expect(typeof result.result).toBe('string');
      expect(result.result).toMatch(/^\d{4}-\d{2}-\d{2}$/);

      // Test year function
      result = service.evaluateExpression('year("2024-01-15")');
      expect(result.success).toBe(true);
      expect(result.result).toBe(2024);

      // Test month function
      result = service.evaluateExpression('month("2024-01-15")');
      expect(result.success).toBe(true);
      expect(result.result).toBe(1);

      // Test day function
      result = service.evaluateExpression('day("2024-01-15")');
      expect(result.success).toBe(true);
      expect(result.result).toBe(15);
    });

    it('should handle complex nested expressions', () => {
      const result = service.evaluateExpression('add(multiply(2, 3), square(4))');
      expect(result.success).toBe(true);
      expect(result.result).toBe(22); // (2*3) + (4^2) = 6 + 16 = 22
    });

    it('should handle expressions with spaces', () => {
      const result = service.evaluateExpression('add( 5 , 3 )');
      expect(result.success).toBe(true);
      expect(result.result).toBe(8);
    });

    it('should handle invalid expressions', () => {
      const result = service.evaluateExpression('invalidFunction(5)');
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });

    it('should handle malformed expressions', () => {
      const result = service.evaluateExpression('add(5,');
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });

    it('should handle division by zero', () => {
      const result = service.evaluateExpression('divide(5, 0)');
      expect(result.success).toBe(true);
      expect(result.result).toBe(Infinity);
    });

    it('should handle negative numbers', () => {
      const result = service.evaluateExpression('add(-5, 3)');
      expect(result.success).toBe(true);
      expect(result.result).toBe(-2);
    });

    it('should handle decimal numbers', () => {
      const result = service.evaluateExpression('add(2.5, 3.7)');
      expect(result.success).toBe(true);
      expect(result.result).toBeCloseTo(6.2);
    });
  });

  describe('Expression Preprocessing', () => {
    it('should replace function calls with JavaScript equivalents', () => {
      // This tests the private preprocessExpression method indirectly
      const result = service.evaluateExpression('add(1, 2)');
      expect(result.success).toBe(true);
      expect(result.result).toBe(3);
    });
  });

  describe('Safe Evaluation', () => {
    it('should prevent access to dangerous functions', () => {
      // Test that eval-like dangerous operations are blocked
      const result = service.evaluateExpression('eval("alert(1)")');
      expect(result.success).toBe(false);
    });

    it('should prevent access to global objects', () => {
      const result = service.evaluateExpression('window.location');
      expect(result.success).toBe(false);
    });
  });

  describe('Error Handling', () => {
    it('should handle syntax errors gracefully', () => {
      const result = service.evaluateExpression('1 + + 2');
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });

    it('should handle reference errors gracefully', () => {
      const result = service.evaluateExpression('undefinedVariable');
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });

    it('should handle type errors gracefully', () => {
      const result = service.evaluateExpression('length(123)');
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
  });
});
