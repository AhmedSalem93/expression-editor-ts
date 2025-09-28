import { TestBed } from '@angular/core/testing';
import { VariableManagerService } from './variable-manager.service';
import { Variable, DataType } from '../interfaces/shared.interfaces';

describe('VariableManagerService', () => {
  let service: VariableManagerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VariableManagerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('Variable Management', () => {
    it('should start with default variables', () => {
      const variables = service.getVariables();
      expect(variables.length).toBeGreaterThan(0);
      // Check for some expected default variables
      const variableNames = variables.map(v => v.name);
      expect(variableNames.length).toBeGreaterThan(0);
    });

    it('should add new variables', () => {
      const initialCount = service.getVariables().length;
      const newVariable: Variable = {
        name: 'testVar',
        value: 42,
        type: DataType.INTEGER,
        explanation: 'Test variable'
      };

      service.addVariable(newVariable);
      const variables = service.getVariables();
      
      expect(variables.length).toBe(initialCount + 1);
      expect(variables.some(v => v.name === 'testVar')).toBeTruthy();
      const addedVar = variables.find(v => v.name === 'testVar');
      expect(addedVar?.value).toBe(42);
      expect(addedVar?.type).toBe(DataType.INTEGER);
    });

    it('should update existing variables', () => {
      const variable: Variable = {
        name: 'updateTest',
        value: 10,
        type: DataType.INTEGER,
        explanation: 'Original value'
      };

      service.addVariable(variable);
      
      const updatedVariable: Variable = {
        name: 'updateTest',
        value: 20,
        type: DataType.INTEGER,
        explanation: 'Updated value'
      };

      service.addVariable(updatedVariable);
      const variables = service.getVariables();
      const found = variables.find(v => v.name === 'updateTest');
      
      expect(found?.value).toBe(20);
      expect(found?.explanation).toBe('Updated value');
    });

    it('should remove variables', () => {
      const variable: Variable = {
        name: 'toRemove',
        value: 'test',
        type: DataType.STRING,
        explanation: 'Will be removed'
      };

      service.addVariable(variable);
      expect(service.getVariables().some(v => v.name === 'toRemove')).toBeTruthy();

      service.removeVariable('toRemove');
      expect(service.getVariables().some(v => v.name === 'toRemove')).toBeFalsy();
    });

    it('should not remove non-existent variables', () => {
      const initialCount = service.getVariables().length;
      service.removeVariable('nonExistent');
      expect(service.getVariables().length).toBe(initialCount);
    });
  });

  describe('Variable Retrieval', () => {
    it('should get variable by name', () => {
      const variable: Variable = {
        name: 'findMe',
        value: 'found',
        type: DataType.STRING,
        explanation: 'Test variable'
      };

      service.addVariable(variable);
      const found = service.getVariable('findMe');
      
      expect(found).toBeTruthy();
      expect(found?.name).toBe('findMe');
      expect(found?.value).toBe('found');
    });

    it('should return undefined for non-existent variable', () => {
      const found = service.getVariable('doesNotExist');
      expect(found).toBeUndefined();
    });

    it('should return a copy of variables array', () => {
      const variables1 = service.getVariables();
      const variables2 = service.getVariables();
      
      expect(variables1).not.toBe(variables2); // Different array instances
      expect(variables1).toEqual(variables2); // Same content
    });
  });

  describe('extractUsedVariables', () => {
    beforeEach(() => {
      // Add some test variables
      service.addVariable({
        name: 'x',
        value: 10,
        type: DataType.REAL,
        explanation: 'X variable'
      });
      
      service.addVariable({
        name: 'y',
        value: 20,
        type: DataType.REAL,
        explanation: 'Y variable'
      });
      
      service.addVariable({
        name: 'result',
        value: 0,
        type: DataType.REAL,
        explanation: 'Result variable'
      });
    });

    it('should extract variables used in expressions', () => {
      const usedVars = service.extractUsedVariables('x + y');
      
      expect(usedVars.length).toBe(2);
      expect(usedVars.some(v => v.name === 'x')).toBeTruthy();
      expect(usedVars.some(v => v.name === 'y')).toBeTruthy();
    });

    it('should extract variables from complex expressions', () => {
      const usedVars = service.extractUsedVariables('result = x * y + 10');
      
      expect(usedVars.length).toBe(3);
      expect(usedVars.some(v => v.name === 'x')).toBeTruthy();
      expect(usedVars.some(v => v.name === 'y')).toBeTruthy();
      expect(usedVars.some(v => v.name === 'result')).toBeTruthy();
    });

    it('should not extract reserved words', () => {
      const usedVars = service.extractUsedVariables('Math.sqrt(x) + true');
      
      expect(usedVars.length).toBe(1);
      expect(usedVars[0].name).toBe('x');
      expect(usedVars.some(v => v.name === 'Math')).toBeFalsy();
      expect(usedVars.some(v => v.name === 'sqrt')).toBeFalsy();
      expect(usedVars.some(v => v.name === 'true')).toBeFalsy();
    });

    it('should not extract non-existent variables', () => {
      const usedVars = service.extractUsedVariables('nonExistent + anotherNonExistent');
      
      expect(usedVars.length).toBe(0);
    });

    it('should not duplicate variables in result', () => {
      const usedVars = service.extractUsedVariables('x + x * x');
      
      expect(usedVars.length).toBe(1);
      expect(usedVars[0].name).toBe('x');
    });

    it('should handle empty expressions', () => {
      const usedVars = service.extractUsedVariables('');
      expect(usedVars.length).toBe(0);
    });

    it('should handle expressions with no variables', () => {
      const usedVars = service.extractUsedVariables('42 + 3.14');
      expect(usedVars.length).toBe(0);
    });
  });

  describe('Reserved Words Detection', () => {
    it('should not extract Math functions as variables', () => {
      service.addVariable({
        name: 'value',
        value: 16,
        type: DataType.REAL,
        explanation: 'Test value'
      });

      const usedVars = service.extractUsedVariables('Math.sqrt(value)');
      
      expect(usedVars.length).toBe(1);
      expect(usedVars[0].name).toBe('value');
    });

    it('should not extract boolean literals as variables', () => {
      service.addVariable({
        name: 'condition',
        value: true,
        type: DataType.BOOLEAN,
        explanation: 'Test condition'
      });

      const usedVars = service.extractUsedVariables('condition && true');
      
      expect(usedVars.length).toBe(1);
      expect(usedVars[0].name).toBe('condition');
    });

    it('should not extract JavaScript keywords as variables', () => {
      service.addVariable({
        name: 'myVar',
        value: 10,
        type: DataType.INTEGER,
        explanation: 'My variable'
      });

      const usedVars = service.extractUsedVariables('function test() { return myVar; }');
      
      expect(usedVars.length).toBe(1);
      expect(usedVars[0].name).toBe('myVar');
    });
  });

  describe('Variable Types', () => {
    it('should handle different variable types', () => {
      const intVar: Variable = {
        name: 'intVar',
        value: 42,
        type: DataType.INTEGER,
        explanation: 'Integer variable'
      };

      const stringVar: Variable = {
        name: 'stringVar',
        value: 'hello',
        type: DataType.STRING,
        explanation: 'String variable'
      };

      const boolVar: Variable = {
        name: 'boolVar',
        value: true,
        type: DataType.BOOLEAN,
        explanation: 'Boolean variable'
      };

      service.addVariable(intVar);
      service.addVariable(stringVar);
      service.addVariable(boolVar);

      expect(service.getVariable('intVar')?.type).toBe(DataType.INTEGER);
      expect(service.getVariable('stringVar')?.type).toBe(DataType.STRING);
      expect(service.getVariable('boolVar')?.type).toBe(DataType.BOOLEAN);
    });

    it('should handle function type variables', () => {
      const funcVariable: Variable = {
        name: 'myFunction',
        value: '(x) => x * 2',
        type: DataType.FUNCTION,
        explanation: 'Doubles the input'
      };

      service.addVariable(funcVariable);
      const found = service.getVariable('myFunction');
      
      expect(found?.type).toBe(DataType.FUNCTION);
      expect(found?.value).toBe('(x) => x * 2');
    });
  });

  describe('Edge Cases', () => {
    it('should handle variables with special characters in names', () => {
      const variable: Variable = {
        name: 'var_with_underscores',
        value: 100,
        type: DataType.INTEGER,
        explanation: 'Variable with underscores'
      };

      service.addVariable(variable);
      const found = service.getVariable('var_with_underscores');
      
      expect(found).toBeTruthy();
      expect(found?.name).toBe('var_with_underscores');
    });

    it('should handle expressions with parentheses and operators', () => {
      service.addVariable({
        name: 'a',
        value: 5,
        type: DataType.INTEGER,
        explanation: 'A variable'
      });
      
      service.addVariable({
        name: 'b',
        value: 10,
        type: DataType.INTEGER,
        explanation: 'B variable'
      });

      const usedVars = service.extractUsedVariables('(a + b) * 2');
      
      expect(usedVars.length).toBe(2);
      expect(usedVars.some(v => v.name === 'a')).toBeTruthy();
      expect(usedVars.some(v => v.name === 'b')).toBeTruthy();
    });

    it('should handle null and undefined values gracefully', () => {
      const variable: Variable = {
        name: 'nullVar',
        value: null,
        type: DataType.STRING,
        explanation: 'Null variable'
      };

      service.addVariable(variable);
      const found = service.getVariable('nullVar');
      
      expect(found).toBeTruthy();
      expect(found?.value).toBeNull();
    });
  });
});
