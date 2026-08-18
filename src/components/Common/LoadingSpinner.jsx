import './LoadingSpinner.css'

export default function LoadingSpinner({ message }) {
  return (
    <div className="loading-wrap" role="status" aria-live="polite">
      <div className="spinner" />
      {message && <p className="loading-msg">{message}</p>}
    </div>
  )
}
