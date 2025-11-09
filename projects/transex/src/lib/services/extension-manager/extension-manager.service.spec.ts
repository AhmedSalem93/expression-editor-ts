import { TestBed } from '@angular/core/testing';
import { ExtensionManagerService } from './extension-manager.service';
import { CustomFunction } from '../../interfaces/core/extensibility.interfaces';

describe('ExtensionManagerService', () => {
  let service: ExtensionManagerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExtensionManagerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('Custom Function Management', () => {
    it('should register a custom function', () => {
      const mockFunction: CustomFunction = {
        name: 'testFunc',
        syntax: 'testFunc(x)',
        description: 'Test function',
        category: 'test'
      };

      service.registerCustomFunction(mockFunction);
      const functions = service.getCustomFunctions();
      expect(functions).toContain(mockFunction);
    });

    it('should get all custom functions', () => {
      const mockFunction1: CustomFunction = {
        name: 'func1',
        syntax: 'func1(x)',
        description: 'Function 1',
        category: 'test'
      };

      const mockFunction2: CustomFunction = {
        name: 'func2',
        syntax: 'func2(x)',
        description: 'Function 2',
        category: 'test'
      };

      service.registerCustomFunction(mockFunction1);
      service.registerCustomFunction(mockFunction2);

      const functions = service.getCustomFunctions();
      expect(functions.length).toBe(2);
      expect(functions).toContain(mockFunction1);
      expect(functions).toContain(mockFunction2);
    });

    it('should handle empty function list', () => {
      const functions = service.getCustomFunctions();
      expect(functions).toEqual([]);
    });

    it('should not register duplicate functions', () => {
      const mockFunction: CustomFunction = {
        name: 'duplicateFunc',
        syntax: 'duplicateFunc(x)',
        description: 'Duplicate function',
        category: 'test'
      };

      service.registerCustomFunction(mockFunction);
      service.registerCustomFunction(mockFunction);

      const functions = service.getCustomFunctions();
      expect(functions.length).toBe(1);
    });

    it('should register functions with different categories', () => {
      const mathFunction: CustomFunction = {
        name: 'square',
        syntax: 'square(x)',
        description: 'Square a number',
        category: 'math'
      };

      const stringFunction: CustomFunction = {
        name: 'uppercase',
        syntax: 'uppercase(str)',
        description: 'Convert to uppercase',
        category: 'string'
      };

      service.registerCustomFunction(mathFunction);
      service.registerCustomFunction(stringFunction);

      const functions = service.getCustomFunctions();
      expect(functions.length).toBe(2);
      expect(functions.some(f => f.category === 'math')).toBeTruthy();
      expect(functions.some(f => f.category === 'string')).toBeTruthy();
    });

    it('should handle functions with examples', () => {
      const functionWithExample: CustomFunction = {
        name: 'fibonacci',
        syntax: 'fibonacci(n)',
        description: 'Calculate fibonacci number',
        category: 'math',
        example: 'fibonacci(5) // returns 5'
      };

      service.registerCustomFunction(functionWithExample);
      const functions = service.getCustomFunctions();
      
      expect(functions).toContain(functionWithExample);
      expect(functions[0].example).toBe('fibonacci(5) // returns 5');
    });

    it('should preserve function metadata', () => {
      const mockFunction: CustomFunction = {
        name: 'testMetadata',
        syntax: 'testMetadata(a, b)',
        description: 'Function with metadata',
        category: 'utility',
        example: 'testMetadata(2, 3) // returns 5'
      };

      service.registerCustomFunction(mockFunction);
      const functions = service.getCustomFunctions();
      const retrievedFunction = functions[0];

      expect(retrievedFunction.name).toBe('testMetadata');
      expect(retrievedFunction.syntax).toBe('testMetadata(a, b)');
      expect(retrievedFunction.description).toBe('Function with metadata');
      expect(retrievedFunction.category).toBe('utility');
      expect(retrievedFunction.example).toBe('testMetadata(2, 3) // returns 5');
    });

    it('should return a copy of functions array', () => {
      const mockFunction: CustomFunction = {
        name: 'copyTest',
        syntax: 'copyTest(x)',
        description: 'Test function for copy',
        category: 'test'
      };

      service.registerCustomFunction(mockFunction);
      const functions1 = service.getCustomFunctions();
      const functions2 = service.getCustomFunctions();
      
      expect(functions1).not.toBe(functions2); // Different array instances
      expect(functions1).toEqual(functions2); // Same content
    });

    it('should handle functions with long descriptions', () => {
      const functionWithLongDescription: CustomFunction = {
        name: 'complexCalc',
        syntax: 'complexCalc(x, y, z)',
        description: 'This is a very long description that explains what this complex calculation function does in great detail',
        category: 'math'
      };

      service.registerCustomFunction(functionWithLongDescription);
      const functions = service.getCustomFunctions();
      
      expect(functions).toContain(functionWithLongDescription);
      expect(functions[0].description.length).toBeGreaterThan(50);
    });

    it('should handle functions without examples', () => {
      const mockFunction: CustomFunction = {
        name: 'noExample',
        syntax: 'noExample(x)',
        description: 'Function without example',
        category: 'test'
      };

      service.registerCustomFunction(mockFunction);
      const functions = service.getCustomFunctions();
      
      expect(functions).toContain(mockFunction);
      expect(functions[0].example).toBeUndefined();
    });

    it('should handle special characters in function names', () => {
      const specialFunction: CustomFunction = {
        name: 'func_with_underscore',
        syntax: 'func_with_underscore(x)',
        description: 'Function with underscore in name',
        category: 'utility'
      };

      service.registerCustomFunction(specialFunction);
      const functions = service.getCustomFunctions();
      
      expect(functions).toContain(specialFunction);
      expect(functions[0].name).toBe('func_with_underscore');
    });

    it('should handle functions with multiple parameters in syntax', () => {
      const multiParamFunction: CustomFunction = {
        name: 'multiParam',
        syntax: 'multiParam(a, b, c, d)',
        description: 'Function with multiple parameters',
        category: 'utility'
      };

      service.registerCustomFunction(multiParamFunction);
      const functions = service.getCustomFunctions();
      
      expect(functions).toContain(multiParamFunction);
      expect(functions[0].syntax).toContain('a, b, c, d');
    });

    it('should handle empty category', () => {
      const emptyCategoryFunction: CustomFunction = {
        name: 'emptyCategory',
        syntax: 'emptyCategory(x)',
        description: 'Function with empty category',
        category: ''
      };

      service.registerCustomFunction(emptyCategoryFunction);
      const functions = service.getCustomFunctions();
      
      expect(functions).toContain(emptyCategoryFunction);
      expect(functions[0].category).toBe('');
    });
  });
});
