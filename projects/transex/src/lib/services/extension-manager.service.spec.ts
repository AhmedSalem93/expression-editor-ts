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
      const mockFunction: CustomFunction = {
        name: 'testFunc',
        syntax: 'testFunc(x)',
        description: 'Test function',
        category: 'test'
      };

      service.registerCustomFunction(mockFunction);
      const functions = service.getCustomFunctions();
      
      expect(functions.length).toBe(1);
      expect(functions[0]).toEqual(mockFunction);
    });

    it('should return empty array when no functions registered', () => {
      const functions = service.getCustomFunctions();
      expect(functions).toEqual([]);
    });

    it('should register multiple custom functions', () => {
      const mockFunction1: CustomFunction = {
        name: 'func1',
        syntax: 'func1(x)',
        description: 'First function',
        category: 'test'
      };

      const mockFunction2: CustomFunction = {
        name: 'func2',
        syntax: 'func2(x)',
        description: 'Second function',
        category: 'test'
      };

      service.registerCustomFunction(mockFunction1);
      service.registerCustomFunction(mockFunction2);
      
      const functions = service.getCustomFunctions();
      expect(functions.length).toBe(2);
      expect(functions).toContain(mockFunction1);
      expect(functions).toContain(mockFunction2);
    });

    it('should return a copy of functions array', () => {
      const mockFunction: CustomFunction = {
        name: 'testFunc',
        syntax: 'testFunc(x)',
        description: 'Test function',
        category: 'test'
      };

      service.registerCustomFunction(mockFunction);
      const functions1 = service.getCustomFunctions();
      const functions2 = service.getCustomFunctions();
      
      expect(functions1).not.toBe(functions2); // Different array instances
      expect(functions1).toEqual(functions2); // Same content
    });
  });
});
