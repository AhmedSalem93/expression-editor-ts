import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { CustomFunctionBuilderComponent } from './custom-function-builder.component';
import { ExtensionManagerService } from '../../services/extension-manager.service';
import { CustomFunction } from '../../interfaces/extensibility.interfaces';

describe('CustomFunctionBuilderComponent', () => {
  let component: CustomFunctionBuilderComponent;
  let fixture: ComponentFixture<CustomFunctionBuilderComponent>;
  let extensionManagerService: jasmine.SpyObj<ExtensionManagerService>;

  beforeEach(async () => {
    const extensionManagerSpy = jasmine.createSpyObj('ExtensionManagerService', [
      'registerCustomFunction',
      'getCustomFunctions'
    ]);

    await TestBed.configureTestingModule({
      imports: [FormsModule, CustomFunctionBuilderComponent],
      providers: [
        { provide: ExtensionManagerService, useValue: extensionManagerSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CustomFunctionBuilderComponent);
    component = fixture.componentInstance;
    extensionManagerService = TestBed.inject(ExtensionManagerService) as jasmine.SpyObj<ExtensionManagerService>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(component.functionName).toBe('');
    expect(component.functionDescription).toBe('');
    expect(component.functionSyntax).toBe('');
    expect(component.functionImplementation).toBe('');
    expect(component.testExpression).toBe('');
    expect(component.testResult).toBe('');
    expect(component.showTestSection).toBe(false);
  });

  it('should validate function name', () => {
    component.functionName = '';
    expect(component.isValidFunctionName()).toBe(false);

    component.functionName = 'validName';
    expect(component.isValidFunctionName()).toBe(true);

    component.functionName = '123invalid';
    expect(component.isValidFunctionName()).toBe(false);

    component.functionName = 'valid_name123';
    expect(component.isValidFunctionName()).toBe(true);
  });

  it('should validate function implementation', () => {
    component.functionImplementation = '';
    expect(component.isValidImplementation()).toBe(false);

    component.functionImplementation = 'return a + b;';
    expect(component.isValidImplementation()).toBe(true);

    component.functionImplementation = 'invalid syntax {';
    expect(component.isValidImplementation()).toBe(false);
  });

  it('should test custom function', () => {
    component.functionName = 'testAdd';
    component.functionImplementation = 'return a + b;';
    component.testExpression = 'testAdd(2, 3)';

    component.testFunction();

    expect(component.testResult).toContain('5');
  });

  it('should handle test function errors', () => {
    component.functionName = 'testError';
    component.functionImplementation = 'throw new Error("Test error");';
    component.testExpression = 'testError()';

    component.testFunction();

    expect(component.testResult).toContain('Error');
  });

  it('should create custom function successfully', () => {
    component.functionName = 'customAdd';
    component.functionDescription = 'Adds two numbers';
    component.functionSyntax = 'customAdd(a, b)';
    component.functionImplementation = 'return a + b;';

    const expectedFunction: CustomFunction = {
      name: 'customAdd',
      syntax: 'customAdd(a, b)',
      description: 'Adds two numbers',
      category: 'Custom',
      implementation: (a: number, b: number) => a + b
    };

    component.createFunction();

    expect(extensionManagerService.registerCustomFunction).toHaveBeenCalledWith(
      jasmine.objectContaining({
        name: 'customAdd',
        syntax: 'customAdd(a, b)',
        description: 'Adds two numbers',
        category: 'Custom'
      })
    );
  });

  it('should emit functionCreated event', () => {
    spyOn(component.functionCreated, 'emit');
    
    component.functionName = 'testFunc';
    component.functionDescription = 'Test function';
    component.functionSyntax = 'testFunc()';
    component.functionImplementation = 'return "test";';

    component.createFunction();

    expect(component.functionCreated.emit).toHaveBeenCalled();
  });

  it('should reset form after creating function', () => {
    component.functionName = 'testFunc';
    component.functionDescription = 'Test function';
    component.functionSyntax = 'testFunc()';
    component.functionImplementation = 'return "test";';

    component.createFunction();

    expect(component.functionName).toBe('');
    expect(component.functionDescription).toBe('');
    expect(component.functionSyntax).toBe('');
    expect(component.functionImplementation).toBe('');
  });

  it('should not create function with invalid data', () => {
    component.functionName = '';
    component.functionDescription = 'Test function';
    component.functionSyntax = 'testFunc()';
    component.functionImplementation = 'return "test";';

    component.createFunction();

    expect(extensionManagerService.registerCustomFunction).not.toHaveBeenCalled();
  });

  it('should toggle test section visibility', () => {
    expect(component.showTestSection).toBe(false);
    
    component.toggleTestSection();
    expect(component.showTestSection).toBe(true);
    
    component.toggleTestSection();
    expect(component.showTestSection).toBe(false);
  });

  it('should cancel function creation', () => {
    spyOn(component.cancelled, 'emit');
    
    component.functionName = 'testFunc';
    component.cancel();

    expect(component.functionName).toBe('');
    expect(component.cancelled.emit).toHaveBeenCalled();
  });

  it('should generate function syntax automatically', () => {
    component.functionName = 'myFunction';
    component.onFunctionNameChange();

    expect(component.functionSyntax).toBe('myFunction()');
  });

  it('should handle complex function implementations', () => {
    component.functionName = 'complexFunc';
    component.functionImplementation = `
      if (a > b) {
        return a * 2;
      } else {
        return b * 2;
      }
    `;
    component.testExpression = 'complexFunc(5, 3)';

    component.testFunction();

    expect(component.testResult).toContain('10');
  });
});
