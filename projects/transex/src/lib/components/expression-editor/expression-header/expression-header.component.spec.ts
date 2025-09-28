import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ExpressionHeaderComponent } from './expression-header.component';
import { ContextType, DataType } from '../../../interfaces/shared.interfaces';

describe('ExpressionHeaderComponent', () => {
  let component: ExpressionHeaderComponent;
  let fixture: ComponentFixture<ExpressionHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExpressionHeaderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExpressionHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display default title when no config provided', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.editor-title')?.textContent).toContain('Expression Editor');
  });

  it('should display custom title from config', () => {
    component.editorConfig = {
      title: 'Custom Expression Editor',
      contextType: ContextType.BOOLEAN,
      expectedResultType: DataType.BOOLEAN
    };
    fixture.detectChanges();
    
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.editor-title')?.textContent).toContain('Custom Expression Editor');
  });

  it('should display correct description for boolean context', () => {
    component.editorConfig = {
      contextType: ContextType.BOOLEAN,
      expectedResultType: DataType.BOOLEAN
    };
    fixture.detectChanges();
    
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.editor-description')?.textContent).toContain('Boolean expressions for conditions');
  });

  it('should display correct description for assignment context', () => {
    component.editorConfig = {
      contextType: ContextType.ASSIGNMENT,
      expectedResultType: DataType.STRING
    };
    fixture.detectChanges();
    
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.editor-description')?.textContent).toContain('Assignment expressions for data mapping');
  });

  it('should display correct description for limited connector context', () => {
    component.editorConfig = {
      contextType: ContextType.LIMITED_CONNECTOR,
      expectedResultType: DataType.REAL
    };
    fixture.detectChanges();
    
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.editor-description')?.textContent).toContain('Arithmetic expressions with limited operations');
  });

  it('should display correct description for arithmetic context', () => {
    component.editorConfig = {
      contextType: ContextType.ARITHMETIC,
      expectedResultType: DataType.REAL
    };
    fixture.detectChanges();
    
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.editor-description')?.textContent).toContain('Mathematical expressions returning numeric values');
  });

  it('should display correct description for general context', () => {
    component.editorConfig = {
      contextType: ContextType.GENERAL,
      expectedResultType: DataType.STRING
    };
    fixture.detectChanges();
    
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.editor-description')?.textContent).toContain('Flexible expression editor');
  });

  it('should return empty description for undefined context', () => {
    expect(component.getContextDescription()).toBe('');
  });
});
