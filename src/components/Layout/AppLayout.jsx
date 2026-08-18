import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import Sidebar from './Sidebar'
import Header from './Header'
import './AppLayout.css'

const titleMap = {
  '/': 'Dashboard',
  '/projects': 'Projects',
  '/tasks': 'Tasks',
  '/ai-mentor': 'AI Mentor',
  '/ai-history': 'AI History',
}

export default function AppLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [search, setSearch] = useState('')
  const location = useLocation()

  // Derive the header title from the current path.
  const title =
    titleMap[location.pathname] ||
    (location.pathname.startsWith('/projects/') ? 'Project Details' : 'Page')

  return (
    <div className="app-shell">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="app-main">
        <Header
          title={title}
          onMenuClick={() => setSidebarOpen(true)}
          search={search}
          onSearchChange={setSearch}
        />
        <main className="app-content">{children}</main>
      </div>
    </div>
  )
}
