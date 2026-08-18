import { X } from 'lucide-react'

export default function Modal({ title, onClose, children, footer, size = 'md' }) {
  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <div className={`modal ${size === 'lg' ? 'modal-lg' : ''}`}>
        <div className="modal-header">
          <div className="flex-between">
            <h3 id="modal-title">{title}</h3>
            <button
              className="btn btn-ghost btn-sm"
              onClick={onClose}
              aria-label="Close dialog"
              style={{ padding: 4 }}
            >
              <X size={18} />
            </button>
          </div>
        </div>
        <div className="modal-body">{children}</div>
        {footer && <div className="modal-footer">{footer}</div>}
      </div>
    </div>
  )
}
