import { ExpressionTypeResult } from '../core/expression.interfaces';

export interface BinaryTreeResult {
  success: boolean;
  tree?: any;
  json?: string;
  error?: string;
  expression?: string;
  timestamp?: string;
}

export interface ExpressionResult extends ExpressionTypeResult {
  binaryTree?: BinaryTreeResult;
}