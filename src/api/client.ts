import type { CalculateResponse, Operation } from '../types'

const API_BASE_URL: string =
  (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? 'http://localhost:8080'

export class ApiError extends Error {}

function isCalculateResponse(value: unknown): value is CalculateResponse {
  return (
    typeof value === 'object' &&
    value !== null &&
    typeof (value as { result?: unknown }).result === 'number'
  )
}

function isErrorBody(value: unknown): value is { error: string } {
  return (
    typeof value === 'object' &&
    value !== null &&
    typeof (value as { error?: unknown }).error === 'string'
  )
}

/**
 * Calls the calculator API. `b` is omitted for unary operations (sqrt).
 * Throws ApiError with a message safe to show directly to the user.
 */
export async function calculate(operation: Operation, a: number, b?: number): Promise<number> {
  let response: Response
  try {
    response = await fetch(`${API_BASE_URL}/api/v1/calculate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(b === undefined ? { operation, a } : { operation, a, b }),
    })
  } catch {
    throw new ApiError('Could not reach the calculator server. Is it running?')
  }

  const data: unknown = await response.json().catch(() => null)

  if (!response.ok) {
    throw new ApiError(isErrorBody(data) ? data.error : `Request failed with status ${response.status}`)
  }

  if (!isCalculateResponse(data)) {
    throw new ApiError('Unexpected response from server.')
  }

  return data.result
}
