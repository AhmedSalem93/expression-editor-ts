import { Injectable } from '@angular/core';
import { CustomFunction } from '../interfaces/extensibility.interfaces';

@Injectable({
  providedIn: 'root'
})
export class ExtensionManagerService {
  private customFunctions: CustomFunction[] = [];

  constructor() { }

  getCustomFunctions(): CustomFunction[] {
    return [...this.customFunctions];
  }

  registerCustomFunction(customFunction: CustomFunction): void {
    this.customFunctions.push(customFunction);
  }
}
