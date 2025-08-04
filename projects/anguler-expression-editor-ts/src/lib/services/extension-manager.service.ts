import { Injectable } from '@angular/core';
import { 
  ExpressionEditorExtension, 
  CustomFunction, 
  CustomSymbol, 
  CustomFunctionCategory, 
  CustomSymbolCategory 
} from '../interfaces/extensibility.interfaces';

@Injectable({
  providedIn: 'root'
})
export class ExtensionManagerService {
  private extensions: ExpressionEditorExtension[] = [];
  private customFunctions: CustomFunction[] = [];
  private customSymbols: CustomSymbol[] = [];
  private customVariables: { [key: string]: any } = {};

  constructor() { }

  // Register an extension
  registerExtension(extension: ExpressionEditorExtension): void {
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
  getExtensions(): ExpressionEditorExtension[] {
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
}
