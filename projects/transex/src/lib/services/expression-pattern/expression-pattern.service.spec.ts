import { TestBed } from '@angular/core/testing';
import { ExpressionPatternService } from './expression-pattern.service';

describe('ExpressionPatternService', () => {
  let service: ExpressionPatternService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExpressionPatternService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('isLambdaFunction', () => {
    it('should detect lambda function with parentheses', () => {
      const result = service.isLambdaFunction('(x, y) => x + y');
      expect(result.isMatch).toBeTruthy();
      expect(result.confidence).toBe(0.95);
    });

    it('should detect lambda function with single parameter', () => {
      const result = service.isLambdaFunction('x => x * 2');
      expect(result.isMatch).toBeTruthy();
      expect(result.confidence).toBe(0.95);
    });

    it('should not detect non-lambda expressions', () => {
      const result = service.isLambdaFunction('x + y');
      expect(result.isMatch).toBeFalsy();
      expect(result.confidence).toBe(0);
    });

    it('should handle whitespace', () => {
      const result = service.isLambdaFunction('  (a, b) => a + b  ');
      expect(result.isMatch).toBeTruthy();
    });
  });

  describe('isFieldAssignment', () => {
    it('should detect simple assignment', () => {
      const result = service.isFieldAssignment('output = input');
      expect(result.isMatch).toBeTruthy();
      expect(result.confidence).toBe(0.9);
    });

    it('should detect nested field assignment', () => {
      const result = service.isFieldAssignment('output.value = input.data');
      expect(result.isMatch).toBeTruthy();
    });

    it('should not detect comparison operator', () => {
      const result = service.isFieldAssignment('x == y');
      expect(result.isMatch).toBeFalsy();
    });

    it('should not detect equality check', () => {
      const result = service.isFieldAssignment('status == "active"');
      expect(result.isMatch).toBeFalsy();
    });
  });

  describe('isTernaryExpression', () => {
    it('should detect ternary expression', () => {
      const result = service.isTernaryExpression('x > 5 ? "high" : "low"');
      expect(result.isMatch).toBeTruthy();
      expect(result.confidence).toBe(0.85);
    });

    it('should detect nested ternary', () => {
      const result = service.isTernaryExpression('x > 10 ? "high" : x > 5 ? "medium" : "low"');
      expect(result.isMatch).toBeTruthy();
    });

    it('should not detect non-ternary', () => {
      const result = service.isTernaryExpression('x + y');
      expect(result.isMatch).toBeFalsy();
    });
  });

  describe('isBooleanExpression', () => {
    it('should detect boolean literal true', () => {
      const result = service.isBooleanExpression('true');
      expect(result.isMatch).toBeTruthy();
      expect(result.confidence).toBe(1.0);
      expect(result.details.subtype).toBe('literal');
    });

    it('should detect boolean literal false', () => {
      const result = service.isBooleanExpression('false');
      expect(result.isMatch).toBeTruthy();
      expect(result.confidence).toBe(1.0);
    });

    it('should detect comparison operators', () => {
      expect(service.isBooleanExpression('x > 5').isMatch).toBeTruthy();
      expect(service.isBooleanExpression('x < 5').isMatch).toBeTruthy();
      expect(service.isBooleanExpression('x >= 5').isMatch).toBeTruthy();
      expect(service.isBooleanExpression('x <= 5').isMatch).toBeTruthy();
      expect(service.isBooleanExpression('x == 5').isMatch).toBeTruthy();
      expect(service.isBooleanExpression('x != 5').isMatch).toBeTruthy();
    });

    it('should detect logical operators', () => {
      expect(service.isBooleanExpression('x && y').isMatch).toBeTruthy();
      expect(service.isBooleanExpression('x || y').isMatch).toBeTruthy();
      expect(service.isBooleanExpression('!x').isMatch).toBeTruthy();
    });

    it('should not detect non-boolean expressions', () => {
      const result = service.isBooleanExpression('x + y');
      expect(result.isMatch).toBeFalsy();
    });
  });

  describe('isStringLiteral', () => {
    it('should detect single-quoted string', () => {
      const result = service.isStringLiteral("'hello'");
      expect(result.isMatch).toBeTruthy();
      expect(result.confidence).toBe(1.0);
    });

    it('should detect double-quoted string', () => {
      const result = service.isStringLiteral('"hello"');
      expect(result.isMatch).toBeTruthy();
    });

    it('should detect backtick string', () => {
      const result = service.isStringLiteral('`hello`');
      expect(result.isMatch).toBeTruthy();
    });

    it('should not detect unquoted string', () => {
      const result = service.isStringLiteral('hello');
      expect(result.isMatch).toBeFalsy();
    });
  });

  describe('isNumericExpression', () => {
    it('should detect integer literal', () => {
      const result = service.isNumericExpression('42');
      expect(result.isMatch).toBeTruthy();
      expect(result.confidence).toBe(1.0);
      expect(result.details.subtype).toBe('literal');
    });

    it('should detect decimal literal', () => {
      const result = service.isNumericExpression('3.14');
      expect(result.isMatch).toBeTruthy();
    });

    it('should detect arithmetic expression', () => {
      const result = service.isNumericExpression('5 + 3');
      expect(result.isMatch).toBeTruthy();
      expect(result.details.subtype).toBe('arithmetic');
    });

    it('should detect Math functions', () => {
      const result = service.isNumericExpression('Math.sqrt(16)');
      expect(result.isMatch).toBeTruthy();
      expect(result.details.subtype).toBe('math_function');
    });

    it('should not detect non-numeric expressions', () => {
      const result = service.isNumericExpression('"hello"');
      expect(result.isMatch).toBeFalsy();
    });
  });

  describe('willReturnInteger', () => {
    it('should detect pure integer', () => {
      const result = service.willReturnInteger('42');
      expect(result.isMatch).toBeTruthy();
      expect(result.confidence).toBe(1.0);
    });

    it('should detect integer arithmetic', () => {
      const result = service.willReturnInteger('5 + 3');
      expect(result.isMatch).toBeTruthy();
    });

    it('should not detect decimal', () => {
      const result = service.willReturnInteger('3.14');
      expect(result.isMatch).toBeFalsy();
    });

    it('should not detect division', () => {
      const result = service.willReturnInteger('10 / 2');
      expect(result.isMatch).toBeFalsy();
    });

    it('should detect integer Math functions', () => {
      expect(service.willReturnInteger('Math.floor(3.7)').isMatch).toBeTruthy();
      expect(service.willReturnInteger('Math.ceil(3.2)').isMatch).toBeTruthy();
      expect(service.willReturnInteger('Math.round(3.5)').isMatch).toBeTruthy();
      expect(service.willReturnInteger('Math.abs(-5)').isMatch).toBeTruthy();
      expect(service.willReturnInteger('Math.trunc(3.9)').isMatch).toBeTruthy();
    });
  });

  describe('containsArithmeticOperators', () => {
    it('should detect addition', () => {
      const result = service.containsArithmeticOperators('a + b');
      expect(result.isMatch).toBeTruthy();
      expect(result.details.operators).toContain('+');
    });

    it('should detect multiple operators', () => {
      const result = service.containsArithmeticOperators('a + b * c - d');
      expect(result.isMatch).toBeTruthy();
      expect(result.details.count).toBe(3);
    });

    it('should not detect non-arithmetic', () => {
      const result = service.containsArithmeticOperators('hello');
      expect(result.isMatch).toBeFalsy();
    });
  });

  describe('hasOnlyIntegerArguments', () => {
    it('should detect integer arguments', () => {
      const result = service.hasOnlyIntegerArguments('add(5, 10)');
      expect(result.isMatch).toBeTruthy();
      expect(result.confidence).toBe(0.9);
    });

    it('should not detect decimal arguments', () => {
      const result = service.hasOnlyIntegerArguments('add(5.5, 10)');
      expect(result.isMatch).toBeFalsy();
    });

    it('should return false for no function', () => {
      const result = service.hasOnlyIntegerArguments('5 + 10');
      expect(result.isMatch).toBeFalsy();
    });
  });

  describe('analyzeComplexity', () => {
    it('should classify simple expression', () => {
      const result = service.analyzeComplexity('x + y');
      expect(result.level).toBe('simple');
      expect(result.score).toBeLessThanOrEqual(2);
    });

    it('should classify moderate expression', () => {
      const result = service.analyzeComplexity('(a + b) * (c - d)');
      expect(result.level).toBe('moderate');
    });

    it('should detect long expression', () => {
      const longExpr = 'a + b + c + d + e + f + g + h + i + j + k + l + m + n + o + p';
      const result = service.analyzeComplexity(longExpr);
      expect(result.factors).toContain('long_expression');
    });

    it('should detect deep nesting', () => {
      const result = service.analyzeComplexity('((((a + b))))');
      expect(result.factors).toContain('deep_nesting');
    });

    it('should detect multiple functions', () => {
      const result = service.analyzeComplexity('Math.sqrt(Math.abs(Math.floor(x)))');
      expect(result.factors).toContain('multiple_functions');
    });

    it('should detect many operators', () => {
      const result = service.analyzeComplexity('a + b - c * d / e % f');
      expect(result.factors).toContain('many_operators');
    });

    it('should detect many variables', () => {
      const result = service.analyzeComplexity('alpha + beta + gamma + delta + epsilon');
      expect(result.factors).toContain('many_variables');
    });

    it('should classify very complex expression', () => {
      const complexExpr = 'Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2) + Math.pow(z1 - z2, 2)) * factor + offset';
      const result = service.analyzeComplexity(complexExpr);
      expect(result.level).toBe('very_complex');
      expect(result.score).toBeGreaterThan(10);
    });
  });

  describe('extractPatterns', () => {
    it('should extract multiple patterns', () => {
      const result = service.extractPatterns('5 + 3');
      expect(result.length).toBeGreaterThan(0);
      expect(result.some(p => p.details.pattern === 'numeric')).toBeTruthy();
    });

    it('should filter non-matching patterns', () => {
      const result = service.extractPatterns('x + y');
      expect(result.every(p => p.isMatch)).toBeTruthy();
    });

    it('should detect lambda in extract', () => {
      const result = service.extractPatterns('(x) => x * 2');
      expect(result.some(p => p.details.pattern === 'lambda')).toBeTruthy();
    });
  });
});