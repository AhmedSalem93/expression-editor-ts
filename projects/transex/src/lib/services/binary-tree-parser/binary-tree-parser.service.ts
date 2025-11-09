import { Injectable } from '@angular/core';
import { TokenizerService, Token } from '../tokenizer/tokenizer.service';

export interface BinaryTreeNode {
  type: 'operator' | 'function' | 'variable' | 'literal';
  value: string | number | boolean;
  left?: BinaryTreeNode;
  right?: BinaryTreeNode;
  children?: BinaryTreeNode[]; // For function calls with multiple parameters
}

export interface ParseResult {
  success: boolean;
  tree?: BinaryTreeNode;
  error?: string;
  json?: string;
}

@Injectable({
  providedIn: 'root'
})
export class BinaryTreeParserService {

  private tokens: Token[] = [];
  private currentIndex = 0;

  constructor(private tokenizerService: TokenizerService) {}

  parseExpression(expression: string): ParseResult {
    try {
      if (!expression || expression.trim().length === 0) {
        return {
          success: false,
          error: 'Expression is empty'
        };
      }

      // Use TokenizerService instead of internal tokenization
      this.tokens = this.tokenizerService.tokenize(expression);
      this.currentIndex = 0;

      // Validate tokens using TokenizerService
      const validation = this.tokenizerService.validateTokens(this.tokens);
      if (!validation.isValid) {
        return {
          success: false,
          error: `Tokenization error: ${validation.errors.join(', ')}`
        };
      }

      if (this.tokens.length === 0) {
        return {
          success: false,
          error: 'No valid tokens found'
        };
      }

      const tree = this.parseOrExpression();
      
      if (this.currentIndex < this.tokens.length) {
        return {
          success: false,
          error: `Unexpected token: ${this.tokens[this.currentIndex].value}`
        };
      }

      const json = JSON.stringify(tree, null, 2);

      return {
        success: true,
        tree: tree,
        json: json
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Parse error'
      };
    }
  }

  private parseOrExpression(): BinaryTreeNode {
    let left = this.parseAndExpression();
    
    while (this.currentIndex < this.tokens.length && this.tokens[this.currentIndex].value === '||') {
      const operator = this.tokens[this.currentIndex].value;
      this.currentIndex++;
      const right = this.parseAndExpression();
      left = {
        type: 'operator',
        value: operator,
        left: left,
        right: right
      };
    }
    
    return left;
  }

  private parseAndExpression(): BinaryTreeNode {
    let left = this.parseEqualityExpression();
    
    while (this.currentIndex < this.tokens.length && this.tokens[this.currentIndex].value === '&&') {
      const operator = this.tokens[this.currentIndex].value;
      this.currentIndex++;
      const right = this.parseEqualityExpression();
      left = {
        type: 'operator',
        value: operator,
        left: left,
        right: right
      };
    }
    
    return left;
  }

  private parseEqualityExpression(): BinaryTreeNode {
    let left = this.parseRelationalExpression();
    
    while (this.currentIndex < this.tokens.length && ['==', '!='].includes(this.tokens[this.currentIndex].value as string)) {
      const operator = this.tokens[this.currentIndex].value;
      this.currentIndex++;
      const right = this.parseRelationalExpression();
      left = {
        type: 'operator',
        value: operator,
        left: left,
        right: right
      };
    }
    
    return left;
  }

  private parseRelationalExpression(): BinaryTreeNode {
    let left = this.parseAssignmentExpression();
    
    while (this.currentIndex < this.tokens.length && ['<', '>', '<=', '>='].includes(this.tokens[this.currentIndex].value as string)) {
      const operator = this.tokens[this.currentIndex].value;
      this.currentIndex++;
      const right = this.parseAssignmentExpression();
      left = {
        type: 'operator',
        value: operator,
        left: left,
        right: right
      };
    }
    
    return left;
  }

