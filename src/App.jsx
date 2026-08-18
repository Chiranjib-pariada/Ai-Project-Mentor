import { BrowserRouter, Routes, Route } from 'react-router-dom'
import AppLayout from './components/Layout/AppLayout'
import { DataProvider } from './context/DataContext'
import DashboardPage from './pages/DashboardPage'
import ProjectsPage from './pages/ProjectsPage'
import ProjectDetailsPage from './pages/ProjectDetailsPage'
import TasksPage from './pages/TasksPage'
import AIMentorPage from './pages/AIMentorPage'
import AIHistoryPage from './pages/AIHistoryPage'
import NotFoundPage from './pages/NotFoundPage'

function App() {
  return (
    <DataProvider>
      <BrowserRouter>
        <AppLayout>
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/projects" element={<ProjectsPage />} />
            <Route path="/projects/:id" element={<ProjectDetailsPage />} />
            <Route path="/tasks" element={<TasksPage />} />
            <Route path="/ai-mentor" element={<AIMentorPage />} />
            <Route path="/ai-history" element={<AIHistoryPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </AppLayout>
      </BrowserRouter>
    </DataProvider>
  )
}

export default App
