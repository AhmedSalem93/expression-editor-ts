import { TestBed } from '@angular/core/testing';
import { ExpressionEvaluatorService } from './expression-evaluator.service';
import { TypeAnalyzerService } from './type-analyzer.service';
import { ValidationService } from './validation.service';
import { VariableManagerService } from './variable-manager.service';
import { DataType, ContextType, Variable } from '../interfaces/shared.interfaces';

describe('ExpressionEvaluatorService', () => {
  let service: ExpressionEvaluatorService;
  let typeAnalyzerSpy: jasmine.SpyObj<TypeAnalyzerService>;
  let validationSpy: jasmine.SpyObj<ValidationService>;
  let variableManagerSpy: jasmine.SpyObj<VariableManagerService>;

  beforeEach(() => {
    const typeAnalyzerSpyObj = jasmine.createSpyObj('TypeAnalyzerService', ['analyzeExpressionReturnType']);
    const validationSpyObj = jasmine.createSpyObj('ValidationService', ['validateExpressionType']);
    const variableManagerSpyObj = jasmine.createSpyObj('VariableManagerService', [
      'addVariable', 'removeVariable', 'getVariables', 'getVariable', 'extractUsedVariables'
    ]);

    TestBed.configureTestingModule({
      providers: [
        ExpressionEvaluatorService,
        { provide: TypeAnalyzerService, useValue: typeAnalyzerSpyObj },
        { provide: ValidationService, useValue: validationSpyObj },
        { provide: VariableManagerService, useValue: variableManagerSpyObj }
      ]
    });

    service = TestBed.inject(ExpressionEvaluatorService);
    typeAnalyzerSpy = TestBed.inject(TypeAnalyzerService) as jasmine.SpyObj<TypeAnalyzerService>;
    validationSpy = TestBed.inject(ValidationService) as jasmine.SpyObj<ValidationService>;
    variableManagerSpy = TestBed.inject(VariableManagerService) as jasmine.SpyObj<VariableManagerService>;

    // Setup default spy returns
    typeAnalyzerSpy.analyzeExpressionReturnType.and.returnValue(DataType.REAL);
    variableManagerSpy.extractUsedVariables.and.returnValue([]);
    variableManagerSpy.getVariable.and.returnValue(undefined);
    variableManagerSpy.getVariables.and.returnValue([]);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('identifyExpressionType', () => {
    it('should return error for empty expression', () => {
      const result = service.identifyExpressionType('');
      expect(result.success).toBeFalsy();
      expect(result.error).toBe('Expression is empty');
    });

    it('should return error for null expression', () => {
      const result = service.identifyExpressionType(null as any);
      expect(result.success).toBeFalsy();
      expect(result.error).toBe('Expression is empty');
    });

    it('should identify simple arithmetic expressions', () => {
      typeAnalyzerSpy.analyzeExpressionReturnType.and.returnValue(DataType.INTEGER);
      
      const result = service.identifyExpressionType('2 + 3');
      expect(result.success).toBeTruthy();
      expect(result.returnType).toBe(DataType.INTEGER);
      expect(typeAnalyzerSpy.analyzeExpressionReturnType).toHaveBeenCalledWith('2 + 3');
    });

    it('should identify boolean expressions', () => {
      typeAnalyzerSpy.analyzeExpressionReturnType.and.returnValue(DataType.BOOLEAN);
      
      const result = service.identifyExpressionType('true');
      expect(result.success).toBeTruthy();
      expect(result.returnType).toBe(DataType.BOOLEAN);
    });

    it('should identify assignment expressions', () => {
      typeAnalyzerSpy.analyzeExpressionReturnType.and.returnValue(DataType.ASSIGNMENT);
      
      const result = service.identifyExpressionType('x = 5');
      expect(result.success).toBeTruthy();
      expect(result.returnType).toBe(DataType.ASSIGNMENT);
    });

    it('should identify lambda expressions', () => {
      typeAnalyzerSpy.analyzeExpressionReturnType.and.returnValue(DataType.FUNCTION);
      
      const result = service.identifyExpressionType('(x) => x * 2');
      expect(result.success).toBeTruthy();
      expect(result.returnType).toBe(DataType.FUNCTION);
      expect(result.isLambdaExpression).toBeTruthy();
    });

    it('should include type validation when config is provided', () => {
      const config = service.getBooleanConfig();
      const mockValidation = {
        isValid: true,
        message: 'Valid',
        expectedType: DataType.BOOLEAN,
        contextType: ContextType.BOOLEAN
      };
      
      typeAnalyzerSpy.analyzeExpressionReturnType.and.returnValue(DataType.BOOLEAN);
      validationSpy.validateExpressionType.and.returnValue(mockValidation);
      
      const result = service.identifyExpressionType('true', config);
      expect(result.success).toBeTruthy();
      expect(result.typeValidation).toBe(mockValidation);
      expect(validationSpy.validateExpressionType).toHaveBeenCalledWith('true', DataType.BOOLEAN, config);
    });

    it('should extract used variables', () => {
      const mockVariables: Variable[] = [
        { name: 'x', value: 10, type: DataType.REAL, explanation: 'Test variable' }
      ];
      variableManagerSpy.extractUsedVariables.and.returnValue(mockVariables);
      
      const result = service.identifyExpressionType('x + 5');
      expect(result.success).toBeTruthy();
      expect(result.usedVariables).toBe(mockVariables);
      expect(variableManagerSpy.extractUsedVariables).toHaveBeenCalledWith('x + 5');
    });

    it('should handle analysis errors gracefully', () => {
      typeAnalyzerSpy.analyzeExpressionReturnType.and.throwError('Analysis error');
      
      const result = service.identifyExpressionType('invalid expression');
      expect(result.success).toBeFalsy();
      expect(result.error).toBe('Analysis error');
    });

    it('should identify function variables as lambda expressions', () => {
      const mockFunctionVariable: Variable = {
        name: 'myFunc',
        value: '(x) => x * 2',
        type: DataType.FUNCTION,
        explanation: 'Function variable'
      };
      variableManagerSpy.getVariable.and.returnValue(mockFunctionVariable);
      
      const result = service.identifyExpressionType('myFunc');
      expect(result.success).toBeTruthy();
      expect(result.isLambdaExpression).toBeTruthy();
    });
  });

  describe('Variable Management Delegation', () => {
    it('should delegate addVariable to VariableManagerService', () => {
      const variable: Variable = {
        name: 'test',
        value: 42,
        type: DataType.INTEGER,
        explanation: 'Test variable'
      };
      
      service.addVariable(variable);
      expect(variableManagerSpy.addVariable).toHaveBeenCalledWith(variable);
    });

    it('should delegate removeVariable to VariableManagerService', () => {
      service.removeVariable('test');
      expect(variableManagerSpy.removeVariable).toHaveBeenCalledWith('test');
    });

    it('should delegate getVariables to VariableManagerService', () => {
      const mockVariables: Variable[] = [
        { name: 'x', value: 10, type: DataType.REAL, explanation: 'X variable' }
      ];
      variableManagerSpy.getVariables.and.returnValue(mockVariables);
      
      const result = service.getVariables();
      expect(result).toBe(mockVariables);
      expect(variableManagerSpy.getVariables).toHaveBeenCalled();
    });

    it('should delegate getVariable to VariableManagerService', () => {
      const mockVariable: Variable = {
        name: 'test',
        value: 42,
        type: DataType.INTEGER,
        explanation: 'Test variable'
      };
      variableManagerSpy.getVariable.and.returnValue(mockVariable);
      
      const result = service.getVariable('test');
      expect(result).toBe(mockVariable);
      expect(variableManagerSpy.getVariable).toHaveBeenCalledWith('test');
    });
  });

  describe('Configuration Methods', () => {
    it('should return boolean configuration', () => {
      const config = service.getBooleanConfig();
      expect(config.expectedResultType).toBe(DataType.BOOLEAN);
      expect(config.contextType).toBe(ContextType.BOOLEAN);
      expect(config.strictValidation).toBeTruthy();
      expect(config.title).toContain('Boolean');
      expect(config.examples).toBeDefined();
      expect(config.examples!.length).toBeGreaterThan(0);
    });

    it('should return assignment configuration', () => {
      const config = service.getAssignmentConfig();
      expect(config.expectedResultType).toBe(DataType.ASSIGNMENT);
      expect(config.contextType).toBe(ContextType.ASSIGNMENT);
      expect(config.strictValidation).toBeTruthy();
      expect(config.title).toContain('Assignment');
      expect(config.examples).toBeDefined();
    });

    it('should return arithmetic configuration', () => {
      const config = service.getArithmeticConfig();
      expect(config.expectedResultType).toBe(DataType.REAL);
      expect(config.contextType).toBe(ContextType.ARITHMETIC);
      expect(config.strictValidation).toBeTruthy();
      expect(config.title).toContain('Arithmetic');
      expect(config.examples).toBeDefined();
    });

    it('should return limited connector configuration with division disabled', () => {
      const config = service.getLimitedConnectorConfig(false);
      expect(config.expectedResultType).toBe(DataType.REAL);
      expect(config.contextType).toBe(ContextType.LIMITED_CONNECTOR);
      expect(config.allowDivision).toBeFalsy();
      expect(config.description).toContain('division disabled');
      expect(config.examples).toBeDefined();
      expect(config.examples!.some(ex => ex.includes('/'))).toBeFalsy();
    });

    it('should return limited connector configuration with division enabled', () => {
      const config = service.getLimitedConnectorConfig(true);
      expect(config.allowDivision).toBeTruthy();
      expect(config.description).toContain('+, -, *, /');
      expect(config.examples!.some(ex => ex.includes('/'))).toBeTruthy();
    });

    it('should return connector configuration (alias for assignment)', () => {
      const config = service.getConnectorConfig();
      const assignmentConfig = service.getAssignmentConfig();
      expect(config).toEqual(assignmentConfig);
    });

    it('should return general configuration', () => {
      const config = service.getGeneralConfig();
      expect(config.expectedResultType).toBe(DataType.REAL);
      expect(config.contextType).toBe(ContextType.GENERAL);
      expect(config.strictValidation).toBeFalsy();
      expect(config.title).toContain('General');
    });
  });

  describe('getPlaceholderForType', () => {
    it('should return boolean placeholder', () => {
      const config = service.getBooleanConfig();
      const placeholder = service.getPlaceholderForType(config);
      expect(placeholder).toContain('boolean condition');
    });

    it('should return assignment placeholder', () => {
      const config = service.getAssignmentConfig();
      const placeholder = service.getPlaceholderForType(config);
      expect(placeholder).toContain('assignment');
    });

    it('should return arithmetic placeholder', () => {
      const config = service.getArithmeticConfig();
      const placeholder = service.getPlaceholderForType(config);
      expect(placeholder).toContain('mathematical expression');
    });

    it('should return limited connector placeholder', () => {
      const config = service.getLimitedConnectorConfig();
      const placeholder = service.getPlaceholderForType(config);
      expect(placeholder).toContain('arithmetic expression');
    });

    it('should return general placeholder', () => {
      const config = service.getGeneralConfig();
      const placeholder = service.getPlaceholderForType(config);
      expect(placeholder).toContain('Enter your expression here');
    });

    it('should return default placeholder for unknown context', () => {
      const config = {
        expectedResultType: DataType.REAL,
        contextType: 'unknown' as any,
        strictValidation: false
      };
      const placeholder = service.getPlaceholderForType(config);
      expect(placeholder).toBe('Enter your expression here...');
    });
  });

  describe('Lambda Function Detection', () => {
    it('should detect arrow function with parentheses', () => {
      const result = service.identifyExpressionType('(x, y) => x + y');
      expect(result.isLambdaExpression).toBeTruthy();
    });

    it('should detect arrow function without parentheses', () => {
      const result = service.identifyExpressionType('x => x * 2');
      expect(result.isLambdaExpression).toBeTruthy();
    });

    it('should not detect regular expressions as lambda functions', () => {
      const result = service.identifyExpressionType('x + y');
      expect(result.isLambdaExpression).toBeFalsy();
    });
  });

  describe('Edge Cases', () => {
    it('should handle whitespace-only expressions', () => {
      const result = service.identifyExpressionType('   \t\n   ');
      expect(result.success).toBeFalsy();
      expect(result.error).toBe('Expression is empty');
    });

    it('should handle expressions with only whitespace', () => {
      const result = service.identifyExpressionType('     ');
      expect(result.success).toBeFalsy();
    });

    it('should handle undefined expression', () => {
      const result = service.identifyExpressionType(undefined as any);
      expect(result.success).toBeFalsy();
      expect(result.error).toBe('Expression is empty');
    });
  });
});
