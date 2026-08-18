import { NavLink } from 'react-router-dom'
import { LayoutDashboard, FolderKanban, ListTodo, Sparkles, History, X } from 'lucide-react'
import './Sidebar.css'

const navItems = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/projects', label: 'Projects', icon: FolderKanban },
  { to: '/tasks', label: 'Tasks', icon: ListTodo },
  { to: '/ai-mentor', label: 'AI Mentor', icon: Sparkles },
  { to: '/ai-history', label: 'AI History', icon: History },
]

export default function Sidebar({ open, onClose }) {
  return (
    <>
      {/* Mobile backdrop */}
      {open && <div className="sidebar-backdrop" onClick={onClose} aria-hidden="true" />}

      <aside className={`sidebar ${open ? 'sidebar-open' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-brand">
            <span className="sidebar-logo">
              <Sparkles size={22} />
            </span>
            <span className="sidebar-title">AI Project Mentor</span>
          </div>
          <button
            className="sidebar-close btn btn-ghost"
            onClick={onClose}
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="sidebar-nav">
          {navItems.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) => `sidebar-link ${isActive ? 'sidebar-link-active' : ''}`}
              onClick={onClose}
            >
              <Icon size={18} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <p>Frontend demo · mock data</p>
        </div>
      </aside>
    </>
  )
}
