import { TestBed } from '@angular/core/testing';
import { ExpressionEvaluatorService } from './expression-evaluator.service';
import { TypeAnalyzerService } from '../type-analyzer/type-analyzer.service';
import { ValidationService } from '../validation/validation.service';
import { VariableManagerService } from '../variable-manager/variable-manager.service';
import { BinaryTreeParserService } from '../binary-tree-parser/binary-tree-parser.service';
import { ConfigurationService } from '../configuration/configuration.service';
import { DataType, ContextType, Variable, ExpressionEditorConfig } from '../../interfaces/shared.interfaces';

describe('ExpressionEvaluatorService', () => {
  let service: ExpressionEvaluatorService;
  let typeAnalyzerSpy: jasmine.SpyObj<TypeAnalyzerService>;
  let validationSpy: jasmine.SpyObj<ValidationService>;
  let variableManagerSpy: jasmine.SpyObj<VariableManagerService>;
  let binaryTreeParserSpy: jasmine.SpyObj<BinaryTreeParserService>;
  let configurationSpy: jasmine.SpyObj<ConfigurationService>;

  beforeEach(() => {
    typeAnalyzerSpy = jasmine.createSpyObj('TypeAnalyzerService', ['analyzeExpressionReturnType']);
    validationSpy = jasmine.createSpyObj('ValidationService', ['validateExpressionType']);
    variableManagerSpy = jasmine.createSpyObj('VariableManagerService', [
      'addVariable', 'removeVariable', 'getVariables', 'getVariable', 'extractUsedVariables'
    ]);
    binaryTreeParserSpy = jasmine.createSpyObj('BinaryTreeParserService', ['parseExpression']);
    configurationSpy = jasmine.createSpyObj('ConfigurationService', [
      'getAssignmentConfig', 'getBooleanConfig', 'getArithmeticConfig', 
      'getGeneralConfig', 'getLimitedConnectorConfig', 'getConnectorConfig', 'getPlaceholderForType'
    ]);

    TestBed.configureTestingModule({
      providers: [
        ExpressionEvaluatorService,
        { provide: TypeAnalyzerService, useValue: typeAnalyzerSpy },
        { provide: ValidationService, useValue: validationSpy },
        { provide: VariableManagerService, useValue: variableManagerSpy },
        { provide: BinaryTreeParserService, useValue: binaryTreeParserSpy },
        { provide: ConfigurationService, useValue: configurationSpy }
      ]
    });

    service = TestBed.inject(ExpressionEvaluatorService);
  });

  describe('Service Creation', () => {
    it('should be created', () => {
      expect(service).toBeTruthy();
    });
  });

  describe('Variable Management', () => {
    it('should add variable through VariableManagerService', () => {
      const variable: Variable = {
        name: 'test',
        value: 42,
        type: DataType.INTEGER,
        explanation: 'Test variable'
      };

      service.addVariable(variable);
      expect(variableManagerSpy.addVariable).toHaveBeenCalledWith(variable);
    });

    it('should remove variable through VariableManagerService', () => {
      service.removeVariable('testVar');
      expect(variableManagerSpy.removeVariable).toHaveBeenCalledWith('testVar');
    });

    it('should get variables through VariableManagerService', () => {
      const mockVariables: Variable[] = [
        { name: 'x', value: 10, type: DataType.REAL, explanation: 'X variable' }
      ];
      variableManagerSpy.getVariables.and.returnValue(mockVariables);

      const result = service.getVariables();
      expect(result).toBe(mockVariables);
      expect(variableManagerSpy.getVariables).toHaveBeenCalled();
    });

    it('should get single variable through VariableManagerService', () => {
      const mockVariable: Variable = { name: 'x', value: 10, type: DataType.REAL, explanation: 'X variable' };
      variableManagerSpy.getVariable.and.returnValue(mockVariable);

      const result = service.getVariable('x');
      expect(result).toBe(mockVariable);
      expect(variableManagerSpy.getVariable).toHaveBeenCalledWith('x');
    });
  });

  describe('Expression Type Identification', () => {
    it('should return error for empty expression', () => {
      const result = service.identifyExpressionType('');
      expect(result.success).toBeFalsy();
      expect(result.error).toBe('Expression is empty');
    });

    it('should return error for whitespace-only expression', () => {
      const result = service.identifyExpressionType('   ');
      expect(result.success).toBeFalsy();
      expect(result.error).toBe('Expression is empty');
    });

    it('should return error when parsing fails', () => {
      binaryTreeParserSpy.parseExpression.and.returnValue({
        success: false,
        error: 'Parse error'
      });

      const result = service.identifyExpressionType('invalid(');
      expect(result.success).toBeFalsy();
      expect(result.error).toBe('Parse error');
    });

    it('should successfully identify arithmetic expressions', () => {
      binaryTreeParserSpy.parseExpression.and.returnValue({
        success: true,
        tree: { type: 'operator', value: '+', left: { type: 'literal', value: 2 }, right: { type: 'literal', value: 3 } }
      });
      typeAnalyzerSpy.analyzeExpressionReturnType.and.returnValue(DataType.INTEGER);
      variableManagerSpy.extractUsedVariables.and.returnValue([]);

      const result = service.identifyExpressionType('2 + 3');
      expect(result.success).toBeTruthy();
      expect(result.returnType).toBe(DataType.INTEGER);
      expect(result.binaryTree).toBeDefined();
      expect(result.usedVariables).toEqual([]);
      expect(result.isLambdaExpression).toBeFalsy();
    });

    it('should identify lambda expressions', () => {
      binaryTreeParserSpy.parseExpression.and.returnValue({
        success: true,
        tree: { type: 'function', value: '=>' }
      });
      typeAnalyzerSpy.analyzeExpressionReturnType.and.returnValue(DataType.FUNCTION);
      variableManagerSpy.extractUsedVariables.and.returnValue([]);

      const result = service.identifyExpressionType('(x) => x * 2');
      expect(result.success).toBeTruthy();
      expect(result.returnType).toBe(DataType.FUNCTION);
      expect(result.isLambdaExpression).toBeTruthy();
    });

    it('should include type validation when config is provided', () => {
      const config: ExpressionEditorConfig = {
        expectedResultType: DataType.BOOLEAN,
        contextType: ContextType.BOOLEAN,
        strictValidation: true,
        title: 'Test',
        description: 'Test',
        placeholder: 'Test',
        examples: []
      };

      const mockValidation = {
        isValid: true,
        message: 'Valid boolean expression',
        expectedType: DataType.BOOLEAN,
        contextType: ContextType.BOOLEAN
      };

      binaryTreeParserSpy.parseExpression.and.returnValue({ 
        success: true, 
        tree: { type: 'literal', value: true } 
      });
      typeAnalyzerSpy.analyzeExpressionReturnType.and.returnValue(DataType.BOOLEAN);
      variableManagerSpy.extractUsedVariables.and.returnValue([]);
      validationSpy.validateExpressionType.and.returnValue(mockValidation);

      const result = service.identifyExpressionType('true', config);
      expect(result.success).toBeTruthy();
      expect(result.typeValidation).toBe(mockValidation);
      expect(validationSpy.validateExpressionType).toHaveBeenCalledWith('true', DataType.BOOLEAN, config);
    });

    it('should handle exceptions during analysis', () => {
      binaryTreeParserSpy.parseExpression.and.throwError('Unexpected error');

      const result = service.identifyExpressionType('error');
      expect(result.success).toBeFalsy();
      expect(result.error).toBe('Unexpected error');
    });

    it('should handle non-Error exceptions', () => {
      binaryTreeParserSpy.parseExpression.and.callFake(() => {
        throw 'String error';
      });

      const result = service.identifyExpressionType('error');
      expect(result.success).toBeFalsy();
      expect(result.error).toBe('Unknown analysis error');
    });
  });

  describe('Lambda Function Detection', () => {
    it('should detect arrow function with parentheses', () => {
      binaryTreeParserSpy.parseExpression.and.returnValue({ 
        success: true, 
        tree: { type: 'literal', value: 'test' } 
      });
      typeAnalyzerSpy.analyzeExpressionReturnType.and.returnValue(DataType.FUNCTION);
      variableManagerSpy.extractUsedVariables.and.returnValue([]);

      const result = service.identifyExpressionType('(x, y) => x + y');
      expect(result.isLambdaExpression).toBeTruthy();
    });

    it('should detect arrow function without parentheses', () => {
      binaryTreeParserSpy.parseExpression.and.returnValue({ 
        success: true, 
        tree: { type: 'literal', value: 'test' } 
      });
      typeAnalyzerSpy.analyzeExpressionReturnType.and.returnValue(DataType.FUNCTION);
      variableManagerSpy.extractUsedVariables.and.returnValue([]);

      const result = service.identifyExpressionType('x => x * 2');
      expect(result.isLambdaExpression).toBeTruthy();
    });

    it('should not detect non-lambda expressions as lambda', () => {
      binaryTreeParserSpy.parseExpression.and.returnValue({ 
        success: true, 
        tree: { type: 'literal', value: 'test' } 
      });
      typeAnalyzerSpy.analyzeExpressionReturnType.and.returnValue(DataType.INTEGER);
      variableManagerSpy.extractUsedVariables.and.returnValue([]);

      const result = service.identifyExpressionType('2 + 3');
      expect(result.isLambdaExpression).toBeFalsy();
    });
  });

  describe('Configuration Delegation', () => {
    it('should delegate getAssignmentConfig', () => {
      const mockConfig = { expectedResultType: DataType.ASSIGNMENT } as ExpressionEditorConfig;
      configurationSpy.getAssignmentConfig.and.returnValue(mockConfig);

      const result = service.getAssignmentConfig();
      expect(result).toBe(mockConfig);
      expect(configurationSpy.getAssignmentConfig).toHaveBeenCalled();
    });

    it('should delegate getBooleanConfig', () => {
      const mockConfig = { expectedResultType: DataType.BOOLEAN } as ExpressionEditorConfig;
      configurationSpy.getBooleanConfig.and.returnValue(mockConfig);

      const result = service.getBooleanConfig();
      expect(result).toBe(mockConfig);
      expect(configurationSpy.getBooleanConfig).toHaveBeenCalled();
    });

    it('should delegate getArithmeticConfig', () => {
      const mockConfig = { expectedResultType: DataType.REAL } as ExpressionEditorConfig;
      configurationSpy.getArithmeticConfig.and.returnValue(mockConfig);

      const result = service.getArithmeticConfig();
      expect(result).toBe(mockConfig);
      expect(configurationSpy.getArithmeticConfig).toHaveBeenCalled();
    });

    it('should delegate getGeneralConfig', () => {
      const mockConfig = { expectedResultType: DataType.REAL } as ExpressionEditorConfig;
      configurationSpy.getGeneralConfig.and.returnValue(mockConfig);

      const result = service.getGeneralConfig();
      expect(result).toBe(mockConfig);
      expect(configurationSpy.getGeneralConfig).toHaveBeenCalled();
    });

    it('should delegate getConnectorConfig', () => {
      const mockConfig = { expectedResultType: DataType.ASSIGNMENT } as ExpressionEditorConfig;
      configurationSpy.getConnectorConfig.and.returnValue(mockConfig);

      const result = service.getConnectorConfig();
      expect(result).toBe(mockConfig);
      expect(configurationSpy.getConnectorConfig).toHaveBeenCalled();
    });

    it('should delegate getLimitedConnectorConfig with default parameter', () => {
      const mockConfig = { expectedResultType: DataType.REAL } as ExpressionEditorConfig;
      configurationSpy.getLimitedConnectorConfig.and.returnValue(mockConfig);

      const result = service.getLimitedConnectorConfig();
      expect(result).toBe(mockConfig);
      expect(configurationSpy.getLimitedConnectorConfig).toHaveBeenCalledWith(false);
    });

    it('should delegate getLimitedConnectorConfig with custom parameter', () => {
      const mockConfig = { expectedResultType: DataType.REAL } as ExpressionEditorConfig;
      configurationSpy.getLimitedConnectorConfig.and.returnValue(mockConfig);

      const result = service.getLimitedConnectorConfig(true);
      expect(result).toBe(mockConfig);
      expect(configurationSpy.getLimitedConnectorConfig).toHaveBeenCalledWith(true);
    });

    it('should delegate getPlaceholderForType', () => {
      const mockConfig = { contextType: ContextType.BOOLEAN } as ExpressionEditorConfig;
      const mockPlaceholder = 'Enter boolean expression';
      configurationSpy.getPlaceholderForType.and.returnValue(mockPlaceholder);

      const result = service.getPlaceholderForType(mockConfig);
      expect(result).toBe(mockPlaceholder);
      expect(configurationSpy.getPlaceholderForType).toHaveBeenCalledWith(mockConfig);
    });
  });

  describe('Edge Cases and Error Handling', () => {
    it('should handle null expression', () => {
      const result = service.identifyExpressionType(null as any);
      expect(result.success).toBeFalsy();
      expect(result.error).toBe('Expression is empty');
    });

    it('should handle undefined expression', () => {
      const result = service.identifyExpressionType(undefined as any);
      expect(result.success).toBeFalsy();
      expect(result.error).toBe('Expression is empty');
    });

    it('should handle parse result without error message', () => {
      binaryTreeParserSpy.parseExpression.and.returnValue({
        success: false
      });

      const result = service.identifyExpressionType('invalid');
      expect(result.success).toBeFalsy();
      expect(result.error).toBe('Parse error');
    });

    it('should handle complex lambda expressions with whitespace', () => {
      binaryTreeParserSpy.parseExpression.and.returnValue({ 
        success: true, 
        tree: { type: 'literal', value: 'test' } 
      });
      typeAnalyzerSpy.analyzeExpressionReturnType.and.returnValue(DataType.FUNCTION);
      variableManagerSpy.extractUsedVariables.and.returnValue([]);

      const result = service.identifyExpressionType('  (x, y) => { return x + y; }  ');
      expect(result.isLambdaExpression).toBeTruthy();
    });
  });
});
