interface DisplayProps {
  result: number | null
  error: string | null
}

export default function Display({ result, error }: DisplayProps) {
  return (
    <div className="display" role="status" aria-live="polite">
      {error ? (
        <span className="display__error">{error}</span>
      ) : (
        <span className="display__result">{result !== null ? result : '0'}</span>
      )}
    </div>
  )
}
