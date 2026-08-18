import { CheckCircle, X } from 'lucide-react'
import './Message.css'

export default function SuccessMessage({ message, onDismiss }) {
  return (
    <div className="msg msg-success" role="status">
      <CheckCircle size={18} />
      <span>{message}</span>
      {onDismiss && (
        <button className="msg-close" onClick={onDismiss} aria-label="Dismiss message">
          <X size={16} />
        </button>
      )}
    </div>
  )
}
