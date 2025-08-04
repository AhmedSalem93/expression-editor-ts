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

export interface Extension {
  name: string;
  version: string;
  description: string;
  customFunctions?: CustomFunction[];
  customSymbols?: CustomSymbol[];
  customVariables?: { [key: string]: any };
}

export interface ExpressionEditorConfig {
  title?: string;
  description?: string;
  placeholder?: string;
  rows?: number;
  showHeader?: boolean;
}
