import { AlertTriangle } from 'lucide-react'

export default function ConfirmDialog({
  title = 'Confirm action',
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  onConfirm,
  onCancel,
}) {
  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="confirm-title">
      <div className="modal" style={{ maxWidth: 440 }}>
        <div className="modal-header">
          <div className="flex-center gap-3">
            <span
              style={{
                color: 'var(--error-600)',
                background: 'var(--error-50)',
                borderRadius: '999px',
                padding: 8,
                display: 'flex',
              }}
            >
              <AlertTriangle size={20} />
            </span>
            <h3 id="confirm-title">{title}</h3>
          </div>
        </div>
        <div className="modal-body">
          <p className="muted">{message}</p>
        </div>
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onCancel}>
            {cancelLabel}
          </button>
          <button className="btn btn-danger" onClick={onConfirm}>
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
