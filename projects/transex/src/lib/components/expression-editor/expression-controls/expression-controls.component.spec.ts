import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ExpressionControlsComponent } from './expression-controls.component';
import { CustomFunction } from '../../../interfaces/extensibility.interfaces';

describe('ExpressionControlsComponent', () => {
  let component: ExpressionControlsComponent;
  let fixture: ComponentFixture<ExpressionControlsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExpressionControlsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExpressionControlsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display "Disable Editor" when not disabled', () => {
    component.disabled = false;
    fixture.detectChanges();
    
    const compiled = fixture.nativeElement as HTMLElement;
    const toggleButton = compiled.querySelector('.btn-toggle');
    expect(toggleButton?.textContent?.trim()).toBe('Disable Editor');
    expect(toggleButton?.classList.contains('btn-disable')).toBeTruthy();
  });

  it('should display "Enable Editor" when disabled', () => {
    component.disabled = true;
    fixture.detectChanges();
    
    const compiled = fixture.nativeElement as HTMLElement;
    const toggleButton = compiled.querySelector('.btn-toggle');
    expect(toggleButton?.textContent?.trim()).toBe('Enable Editor');
    expect(toggleButton?.classList.contains('btn-enable')).toBeTruthy();
  });

  it('should emit toggleEditor when toggle button is clicked', () => {
    spyOn(component.toggleEditor, 'emit');
    
    const compiled = fixture.nativeElement as HTMLElement;
    const toggleButton = compiled.querySelector('.btn-toggle') as HTMLButtonElement;
    toggleButton.click();
    
    expect(component.toggleEditor.emit).toHaveBeenCalled();
  });

  it('should emit clearExpression when clear button is clicked', () => {
    spyOn(component.clearExpression, 'emit');
    
    const compiled = fixture.nativeElement as HTMLElement;
    const clearButton = compiled.querySelector('.btn:not(.btn-toggle):not(.btn-functions):not(.btn-symbols):not(.btn-custom)') as HTMLButtonElement;
    clearButton.click();
    
    expect(component.clearExpression.emit).toHaveBeenCalled();
  });

  it('should emit openFunctionsMenu when functions button is clicked', () => {
    spyOn(component.openFunctionsMenu, 'emit');
    
    const compiled = fixture.nativeElement as HTMLElement;
    const functionsButton = compiled.querySelector('.btn-functions') as HTMLButtonElement;
    functionsButton.click();
    
    expect(component.openFunctionsMenu.emit).toHaveBeenCalled();
  });

  it('should emit openSymbolPicker when symbols button is clicked', () => {
    spyOn(component.openSymbolPicker, 'emit');
    
    const compiled = fixture.nativeElement as HTMLElement;
    const symbolsButton = compiled.querySelector('.btn-symbols') as HTMLButtonElement;
    symbolsButton.click();
    
    expect(component.openSymbolPicker.emit).toHaveBeenCalled();
  });

  it('should emit openCustomFunctionBuilder when create function button is clicked', () => {
    spyOn(component.openCustomFunctionBuilder, 'emit');
    
    const compiled = fixture.nativeElement as HTMLElement;
    const customButton = compiled.querySelector('.btn-custom') as HTMLButtonElement;
    customButton.click();
    
    expect(component.openCustomFunctionBuilder.emit).toHaveBeenCalled();
  });

  it('should emit closeCustomFunctionBuilder when close is triggered', () => {
    spyOn(component.closeCustomFunctionBuilder, 'emit');
    
    component.onCloseCustomFunctionBuilder();
    
    expect(component.closeCustomFunctionBuilder.emit).toHaveBeenCalled();
  });

  it('should emit customFunctionCreated when function is created', () => {
    spyOn(component.customFunctionCreated, 'emit');
    
    const mockFunction: CustomFunction = {
      name: 'testFunc',
      syntax: 'testFunc(x)',
      description: 'Test function',
      category: 'custom'
    };
    
    component.onCustomFunctionCreated(mockFunction);
    
    expect(component.customFunctionCreated.emit).toHaveBeenCalledWith(mockFunction);
  });

  it('should show custom function builder when showCustomFunctionBuilder is true', () => {
    component.showCustomFunctionBuilder = true;
    fixture.detectChanges();
    
    const compiled = fixture.nativeElement as HTMLElement;
    const customFunctionBuilder = compiled.querySelector('lib-custom-function-builder');
    expect(customFunctionBuilder).toBeTruthy();
  });

  it('should have all required buttons', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    
    expect(compiled.querySelector('.btn-toggle')).toBeTruthy();
    expect(compiled.querySelector('.btn:not(.btn-toggle):not(.btn-functions):not(.btn-symbols):not(.btn-custom)')).toBeTruthy(); // Clear button
    expect(compiled.querySelector('.btn-functions')).toBeTruthy();
    expect(compiled.querySelector('.btn-symbols')).toBeTruthy();
    expect(compiled.querySelector('.btn-custom')).toBeTruthy();
  });

  it('should have correct button text content', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    
    expect(compiled.querySelector('.btn-functions')?.textContent).toContain('Functions Menu');
    expect(compiled.querySelector('.btn-symbols')?.textContent).toContain('Symbol Picker');
    expect(compiled.querySelector('.btn-custom')?.textContent).toContain('Create Function');
  });
});
