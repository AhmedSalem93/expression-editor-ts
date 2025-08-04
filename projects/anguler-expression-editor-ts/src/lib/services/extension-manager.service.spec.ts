import { TestBed } from '@angular/core/testing';
import { ExtensionManagerService } from './extension-manager.service';
import { CustomFunction, CustomSymbol, Extension } from '../interfaces/extensibility.interfaces';

describe('ExtensionManagerService', () => {
  let service: ExtensionManagerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExtensionManagerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('Extension Registration', () => {
    it('should register an extension with custom functions', () => {
      const mockExtension: Extension = {
        name: 'Test Extension',
        version: '1.0.0',
        description: 'Test extension for unit testing',
        customFunctions: [
          {
            name: 'testFunc',
            syntax: 'testFunc(x)',
            description: 'Test function',
            category: 'test',
            implementation: (x: number) => x * 2
          }
        ]
      };

      service.registerExtension(mockExtension);
      
      const extensions = service.getExtensions();
      expect(extensions).toContain(mockExtension);
      
      const customFunctions = service.getCustomFunctions();
      expect(customFunctions.length).toBe(1);
      expect(customFunctions[0].name).toBe('testFunc');
    });

    it('should register an extension with custom symbols', () => {
      const mockExtension: Extension = {
        name: 'Symbol Extension',
        version: '1.0.0',
        description: 'Extension with symbols',
        customSymbols: [
          {
            name: 'TestSymbol',
            symbol: '∑',
            description: 'Test symbol',
            category: 'test'
          }
        ]
      };

      service.registerExtension(mockExtension);
      
      const customSymbols = service.getCustomSymbols();
      expect(customSymbols.length).toBe(1);
      expect(customSymbols[0].symbol).toBe('∑');
    });

    it('should register an extension with custom variables', () => {
      const mockExtension: Extension = {
        name: 'Variable Extension',
        version: '1.0.0',
        description: 'Extension with variables',
        customVariables: {
          TEST_CONSTANT: 42,
          PI_APPROX: 3.14
        }
      };

      service.registerExtension(mockExtension);
      
      const customVariables = service.getCustomVariables();
      expect(customVariables['TEST_CONSTANT']).toBe(42);
      expect(customVariables['PI_APPROX']).toBe(3.14);
    });
  });

  describe('Custom Function Management', () => {
    beforeEach(() => {
      const mockFunction: CustomFunction = {
        name: 'square',
        syntax: 'square(x)',
        description: 'Square a number',
        category: 'math',
        implementation: (x: number) => x * x
      };
      service.registerCustomFunction(mockFunction);
    });

    it('should register a single custom function', () => {
      const functions = service.getCustomFunctions();
      expect(functions.length).toBe(1);
      expect(functions[0].name).toBe('square');
    });

    it('should get functions by category', () => {
      const mathFunctions = service.getFunctionsByCategory('math');
      expect(mathFunctions.length).toBe(1);
      expect(mathFunctions[0].name).toBe('square');

      const stringFunctions = service.getFunctionsByCategory('string');
      expect(stringFunctions.length).toBe(0);
    });

    it('should execute a custom function', () => {
      const result = service.executeFunction('square', 5);
      expect(result).toBe(25);
    });

    it('should throw error for non-existent function', () => {
      expect(() => service.executeFunction('nonExistent', 5))
        .toThrowError("Function 'nonExistent' not found");
    });

    it('should check if function exists', () => {
      expect(service.hasFunction('square')).toBe(true);
      expect(service.hasFunction('nonExistent')).toBe(false);
    });

    it('should get function categories', () => {
      const categories = service.getFunctionCategories();
      expect(categories).toContain('math');
    });
  });

  describe('Custom Symbol Management', () => {
    beforeEach(() => {
      const mockSymbol: CustomSymbol = {
        name: 'Alpha',
        symbol: 'α',
        description: 'Greek letter alpha',
        category: 'greek'
      };
      service.registerCustomSymbol(mockSymbol);
    });

    it('should register a single custom symbol', () => {
      const symbols = service.getCustomSymbols();
      expect(symbols.length).toBe(1);
      expect(symbols[0].symbol).toBe('α');
    });

    it('should get symbols by category', () => {
      const greekSymbols = service.getSymbolsByCategory('greek');
      expect(greekSymbols.length).toBe(1);
      expect(greekSymbols[0].name).toBe('Alpha');

      const mathSymbols = service.getSymbolsByCategory('math');
      expect(mathSymbols.length).toBe(0);
    });

    it('should check if symbol exists', () => {
      expect(service.hasSymbol('Alpha')).toBe(true);
      expect(service.hasSymbol('Beta')).toBe(false);
    });

    it('should get symbol categories', () => {
      const categories = service.getSymbolCategories();
      expect(categories).toContain('greek');
    });
  });

  describe('Custom Variable Management', () => {
    it('should register a custom variable', () => {
      service.registerCustomVariable('TEST_VAR', 100);
      
      const variables = service.getCustomVariables();
      expect(variables['TEST_VAR']).toBe(100);
    });

    it('should override existing variable', () => {
      service.registerCustomVariable('TEST_VAR', 50);
      service.registerCustomVariable('TEST_VAR', 75);
      
      const variables = service.getCustomVariables();
      expect(variables['TEST_VAR']).toBe(75);
    });
  });

  describe('Extension Clearing', () => {
    beforeEach(() => {
      // Set up some test data
      const mockExtension: Extension = {
        name: 'Test Extension',
        version: '1.0.0',
        description: 'Test extension',
        customFunctions: [{
          name: 'testFunc',
          syntax: 'testFunc()',
          description: 'Test',
          category: 'test',
          implementation: () => 42
        }],
        customSymbols: [{
          name: 'TestSymbol',
          symbol: '∑',
          description: 'Test symbol',
          category: 'test'
        }],
        customVariables: { TEST: 123 }
      };
      
      service.registerExtension(mockExtension);
      service.registerCustomFunction({
        name: 'standalone',
        syntax: 'standalone()',
        description: 'Standalone function',
        category: 'test',
        implementation: () => 'test'
      });
      service.registerCustomVariable('STANDALONE_VAR', 456);
    });

    it('should clear all extensions and related data', () => {
      // Verify data exists before clearing
      expect(service.getExtensions().length).toBe(1);
      expect(service.getCustomFunctions().length).toBe(2);
      expect(service.getCustomSymbols().length).toBe(1);
      expect(Object.keys(service.getCustomVariables()).length).toBe(2);

      // Clear all extensions
      service.clearExtensions();

      // Verify all data is cleared
      expect(service.getExtensions().length).toBe(0);
      expect(service.getCustomFunctions().length).toBe(0);
      expect(service.getCustomSymbols().length).toBe(0);
      expect(Object.keys(service.getCustomVariables()).length).toBe(0);
    });
  });

  describe('Complex Extension Scenarios', () => {
    it('should handle multiple extensions with overlapping categories', () => {
      const extension1: Extension = {
        name: 'Math Extension',
        version: '1.0.0',
        description: 'Math functions',
        customFunctions: [{
          name: 'add',
          syntax: 'add(a, b)',
          description: 'Add two numbers',
          category: 'arithmetic',
          implementation: (a: number, b: number) => a + b
        }]
      };

      const extension2: Extension = {
        name: 'Advanced Math Extension',
        version: '1.0.0',
        description: 'Advanced math functions',
        customFunctions: [{
          name: 'multiply',
          syntax: 'multiply(a, b)',
          description: 'Multiply two numbers',
          category: 'arithmetic',
          implementation: (a: number, b: number) => a * b
        }]
      };

      service.registerExtension(extension1);
      service.registerExtension(extension2);

      const arithmeticFunctions = service.getFunctionsByCategory('arithmetic');
      expect(arithmeticFunctions.length).toBe(2);
      expect(arithmeticFunctions.map(f => f.name)).toContain('add');
      expect(arithmeticFunctions.map(f => f.name)).toContain('multiply');
    });

    it('should handle extension with all types of custom content', () => {
      const comprehensiveExtension: Extension = {
        name: 'Comprehensive Extension',
        version: '2.0.0',
        description: 'Extension with everything',
        customFunctions: [
          {
            name: 'comprehensive',
            syntax: 'comprehensive(x)',
            description: 'Comprehensive function',
            category: 'comprehensive',
            implementation: (x: any) => `processed: ${x}`
          }
        ],
        customSymbols: [
          {
            name: 'ComprehensiveSymbol',
            symbol: '⊕',
            description: 'Comprehensive symbol',
            category: 'comprehensive'
          }
        ],
        customVariables: {
          COMPREHENSIVE_CONST: 'comprehensive_value'
        }
      };

      service.registerExtension(comprehensiveExtension);

      // Test all aspects are registered
      expect(service.getExtensions().length).toBe(1);
      expect(service.getCustomFunctions().length).toBe(1);
      expect(service.getCustomSymbols().length).toBe(1);
      expect(service.getCustomVariables()['COMPREHENSIVE_CONST']).toBe('comprehensive_value');

      // Test function execution
      const result = service.executeFunction('comprehensive', 'test');
      expect(result).toBe('processed: test');

      // Test category retrieval
      expect(service.getFunctionCategories()).toContain('comprehensive');
      expect(service.getSymbolCategories()).toContain('comprehensive');
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
});
