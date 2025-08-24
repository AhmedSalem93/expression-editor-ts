import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ExpressionEditorComponent } from './components/expression-editor/expression-editor.component';
import { CustomFunctionBuilderComponent } from './components/custom-function-builder/custom-function-builder.component';
import { ExpressionEvaluatorService } from './services/expression-evaluator.service';
import { ExtensionManagerService } from './services/extension-manager.service';

@NgModule({
  declarations: [
    ExpressionEditorComponent,
    CustomFunctionBuilderComponent
  ],
  imports: [
    CommonModule,
    FormsModule
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
export class AngularExpressionEditorModule { }
