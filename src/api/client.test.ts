import { afterEach, describe, expect, it, vi } from 'vitest'
import { ApiError, calculate } from './client'

function mockFetchOnce(status: number, body: unknown) {
  vi.stubGlobal(
    'fetch',
    vi.fn().mockResolvedValue({
      ok: status >= 200 && status < 300,
      status,
      json: () => Promise.resolve(body),
    }),
  )
}

describe('calculate', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('returns the result on a successful call', async () => {
    mockFetchOnce(200, { result: 5 })

    const result = await calculate('add', 2, 3)

    expect(result).toBe(5)
  })

  it('sends "b" only when provided (unary operations)', async () => {
    mockFetchOnce(200, { result: 4 })
    const fetchSpy = vi.mocked(fetch)

    await calculate('sqrt', 16)

    const [, init] = fetchSpy.mock.calls[0]
    const body = JSON.parse(init!.body as string)
    expect(body).toEqual({ operation: 'sqrt', a: 16 })
  })

  it('throws ApiError with the server message on a 400 response', async () => {
    mockFetchOnce(400, { error: 'division by zero' })

    await expect(calculate('divide', 1, 0)).rejects.toThrow(ApiError)
    await expect(calculate('divide', 1, 0)).rejects.toThrow('division by zero')
  })

  it('throws a generic ApiError when the response has no error field', async () => {
    mockFetchOnce(500, {})

    await expect(calculate('add', 1, 1)).rejects.toThrow('Request failed with status 500')
  })

  it('throws ApiError when the network request fails', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockRejectedValue(new TypeError('network error')),
    )

    await expect(calculate('add', 1, 1)).rejects.toThrow(
      'Could not reach the calculator server. Is it running?',
    )
  })

  it('throws ApiError when the response body is malformed', async () => {
    mockFetchOnce(200, { unexpected: true })

    await expect(calculate('add', 1, 1)).rejects.toThrow('Unexpected response from server.')
  })
})
