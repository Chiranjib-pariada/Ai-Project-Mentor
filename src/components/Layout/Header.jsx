import { Menu, Search, Bell, User } from 'lucide-react'
import './Header.css'

export default function Header({ title, onMenuClick, search, onSearchChange }) {
  return (
    <header className="app-header">
      <div className="header-left">
        <button
          className="btn btn-ghost header-menu-btn"
          onClick={onMenuClick}
          aria-label="Open navigation menu"
        >
          <Menu size={22} />
        </button>
        <h1 className="header-title">{title}</h1>
      </div>

      <div className="header-right">
        <div className="header-search">
          <Search size={16} />
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            aria-label="Global search"
          />
        </div>

        <button className="header-icon-btn" aria-label="Notifications">
          <Bell size={20} />
          <span className="header-dot" />
        </button>

        <div className="header-profile" title="Student user">
          <span className="header-avatar">
            <User size={18} />
          </span>
          <span className="header-user-name">Student</span>
        </div>
      </div>
    </header>
  )
}
