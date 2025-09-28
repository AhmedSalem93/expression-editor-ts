import { Variable, DataType } from '../interfaces/shared.interfaces';

export const DEFAULT_VARIABLES: Variable[] = [
  {
    name: 'temperature',
    value: 25.5,
    type: DataType.REAL,
    explanation: 'Current temperature in Celsius',
    example: 'temperature > 30'
  },
  {
    name: 'status',
    value: 'active',
    type: DataType.STRING,
    explanation: 'Current system status',
    example: 'status == "active"'
  },
  {
    name: 'count',
    value: 42,
    type: DataType.INTEGER,
    explanation: 'Number of items processed',
    example: 'count * 2'
  },
  {
    name: 'isEnabled',
    value: true,
    type: DataType.BOOLEAN,
    explanation: 'Whether the feature is enabled',
    example: 'isEnabled && hasPermission'
  },
  {
    name: 'price',
    value: 99.99,
    type: DataType.REAL,
    explanation: 'Product price in currency units',
    example: 'price * quantity'
  },
  {
    name: 'quantity',
    value: 3,
    type: DataType.INTEGER,
    explanation: 'Number of items in order',
    example: 'price * quantity'
  },
  {
    name: 'fahrenheitToCelsius',
    value: '(f) => (f - 32) * 5 / 9',
    type: DataType.FUNCTION,
    explanation: 'Lambda function to convert Fahrenheit to Celsius',
    example: 'fahrenheitToCelsius(77)'
  }
];
