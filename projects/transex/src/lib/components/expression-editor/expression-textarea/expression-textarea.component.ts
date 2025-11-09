import { Component, Input, Output, EventEmitter, forwardRef, ViewChild, ElementRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ExpressionEditorConfig, TypeValidationResult } from '../../../interfaces/shared.interfaces';

@Component({
  selector: 'lib-expression-textarea',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './expression-textarea.component.html',
  styleUrls: ['./expression-textarea.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ExpressionTextareaComponent),
      multi: true
    }
  ]
})
export class ExpressionTextareaComponent implements ControlValueAccessor {
  @Input() disabled = false;
  @Input() editorConfig?: ExpressionEditorConfig;
  @Input() currentValidation: TypeValidationResult | null = null;
  @Output() valueChange = new EventEmitter<string>();
  
  @ViewChild('expressionTextarea') expressionTextarea!: ElementRef<HTMLTextAreaElement>;

  value = '';
  
  private onChange = (value: string) => {};
  private onTouched = () => {};

  onInput(event: any) {
    this.value = event.target.value;
    this.onChange(this.value);
    this.valueChange.emit(this.value);
  }


  getPlaceholder(): string {
    return 'Enter your expression here...';
  }

  insertTextAtCursor(text: string) {
    if (!this.expressionTextarea?.nativeElement) {
      this.value = (this.value || '') + text;
      this.onChange(this.value);
      this.valueChange.emit(this.value);
      return;
    }

    const textarea = this.expressionTextarea.nativeElement;
    const startPos = textarea.selectionStart;
    const endPos = textarea.selectionEnd;
    
    this.value = this.value.substring(0, startPos) + text + this.value.substring(endPos);
    this.onChange(this.value);
    this.valueChange.emit(this.value);
    
    setTimeout(() => {
      textarea.focus();
      if (textarea.setSelectionRange && typeof textarea.setSelectionRange === 'function') {
        textarea.setSelectionRange(startPos + text.length, startPos + text.length);
      }
    });
  }

  writeValue(value: string | null): void {
    this.value = value || '';
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}
