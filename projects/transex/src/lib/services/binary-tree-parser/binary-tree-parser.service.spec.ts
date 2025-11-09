import { TestBed } from '@angular/core/testing';
import { BinaryTreeParserService } from './binary-tree-parser.service';
import { TokenizerService, Token } from '../tokenizer/tokenizer.service';

describe('BinaryTreeParserService', () => {
  let service: BinaryTreeParserService;
  let tokenizerSpy: jasmine.SpyObj<TokenizerService>;

  beforeEach(() => {
    tokenizerSpy = jasmine.createSpyObj('TokenizerService', ['tokenize', 'validateTokens']);

    TestBed.configureTestingModule({
      providers: [
        BinaryTreeParserService,
        { provide: TokenizerService, useValue: tokenizerSpy }
      ]
    });

    service = TestBed.inject(BinaryTreeParserService);
  });

  describe('Service Creation', () => {
    it('should be created', () => {
      expect(service).toBeTruthy();
    });
  });

  describe('Expression Parsing', () => {
    it('should return error for empty expression', () => {
      const result = service.parseExpression('');
      expect(result.success).toBeFalsy();
      expect(result.error).toBe('Expression is empty');
    });

    it('should return error for whitespace-only expression', () => {
      const result = service.parseExpression('   ');
      expect(result.success).toBeFalsy();
      expect(result.error).toBe('Expression is empty');
    });

    it('should return error when tokenization fails', () => {
      tokenizerSpy.tokenize.and.returnValue([]);
      tokenizerSpy.validateTokens.and.returnValue({
        isValid: false,
        errors: ['Invalid token']
      });

      const result = service.parseExpression('invalid');
      expect(result.success).toBeFalsy();
      expect(result.error).toBe('Tokenization error: Invalid token');
    });

    it('should return error when no tokens found', () => {
      tokenizerSpy.tokenize.and.returnValue([]);
      tokenizerSpy.validateTokens.and.returnValue({
        isValid: true,
        errors: []
      });

      const result = service.parseExpression('');
      expect(result.success).toBeFalsy();
      expect(result.error).toBe('No valid tokens found');
    });

    it('should parse simple arithmetic expression', () => {
      const tokens: Token[] = [
        { type: 'literal' as const, value: '2', position: 0 },
        { type: 'operator' as const, value: '+', position: 2 },
        { type: 'literal' as const, value: '3', position: 4 }
      ];
      
      tokenizerSpy.tokenize.and.returnValue(tokens);
      tokenizerSpy.validateTokens.and.returnValue({
        isValid: true,
        errors: []
      });

      const result = service.parseExpression('2 + 3');
      expect(result.success).toBeTruthy();
      expect(result.tree).toBeDefined();
      expect(result.tree?.type).toBe('operator');
      expect(result.tree?.value).toBe('+');
      expect(result.json).toBeDefined();
    });

    it('should parse parenthesized expressions', () => {
      const tokens: Token[] = [
        { type: 'parenthesis' as const, value: '(', position: 0 },
        { type: 'literal' as const, value: '2', position: 1 },
        { type: 'operator' as const, value: '+', position: 3 },
        { type: 'literal' as const, value: '3', position: 5 },
        { type: 'parenthesis' as const, value: ')', position: 6 }
      ];
      
      tokenizerSpy.tokenize.and.returnValue(tokens);
      tokenizerSpy.validateTokens.and.returnValue({
        isValid: true,
        errors: []
      });

      const result = service.parseExpression('(2 + 3)');
      expect(result.success).toBeTruthy();
      expect(result.tree?.type).toBe('operator');
      expect(result.tree?.value).toBe('+');
    });

    it('should parse function calls', () => {
      const tokens: Token[] = [
        { type: 'function' as const, value: 'Math.sqrt', position: 0 },
        { type: 'parenthesis' as const, value: '(', position: 9 },
        { type: 'literal' as const, value: '16', position: 10 },
        { type: 'parenthesis' as const, value: ')', position: 12 }
      ];
      
      tokenizerSpy.tokenize.and.returnValue(tokens);
      tokenizerSpy.validateTokens.and.returnValue({
        isValid: true,
        errors: []
      });

      const result = service.parseExpression('Math.sqrt(16)');
      expect(result.success).toBeTruthy();
      expect(result.tree?.type).toBe('function');
      expect(result.tree?.value).toBe('Math.sqrt');
      expect(result.tree?.children).toBeDefined();
      expect(result.tree?.children?.length).toBe(1);
    });

    it('should parse function calls with multiple arguments', () => {
      const tokens: Token[] = [
        { type: 'function' as const, value: 'Math.pow', position: 0 },
        { type: 'parenthesis' as const, value: '(', position: 8 },
        { type: 'literal' as const, value: '2', position: 9 },
        { type: 'comma' as const, value: ',', position: 10 },
        { type: 'literal' as const, value: '3', position: 12 },
        { type: 'parenthesis' as const, value: ')', position: 13 }
      ];
      
      tokenizerSpy.tokenize.and.returnValue(tokens);
      tokenizerSpy.validateTokens.and.returnValue({
        isValid: true,
        errors: []
      });

      const result = service.parseExpression('Math.pow(2, 3)');
      expect(result.success).toBeTruthy();
      expect(result.tree?.type).toBe('function');
      expect(result.tree?.children?.length).toBe(2);
    });

    it('should parse boolean literals', () => {
      const tokens: Token[] = [
        { type: 'literal' as const, value: 'true', position: 0 }
      ];
      
      tokenizerSpy.tokenize.and.returnValue(tokens);
      tokenizerSpy.validateTokens.and.returnValue({
        isValid: true,
        errors: []
      });

      const result = service.parseExpression('true');
      expect(result.success).toBeTruthy();
      expect(result.tree?.type).toBe('literal');
      expect(result.tree?.value).toBe(true);
    });

    it('should parse variables', () => {
      const tokens: Token[] = [
        { type: 'variable' as const, value: 'x', position: 0 }
      ];
      
      tokenizerSpy.tokenize.and.returnValue(tokens);
      tokenizerSpy.validateTokens.and.returnValue({
        isValid: true,
        errors: []
      });

      const result = service.parseExpression('x');
      expect(result.success).toBeTruthy();
      expect(result.tree?.type).toBe('variable');
      expect(result.tree?.value).toBe('x');
    });

    it('should handle operator precedence', () => {
      const tokens: Token[] = [
        { type: 'literal' as const, value: '2', position: 0 },
        { type: 'operator' as const, value: '+', position: 2 },
        { type: 'literal' as const, value: '3', position: 4 },
        { type: 'operator' as const, value: '*', position: 6 },
        { type: 'literal' as const, value: '4', position: 8 }
      ];
      
      tokenizerSpy.tokenize.and.returnValue(tokens);
      tokenizerSpy.validateTokens.and.returnValue({
        isValid: true,
        errors: []
      });

      const result = service.parseExpression('2 + 3 * 4');
      expect(result.success).toBeTruthy();
      expect(result.tree?.type).toBe('operator');
      expect(result.tree?.value).toBe('+');
      expect(result.tree?.right?.type).toBe('operator');
      expect(result.tree?.right?.value).toBe('*');
    });

    it('should handle exceptions during parsing', () => {
      tokenizerSpy.tokenize.and.throwError('Tokenizer error');

      const result = service.parseExpression('error');
      expect(result.success).toBeFalsy();
      expect(result.error).toBe('Tokenizer error');
    });

    it('should handle non-Error exceptions', () => {
      tokenizerSpy.tokenize.and.callFake(() => {
        throw 'String error';
      });

      const result = service.parseExpression('error');
      expect(result.success).toBeFalsy();
      expect(result.error).toBe('Parse error');
    });
  });

  describe('Complex Expressions', () => {
    it('should parse complex nested expressions', () => {
      const tokens: Token[] = [
        { type: 'parenthesis' as const, value: '(', position: 0 },
        { type: 'literal' as const, value: '2', position: 1 },
        { type: 'operator' as const, value: '+', position: 3 },
        { type: 'literal' as const, value: '3', position: 5 },
        { type: 'parenthesis' as const, value: ')', position: 6 },
        { type: 'operator' as const, value: '*', position: 8 },
        { type: 'parenthesis' as const, value: '(', position: 10 },
        { type: 'literal' as const, value: '4', position: 11 },
        { type: 'operator' as const, value: '-', position: 13 },
        { type: 'literal' as const, value: '1', position: 15 },
        { type: 'parenthesis' as const, value: ')', position: 16 }
      ];
      
      tokenizerSpy.tokenize.and.returnValue(tokens);
      tokenizerSpy.validateTokens.and.returnValue({
        isValid: true,
        errors: []
      });

      const result = service.parseExpression('(2 + 3) * (4 - 1)');
      expect(result.success).toBeTruthy();
      expect(result.tree?.type).toBe('operator');
      expect(result.tree?.value).toBe('*');
    });

    it('should parse logical operators', () => {
      const tokens: Token[] = [
        { type: 'literal' as const, value: 'true', position: 0 },
        { type: 'operator' as const, value: '&&', position: 5 },
        { type: 'literal' as const, value: 'false', position: 8 }
      ];
      
      tokenizerSpy.tokenize.and.returnValue(tokens);
      tokenizerSpy.validateTokens.and.returnValue({
        isValid: true,
        errors: []
      });

      const result = service.parseExpression('true && false');
      expect(result.success).toBeTruthy();
      expect(result.tree?.type).toBe('operator');
      expect(result.tree?.value).toBe('&&');
    });
  });
});
