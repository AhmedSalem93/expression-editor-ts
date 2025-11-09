import { DataType, ContextType } from './expression.interfaces';

export interface TypeValidationResult {
  isValid: boolean;
  message: string;
  expectedType: DataType;
  actualType?: DataType;
  contextType: ContextType;
}