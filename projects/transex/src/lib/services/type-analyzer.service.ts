import { Injectable } from '@angular/core';
import { DataType } from '../interfaces/shared.interfaces';
import { VariableManagerService } from './variable-manager.service';

@Injectable({
  providedIn: 'root'
})
export class TypeAnalyzerService {

  constructor(private variableManager: VariableManagerService) {}

  analyzeExpressionReturnType(expression: string): DataType {
    const trimmed = expression.trim();
    
    if (this.isLambdaFunction(trimmed)) {
      return DataType.FUNCTION;
    }
    
    if (this.isFieldAssignment(trimmed)) {
      return DataType.ASSIGNMENT;
    }

    if (this.isTernaryExpression(trimmed)) {
      const ternaryType = this.analyzeTernaryReturnType(trimmed);
      if (ternaryType) {
        return ternaryType;
      }
      return DataType.REAL;
    }
    
    if (this.isBooleanExpression(trimmed)) {
      return DataType.BOOLEAN;
    }
    
    if (this.isStringLiteral(trimmed)) {
      return DataType.STRING;
    }
    
    if (this.isNumericExpression(trimmed)) {
      if (this.willReturnInteger(trimmed)) {
        return DataType.INTEGER;
      } else {
        return DataType.REAL;
      }
    }
    
    const singleVariable = this.variableManager.getVariable(trimmed);
    if (singleVariable) {
      return singleVariable.type;
    }
    
    return DataType.REAL;
  }

  private isStringLiteral(expression: string): boolean {
    return /^["'].*["']$/.test(expression.trim());
  }

  private isNumericExpression(expression: string): boolean {
    const numericPattern = /^[\d\s+\-*/().]+$|^[\d\s+\-*/().]*Math\.[a-zA-Z]+\([\d\s+\-*/(),]*\)[\d\s+\-*/().]*$/;
    return numericPattern.test(expression) || this.containsArithmeticOperators(expression);
  }

  private willReturnInteger(expression: string): boolean {
    const cleaned = expression.replace(/\s/g, '');
    
    if (/^[\d+\-*/().\s]+$/.test(expression) && !/[a-zA-Z_]/.test(expression)) {
      const evalResult = this.safeEvaluateNumericOnly(expression);
      if (evalResult.evaluated) {
        return Number.isInteger(evalResult.value);
      }
    }
    if (cleaned.includes('.')) {
      return false;
    }
    
    if (/Math\./.test(cleaned)) {
      const integerMathFunctions = /^Math\.(abs|ceil|floor|round|trunc|sign)\(/;
      if (integerMathFunctions.test(cleaned)) {
        return this.hasOnlyIntegerArguments(cleaned);
      }
      return false;
    }
    
    const integerFunctions = /^(add|subtract|multiply|abs| ceil|floor|round|max|min)\(/;
    if (integerFunctions.test(cleaned)) {
      return this.hasOnlyIntegerArguments(cleaned);
    }
    
    if (/[a-zA-Z_][a-zA-Z0-9_]*\s*\(/.test(cleaned)) {
      return false;
    }
    
    const simpleIntegerPattern = /^[\d+\-*()]+$/;
    if (simpleIntegerPattern.test(cleaned)) {
      return true;
    }
    
    if (/[a-zA-Z_][a-zA-Z0-9_.]*/.test(cleaned)) {
      return false;
    }
    return false;
  }

  private hasOnlyIntegerArguments(expression: string): boolean {
    const match = expression.match(/\(([^)]+)\)/);
    if (!match) return false;
    
    const args = match[1].split(',').map(arg => arg.trim());
    
    return args.every(arg => {
      const cleanArg = arg.replace(/[+\-*()]/g, '');
      return /^\d+$/.test(cleanArg) && !arg.includes('.');
    });
  }

  private containsArithmeticOperators(expression: string): boolean {
    return /[+\-*/]/.test(expression);
  }

  private isBooleanExpression(expression: string): boolean {
    return /\b(true|false)\b|[<>=!]=?|&&|\|\|/.test(expression);
  }

  private isFieldAssignment(expression: string): boolean {
    return /^\s*[a-zA-Z_][a-zA-Z0-9_.]*\s*=(?!=)\s*.+/.test(expression);
  }

  private isLambdaFunction(expression: string): boolean {
    return /^\s*(\([^)]*\)|\w+)\s*=>\s*.+/.test(expression.trim());
  }

  private isTernaryExpression(expression: string): boolean {
    const qIndex = expression.indexOf('?');
    const cIndex = expression.lastIndexOf(':');
    if (qIndex < 0 || cIndex < 0 || qIndex > cIndex) return false;
    return true;
  }

  private analyzeTernaryReturnType(expression: string): DataType | null {
    const qIndex = expression.indexOf('?');
    const cIndex = expression.lastIndexOf(':');
    if (qIndex < 0 || cIndex < 0 || qIndex < 1 || cIndex <= qIndex + 1) {
      return null;
    }
    const whenTrue = expression.slice(qIndex + 1, cIndex).trim();
    const whenFalse = expression.slice(cIndex + 1).trim();

    const trueType = this.analyzeExpressionReturnType(whenTrue);
    const falseType = this.analyzeExpressionReturnType(whenFalse);

    if (trueType === falseType) {
      return trueType;
    }

    const numericTypes = [DataType.INTEGER, DataType.REAL];
    if (numericTypes.includes(trueType) && numericTypes.includes(falseType)) {
      return (trueType === DataType.INTEGER && falseType === DataType.INTEGER)
        ? DataType.INTEGER
        : DataType.REAL;
    }

    if ((trueType === DataType.STRING && falseType !== DataType.ASSIGNMENT && falseType !== DataType.FUNCTION) ||
        (falseType === DataType.STRING && trueType !== DataType.ASSIGNMENT && trueType !== DataType.FUNCTION)) {
      return DataType.STRING;
    }

    return DataType.REAL;
  }
  private safeEvaluateNumericOnly(expr: string): { evaluated: boolean; value: number } {
    const allowed = /^[\d\s+\-*/().]+$/;
    if (!allowed.test(expr)) {
      return { evaluated: false, value: NaN };
    }
    try {
      const fn = new Function(`"use strict"; return (${expr});`);
      const value = fn();
      if (typeof value === 'number' && Number.isFinite(value)) {
        return { evaluated: true, value };
      }
      return { evaluated: false, value: NaN };
    } catch {
      return { evaluated: false, value: NaN };
    }
  }
}