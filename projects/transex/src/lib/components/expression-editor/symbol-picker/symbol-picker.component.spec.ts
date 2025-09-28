import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SymbolPickerComponent } from './symbol-picker.component';
import { SymbolCategory, SymbolItem } from '../../../interfaces/shared.interfaces';

describe('SymbolPickerComponent', () => {
  let component: SymbolPickerComponent;
  let fixture: ComponentFixture<SymbolPickerComponent>;

  const mockSymbolCategories: SymbolCategory[] = [
    {
      name: 'arithmetic',
      label: 'Arithmetic',
      symbols: [
        {
          name: 'Plus',
          symbol: '+',
          description: 'Addition operator',
          category: 'arithmetic'
        },
        {
          name: 'Minus',
          symbol: '-',
          description: 'Subtraction operator',
          category: 'arithmetic'
        }
      ]
    },
    {
      name: 'comparison',
      label: 'Comparison',
      symbols: [
        {
          name: 'Equals',
          symbol: '==',
          description: 'Equality comparison',
          category: 'comparison'
        }
      ]
    }
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SymbolPickerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SymbolPickerComponent);
    component = fixture.componentInstance;
    component.symbolCategories = mockSymbolCategories;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not display modal when showSymbolPicker is false', () => {
    component.showSymbolPicker = false;
    fixture.detectChanges();
    
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.symbol-picker-overlay')).toBeNull();
  });

  it('should display modal when showSymbolPicker is true', () => {
    component.showSymbolPicker = true;
    fixture.detectChanges();
    
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.symbol-picker-overlay')).toBeTruthy();
  });

  it('should emit closeSymbolPicker when close button is clicked', () => {
    spyOn(component.closeSymbolPicker, 'emit');
    component.showSymbolPicker = true;
    fixture.detectChanges();
    
    const compiled = fixture.nativeElement as HTMLElement;
    const closeButton = compiled.querySelector('.close-btn') as HTMLButtonElement;
    closeButton.click();
    
    expect(component.closeSymbolPicker.emit).toHaveBeenCalled();
  });

  it('should emit closeSymbolPicker when overlay is clicked', () => {
    spyOn(component.closeSymbolPicker, 'emit');
    component.showSymbolPicker = true;
    fixture.detectChanges();
    
    const compiled = fixture.nativeElement as HTMLElement;
    const overlay = compiled.querySelector('.symbol-picker-overlay') as HTMLElement;
    overlay.click();
    
    expect(component.closeSymbolPicker.emit).toHaveBeenCalled();
  });

  it('should display symbol categories', () => {
    component.showSymbolPicker = true;
    fixture.detectChanges();
    
    const compiled = fixture.nativeElement as HTMLElement;
    const categoryTabs = compiled.querySelectorAll('.category-tab');
    expect(categoryTabs.length).toBe(2);
    expect(categoryTabs[0].textContent?.trim()).toBe('Arithmetic');
    expect(categoryTabs[1].textContent?.trim()).toBe('Comparison');
  });

  it('should emit symbolCategorySelected when category tab is clicked', () => {
    spyOn(component.symbolCategorySelected, 'emit');
    component.showSymbolPicker = true;
    fixture.detectChanges();
    
    const compiled = fixture.nativeElement as HTMLElement;
    const categoryTab = compiled.querySelector('.category-tab') as HTMLButtonElement;
    categoryTab.click();
    
    expect(component.symbolCategorySelected.emit).toHaveBeenCalledWith('arithmetic');
  });

  it('should display symbols for selected category', () => {
    component.showSymbolPicker = true;
    component.selectedSymbolCategory = 'arithmetic';
    fixture.detectChanges();
    
    const compiled = fixture.nativeElement as HTMLElement;
    const symbolItems = compiled.querySelectorAll('.symbol-item');
    expect(symbolItems.length).toBe(2);
    expect(symbolItems[0].textContent).toContain('+');
    expect(symbolItems[0].textContent).toContain('Plus');
    expect(symbolItems[1].textContent).toContain('-');
    expect(symbolItems[1].textContent).toContain('Minus');
  });

  it('should emit symbolSelected when symbol item is clicked', () => {
    spyOn(component.symbolSelected, 'emit');
    component.showSymbolPicker = true;
    component.selectedSymbolCategory = 'arithmetic';
    fixture.detectChanges();
    
    const compiled = fixture.nativeElement as HTMLElement;
    const symbolItem = compiled.querySelector('.symbol-item') as HTMLElement;
    symbolItem.click();
    
    expect(component.symbolSelected.emit).toHaveBeenCalledWith(mockSymbolCategories[0].symbols[0]);
  });

  it('should display symbol details when symbol is selected', () => {
    component.showSymbolPicker = true;
    component.selectedSymbol = mockSymbolCategories[0].symbols[0];
    fixture.detectChanges();
    
    const compiled = fixture.nativeElement as HTMLElement;
    const symbolDetails = compiled.querySelector('.symbol-details');
    expect(symbolDetails).toBeTruthy();
    expect(symbolDetails?.textContent).toContain('Plus');
    expect(symbolDetails?.textContent).toContain('+');
    expect(symbolDetails?.textContent).toContain('Addition operator');
  });

  it('should emit symbolInserted when insert button is clicked', () => {
    spyOn(component.symbolInserted, 'emit');
    component.showSymbolPicker = true;
    component.selectedSymbol = mockSymbolCategories[0].symbols[0];
    fixture.detectChanges();
    
    const compiled = fixture.nativeElement as HTMLElement;
    const insertButton = compiled.querySelector('.symbol-details button') as HTMLButtonElement;
    insertButton.click();
    
    expect(component.symbolInserted.emit).toHaveBeenCalledWith(mockSymbolCategories[0].symbols[0]);
  });

  it('should return symbols for selected category', () => {
    component.selectedSymbolCategory = 'arithmetic';
    const symbols = component.getSelectedCategorySymbols();
    expect(symbols.length).toBe(2);
    expect(symbols[0].name).toBe('Plus');
    expect(symbols[1].name).toBe('Minus');
  });

  it('should return empty array for non-existent category', () => {
    component.selectedSymbolCategory = 'nonexistent';
    const symbols = component.getSelectedCategorySymbols();
    expect(symbols).toEqual([]);
  });

  it('should mark active category tab', () => {
    component.showSymbolPicker = true;
    component.selectedSymbolCategory = 'arithmetic';
    fixture.detectChanges();
    
    const compiled = fixture.nativeElement as HTMLElement;
    const categoryTabs = compiled.querySelectorAll('.category-tab');
    expect(categoryTabs[0].classList.contains('active')).toBeTruthy();
    expect(categoryTabs[1].classList.contains('active')).toBeFalsy();
  });

  it('should mark selected symbol item', () => {
    component.showSymbolPicker = true;
    component.selectedSymbolCategory = 'arithmetic';
    component.selectedSymbol = mockSymbolCategories[0].symbols[0];
    fixture.detectChanges();
    
    const compiled = fixture.nativeElement as HTMLElement;
    const symbolItem = compiled.querySelector('.symbol-item');
    expect(symbolItem?.classList.contains('selected')).toBeTruthy();
  });

  it('should display symbols in grid layout', () => {
    component.showSymbolPicker = true;
    component.selectedSymbolCategory = 'arithmetic';
    fixture.detectChanges();
    
    const compiled = fixture.nativeElement as HTMLElement;
    const symbolGrid = compiled.querySelector('.symbol-grid');
    expect(symbolGrid).toBeTruthy();
    expect(getComputedStyle(symbolGrid!).display).toBe('grid');
  });

  it('should not show symbol details when no symbol is selected', () => {
    component.showSymbolPicker = true;
    component.selectedSymbol = null;
    fixture.detectChanges();
    
    const compiled = fixture.nativeElement as HTMLElement;
    const symbolDetails = compiled.querySelector('.symbol-details');
    expect(symbolDetails).toBeNull();
  });

  it('should handle empty symbol categories', () => {
    component.symbolCategories = [];
    component.showSymbolPicker = true;
    fixture.detectChanges();
    
    const compiled = fixture.nativeElement as HTMLElement;
    const categoryTabs = compiled.querySelectorAll('.category-tab');
    expect(categoryTabs.length).toBe(0);
  });
});
