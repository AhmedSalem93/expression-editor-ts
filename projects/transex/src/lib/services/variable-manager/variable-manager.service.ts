import { Injectable } from '@angular/core';
import { Variable, DataType } from '../../interfaces/shared.interfaces';
import { DEFAULT_VARIABLES } from '../../data/default-variables.data';

@Injectable({
  providedIn: 'root'
})
export class VariableManagerService {

  private variables: Variable[] = [];

  constructor() { 
    this.variables = [...DEFAULT_VARIABLES];
  }

  addVariable(variable: Variable): void {
    const existingIndex = this.variables.findIndex(v => v.name === variable.name);
    if (existingIndex >= 0) {
      this.variables[existingIndex] = variable;
    } else {
      this.variables.push(variable);
    }
  }

  removeVariable(name: string): void {
    this.variables = this.variables.filter(v => v.name !== name);
  }

  getVariables(): Variable[] {
    return [...this.variables];
  }

  getVariable(name: string): Variable | undefined {
    return this.variables.find(v => v.name === name);
  }

  extractUsedVariables(expression: string): Variable[] {
    const usedVariables: Variable[] = [];
    const variableNames = expression.match(/\b[a-zA-Z_][a-zA-Z0-9_]*\b/g) || [];
    
    for (const name of variableNames) {
      const variable = this.getVariable(name);
      if (variable && !usedVariables.find(v => v.name === name)) {
        usedVariables.push(variable);
      }
    }
    
    return usedVariables;
  }
}
