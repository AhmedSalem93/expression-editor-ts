import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ExpressionTextareaComponent } from './expression-textarea.component';
import { ContextType, DataType } from '../../../interfaces/shared.interfaces';

describe('ExpressionTextareaComponent', () => {
  let component: ExpressionTextareaComponent;
  let fixture: ComponentFixture<ExpressionTextareaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExpressionTextareaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExpressionTextareaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display placeholder text', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const textarea = compiled.querySelector('textarea');
    expect(textarea?.placeholder).toBe('Enter your expression here...');
  });

  it('should emit value change on input', () => {
    spyOn(component.valueChange, 'emit');
    
    const textarea = fixture.nativeElement.querySelector('textarea') as HTMLTextAreaElement;
    textarea.value = 'test expression';
    textarea.dispatchEvent(new Event('input'));
    
    expect(component.valueChange.emit).toHaveBeenCalledWith('test expression');
  });

  it('should emit blur event on blur', () => {
    spyOn(component.blur, 'emit');
    
    const textarea = fixture.nativeElement.querySelector('textarea') as HTMLTextAreaElement;
    textarea.dispatchEvent(new Event('blur'));
    
    expect(component.blur.emit).toHaveBeenCalled();
  });

  it('should show validation success message', () => {
    component.currentValidation = {
      isValid: true,
      message: 'Valid expression',
      expectedType: DataType.BOOLEAN,
      contextType: ContextType.BOOLEAN
    };
    fixture.detectChanges();
    
    const compiled = fixture.nativeElement as HTMLElement;
    const validationDisplay = compiled.querySelector('.validation-display');
    expect(validationDisplay?.classList.contains('validation-success')).toBeTruthy();
    expect(validationDisplay?.textContent).toContain('Valid expression');
    expect(validationDisplay?.textContent).toContain('✓');
  });

  it('should show validation error message', () => {
    component.currentValidation = {
      isValid: false,
      message: 'Invalid expression',
      expectedType: DataType.BOOLEAN,
      contextType: ContextType.BOOLEAN
    };
    fixture.detectChanges();
    
    const compiled = fixture.nativeElement as HTMLElement;
    const validationDisplay = compiled.querySelector('.validation-display');
    expect(validationDisplay?.classList.contains('validation-error')).toBeTruthy();
    expect(validationDisplay?.textContent).toContain('Invalid expression');
    expect(validationDisplay?.textContent).toContain('⚠');
  });

  it('should not show validation display when no validation', () => {
    component.currentValidation = null;
    fixture.detectChanges();
    
    const compiled = fixture.nativeElement as HTMLElement;
    const validationDisplay = compiled.querySelector('.validation-display');
    expect(validationDisplay).toBeNull();
  });

  it('should apply valid class when validation is valid', () => {
    component.currentValidation = {
      isValid: true,
      message: 'Valid',
      expectedType: DataType.BOOLEAN,
      contextType: ContextType.BOOLEAN
    };
    fixture.detectChanges();
    
    const compiled = fixture.nativeElement as HTMLElement;
    const textarea = compiled.querySelector('textarea');
    expect(textarea?.classList.contains('valid')).toBeTruthy();
  });

  it('should apply invalid class when validation is invalid', () => {
    component.currentValidation = {
      isValid: false,
      message: 'Invalid',
      expectedType: DataType.BOOLEAN,
      contextType: ContextType.BOOLEAN
    };
    fixture.detectChanges();
    
    const compiled = fixture.nativeElement as HTMLElement;
    const textarea = compiled.querySelector('textarea');
    expect(textarea?.classList.contains('invalid')).toBeTruthy();
  });

  it('should disable textarea when disabled is true', () => {
    component.disabled = true;
    fixture.detectChanges();
    
    const compiled = fixture.nativeElement as HTMLElement;
    const textarea = compiled.querySelector('textarea') as HTMLTextAreaElement;
    expect(textarea.disabled).toBeTruthy();
  });

  it('should insert text at cursor position', () => {
    component.value = 'hello world';
    component.insertTextAtCursor(' test');
    
    expect(component.value).toBe('hello world test');
  });

  it('should write value through ControlValueAccessor', () => {
    component.writeValue('test value');
    expect(component.value).toBe('test value');
  });

  it('should handle null value in writeValue', () => {
    component.writeValue(null);
    expect(component.value).toBe('');
  });

  it('should register onChange callback', () => {
    const mockFn = jasmine.createSpy('onChange');
    component.registerOnChange(mockFn);
    
    component.onInput({ target: { value: 'test' } });
    expect(mockFn).toHaveBeenCalledWith('test');
  });

  it('should register onTouched callback', () => {
    const mockFn = jasmine.createSpy('onTouched');
    component.registerOnTouched(mockFn);
    
    component.onBlur();
    expect(mockFn).toHaveBeenCalled();
  });

  it('should set disabled state', () => {
    component.setDisabledState(true);
    expect(component.disabled).toBeTruthy();
    
    component.setDisabledState(false);
    expect(component.disabled).toBeFalsy();
  });
});
