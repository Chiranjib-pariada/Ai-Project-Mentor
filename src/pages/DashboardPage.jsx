import { Link } from 'react-router-dom'
import {
  FolderKanban,
  ListTodo,
  Clock,
  Loader2,
  CheckCircle2,
  Sparkles,
  ArrowRight,
} from 'lucide-react'
import { useData } from '../context/DataContext'
import { StatusBadge, PriorityBadge } from '../components/Common/Badges'
import './DashboardPage.css'

export default function DashboardPage() {
  const { projects, tasks } = useData()

  const totalProjects = projects.length
  const totalTasks = tasks.length
  const pendingTasks = tasks.filter((t) => t.status === 'Pending').length
  const inProgressTasks = tasks.filter((t) => t.status === 'In Progress').length
  const completedTasks = tasks.filter((t) => t.status === 'Completed').length

  // Project progress: completed tasks / total tasks per project.
  const projectProgress = projects.map((p) => {
    const pTasks = tasks.filter((t) => t.projectId === p.id)
    const done = pTasks.filter((t) => t.status === 'Completed').length
    const pct = pTasks.length ? Math.round((done / pTasks.length) * 100) : 0
    return { ...p, total: pTasks.length, done, pct }
  })

  const recentTasks = [...tasks]
    .sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1))
    .slice(0, 5)

  // Simple mock "recommended next task" — first pending high-priority task.
  const recommended =
    tasks.find((t) => t.status === 'Pending' && t.priority === 'High') ||
    tasks.find((t) => t.status === 'Pending') ||
    tasks[0]
  const recommendedProject = recommended
    ? projects.find((p) => p.id === recommended.projectId)
    : null

  const stats = [
    { label: 'Total Projects', value: totalProjects, icon: FolderKanban, color: 'stat-indigo' },
    { label: 'Total Tasks', value: totalTasks, icon: ListTodo, color: 'stat-blue' },
    { label: 'Pending Tasks', value: pendingTasks, icon: Clock, color: 'stat-amber' },
    { label: 'In Progress', value: inProgressTasks, icon: Loader2, color: 'stat-cyan' },
    { label: 'Completed Tasks', value: completedTasks, icon: CheckCircle2, color: 'stat-green' },
  ]

  return (
    <div className="fade-in">
      {/* Summary cards */}
      <div className="stat-grid">
        {stats.map((s) => (
          <div key={s.label} className="card stat-card">
            <div className={`stat-icon ${s.color}`}>
              <s.icon size={20} />
            </div>
            <div>
              <div className="stat-value">{s.value}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Project progress */}
      <section className="card card-pad mt-5">
        <div className="flex-between mb-4">
          <h2>Project Progress</h2>
          <Link to="/projects" className="btn btn-ghost btn-sm">
            View all <ArrowRight size={14} />
          </Link>
        </div>

        <div className="progress-list">
          {projectProgress.map((p) => (
            <div key={p.id} className="progress-row">
              <div className="progress-row-head">
                <Link to={`/projects/${p.id}`} className="progress-name">
                  {p.name}
                </Link>
                <span className="muted" style={{ fontSize: 13 }}>
                  {p.done}/{p.total} tasks · {p.pct}%
                </span>
              </div>
              <div className="progress">
                <div className="progress-bar" style={{ width: `${p.pct}%` }} />
              </div>
              <div className="tech-row">
                {p.techStack.map((t) => (
                  <span key={t} className="tech-chip">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="dashboard-grid">
        {/* Recent tasks */}
        <section className="card card-pad">
          <div className="flex-between mb-4">
            <h2>Recent Tasks</h2>
            <Link to="/tasks" className="btn btn-ghost btn-sm">
              View all <ArrowRight size={14} />
            </Link>
          </div>
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Task</th>
                  <th>Project</th>
                  <th>Priority</th>
                  <th>Status</th>
                  <th>Updated</th>
                </tr>
              </thead>
              <tbody>
                {recentTasks.map((t) => {
                  const proj = projects.find((p) => p.id === t.projectId)
                  return (
                    <tr key={t.id}>
                      <td>{t.title}</td>
                      <td>{proj?.name || '—'}</td>
                      <td>
                        <PriorityBadge priority={t.priority} />
                      </td>
                      <td>
                        <StatusBadge status={t.status} />
                      </td>
                      <td className="muted">{t.updatedAt}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </section>

        {/* AI recommendation */}
        <section className="card card-pad ai-recommend">
          <div className="flex-center gap-2 mb-4">
            <span className="ai-recommend-icon">
              <Sparkles size={18} />
            </span>
            <h2>AI Recommended Next Task</h2>
          </div>

          {recommended && recommendedProject ? (
            <>
              <div className="ai-recommend-project">{recommendedProject.name}</div>
              <div className="ai-recommend-task">{recommended.title}</div>
              <p className="muted mt-2">
                This high-priority pending task is blocking progress on{' '}
                {recommendedProject.name}. Starting it now keeps the critical path moving.
              </p>
              <Link to="/ai-mentor" className="btn btn-primary btn-sm mt-4">
                View Recommendation <ArrowRight size={14} />
              </Link>
            </>
          ) : (
            <p className="muted">No recommendations available yet.</p>
          )}
        </section>
      </div>
    </div>
  )
}
