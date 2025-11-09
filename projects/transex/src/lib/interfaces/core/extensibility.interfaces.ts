export interface CustomFunction {
  name: string;
  syntax: string;
  description: string;
  example?: string;
  category: string;
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
  customFunctions?: CustomFunction[];
  customSymbols?: CustomSymbol[];
}