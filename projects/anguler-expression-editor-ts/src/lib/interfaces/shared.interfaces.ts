// Shared interfaces used across multiple components

export interface FunctionCategory {
  name: string;
  label: string;
  functions: FunctionItem[];
}

export interface FunctionItem {
  name: string;
  syntax: string;
  description: string;
  example?: string;
  category: string;
}

export interface SymbolCategory {
  name: string;
  label: string;
  symbols: SymbolItem[];
}

export interface SymbolItem {
  name: string;
  symbol: string;
  description: string;
  category: string;
}

export interface EvaluationResult {
  success: boolean;
  result?: any;
  type?: string;
  error?: string;
}
