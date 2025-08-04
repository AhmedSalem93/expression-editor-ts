import { TestBed } from '@angular/core/testing';

import { AngulerExpressionEditorTsModule } from './anguler-expression-editor-ts';

describe('AngulerExpressionEditorTsModule', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AngulerExpressionEditorTsModule]
    })
    .compileComponents();
  });

  it('should create module', () => {
    expect(AngulerExpressionEditorTsModule).toBeTruthy();
  });
});
