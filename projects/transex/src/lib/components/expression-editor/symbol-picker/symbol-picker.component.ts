import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SymbolCategory, SymbolItem } from '../../../interfaces/shared.interfaces';

@Component({
  selector: 'lib-symbol-picker',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './symbol-picker.component.html',
  styleUrls: ['./symbol-picker.component.css']
})
export class SymbolPickerComponent {
  @Input() showSymbolPicker = false;
  @Input() symbolCategories: SymbolCategory[] = [];
  @Input() selectedSymbolCategory = 'arithmetic';
  @Input() selectedSymbol: SymbolItem | null = null;
  
  @Output() closeSymbolPicker = new EventEmitter<void>();
  @Output() symbolCategorySelected = new EventEmitter<string>();
  @Output() symbolSelected = new EventEmitter<SymbolItem>();
  @Output() symbolInserted = new EventEmitter<SymbolItem>();

  onCloseSymbolPicker() {
    this.closeSymbolPicker.emit();
  }

  onSelectSymbolCategory(category: string) {
    this.symbolCategorySelected.emit(category);
  }

  onSelectSymbol(symbol: SymbolItem) {
    this.symbolSelected.emit(symbol);
  }

  onInsertSymbol(symbol: SymbolItem) {
    this.symbolInserted.emit(symbol);
  }

  getSelectedCategorySymbols(): SymbolItem[] {
    const category = this.symbolCategories.find(c => c.name === this.selectedSymbolCategory);
    return category ? category.symbols : [];
  }
}
