import { Injectable } from '@angular/core';
import { 
  Extension, 
  CustomFunction, 
  CustomSymbol
} from '../interfaces/extensibility.interfaces';

@Injectable({
  providedIn: 'root'
})
export class ExtensionManagerService {
  private extensions: Extension[] = [];
  private customFunctions: CustomFunction[] = [];
  private customSymbols: CustomSymbol[] = [];
  private customVariables: { [key: string]: any } = {};

  constructor() { }

  // Register an extension
  registerExtension(extension: Extension): void {
    this.extensions.push(extension);
    
    // Merge custom functions
    if (extension.customFunctions) {
      this.customFunctions.push(...extension.customFunctions);
    }
    
    // Merge custom symbols
    if (extension.customSymbols) {
      this.customSymbols.push(...extension.customSymbols);
    }
    
    // Merge custom variables
    if (extension.customVariables) {
      Object.assign(this.customVariables, extension.customVariables);
    }
  }

  // Get all registered extensions
  getExtensions(): Extension[] {
    return [...this.extensions];
  }

  // Get all custom functions from extensions
  getCustomFunctions(): CustomFunction[] {
    return [...this.customFunctions];
  }

  // Get all custom symbols from extensions
  getCustomSymbols(): CustomSymbol[] {
    return [...this.customSymbols];
  }

  // Get all custom variables from extensions
  getCustomVariables(): { [key: string]: any } {
    return { ...this.customVariables };
  }

  // Get functions by category
  getFunctionsByCategory(category: string): CustomFunction[] {
    return this.customFunctions.filter(func => func.category === category);
  }

  // Get symbols by category
  getSymbolsByCategory(category: string): CustomSymbol[] {
    return this.customSymbols.filter(symbol => symbol.category === category);
  }

  // Execute a custom function
  executeFunction(functionName: string, ...args: any[]): any {
    const func = this.customFunctions.find(f => f.name === functionName);
    if (func && func.implementation) {
      return func.implementation(...args);
    }
    throw new Error(`Function '${functionName}' not found`);
  }

  // Register a single custom function
  registerCustomFunction(customFunction: CustomFunction): void {
    this.customFunctions.push(customFunction);
  }

  // Register a single custom symbol
  registerCustomSymbol(customSymbol: CustomSymbol): void {
    this.customSymbols.push(customSymbol);
  }

  // Register a custom variable
  registerCustomVariable(name: string, value: any): void {
    this.customVariables[name] = value;
  }

  // Clear all extensions
  clearExtensions(): void {
    this.extensions = [];
    this.customFunctions = [];
    this.customSymbols = [];
    this.customVariables = {};
  }

  // Get available function categories
  getFunctionCategories(): string[] {
    const categories = new Set<string>();
    this.customFunctions.forEach(func => categories.add(func.category));
    return Array.from(categories);
  }

  // Get available symbol categories
  getSymbolCategories(): string[] {
    const categories = new Set<string>();
    this.customSymbols.forEach(symbol => categories.add(symbol.category));
    return Array.from(categories);
  }

  // Check if a function exists
  hasFunction(functionName: string): boolean {
    return this.customFunctions.some(func => func.name === functionName);
  }

  // Check if a symbol exists
  hasSymbol(symbolName: string): boolean {
    return this.customSymbols.some(symbol => symbol.name === symbolName);
  }
}
