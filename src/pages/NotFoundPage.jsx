import { Link } from 'react-router-dom'
import { Compass } from 'lucide-react'
import './NotFoundPage.css'

export default function NotFoundPage() {
  return (
    <div className="not-found fade-in">
      <div className="not-found-icon">
        <Compass size={48} />
      </div>
      <h1>404</h1>
      <p className="muted">The page you are looking for does not exist or has moved.</p>
      <Link className="btn btn-primary mt-4" to="/">
        Back to Dashboard
      </Link>
    </div>
  )
}
