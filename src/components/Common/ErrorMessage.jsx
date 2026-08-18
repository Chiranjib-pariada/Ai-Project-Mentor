import { AlertTriangle, X } from 'lucide-react'
import './Message.css'

export default function ErrorMessage({ message, onDismiss }) {
  return (
    <div className="msg msg-error" role="alert">
      <AlertTriangle size={18} />
      <span>{message}</span>
      {onDismiss && (
        <button className="msg-close" onClick={onDismiss} aria-label="Dismiss error">
          <X size={16} />
        </button>
      )}
    </div>
  )
}
