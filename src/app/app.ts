import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Import the comprehensive expression editor component directly from source
import { ExpressionEditorComponent } from '../../projects/anguler-expression-editor-ts/src/lib/components/expression-editor/expression-editor.component';
import { ExpressionEvaluatorService } from '../../projects/anguler-expression-editor-ts/src/lib/services/expression-evaluator.service';
import { ExtensionManagerService } from '../../projects/anguler-expression-editor-ts/src/lib/services/extension-manager.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ExpressionEditorComponent,
  ],
  providers: [ExpressionEvaluatorService, ExtensionManagerService],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('my-workspace');

  // Expression Editor properties
  expressionValue = '';

  // Expression Editor configuration
  editorConfig: any = {
    title: 'Advanced Expression Editor',
    placeholder: 'Enter your expression here...',
    rows: 8,
    showHeader: true,
    showFooter: false,
    description: 'Expression Editor to transform and evaluate data',
    enableValidation: true,
    enableAutocomplete: true,
  };

  // Expression Editor event handlers
  onExpressionChange(value: string) {
    this.expressionValue = value;
    console.log('Expression changed:', value);
  }

  onValidationChange(result: any) {
    console.log('Validation result:', result);
  }
}