  private parseAssignmentExpression(): BinaryTreeNode {
    let left = this.parseAdditiveExpression();
    
    while (this.currentIndex < this.tokens.length && this.tokens[this.currentIndex].value === '=') {
      const operator = this.tokens[this.currentIndex].value;
      this.currentIndex++;
      const right = this.parseAdditiveExpression();
      left = {
        type: 'operator',
        value: operator,
        left: left,
        right: right
      };
    }
    
    return left;
  }

  private parseAdditiveExpression(): BinaryTreeNode {
    let left = this.parseMultiplicativeExpression();
    
    while (this.currentIndex < this.tokens.length && ['+', '-'].includes(this.tokens[this.currentIndex].value as string)) {
      const operator = this.tokens[this.currentIndex].value;
      this.currentIndex++;
      const right = this.parseMultiplicativeExpression();
      left = {
        type: 'operator',
        value: operator,
        left: left,
        right: right
      };
    }
    
    return left;
  }

  private parseMultiplicativeExpression(): BinaryTreeNode {
    let left = this.parseUnaryExpression();
    
    while (this.currentIndex < this.tokens.length && ['*', '/'].includes(this.tokens[this.currentIndex].value as string)) {
      const operator = this.tokens[this.currentIndex].value;
      this.currentIndex++;
      const right = this.parseUnaryExpression();
      left = {
        type: 'operator',
        value: operator,
        left: left,
        right: right
      };
    }
    
    return left;
  }

  private parseUnaryExpression(): BinaryTreeNode {
    if (this.currentIndex < this.tokens.length && ['+', '-', '!'].includes(this.tokens[this.currentIndex].value as string)) {
      const operator = this.tokens[this.currentIndex].value;
      this.currentIndex++;
      const operand = this.parseUnaryExpression();
      return {
        type: 'operator',
        value: operator,
        right: operand
      };
    }
    
    return this.parsePrimaryExpression();
  }

  private parsePrimaryExpression(): BinaryTreeNode {
    if (this.currentIndex >= this.tokens.length) {
      throw new Error('Unexpected end of expression');
    }
    
    const token = this.tokens[this.currentIndex];
    
    // Parentheses
    if (token.value === '(') {
      this.currentIndex++;
      const expr = this.parseOrExpression();
      if (this.currentIndex >= this.tokens.length || this.tokens[this.currentIndex].value !== ')') {
        throw new Error('Missing closing parenthesis');
      }
      this.currentIndex++;
      return expr;
    }
    
    // String literals
    if (typeof token.value === 'string' && (token.value.startsWith('"') || token.value.startsWith("'"))) {
      this.currentIndex++;
      return {
        type: 'literal',
        value: token.value.slice(1, -1) // Remove quotes
      };
    }
    
    // Numbers
    if (typeof token.value === 'string' && /^\d+(\.\d+)?$/.test(token.value)) {
      this.currentIndex++;
      const numValue = parseFloat(token.value);
      return {
        type: 'literal',
        value: numValue
      };
    }
    
    // Boolean literals
    if (token.value === 'true' || token.value === 'false') {
      this.currentIndex++;
      return {
        type: 'literal',
        value: token.value === 'true'
      };
    }
    
    // Function calls
    if (this.currentIndex + 1 < this.tokens.length && this.tokens[this.currentIndex + 1].value === '(') {
      const functionName = token.value;
      this.currentIndex += 2; // Skip function name and '('
      
      const args: BinaryTreeNode[] = [];
      
      // Parse arguments
      if (this.currentIndex < this.tokens.length && this.tokens[this.currentIndex].value !== ')') {
        args.push(this.parseOrExpression());
        
        while (this.currentIndex < this.tokens.length && this.tokens[this.currentIndex].value === ',') {
          this.currentIndex++; // Skip comma
          args.push(this.parseOrExpression());
        }
      }
      
      if (this.currentIndex >= this.tokens.length || this.tokens[this.currentIndex].value !== ')') {
        throw new Error('Missing closing parenthesis in function call');
      }
      this.currentIndex++; // Skip ')'
      
      return {
        type: 'function',
        value: functionName,
        children: args
      };
    }
    
    // Variables
    this.currentIndex++;
    return {
      type: 'variable',
      value: token.value
    };
  }
}