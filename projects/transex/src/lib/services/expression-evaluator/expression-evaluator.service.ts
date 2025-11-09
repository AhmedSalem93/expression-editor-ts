import { Injectable } from '@angular/core';
import { TypeAnalyzerService } from '../type-analyzer/type-analyzer.service';
import { ValidationService } from '../validation/validation.service';
import { VariableManagerService } from '../variable-manager/variable-manager.service';
import { BinaryTreeParserService } from '../binary-tree-parser/binary-tree-parser.service';
import { ConfigurationService } from '../configuration/configuration.service';
import { BinaryTreeResult, ExpressionEditorConfig, ExpressionEditorConfigEnhanced, ExpressionResult, Variable, VariableMapping } from '../../interfaces/shared.interfaces';

@Injectable({
  providedIn: 'root'
})
export class ExpressionEvaluatorService {

  constructor(
    private typeAnalyzer: TypeAnalyzerService,
    private validator: ValidationService,
    private variableManager: VariableManagerService,
    private binaryTreeParser: BinaryTreeParserService,
    private configurationService: ConfigurationService
  ) { }

  addVariable(variable: Variable): void {
    this.variableManager.addVariable(variable);
  }

  removeVariable(name: string): void {
    this.variableManager.removeVariable(name);
  }

  getVariables(): Variable[] {
    return this.variableManager.getVariables();
  }

  getVariable(name: string): Variable | undefined {
    return this.variableManager.getVariable(name);
  }

  identifyExpressionType(expression: string, config?: ExpressionEditorConfig | ExpressionEditorConfigEnhanced): ExpressionResult {
    if (!expression || expression.trim().length === 0) {
      return {
        success: false,
        error: 'Expression is empty'
      };
    }

    try {
        // Check if it's a lambda function or ternary expression first
        const isLambdaExpression = this.isLambdaFunction(expression);
         const isTernaryExpression = this.isTernaryExpression(expression);
      
      // Parse binary tree only if it's NOT a lambda function or ternary expression
  let parseResult: BinaryTreeResult | null = null;
  if (!isLambdaExpression && !isTernaryExpression) {
    parseResult = this.binaryTreeParser.parseExpression(expression);
    if (!parseResult.success) {
      return {
        success: false,
        error: parseResult.error || 'Parse error'
      };
    }
  }
    
      // Analyze return type
      const returnType = this.typeAnalyzer.analyzeExpressionReturnType(expression);
      
      // Get used variables
      const usedVariables = this.variableManager.extractUsedVariables(expression);
    
      const result: ExpressionResult = {
        success: true,
        returnType: returnType,
        binaryTree: parseResult || undefined,  // Only include if available
        usedVariables: usedVariables,
        isLambdaExpression: isLambdaExpression
      };
    
      // Add type validation if config is provided
      if (config) {
        const typeValidation = this.validator.validateExpressionType(expression, returnType, config);
        result.typeValidation = typeValidation;
      }
    
      return result;
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown analysis error'
      };
    }
  }

  private isLambdaFunction(expression: string): boolean {
    // Detect lambda function
    return /^\s*(\([^)]*\)|\w+)\s*=>\s*.+/.test(expression.trim());
  }

  getAssignmentConfig(): ExpressionEditorConfig {
    return this.configurationService.getAssignmentConfig();
  }

  getLimitedConnectorConfig(allowDivision: boolean = false): ExpressionEditorConfig {
    return this.configurationService.getLimitedConnectorConfig(allowDivision);
  }

  getBooleanConfig(): ExpressionEditorConfig {
    return this.configurationService.getBooleanConfig();
  }

  getArithmeticConfig(): ExpressionEditorConfig {
    return this.configurationService.getArithmeticConfig();
  }

  getConnectorConfig(): ExpressionEditorConfig {
    return this.configurationService.getConnectorConfig();
  }

  getGeneralConfig(): ExpressionEditorConfig {
    return this.configurationService.getGeneralConfig();
  }

  getPlaceholderForType(config: ExpressionEditorConfig): string {
    return this.configurationService.getPlaceholderForType(config);
  }
  private isTernaryExpression(expression: string): boolean {
    // Detect ternary/conditional expressions like: condition ? value1 : value2
    return /\?.*:/.test(expression.trim());
  }
  transformToBackend(expression: string, mappings: VariableMapping[]): string {
    let transformed = expression;
    
    // Replace frontend variable names with backend names
    mappings.forEach(mapping => {
      const regex = new RegExp(this.escapeRegex(mapping.frontendName), 'g');
      transformed = transformed.replace(regex, mapping.backendName);
    });
    
    return transformed;
  }
  
  transformToFrontend(expression: string, mappings: VariableMapping[]): string {
    let transformed = expression;
    
    // Replace backend variable names with frontend names
    mappings.forEach(mapping => {
      const regex = new RegExp(this.escapeRegex(mapping.backendName), 'g');
      transformed = transformed.replace(regex, mapping.frontendName);
    });
    
    return transformed;
  }
  
  private escapeRegex(str: string): string {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }
}
