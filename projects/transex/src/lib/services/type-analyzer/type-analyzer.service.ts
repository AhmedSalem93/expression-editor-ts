import { Injectable } from '@angular/core';
import { DataType } from '../../interfaces/shared.interfaces';
import { VariableManagerService } from '../variable-manager/variable-manager.service';
import { ExpressionPatternService } from '../expression-pattern/expression-pattern.service';

@Injectable({
  providedIn: 'root'
})
export class TypeAnalyzerService {

  constructor(
    private variableManager: VariableManagerService,
    private patternService: ExpressionPatternService
  ) {}

  analyzeExpressionReturnType(expression: string): DataType {
    const trimmed = expression.trim();
    
    const lambdaMatch = this.patternService.isLambdaFunction(trimmed);
    if (lambdaMatch.isMatch) {
      return DataType.FUNCTION;
    }
    
    const assignmentMatch = this.patternService.isFieldAssignment(trimmed);
    if (assignmentMatch.isMatch) {
      return DataType.ASSIGNMENT;
    }

    const ternaryMatch = this.patternService.isTernaryExpression(trimmed);
    if (ternaryMatch.isMatch) {
      const ternaryType = this.analyzeTernaryReturnType(trimmed);
      if (ternaryType) {
        return ternaryType;
      }
      return DataType.REAL;
    }
    
    const booleanMatch = this.patternService.isBooleanExpression(trimmed);
    if (booleanMatch.isMatch) {
      return DataType.BOOLEAN;
    }
    
    const stringMatch = this.patternService.isStringLiteral(trimmed);
    if (stringMatch.isMatch) {
      return DataType.STRING;
    }
    
    const numericMatch = this.patternService.isNumericExpression(trimmed);
    if (numericMatch.isMatch) {
      const integerMatch = this.patternService.willReturnInteger(trimmed);
      if (integerMatch.isMatch) {
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
}