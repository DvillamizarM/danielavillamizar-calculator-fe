// Mirrors the calculator-api contract: POST /api/v1/calculate.
export type Operation =
  | 'add'
  | 'subtract'
  | 'multiply'
  | 'divide'
  | 'power'
  | 'sqrt'
  | 'percentage'

export interface CalculateRequest {
  operation: Operation
  a: number
  b?: number
}

export interface CalculateResponse {
  result: number
}

export interface ApiErrorBody {
  error: string
}

export interface OperationDescriptor {
  value: Operation
  label: string
  symbol: string
  /** Unary operations (e.g. sqrt) only take the first operand. */
  unary?: boolean
}

export const OPERATIONS: OperationDescriptor[] = [
  { value: 'add', label: 'Add', symbol: '+' },
  { value: 'subtract', label: 'Subtract', symbol: '−' },
  { value: 'multiply', label: 'Multiply', symbol: '×' },
  { value: 'divide', label: 'Divide', symbol: '÷' },
  { value: 'power', label: 'Power', symbol: 'xʸ' },
  { value: 'sqrt', label: 'Square root', symbol: '√', unary: true },
  { value: 'percentage', label: 'Percentage (a% of b)', symbol: '%' },
]
