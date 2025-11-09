import { Injectable } from '@angular/core';

export interface Token {
  type: 'operator' | 'function' | 'variable' | 'literal' | 'parenthesis' | 'comma' | 'bracket' | 'semicolon' | 'colon' | 'question';
  value: string;
  position: number;
}

@Injectable({
  providedIn: 'root'
})
export class TokenizerService {

  tokenize(expression: string): Token[] {
    const tokens: Token[] = [];
    let i = 0;
    
    while (i < expression.length) {
      const char = expression[i];
      
      // Skip whitespace
      if (/\s/.test(char)) {
        i++;
        continue;
      }
      
      // Handle operators
      if (this.isOperator(char)) {
        const operator = this.parseOperator(expression, i);
        tokens.push({
          type: 'operator',
          value: operator,
          position: i
        });
        i += operator.length;
        continue;
      }
      
      // Handle parentheses
      if (char === '(' || char === ')') {
        tokens.push({
          type: 'parenthesis',
          value: char,
          position: i
        });
        i++;
        continue;
      }
      
      // Handle comma
      if (char === ',') {
        tokens.push({
          type: 'comma',
          value: char,
          position: i
        });
        i++;
        continue;
      }
      
      // Handle string literals
      if (char === '"' || char === "'") {
        const stringLiteral = this.parseStringLiteral(expression, i);
        tokens.push({
          type: 'literal',
          value: stringLiteral.value,
          position: i
        });
        i = stringLiteral.endIndex;
        continue;
      }
      
      // Handle numbers
      if (/\d/.test(char) || (char === '.' && /\d/.test(expression[i + 1]))) {
        const number = this.parseNumber(expression, i);
        tokens.push({
          type: 'literal',
          value: number.value,
          position: i
        });
        i = number.endIndex;
        continue;
      }
      
      // Handle identifiers (variables/functions)
      if (/[a-zA-Z_$]/.test(char)) {
        const identifier = this.parseIdentifier(expression, i);
        const nextChar = expression[identifier.endIndex];
        
        tokens.push({
          type: nextChar === '(' ? 'function' : 'variable',
          value: identifier.value,
          position: i
        });
        i = identifier.endIndex;
        continue;
      }
      
      // Unknown character - skip it
      i++;
    }
    
    return tokens;
  }

  private isOperator(char: string): boolean {
    return /[+\-*/%=!<>&|^~]/.test(char);
  }

  private parseOperator(expression: string, startIndex: number): string {
    const char = expression[startIndex];
    const nextChar = expression[startIndex + 1];
    
    // Two-character operators
    const twoChar = char + nextChar;
    if (['==', '!=', '<=', '>=', '&&', '||', '=>'].includes(twoChar)) {
      return twoChar;
    }
    
    return char;
  }

  private parseStringLiteral(expression: string, startIndex: number): { value: string; endIndex: number } {
    const quote = expression[startIndex];
    let i = startIndex + 1;
    let value = '';
    
    while (i < expression.length && expression[i] !== quote) {
      if (expression[i] === '\\' && i + 1 < expression.length) {
        // Handle escape sequences
        i++;
        const escaped = expression[i];
        switch (escaped) {
          case 'n': value += '\n'; break;
          case 't': value += '\t'; break;
          case 'r': value += '\r'; break;
          case '\\': value += '\\'; break;
          case '"': value += '"'; break;
          case "'": value += "'"; break;
          default: value += escaped; break;
        }
      } else {
        value += expression[i];
      }
      i++;
    }
    
    return {
      value: quote + value + quote, // Include quotes in the value
      endIndex: i + 1
    };
  }

  private parseNumber(expression: string, startIndex: number): { value: string; endIndex: number } {
    let i = startIndex;
    let value = '';
    let hasDecimal = false;
    
    while (i < expression.length) {
      const char = expression[i];
      
      if (/\d/.test(char)) {
        value += char;
      } else if (char === '.' && !hasDecimal && /\d/.test(expression[i + 1])) {
        hasDecimal = true;
        value += char;
      } else {
        break;
      }
      i++;
    }
    
    return { value, endIndex: i };
  }

  private parseIdentifier(expression: string, startIndex: number): { value: string; endIndex: number } {
    let i = startIndex;
    let value = '';
    
    while (i < expression.length && /[a-zA-Z0-9_$.]/.test(expression[i])) {
      value += expression[i];
      i++;
    }
    
    return { value, endIndex: i };
  }

  validateTokens(tokens: Token[]): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    // Check for empty token list
    if (tokens.length === 0) {
      errors.push('No tokens found');
      return { isValid: false, errors };
    }
    
    // Check for balanced parentheses
    let parenthesesCount = 0;
    for (const token of tokens) {
      if (token.type === 'parenthesis') {
        if (token.value === '(') {
          parenthesesCount++;
        } else {
          parenthesesCount--;
          if (parenthesesCount < 0) {
            errors.push('Unmatched closing parenthesis');
            break;
          }
        }
      }
    }
    
    if (parenthesesCount > 0) {
      errors.push('Unmatched opening parenthesis');
    }
    
    // Check for consecutive operators
    for (let i = 0; i < tokens.length - 1; i++) {
      const current = tokens[i];
      const next = tokens[i + 1];
      
      if (current.type === 'operator' && next.type === 'operator') {
        errors.push(`Consecutive operators: ${current.value} ${next.value}`);
      }
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }
}
