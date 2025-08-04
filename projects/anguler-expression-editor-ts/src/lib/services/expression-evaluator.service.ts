import { Injectable } from '@angular/core';
import { EvaluationResult } from '../interfaces/shared.interfaces';

@Injectable({
  providedIn: 'root'
})
export class ExpressionEvaluatorService {

  constructor() { }

  evaluateExpression(expression: string): EvaluationResult {
    if (!expression || expression.trim().length === 0) {
      return { success: false, error: 'Empty expression' };
    }

    try {
      // Replace function calls with JavaScript equivalents
      let processedExpression = this.preprocessExpression(expression);
      
      // Create a safe evaluation context
      const context = this.createEvaluationContext();
      
      // Evaluate the expression
      const result = this.safeEvaluate(processedExpression, context);
      
      return {
        success: true,
        result: result,
        type: typeof result
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown evaluation error'
      };
    }
  }

  private preprocessExpression(expression: string): string {
    let processed = expression;

    // Replace custom functions with JavaScript implementations
    const functionMappings = {
      // Arithmetic functions
      'add\\((.*?),\\s*(.*?)\\)': '($1 + $2)',
      'subtract\\((.*?),\\s*(.*?)\\)': '($1 - $2)',
      'multiply\\((.*?),\\s*(.*?)\\)': '($1 * $2)',
      'divide\\((.*?),\\s*(.*?)\\)': '($1 / $2)',
      'mod\\((.*?),\\s*(.*?)\\)': '($1 % $2)',
      'power\\((.*?),\\s*(.*?)\\)': 'Math.pow($1, $2)',
      'square\\((.*?)\\)': 'Math.pow($1, 2)',
      'sqrt\\((.*?)\\)': 'Math.sqrt($1)',
      'abs\\((.*?)\\)': 'Math.abs($1)',
      'average\\(([^)]+)\\)': '(($1).split(",").map(x => parseFloat(x.trim())).reduce((a,b) => a+b, 0) / ($1).split(",").length)',
      
      // Relational functions
      'equals\\((.*?),\\s*(.*?)\\)': '($1 === $2)',
      'notEquals\\((.*?),\\s*(.*?)\\)': '($1 !== $2)',
      'greaterThan\\((.*?),\\s*(.*?)\\)': '($1 > $2)',
      'lessThan\\((.*?),\\s*(.*?)\\)': '($1 < $2)',
      'greaterThanOrEqual\\((.*?),\\s*(.*?)\\)': '($1 >= $2)',
      'lessThanOrEqual\\((.*?),\\s*(.*?)\\)': '($1 <= $2)',
      
      // Logical functions
      'and\\((.*?),\\s*(.*?)\\)': '($1 && $2)',
      'or\\((.*?),\\s*(.*?)\\)': '($1 || $2)',
      'not\\((.*?)\\)': '(!$1)',
      'if\\((.*?),\\s*(.*?),\\s*(.*?)\\)': '($1 ? $2 : $3)',
      
      // String functions
      'concat\\((.*?),\\s*(.*?)\\)': '($1 + $2)',
      'length\\((.*?)\\)': '($1).length',
      'substring\\((.*?),\\s*(.*?),\\s*(.*?)\\)': '($1).substring($2, $2 + $3)',
      'toUpper\\((.*?)\\)': '($1).toUpperCase()',
      'toLower\\((.*?)\\)': '($1).toLowerCase()',
      'trim\\((.*?)\\)': '($1).trim()'
    };

    // Apply function mappings
    for (const [pattern, replacement] of Object.entries(functionMappings)) {
      const regex = new RegExp(pattern, 'g');
      processed = processed.replace(regex, replacement);
    }

    return processed;
  }

  private createEvaluationContext(): any {
    return {
      Math: Math,
      String: String,
      Number: Number,
      Boolean: Boolean,
      parseInt: parseInt,
      parseFloat: parseFloat,
      isNaN: isNaN,
      isFinite: isFinite,
      // Add some sample variables for testing
      x: 10,
      y: 5,
      name: "John",
      age: 25,
      pi: Math.PI,
      e: Math.E
    };
  }

  private safeEvaluate(expression: string, context: any): any {
    // Create a function that evaluates the expression in the given context
    const contextKeys = Object.keys(context);
    const contextValues = Object.values(context);
    
    try {
      // Create a function with the context variables as parameters
      const func = new Function(...contextKeys, `return ${expression}`);
      return func(...contextValues);
    } catch (error) {
      throw new Error(`Evaluation error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Helper method to get available variables
  getAvailableVariables(): { [key: string]: any } {
    return this.createEvaluationContext();
  }

  // Helper method to format result for display
  formatResult(result: any): string {
    if (result === null) return 'null';
    if (result === undefined) return 'undefined';
    if (typeof result === 'string') return `"${result}"`;
    if (typeof result === 'number') {
      // Format numbers nicely
      if (Number.isInteger(result)) return result.toString();
      return result.toFixed(6).replace(/\.?0+$/, '');
    }
    if (typeof result === 'boolean') return result.toString();
    if (Array.isArray(result)) return `[${result.map(item => this.formatResult(item)).join(', ')}]`;
    if (typeof result === 'object') return JSON.stringify(result, null, 2);
    return String(result);
  }
}
