import type { FormEvent } from 'react'
import { OPERATIONS, type Operation } from '../types'

interface KeypadProps {
  operation: Operation
  onOperationChange: (op: Operation) => void
  aInput: string
  bInput: string
  onAChange: (value: string) => void
  onBChange: (value: string) => void
  isUnary: boolean
  onCalculate: () => void
  onClear: () => void
  loading: boolean
}

export default function Keypad({
  operation,
  onOperationChange,
  aInput,
  bInput,
  onAChange,
  onBChange,
  isUnary,
  onCalculate,
  onClear,
  loading,
}: KeypadProps) {
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    onCalculate()
  }

  return (
    <form className="keypad" onSubmit={handleSubmit}>
      <div className="keypad__operations" role="group" aria-label="Operation">
        {OPERATIONS.map((op) => (
          <button
            key={op.value}
            type="button"
            className={`keypad__op${operation === op.value ? ' keypad__op--active' : ''}`}
            aria-pressed={operation === op.value}
            aria-label={op.label}
            title={op.label}
            onClick={() => onOperationChange(op.value)}
          >
            {op.symbol}
          </button>
        ))}
      </div>

      <div className="keypad__inputs">
        <label className="keypad__field">
          <span>{isUnary ? 'Value' : 'First value'}</span>
          <input
            type="number"
            inputMode="decimal"
            aria-label={isUnary ? 'Value' : 'First value'}
            value={aInput}
            onChange={(event) => onAChange(event.target.value)}
            placeholder="0"
          />
        </label>

        {!isUnary && (
          <label className="keypad__field">
            <span>Second value</span>
            <input
              type="number"
              inputMode="decimal"
              aria-label="Second value"
              value={bInput}
              onChange={(event) => onBChange(event.target.value)}
              placeholder="0"
            />
          </label>
        )}
      </div>

      <div className="keypad__actions">
        <button type="button" className="keypad__clear" onClick={onClear}>
          Clear
        </button>
        <button type="submit" className="keypad__equals" disabled={loading}>
          {loading ? 'Calculating…' : '='}
        </button>
      </div>
    </form>
  )
}
