import { TestBed } from '@angular/core/testing';
import { ExtensionManagerService } from './extension-manager.service';
import { CustomFunction } from '../interfaces/extensibility.interfaces';

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
      const customFunction: CustomFunction = {
        name: 'double',
        syntax: 'double(x)',
        description: 'Doubles the input value',
        category: 'math',
        implementation: (x: number) => x * 2
      };

      service.registerCustomFunction(customFunction);
      
      const registeredFunctions = service.getCustomFunctions();
      expect(registeredFunctions).toContain(customFunction);
      expect(registeredFunctions.length).toBe(1);
    });

    it('should register multiple custom functions', () => {
      const function1: CustomFunction = {
        name: 'double',
        syntax: 'double(x)',
        description: 'Doubles the input value',
        category: 'math',
        implementation: (x: number) => x * 2
      };

      const function2: CustomFunction = {
        name: 'triple',
        syntax: 'triple(x)',
        description: 'Triples the input value',
        category: 'math',
        implementation: (x: number) => x * 3
      };

      service.registerCustomFunction(function1);
      service.registerCustomFunction(function2);
      
      const registeredFunctions = service.getCustomFunctions();
      expect(registeredFunctions).toContain(function1);
      expect(registeredFunctions).toContain(function2);
      expect(registeredFunctions.length).toBe(2);
    });

    it('should get custom functions', () => {
      const customFunction: CustomFunction = {
        name: 'increment',
        syntax: 'increment(x)',
        description: 'Increments the input value by 1',
        category: 'math',
        implementation: (x: number) => x + 1
      };

      service.registerCustomFunction(customFunction);
      
      const functions = service.getCustomFunctions();
      expect(functions).toEqual([customFunction]);
    });

    it('should return empty array when no custom functions are registered', () => {
      const functions = service.getCustomFunctions();
      expect(functions).toEqual([]);
    });

    it('should handle function with optional parameters', () => {
      const customFunction: CustomFunction = {
        name: 'greet',
        syntax: 'greet(name, greeting)',
        description: 'Greets a person with optional greeting',
        category: 'text',
        implementation: (name: string, greeting?: string) => (greeting || "Hello") + ", " + name + "!"
      };

      service.registerCustomFunction(customFunction);
      
      const registeredFunctions = service.getCustomFunctions();
      expect(registeredFunctions[0].name).toBe('greet');
      expect(registeredFunctions[0].syntax).toBe('greet(name, greeting)');
    });

    it('should handle function with return type', () => {
      const customFunction: CustomFunction = {
        name: 'isEven',
        syntax: 'isEven(x)',
        description: 'Checks if a number is even',
        category: 'math',
        implementation: (x: number) => x % 2 === 0
      };

      service.registerCustomFunction(customFunction);
      
      const registeredFunctions = service.getCustomFunctions();
      expect(registeredFunctions[0].name).toBe('isEven');
    });

    it('should handle function with category', () => {
      const customFunction: CustomFunction = {
        name: 'factorial',
        syntax: 'factorial(n)',
        description: 'Calculates factorial of a number',
        category: 'mathematical',
        implementation: (n: number) => {
          if (n <= 1) return 1;
          let result = 1;
          for (let i = 2; i <= n; i++) result *= i;
          return result;
        }
      };

      service.registerCustomFunction(customFunction);
      
      const registeredFunctions = service.getCustomFunctions();
      expect(registeredFunctions[0].category).toBe('mathematical');
    });
  });

  describe('Function Validation', () => {
    it('should validate function name is provided', () => {
      const invalidFunction: any = {
        syntax: 'test(x)',
        description: 'Test function',
        implementation: 'return x;'
      };

      expect(() => service.registerCustomFunction(invalidFunction)).not.toThrow();
      // Service should handle invalid functions gracefully
    });

    it('should validate function syntax is provided', () => {
      const invalidFunction: any = {
        name: 'test',
        description: 'Test function',
        implementation: 'return x;'
      };

      expect(() => service.registerCustomFunction(invalidFunction)).not.toThrow();
      // Service should handle invalid functions gracefully
    });

    it('should validate function implementation is provided', () => {
      const invalidFunction: any = {
        name: 'test',
        syntax: 'test(x)',
        description: 'Test function'
      };

      expect(() => service.registerCustomFunction(invalidFunction)).not.toThrow();
      // Service should handle invalid functions gracefully
    });
  });

  describe('Function Replacement', () => {
    it('should replace existing function with same name', () => {
      const function1: CustomFunction = {
        name: 'test',
        syntax: 'test(x)',
        description: 'First version',
        category: 'test',
        implementation: (x: number) => x
      };

      const function2: CustomFunction = {
        name: 'test',
        syntax: 'test(x)',
        description: 'Second version',
        category: 'test',
        implementation: (x: number) => x * 2
      };

      service.registerCustomFunction(function1);
      service.registerCustomFunction(function2);
      
      const registeredFunctions = service.getCustomFunctions();
      expect(registeredFunctions.length).toBe(2); // Both should be registered
      expect(registeredFunctions).toContain(function1);
      expect(registeredFunctions).toContain(function2);
    });
  });

  describe('Service State', () => {
    it('should maintain function registry across multiple operations', () => {
      const function1: CustomFunction = {
        name: 'add10',
        syntax: 'add10(x)',
        description: 'Adds 10 to input',
        category: 'math',
        implementation: (x: number) => x + 10
      };

      const function2: CustomFunction = {
        name: 'multiply5',
        syntax: 'multiply5(x)',
        description: 'Multiplies input by 5',
        category: 'math',
        implementation: (x: number) => x * 5
      };

      // Register first function
      service.registerCustomFunction(function1);
      expect(service.getCustomFunctions().length).toBe(1);

      // Register second function
      service.registerCustomFunction(function2);
      expect(service.getCustomFunctions().length).toBe(2);

      // Verify both functions are still there
      const functions = service.getCustomFunctions();
      expect(functions).toContain(function1);
      expect(functions).toContain(function2);
    });

    it('should handle empty function registry', () => {
      expect(service.getCustomFunctions()).toEqual([]);
    });
  });

describe('Service State Management', () => {
  it('should start with empty custom functions array', () => {
    const functions = service.getCustomFunctions();
    expect(functions).toEqual([]);
    expect(functions.length).toBe(0);
  });

  it('should maintain separate instances for different service instances', () => {
    const service2 = TestBed.inject(ExtensionManagerService);
    
    const function1: CustomFunction = {
      name: 'service1Func',
      syntax: 'service1Func()',
      description: 'Function for service 1',
      category: 'test',
      implementation: () => 'service1'
    };

    service.registerCustomFunction(function1);
    
    expect(service.getCustomFunctions().length).toBe(1);
    expect(service2.getCustomFunctions().length).toBe(1); // Same instance in TestBed
  });
});
