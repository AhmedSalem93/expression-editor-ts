import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { VariableManagerComponent } from './variable-manager.component';
import { DataType, Variable } from '../../../interfaces/shared.interfaces';

describe('VariableManagerComponent', () => {
  let component: VariableManagerComponent;
  let fixture: ComponentFixture<VariableManagerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VariableManagerComponent, FormsModule]
    }).compileComponents();

    fixture = TestBed.createComponent(VariableManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Variable Selection', () => {
    it('should select a variable', () => {
      const mockVariable: Variable = {
        name: 'testVar',
        value: 42,
        type: DataType.INTEGER,
        explanation: 'Test variable'
      };

      spyOn(component.variableSelected, 'emit');
      component.onVariableSelected(mockVariable);

      expect(component.selectedVariable).toEqual(mockVariable);
      expect(component.variableSelected.emit).toHaveBeenCalledWith(mockVariable);
    });

    it('should insert a variable', () => {
      const mockVariable: Variable = {
        name: 'price',
        value: 19.99,
        type: DataType.REAL,
        explanation: 'Product price'
      };

      spyOn(component.variableInserted, 'emit');
      component.onInsertVariable(mockVariable);

      expect(component.variableInserted.emit).toHaveBeenCalledWith(mockVariable);
    });
  });

  describe('Variable Creation', () => {
    it('should show create form', () => {
      component.onShowCreateForm();
      expect(component.showCreateForm).toBeTruthy();
    });

    it('should hide create form', () => {
      component.showCreateForm = true;
      component.onHideCreateForm();
      expect(component.showCreateForm).toBeFalsy();
    });

    it('should validate new variable - invalid when empty', () => {
      component.newVariable = {
        name: '',
        value: '',
        type: DataType.STRING,
        explanation: ''
      };
      expect(component.isValidNewVariable()).toBeFalsy();
    });

    it('should validate new variable - valid when all fields filled', () => {
      component.newVariable = {
        name: 'test',
        value: 'value',
        type: DataType.STRING,
        explanation: 'Test variable'
      };
      expect(component.isValidNewVariable()).toBeTruthy();
    });

    it('should create a new variable', () => {
      component.newVariable = {
        name: 'newVar',
        value: '100',
        type: DataType.INTEGER,
        explanation: 'New test variable'
      };

      spyOn(component.variableCreated, 'emit');
      component.onCreateVariable();

      expect(component.variableCreated.emit).toHaveBeenCalled();
      expect(component.showCreateForm).toBeFalsy();
    });

    it('should not create variable if invalid', () => {
      component.newVariable = {
        name: '',
        value: '',
        type: DataType.STRING,
        explanation: ''
      };

      spyOn(component.variableCreated, 'emit');
      component.onCreateVariable();

      expect(component.variableCreated.emit).not.toHaveBeenCalled();
    });
  });

  describe('Variable Deletion', () => {
    it('should delete a variable after confirmation', (done) => {
      const mockVariable: Variable = {
        name: 'deleteMe',
        value: 'test',
        type: DataType.STRING,
        explanation: 'Variable to delete'
      };

      spyOn(window, 'confirm').and.returnValue(true);
      spyOn(component.variableDeleted, 'emit');

      const mockEvent = new Event('click');
      spyOn(mockEvent, 'stopPropagation');
      spyOn(mockEvent, 'preventDefault');

      component.onDeleteVariable(mockVariable, mockEvent);

      setTimeout(() => {
        expect(window.confirm).toHaveBeenCalled();
        expect(component.variableDeleted.emit).toHaveBeenCalledWith(mockVariable);
        expect(mockEvent.stopPropagation).toHaveBeenCalled();
        expect(mockEvent.preventDefault).toHaveBeenCalled();
        done();
      }, 20);
    });

    it('should not delete variable if cancelled', (done) => {
      const mockVariable: Variable = {
        name: 'keepMe',
        value: 'test',
        type: DataType.STRING,
        explanation: 'Variable to keep'
      };

      spyOn(window, 'confirm').and.returnValue(false);
      spyOn(component.variableDeleted, 'emit');

      const mockEvent = new Event('click');
      component.onDeleteVariable(mockVariable, mockEvent);

      setTimeout(() => {
        expect(window.confirm).toHaveBeenCalled();
        expect(component.variableDeleted.emit).not.toHaveBeenCalled();
        done();
      }, 20);
    });

    it('should clear selection when deleting selected variable', (done) => {
      const mockVariable: Variable = {
        name: 'selected',
        value: 'test',
        type: DataType.STRING,
        explanation: 'Selected variable'
      };

      component.selectedVariable = mockVariable;
      spyOn(window, 'confirm').and.returnValue(true);

      const mockEvent = new Event('click');
      component.onDeleteVariable(mockVariable, mockEvent);

      setTimeout(() => {
        expect(component.selectedVariable).toBeNull();
        done();
      }, 20);
    });
  });

  describe('Data Type Handling', () => {
    it('should get correct placeholder for each data type', () => {
      component.newVariable.type = DataType.BOOLEAN;
      expect(component.getValuePlaceholder()).toBe('true or false');

      component.newVariable.type = DataType.INTEGER;
      expect(component.getValuePlaceholder()).toContain('42');

      component.newVariable.type = DataType.REAL;
      expect(component.getValuePlaceholder()).toContain('3.14');

      component.newVariable.type = DataType.STRING;
      expect(component.getValuePlaceholder()).toContain('Hello World');

      component.newVariable.type = DataType.FUNCTION;
      expect(component.getValuePlaceholder()).toContain('=>');
    });

    it('should get correct type label', () => {
      expect(component.getVariableTypeLabel(DataType.BOOLEAN)).toBe('Boolean');
      expect(component.getVariableTypeLabel(DataType.INTEGER)).toBe('Integer');
      expect(component.getVariableTypeLabel(DataType.REAL)).toBe('Real');
      expect(component.getVariableTypeLabel(DataType.STRING)).toBe('String');
      expect(component.getVariableTypeLabel(DataType.FUNCTION)).toBe('Function');
      expect(component.getVariableTypeLabel(DataType.ASSIGNMENT)).toBe('Assignment');
    });

    it('should display variable value correctly', () => {
      const stringVar: Variable = {
        name: 'str',
        value: 'hello',
        type: DataType.STRING,
        explanation: 'String var'
      };
      expect(component.getVariableValueDisplay(stringVar)).toBe('"hello"');

      const intVar: Variable = {
        name: 'num',
        value: 42,
        type: DataType.INTEGER,
        explanation: 'Integer var'
      };
      expect(component.getVariableValueDisplay(intVar)).toBe('42');

      const funcVar: Variable = {
        name: 'fn',
        value: '(x) => x * 2',
        type: DataType.FUNCTION,
        explanation: 'Function var'
      };
      expect(component.getVariableValueDisplay(funcVar)).toBe('(x) => x * 2');
    });
  });

  describe('Component Lifecycle', () => {
    it('should close variable manager', () => {
      component.selectedVariable = {
        name: 'test',
        value: 'test',
        type: DataType.STRING,
        explanation: 'test'
      };
      component.showCreateForm = true;

      spyOn(component.closeVariableManager, 'emit');
      component.onClose();

      expect(component.closeVariableManager.emit).toHaveBeenCalled();
      expect(component.selectedVariable).toBeNull();
      expect(component.showCreateForm).toBeFalsy();
    });
  });

  describe('Input Properties', () => {
    it('should accept variables input', () => {
      const mockVariables: Variable[] = [
        { name: 'x', value: 10, type: DataType.INTEGER, explanation: 'X variable' },
        { name: 'y', value: 20, type: DataType.INTEGER, explanation: 'Y variable' }
      ];

      component.variables = mockVariables;
      expect(component.variables.length).toBe(2);
      expect(component.variables[0].name).toBe('x');
    });

    it('should accept allowVariableCreation input', () => {
      component.allowVariableCreation = false;
      expect(component.allowVariableCreation).toBeFalsy();

      component.allowVariableCreation = true;
      expect(component.allowVariableCreation).toBeTruthy();
    });

    it('should accept showVariableManager input', () => {
      component.showVariableManager = true;
      expect(component.showVariableManager).toBeTruthy();

      component.showVariableManager = false;
      expect(component.showVariableManager).toBeFalsy();
    });
  });
});