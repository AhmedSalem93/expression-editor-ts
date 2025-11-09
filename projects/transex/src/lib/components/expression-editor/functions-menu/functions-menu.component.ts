import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FunctionCategory, FunctionItem } from '../../../interfaces/shared.interfaces';
import { ExtensionManagerService } from '../../../services/extension-manager/extension-manager.service';

@Component({
  selector: 'lib-functions-menu',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './functions-menu.component.html',
  styleUrls: ['./functions-menu.component.css']
})
export class FunctionsMenuComponent {
  @Input() showFunctionsMenu = false;
  @Input() functionCategories: FunctionCategory[] = [];
  @Input() selectedFunctionCategory = 'arithmetic';
  @Input() selectedFunction: FunctionItem | null = null;
  
  @Output() closeFunctionsMenu = new EventEmitter<void>();
  @Output() functionCategorySelected = new EventEmitter<string>();
  @Output() functionSelected = new EventEmitter<FunctionItem>();
  @Output() functionInserted = new EventEmitter<FunctionItem>();

  constructor(private extensionManager: ExtensionManagerService) {}

  onCloseFunctionsMenu() {
    this.closeFunctionsMenu.emit();
  }

  onSelectFunctionCategory(category: string) {
    this.functionCategorySelected.emit(category);
  }

  onSelectFunction(func: FunctionItem) {
    this.functionSelected.emit(func);
  }

  onInsertFunction(func: FunctionItem) {
    this.functionInserted.emit(func);
  }

  getSelectedCategoryFunctions(): FunctionItem[] {
    const category = this.functionCategories.find(c => c.name === this.selectedFunctionCategory);
    let functions = category ? category.functions : [];
    
    if (this.selectedFunctionCategory === 'custom') {
      const customFunctions = this.extensionManager.getCustomFunctions();
      const customFunctionItems: FunctionItem[] = customFunctions.map(cf => ({
        name: cf.name,
        syntax: cf.syntax,
        description: cf.description,
        example: cf.example || '',
        category: 'custom'
      }));
      functions = [...customFunctionItems];
    }
    
    return functions;
  }
}
