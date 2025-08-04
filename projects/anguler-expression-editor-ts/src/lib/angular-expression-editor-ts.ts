import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// No Angular Material dependencies needed for basic functionality

// Components
import { ExpressionEditorComponent } from './components/expression-editor/expression-editor.component';
import { CustomFunctionBuilderComponent } from './components/custom-function-builder/custom-function-builder.component';

// Services
import { ExpressionEvaluatorService } from './services/expression-evaluator.service';
import { ExtensionManagerService } from './services/extension-manager.service';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ExpressionEditorComponent,
    CustomFunctionBuilderComponent
  ],
  providers: [
    ExpressionEvaluatorService,
    ExtensionManagerService
  ],
  exports: [
    ExpressionEditorComponent,
    CustomFunctionBuilderComponent
  ]
})
export class AngularExpressionEditorTsModule { }
