import { DataType, ContextType } from '../core/expression.interfaces';
import { Variable } from '../core/expression.interfaces';

export interface ExpressionEditorConfig {
  expectedResultType: DataType;
  contextType: ContextType;
  strictValidation?: boolean;
  allowDivision?: boolean;
  title?: string;
  description?: string;
  placeholder?: string;
  examples?: string[];
}

export interface VariableMapping {
  frontendName: string;   // e.g., "output.value[1]"
  backendName: string;    // e.g., "output.status"
}
export interface FieldMappingData {
  frontendField: string;
  backendField: string;
  expression: string;
  tree: any;
  timestamp: string;
}
export interface ExpressionEditorConfigEnhanced extends ExpressionEditorConfig {
  variables?: Variable[];
  allowVariableCreation?: boolean;
  variableMappings?: VariableMapping[];
}