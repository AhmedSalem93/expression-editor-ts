import { TestBed } from '@angular/core/testing';
import { TokenizerService, Token } from './tokenizer.service';

describe('TokenizerService', () => {
  let service: TokenizerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TokenizerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('Basic Tokenization', () => {
    it('should tokenize simple arithmetic expression', () => {
      const tokens = service.tokenize('2 + 3');
      expect(tokens.length).toBe(3);
      expect(tokens[0]).toEqual({ type: 'literal', value: '2', position: 0 });
      expect(tokens[1]).toEqual({ type: 'operator', value: '+', position: 2 });
      expect(tokens[2]).toEqual({ type: 'literal', value: '3', position: 4 });
    });

    it('should tokenize variables and operators', () => {
      const tokens = service.tokenize('x * y');
      expect(tokens.length).toBe(3);
      expect(tokens[0]).toEqual({ type: 'variable', value: 'x', position: 0 });
      expect(tokens[1]).toEqual({ type: 'operator', value: '*', position: 2 });
      expect(tokens[2]).toEqual({ type: 'variable', value: 'y', position: 4 });
    });

    it('should tokenize function calls', () => {
      const tokens = service.tokenize('Math.sqrt(16)');
      expect(tokens.length).toBe(4);
      expect(tokens[0]).toEqual({ type: 'function', value: 'Math.sqrt', position: 0 });
      expect(tokens[1]).toEqual({ type: 'parenthesis', value: '(', position: 9 });
      expect(tokens[2]).toEqual({ type: 'literal', value: '16', position: 10 });
      expect(tokens[3]).toEqual({ type: 'parenthesis', value: ')', position: 12 });
    });
  });

  describe('String Literal Tokenization', () => {
    it('should tokenize double-quoted strings', () => {
      const tokens = service.tokenize('"hello world"');
      expect(tokens.length).toBe(1);
      expect(tokens[0]).toEqual({ type: 'literal', value: '"hello world"', position: 0 });
    });

    it('should tokenize single-quoted strings', () => {
      const tokens = service.tokenize("'test string'");
      expect(tokens.length).toBe(1);
      expect(tokens[0]).toEqual({ type: 'literal', value: "'test string'", position: 0 });
    });

    it('should handle escaped characters in strings', () => {
      const tokens = service.tokenize('"hello\\nworld"');
      expect(tokens.length).toBe(1);
      expect(tokens[0].type).toBe('literal');
      expect(tokens[0].value).toContain('\\n');
    });

    it('should handle unterminated strings', () => {
      const tokens = service.tokenize('"unterminated');
      expect(tokens.length).toBe(1);
      expect(tokens[0].type).toBe('literal');
    });
  });

  describe('Number Tokenization', () => {
    it('should tokenize integers', () => {
      const tokens = service.tokenize('42');
      expect(tokens.length).toBe(1);
      expect(tokens[0]).toEqual({ type: 'literal', value: '42', position: 0 });
    });

    it('should tokenize decimal numbers', () => {
      const tokens = service.tokenize('3.14159');
      expect(tokens.length).toBe(1);
      expect(tokens[0]).toEqual({ type: 'literal', value: '3.14159', position: 0 });
    });

    it('should tokenize numbers starting with decimal', () => {
      const tokens = service.tokenize('.5');
      expect(tokens.length).toBe(1);
      expect(tokens[0]).toEqual({ type: 'literal', value: '.5', position: 0 });
    });
  });

  describe('Operator Tokenization', () => {
    it('should tokenize single-character operators', () => {
      const tokens = service.tokenize('a + b - c * d / e % f');
      const operators = tokens.filter(t => t.type === 'operator');
      expect(operators.map(t => t.value)).toEqual(['+', '-', '*', '/', '%']);
    });

    it('should tokenize two-character operators', () => {
      const tokens = service.tokenize('a == b != c <= d >= e && f || g');
      const operators = tokens.filter(t => t.type === 'operator');
      expect(operators.map(t => t.value)).toEqual(['==', '!=', '<=', '>=', '&&', '||']);
    });

    it('should tokenize arrow functions', () => {
      const tokens = service.tokenize('x => x * 2');
      const arrowToken = tokens.find(t => t.value === '=>');
      expect(arrowToken).toBeDefined();
      expect(arrowToken?.type).toBe('operator');
    });
  });

  describe('Complex Expression Tokenization', () => {
    it('should tokenize complex arithmetic expression', () => {
      const tokens = service.tokenize('(a + b) * Math.pow(c, 2)');
      expect(tokens.length).toBeGreaterThan(10);
      expect(tokens.some(t => t.type === 'parenthesis' && t.value === '(')).toBeTruthy();
      expect(tokens.some(t => t.type === 'function' && t.value === 'Math.pow')).toBeTruthy();
      expect(tokens.some(t => t.type === 'comma')).toBeTruthy();
    });

    it('should tokenize boolean expression', () => {
      const tokens = service.tokenize('status == "active" && count > 0');
      expect(tokens.some(t => t.type === 'operator' && t.value === '==')).toBeTruthy();
      expect(tokens.some(t => t.type === 'literal' && t.value === '"active"')).toBeTruthy();
      expect(tokens.some(t => t.type === 'operator' && t.value === '&&')).toBeTruthy();
    });
  });

  describe('Whitespace Handling', () => {
    it('should ignore whitespace', () => {
      const tokens1 = service.tokenize('a+b');
      const tokens2 = service.tokenize('a + b');
      const tokens3 = service.tokenize('  a  +  b  ');
      
      const normalize = (tokens: Token[]) => tokens.map(t => ({ type: t.type, value: t.value }));
      
      expect(normalize(tokens1)).toEqual(normalize(tokens2));
      expect(normalize(tokens2)).toEqual(normalize(tokens3));
    });

    it('should handle tabs and newlines', () => {
      const tokens = service.tokenize('a\t+\nb');
      expect(tokens.length).toBe(3);
      expect(tokens[0].value).toBe('a');
      expect(tokens[1].value).toBe('+');
      expect(tokens[2].value).toBe('b');
    });
  });

  describe('Token Validation', () => {
    it('should validate balanced parentheses', () => {
      const tokens1 = service.tokenize('(a + b)');
      const result1 = service.validateTokens(tokens1);
      expect(result1.isValid).toBeTruthy();
      expect(result1.errors).toEqual([]);

      const tokens2 = service.tokenize('(a + b');
      const result2 = service.validateTokens(tokens2);
      expect(result2.isValid).toBeFalsy();
      expect(result2.errors).toContain('Unmatched opening parenthesis');

      const tokens3 = service.tokenize('a + b)');
      const result3 = service.validateTokens(tokens3);
      expect(result3.isValid).toBeFalsy();
      expect(result3.errors).toContain('Unmatched closing parenthesis');
    });

    it('should detect consecutive operators', () => {
      const tokens = service.tokenize('a + * b');
      const result = service.validateTokens(tokens);
      expect(result.isValid).toBeFalsy();
      expect(result.errors.some(error => error.includes('Consecutive operators'))).toBeTruthy();
    });

    it('should validate empty token list', () => {
      const result = service.validateTokens([]);
      expect(result.isValid).toBeFalsy();
      expect(result.errors).toContain('No tokens found');
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty expression', () => {
      const tokens = service.tokenize('');
      expect(tokens).toEqual([]);
    });

    it('should handle whitespace-only expression', () => {
      const tokens = service.tokenize('   \t\n   ');
      expect(tokens).toEqual([]);
    });

    it('should handle dot notation in identifiers', () => {
      const tokens = service.tokenize('object.property.method');
      expect(tokens.length).toBe(1);
      expect(tokens[0]).toEqual({ type: 'variable', value: 'object.property.method', position: 0 });
    });

    it('should handle underscore and dollar in identifiers', () => {
      const tokens = service.tokenize('_private $jquery __proto__');
      expect(tokens.length).toBe(3);
      expect(tokens[0].value).toBe('_private');
      expect(tokens[1].value).toBe('$jquery');
      expect(tokens[2].value).toBe('__proto__');
    });
  });

  describe('Special Characters', () => {
    it('should tokenize parentheses', () => {
      const tokens = service.tokenize('()');
      expect(tokens.length).toBe(2);
      expect(tokens[0]).toEqual({ type: 'parenthesis', value: '(', position: 0 });
      expect(tokens[1]).toEqual({ type: 'parenthesis', value: ')', position: 1 });
    });

    it('should tokenize commas', () => {
      const tokens = service.tokenize('a, b, c');
      const commas = tokens.filter(t => t.type === 'comma');
      expect(commas.length).toBe(2);
    });
  });

  describe('Position Tracking', () => {
    it('should track correct positions for all tokens', () => {
      const tokens = service.tokenize('hello + world');
      expect(tokens[0].position).toBe(0);  // 'hello'
      expect(tokens[1].position).toBe(6);  // '+'
      expect(tokens[2].position).toBe(8);  // 'world'
    });

    it('should track positions with varying whitespace', () => {
      const tokens = service.tokenize('a   +    b');
      expect(tokens[0].position).toBe(0);  // 'a'
      expect(tokens[1].position).toBe(4);  // '+'
      expect(tokens[2].position).toBe(9);  // 'b'
    });
  });
});
