import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import Calculator from './Calculator'

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

describe('Calculator', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('shows the server result after a successful calculation', async () => {
    const user = userEvent.setup()
    mockFetchOnce(200, { result: 5 })
    render(<Calculator />)

    await user.type(screen.getByLabelText('First value'), '2')
    await user.type(screen.getByLabelText('Second value'), '3')
    await user.click(screen.getByRole('button', { name: '=' }))

    expect(await screen.findByText('5')).toBeInTheDocument()
  })

  it('shows a validation error without calling the API for non-numeric input', async () => {
    const user = userEvent.setup()
    const fetchSpy = vi.fn()
    vi.stubGlobal('fetch', fetchSpy)
    render(<Calculator />)

    // number inputs reject non-numeric characters, so the field stays empty
    await user.click(screen.getByRole('button', { name: '=' }))

    expect(await screen.findByText(/enter a valid number/i)).toBeInTheDocument()
    expect(fetchSpy).not.toHaveBeenCalled()
  })

  it('shows a client-side error for division by zero without calling the API', async () => {
    const user = userEvent.setup()
    const fetchSpy = vi.fn()
    vi.stubGlobal('fetch', fetchSpy)
    render(<Calculator />)

    await user.click(screen.getByRole('button', { name: 'Divide' }))
    await user.type(screen.getByLabelText('First value'), '10')
    await user.type(screen.getByLabelText('Second value'), '0')
    await user.click(screen.getByRole('button', { name: '=' }))

    expect(await screen.findByText('Cannot divide by zero.')).toBeInTheDocument()
    expect(fetchSpy).not.toHaveBeenCalled()
  })

  it('shows a validation error when only the first value is filled in', async () => {
    const user = userEvent.setup()
    const fetchSpy = vi.fn()
    vi.stubGlobal('fetch', fetchSpy)
    render(<Calculator />)

    await user.type(screen.getByLabelText('First value'), '5')
    await user.click(screen.getByRole('button', { name: '=' }))

    expect(await screen.findByText('Enter a valid number for the second value.')).toBeInTheDocument()
    expect(fetchSpy).not.toHaveBeenCalled()
  })

  it('shows a client-side error for a negative sqrt input without calling the API', async () => {
    const user = userEvent.setup()
    const fetchSpy = vi.fn()
    vi.stubGlobal('fetch', fetchSpy)
    render(<Calculator />)

    await user.click(screen.getByRole('button', { name: 'Square root' }))
    await user.type(screen.getByLabelText('Value'), '-4')
    await user.click(screen.getByRole('button', { name: '=' }))

    expect(
      await screen.findByText('Cannot take the square root of a negative number.'),
    ).toBeInTheDocument()
    expect(fetchSpy).not.toHaveBeenCalled()
  })

  it('hides the second input for the unary sqrt operation', async () => {
    const user = userEvent.setup()
    render(<Calculator />)

    await user.click(screen.getByRole('button', { name: 'Square root' }))

    expect(screen.queryByLabelText('Second value')).not.toBeInTheDocument()
    expect(screen.getByLabelText('Value')).toBeInTheDocument()
  })

  it('surfaces a server-side error message', async () => {
    const user = userEvent.setup()
    mockFetchOnce(400, { error: 'division by zero' })
    render(<Calculator />)

    await user.click(screen.getByRole('button', { name: 'Divide' }))
    await user.type(screen.getByLabelText('First value'), '10')
    await user.type(screen.getByLabelText('Second value'), '2')
    await user.click(screen.getByRole('button', { name: '=' }))

    expect(await screen.findByText('division by zero')).toBeInTheDocument()
  })

  it('clears inputs and result when Clear is clicked', async () => {
    const user = userEvent.setup()
    mockFetchOnce(200, { result: 5 })
    render(<Calculator />)

    await user.type(screen.getByLabelText('First value'), '2')
    await user.type(screen.getByLabelText('Second value'), '3')
    await user.click(screen.getByRole('button', { name: '=' }))
    await screen.findByText('5')

    await user.click(screen.getByRole('button', { name: 'Clear' }))

    expect(screen.getByLabelText('First value')).toHaveValue(null)
    expect(screen.getByLabelText('Second value')).toHaveValue(null)
    expect(screen.getByText('0')).toBeInTheDocument()
  })
})
