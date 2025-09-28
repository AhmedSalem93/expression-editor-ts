import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExpressionEditorConfig, ContextType } from '../../../interfaces/shared.interfaces';

@Component({
  selector: 'lib-expression-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './expression-header.component.html',
  styleUrls: ['./expression-header.component.css']
})
export class ExpressionHeaderComponent {
  @Input() editorConfig?: ExpressionEditorConfig;

  ContextType = ContextType;

  getContextDescription(): string {
    if (!this.editorConfig) return '';
    
    switch (this.editorConfig.contextType) {
      case ContextType.BOOLEAN:
        return 'Boolean expressions for conditions and state machines';
      case ContextType.ASSIGNMENT:
        return 'Assignment expressions for data mapping and transformations';
      case ContextType.LIMITED_CONNECTOR:
        return 'Arithmetic expressions with limited operations (+, -, *, optionally /)';
      case ContextType.ARITHMETIC:
        return 'Mathematical expressions returning numeric values';
      case ContextType.GENERAL:
        return 'Flexible expression editor without specific validation';
      default:
        return '';
    }
  }
}
