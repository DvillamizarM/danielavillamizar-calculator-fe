import { useState } from 'react'
import { ApiError, calculate } from '../api/client'
import { OPERATIONS, type Operation } from '../types'
import Display from './Display'
import Keypad from './Keypad'

function parseOperand(raw: string): number | null {
  if (raw.trim() === '') return null
  const value = Number(raw)
  return Number.isFinite(value) ? value : null
}

export default function Calculator() {
  const [operation, setOperation] = useState<Operation>('add')
  const [aInput, setAInput] = useState('')
  const [bInput, setBInput] = useState('')
  const [result, setResult] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const isUnary = OPERATIONS.find((op) => op.value === operation)?.unary ?? false

  function handleOperationChange(op: Operation) {
    setOperation(op)
    setResult(null)
    setError(null)
  }

  function handleClear() {
    setAInput('')
    setBInput('')
    setResult(null)
    setError(null)
  }

  async function handleCalculate() {
    setError(null)
    setResult(null)

    const a = parseOperand(aInput)
    if (a === null) {
      setError(`Enter a valid number for the ${isUnary ? 'value' : 'first value'}.`)
      return
    }

    let b: number | undefined
    if (!isUnary) {
      const parsedB = parseOperand(bInput)
      if (parsedB === null) {
        setError('Enter a valid number for the second value.')
        return
      }
      if (operation === 'divide' && parsedB === 0) {
        setError('Cannot divide by zero.')
        return
      }
      b = parsedB
    }

    if (operation === 'sqrt' && a < 0) {
      setError('Cannot take the square root of a negative number.')
      return
    }

    setLoading(true)
    try {
      setResult(await calculate(operation, a, b))
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Something went wrong.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="calculator">
      <Display result={result} error={error} />
      <Keypad
        operation={operation}
        onOperationChange={handleOperationChange}
        aInput={aInput}
        bInput={bInput}
        onAChange={setAInput}
        onBChange={setBInput}
        isUnary={isUnary}
        onCalculate={handleCalculate}
        onClear={handleClear}
        loading={loading}
      />
    </div>
  )
}
