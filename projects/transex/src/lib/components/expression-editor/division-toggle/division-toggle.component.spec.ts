import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DivisionToggleComponent } from './division-toggle.component';
import { ContextType, DataType } from '../../../interfaces/shared.interfaces';

describe('DivisionToggleComponent', () => {
  let component: DivisionToggleComponent;
  let fixture: ComponentFixture<DivisionToggleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DivisionToggleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DivisionToggleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not display toggle for non-limited connector context', () => {
    component.editorConfig = {
      contextType: ContextType.BOOLEAN,
      expectedResultType: DataType.BOOLEAN
    };
    fixture.detectChanges();
    
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.division-toggle-section')).toBeNull();
  });

  it('should display toggle for limited connector context', () => {
    component.editorConfig = {
      contextType: ContextType.LIMITED_CONNECTOR,
      expectedResultType: DataType.REAL,
      allowDivision: false
    };
    fixture.detectChanges();
    
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.division-toggle-section')).toBeTruthy();
  });

  it('should show division disabled status when allowDivision is false', () => {
    component.editorConfig = {
      contextType: ContextType.LIMITED_CONNECTOR,
      expectedResultType: DataType.REAL,
      allowDivision: false
    };
    fixture.detectChanges();
    
    const compiled = fixture.nativeElement as HTMLElement;
    const status = compiled.querySelector('.toggle-status');
    expect(status?.textContent?.trim()).toBe('Division Disabled');
    expect(status?.classList.contains('disabled')).toBeTruthy();
  });

  it('should show division enabled status when allowDivision is true', () => {
    component.editorConfig = {
      contextType: ContextType.LIMITED_CONNECTOR,
      expectedResultType: DataType.REAL,
      allowDivision: true
    };
    fixture.detectChanges();
    
    const compiled = fixture.nativeElement as HTMLElement;
    const status = compiled.querySelector('.toggle-status');
    expect(status?.textContent?.trim()).toBe('Division Enabled');
    expect(status?.classList.contains('enabled')).toBeTruthy();
  });

  it('should show operations without division when disabled', () => {
    component.editorConfig = {
      contextType: ContextType.LIMITED_CONNECTOR,
      expectedResultType: DataType.REAL,
      allowDivision: false
    };
    fixture.detectChanges();
    
    const compiled = fixture.nativeElement as HTMLElement;
    const operations = compiled.querySelector('.operations');
    expect(operations?.textContent?.trim()).toBe('+ - *');
  });

  it('should show operations with division when enabled', () => {
    component.editorConfig = {
      contextType: ContextType.LIMITED_CONNECTOR,
      expectedResultType: DataType.REAL,
      allowDivision: true
    };
    fixture.detectChanges();
    
    const compiled = fixture.nativeElement as HTMLElement;
    const operations = compiled.querySelector('.operations');
    expect(operations?.textContent?.trim()).toBe('+ - * /');
  });

  it('should emit config change when toggle is clicked', () => {
    spyOn(component.configChange, 'emit');
    
    component.editorConfig = {
      contextType: ContextType.LIMITED_CONNECTOR,
      expectedResultType: DataType.REAL,
      allowDivision: false
    };
    
    component.toggleDivision();
    
    expect(component.configChange.emit).toHaveBeenCalledWith({
      contextType: ContextType.LIMITED_CONNECTOR,
      expectedResultType: DataType.REAL,
      allowDivision: true
    });
  });

  it('should return correct limited connector context status', () => {
    component.editorConfig = {
      contextType: ContextType.LIMITED_CONNECTOR,
      expectedResultType: DataType.REAL
    };
    expect(component.isLimitedConnectorContext()).toBeTruthy();

    component.editorConfig = {
      contextType: ContextType.BOOLEAN,
      expectedResultType: DataType.BOOLEAN
    };
    expect(component.isLimitedConnectorContext()).toBeFalsy();
  });
});
