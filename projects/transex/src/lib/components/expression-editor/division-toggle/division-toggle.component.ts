import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ExpressionEditorConfig, ContextType } from '../../../interfaces/shared.interfaces';

@Component({
  selector: 'lib-division-toggle',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './division-toggle.component.html',
  styleUrls: ['./division-toggle.component.css']
})
export class DivisionToggleComponent {
  @Input() editorConfig?: ExpressionEditorConfig;
  @Output() configChange = new EventEmitter<ExpressionEditorConfig>();

  ContextType = ContextType;

  isLimitedConnectorContext(): boolean {
    return this.editorConfig?.contextType === ContextType.LIMITED_CONNECTOR;
  }

  toggleDivision() {
    if (this.editorConfig && this.editorConfig.contextType === ContextType.LIMITED_CONNECTOR) {
      const newConfig = {
        ...this.editorConfig,
        allowDivision: !this.editorConfig.allowDivision
      };
      this.configChange.emit(newConfig);
    }
  }
}
