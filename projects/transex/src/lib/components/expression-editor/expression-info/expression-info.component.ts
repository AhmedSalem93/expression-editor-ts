import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExpressionTypeResult, DataType, TypeValidationResult } from '../../../interfaces/shared.interfaces';

@Component({
  selector: 'lib-expression-info',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './expression-info.component.html',
  styleUrls: ['./expression-info.component.css']
})
export class ExpressionInfoComponent {
  @Input() value = '';
  @Input() typeResult: ExpressionTypeResult | null = null;
  @Input() currentValidation: TypeValidationResult | null = null;

  getReturnTypeDisplay(): string {
    if (!this.typeResult?.success || !this.typeResult.returnType) return '';
    
    switch (this.typeResult.returnType) {
      case DataType.INTEGER:
        return 'Integer';
      case DataType.REAL:
        return 'Real';
      case DataType.BOOLEAN:
        return 'Boolean';
      case DataType.STRING:
        return 'String';
      case DataType.ASSIGNMENT:
        return 'Assignment';
      case DataType.FUNCTION:
        return 'Function';
      default:
        return this.typeResult.returnType;
    }
  }

  shouldShowTypeInfo(): boolean {
    return this.typeResult?.success === true && 
           (this.currentValidation === null || this.currentValidation?.isValid === true);
  }
}
