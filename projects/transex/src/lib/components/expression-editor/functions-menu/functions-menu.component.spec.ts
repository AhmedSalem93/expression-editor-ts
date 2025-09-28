import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FunctionsMenuComponent } from './functions-menu.component';
import { ExtensionManagerService } from '../../../services/extension-manager.service';
import { FunctionCategory, FunctionItem } from '../../../interfaces/shared.interfaces';

describe('FunctionsMenuComponent', () => {
  let component: FunctionsMenuComponent;
  let fixture: ComponentFixture<FunctionsMenuComponent>;
  let mockExtensionManager: jasmine.SpyObj<ExtensionManagerService>;

  const mockFunctionCategories: FunctionCategory[] = [
    {
      name: 'arithmetic',
      label: 'Arithmetic',
      functions: [
        {
          name: 'add',
          syntax: 'add(a, b)',
          description: 'Adds two numbers',
          example: 'add(2, 3) = 5',
          category: 'arithmetic'
        }
      ]
    },
    {
      name: 'custom',
      label: 'Custom Functions',
      functions: []
    }
  ];

  beforeEach(async () => {
    const extensionManagerSpy = jasmine.createSpyObj('ExtensionManagerService', ['getCustomFunctions']);

    await TestBed.configureTestingModule({
      imports: [FunctionsMenuComponent],
      providers: [
        { provide: ExtensionManagerService, useValue: extensionManagerSpy }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FunctionsMenuComponent);
    component = fixture.componentInstance;
    mockExtensionManager = TestBed.inject(ExtensionManagerService) as jasmine.SpyObj<ExtensionManagerService>;
    
    component.functionCategories = mockFunctionCategories;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not display modal when showFunctionsMenu is false', () => {
    component.showFunctionsMenu = false;
    fixture.detectChanges();
    
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.functions-menu-overlay')).toBeNull();
  });

  it('should display modal when showFunctionsMenu is true', () => {
    component.showFunctionsMenu = true;
    fixture.detectChanges();
    
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.functions-menu-overlay')).toBeTruthy();
  });

  it('should emit closeFunctionsMenu when close button is clicked', () => {
    spyOn(component.closeFunctionsMenu, 'emit');
    component.showFunctionsMenu = true;
    fixture.detectChanges();
    
    const compiled = fixture.nativeElement as HTMLElement;
    const closeButton = compiled.querySelector('.close-btn') as HTMLButtonElement;
    closeButton.click();
    
    expect(component.closeFunctionsMenu.emit).toHaveBeenCalled();
  });

  it('should emit closeFunctionsMenu when overlay is clicked', () => {
    spyOn(component.closeFunctionsMenu, 'emit');
    component.showFunctionsMenu = true;
    fixture.detectChanges();
    
    const compiled = fixture.nativeElement as HTMLElement;
    const overlay = compiled.querySelector('.functions-menu-overlay') as HTMLElement;
    overlay.click();
    
    expect(component.closeFunctionsMenu.emit).toHaveBeenCalled();
  });

  it('should display function categories', () => {
    component.showFunctionsMenu = true;
    fixture.detectChanges();
    
    const compiled = fixture.nativeElement as HTMLElement;
    const categoryTabs = compiled.querySelectorAll('.category-tab');
    expect(categoryTabs.length).toBe(2);
    expect(categoryTabs[0].textContent?.trim()).toBe('Arithmetic');
    expect(categoryTabs[1].textContent?.trim()).toBe('Custom Functions');
  });

  it('should emit functionCategorySelected when category tab is clicked', () => {
    spyOn(component.functionCategorySelected, 'emit');
    component.showFunctionsMenu = true;
    fixture.detectChanges();
    
    const compiled = fixture.nativeElement as HTMLElement;
    const categoryTab = compiled.querySelector('.category-tab') as HTMLButtonElement;
    categoryTab.click();
    
    expect(component.functionCategorySelected.emit).toHaveBeenCalledWith('arithmetic');
  });

  it('should display functions for selected category', () => {
    component.showFunctionsMenu = true;
    component.selectedFunctionCategory = 'arithmetic';
    fixture.detectChanges();
    
    const compiled = fixture.nativeElement as HTMLElement;
    const functionItems = compiled.querySelectorAll('.function-item');
    expect(functionItems.length).toBe(1);
    expect(functionItems[0].textContent).toContain('add');
    expect(functionItems[0].textContent).toContain('add(a, b)');
  });

  it('should emit functionSelected when function item is clicked', () => {
    spyOn(component.functionSelected, 'emit');
    component.showFunctionsMenu = true;
    component.selectedFunctionCategory = 'arithmetic';
    fixture.detectChanges();
    
    const compiled = fixture.nativeElement as HTMLElement;
    const functionItem = compiled.querySelector('.function-item') as HTMLElement;
    functionItem.click();
    
    expect(component.functionSelected.emit).toHaveBeenCalledWith(mockFunctionCategories[0].functions[0]);
  });

  it('should display function details when function is selected', () => {
    component.showFunctionsMenu = true;
    component.selectedFunction = mockFunctionCategories[0].functions[0];
    fixture.detectChanges();
    
    const compiled = fixture.nativeElement as HTMLElement;
    const functionDetails = compiled.querySelector('.function-details');
    expect(functionDetails).toBeTruthy();
    expect(functionDetails?.textContent).toContain('add');
    expect(functionDetails?.textContent).toContain('add(a, b)');
    expect(functionDetails?.textContent).toContain('Adds two numbers');
    expect(functionDetails?.textContent).toContain('add(2, 3) = 5');
  });

  it('should emit functionInserted when insert button is clicked', () => {
    spyOn(component.functionInserted, 'emit');
    component.showFunctionsMenu = true;
    component.selectedFunction = mockFunctionCategories[0].functions[0];
    fixture.detectChanges();
    
    const compiled = fixture.nativeElement as HTMLElement;
    const insertButton = compiled.querySelector('.function-details button') as HTMLButtonElement;
    insertButton.click();
    
    expect(component.functionInserted.emit).toHaveBeenCalledWith(mockFunctionCategories[0].functions[0]);
  });

  it('should get custom functions for custom category', () => {
    const mockCustomFunctions = [
      {
        name: 'customFunc',
        syntax: 'customFunc(x)',
        description: 'Custom function',
        implementation: (x: number) => x * 2,
        category: 'custom'
      }
    ];
    
    mockExtensionManager.getCustomFunctions.and.returnValue(mockCustomFunctions);
    component.selectedFunctionCategory = 'custom';
    
    const functions = component.getSelectedCategoryFunctions();
    expect(functions.length).toBe(1);
    expect(functions[0].name).toBe('customFunc');
    expect(functions[0].syntax).toBe('customFunc(x)');
  });

  it('should return empty array for non-existent category', () => {
    component.selectedFunctionCategory = 'nonexistent';
    const functions = component.getSelectedCategoryFunctions();
    expect(functions).toEqual([]);
  });

  it('should mark active category tab', () => {
    component.showFunctionsMenu = true;
    component.selectedFunctionCategory = 'arithmetic';
    fixture.detectChanges();
    
    const compiled = fixture.nativeElement as HTMLElement;
    const categoryTabs = compiled.querySelectorAll('.category-tab');
    expect(categoryTabs[0].classList.contains('active')).toBeTruthy();
    expect(categoryTabs[1].classList.contains('active')).toBeFalsy();
  });

  it('should mark selected function item', () => {
    component.showFunctionsMenu = true;
    component.selectedFunctionCategory = 'arithmetic';
    component.selectedFunction = mockFunctionCategories[0].functions[0];
    fixture.detectChanges();
    
    const compiled = fixture.nativeElement as HTMLElement;
    const functionItem = compiled.querySelector('.function-item');
    expect(functionItem?.classList.contains('selected')).toBeTruthy();
  });
});
