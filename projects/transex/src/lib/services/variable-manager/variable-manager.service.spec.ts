import { TestBed } from '@angular/core/testing';
import { VariableManagerService } from './variable-manager.service';
import { DataType, Variable } from '../../interfaces/shared.interfaces';

describe('VariableManagerService', () => {
  let service: VariableManagerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VariableManagerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initialize with default variables', () => {
    const variables = service.getVariables();
    expect(variables.length).toBeGreaterThan(0);
    expect(variables.some(v => v.name === 'input')).toBeTruthy();
  });

  it('should add and retrieve variables', () => {
    const variable: Variable = {
      name: 'test',
      value: 42,
      type: DataType.INTEGER,
      explanation: 'Test'
    };

    service.addVariable(variable);
    expect(service.getVariable('test')).toEqual(variable);
    expect(service.getVariables()).toContain(variable);
  });

  it('should remove variables', () => {
    const variable: Variable = {
      name: 'remove',
      value: 'test',
      type: DataType.STRING,
      explanation: 'Remove me'
    };

    service.addVariable(variable);
    expect(service.getVariable('remove')).toEqual(variable);

    service.removeVariable('remove');
    expect(service.getVariable('remove')).toBeUndefined();
  });

  it('should update existing variables', () => {
    const original: Variable = { name: 'update', value: 1, type: DataType.INTEGER, explanation: 'Original' };
    const updated: Variable = { name: 'update', value: 2, type: DataType.INTEGER, explanation: 'Updated' };

    service.addVariable(original);
    expect(service.getVariable('update')?.value).toBe(1);

    service.addVariable(updated);
    expect(service.getVariable('update')?.value).toBe(2);
  });

  it('should handle all data types', () => {
    const vars = [
      { name: 'int', value: 42, type: DataType.INTEGER, explanation: 'Integer' },
      { name: 'real', value: 3.14, type: DataType.REAL, explanation: 'Real' },
      { name: 'str', value: 'hello', type: DataType.STRING, explanation: 'String' },
      { name: 'bool', value: true, type: DataType.BOOLEAN, explanation: 'Boolean' },
      { name: 'func', value: '(x) => x', type: DataType.FUNCTION, explanation: 'Function' }
    ];

    vars.forEach(v => service.addVariable(v));
    vars.forEach(v => expect(service.getVariable(v.name)?.type).toBe(v.type));
  });

  it('should extract used variables from expressions', () => {
    service.addVariable({ name: 'x', value: 10, type: DataType.INTEGER, explanation: 'X' });
    service.addVariable({ name: 'y', value: 20, type: DataType.INTEGER, explanation: 'Y' });

    const usedVars = service.extractUsedVariables('x + y * 2');
    expect(usedVars.length).toBe(2);
    expect(usedVars.some(v => v.name === 'x')).toBeTruthy();
    expect(usedVars.some(v => v.name === 'y')).toBeTruthy();
  });

  it('should handle empty expressions', () => {
    expect(service.extractUsedVariables('').length).toBe(0);
    expect(service.extractUsedVariables('2 + 3').length).toBe(0);
  });

  it('should handle non-existent variables gracefully', () => {
    expect(service.getVariable('nonExistent')).toBeUndefined();
    service.removeVariable('nonExistent'); // Should not throw
  });

  it('should handle edge cases', () => {
    const edgeCases = [
      { name: '', value: 'empty', type: DataType.STRING, explanation: 'Empty name' },
      { name: 'null', value: null, type: DataType.STRING, explanation: 'Null value' },
      { name: 'undefined', value: undefined, type: DataType.STRING, explanation: 'Undefined value' }
    ];

    edgeCases.forEach(v => {
      service.addVariable(v);
      expect(service.getVariable(v.name)).toEqual(v);
    });
  });
});
