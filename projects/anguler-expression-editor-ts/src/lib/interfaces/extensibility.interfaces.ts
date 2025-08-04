// Extensibility interfaces

export interface CustomFunction {
  name: string;
  syntax: string;
  description: string;
  example?: string;
  category: string;
  implementation: (...args: any[]) => any;
}

export interface CustomSymbol {
  name: string;
  symbol: string;
  description: string;
  category: string;
}

export interface CustomFunctionCategory {
  name: string;
  label: string;
  functions: CustomFunction[];
}

export interface CustomSymbolCategory {
  name: string;
  label: string;
  symbols: CustomSymbol[];
}

export interface ExpressionEditorExtension {
  name: string;
  version: string;
  description?: string;
  customFunctions?: CustomFunction[];
  customSymbols?: CustomSymbol[];
  customFunctionCategories?: CustomFunctionCategory[];
  customSymbolCategories?: CustomSymbolCategory[];
  customVariables?: { [key: string]: any };
}

export interface EditorTheme {
  name: string;
  colors: {
    background: string;
    foreground: string;
    border: string;
    buttonBackground: string;
    buttonHover: string;
    modalBackground: string;
    modalOverlay: string;
  };
}

export interface ValidationRule {
  name: string;
  description: string;
  validate: (expression: string) => ValidationResult;
}

export interface ValidationResult {
  isValid: boolean;
  message?: string;
  errors?: ValidationError[];
}

export interface ValidationError {
  message: string;
  position?: number;
  length?: number;
}

export interface ExpressionEditorConfig {
  title?: string;
  description?: string;
  placeholder?: string;
  rows?: number;
  showHeader?: boolean;
  showFooter?: boolean;
  enableValidation?: boolean;
  enableAutocomplete?: boolean;
  theme?: EditorTheme;
  extensions?: ExpressionEditorExtension[];
  customValidationRules?: ValidationRule[];
  allowedCategories?: string[];
  disabledFunctions?: string[];
}
