import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Import the module instead of individual components
import { AngularExpressionEditorModule } from '../../projects/anguler-expression-editor-ts/src/lib/angular-expression-editor-ts.module';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AngularExpressionEditorModule,
  ],
  templateUrl: './app.html',
  styleUrls: ['./app.css'],
})
export class App {
  // Expression Editor properties
  expressionValue = '';

  // Expression Editor configuration
  editorConfig: any = {
    title: 'Advanced Expression Editor',
    placeholder: 'Enter your expression here...',
    description: 'Expression Editor to transform and evaluate data',
    rows: 5,
    showHeader: true,
  };
}
