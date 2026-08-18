import { useMemo, useState } from 'react'
import { Eye, Trash2, History, X } from 'lucide-react'
import { useData } from '../context/DataContext'
import { aiTaskTypes } from '../data/mockData'
import Modal from '../components/Common/Modal'
import ConfirmDialog from '../components/Common/ConfirmDialog'
import SuccessMessage from '../components/Common/SuccessMessage'
import EmptyState from '../components/Common/EmptyState'
import './AIHistoryPage.css'

const sectionLabels = [
  ['requirementUnderstanding', 'Requirement Understanding'],
  ['frontendTasks', 'Frontend Tasks'],
  ['backendTasks', 'Backend Tasks'],
  ['databaseTasks', 'Database Tasks'],
  ['testingSteps', 'Testing Steps'],
  ['possibleBlockers', 'Possible Blockers'],
  ['recommendedNextAction', 'Recommended Next Action'],
]

export default function AIHistoryPage() {
  const { aiHistory, projects, removeAIHistory } = useData()

  const [filterProject, setFilterProject] = useState('')
  const [filterType, setFilterType] = useState('')
  const [filterDate, setFilterDate] = useState('')
  const [viewItem, setViewItem] = useState(null)
  const [deleteId, setDeleteId] = useState(null)
  const [success, setSuccess] = useState('')

  const filtered = useMemo(() => {
    return aiHistory.filter((h) => {
      if (filterProject && h.projectId !== Number(filterProject)) return false
      if (filterType && h.taskType !== filterType) return false
      if (filterDate && h.createdAt !== filterDate) return false
      return true
    })
  }, [aiHistory, filterProject, filterType, filterDate])

  const confirmDelete = () => {
    removeAIHistory(deleteId)
    setDeleteId(null)
    setSuccess('AI interaction deleted successfully.')
    setTimeout(() => setSuccess(''), 3000)
  }

  const clearFilters = () => {
    setFilterProject('')
    setFilterType('')
    setFilterDate('')
  }

  const itemToDelete = aiHistory.find((h) => h.id === deleteId)

  return (
    <div className="fade-in">
      {success && <SuccessMessage message={success} onDismiss={() => setSuccess('')} />}

      <p className="muted mb-4">Previous AI Mentor interactions and their full responses.</p>

      {/* Filters */}
      <div className="card card-pad mb-4">
        <div className="filter-grid">
          <div className="form-group">
            <label className="form-label" htmlFor="h-project">
              Project
            </label>
            <select
              id="h-project"
              className="form-select"
              value={filterProject}
              onChange={(e) => setFilterProject(e.target.value)}
            >
              <option value="">All projects</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="h-type">
              AI Task Type
            </label>
            <select
              id="h-type"
              className="form-select"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              <option value="">All types</option>
              {aiTaskTypes.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="h-date">
              Date
            </label>
            <input
              id="h-date"
              type="date"
              className="form-input"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
            />
          </div>
        </div>
        <div className="mt-2">
          <button className="btn btn-ghost btn-sm" onClick={clearFilters}>
            Clear filters
          </button>
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={History}
          title="No AI interactions found"
          description="Generate a recommendation on the AI Mentor page to build up your history."
        />
      ) : (
        <div className="history-grid">
          {filtered.map((h) => (
            <article key={h.id} className="card history-card">
              <div className="flex-between mb-2">
                <span className="badge badge-ai">{h.taskType}</span>
                <span className="muted" style={{ fontSize: 12 }}>
                  #{h.id}
                </span>
              </div>
              <h3>{h.projectName}</h3>
              <p className="history-prompt mt-2">{h.prompt}</p>
              <p className="muted history-preview mt-2">{h.responsePreview}</p>
              <div className="history-foot">
                <span className="muted" style={{ fontSize: 12 }}>
                  {h.modelName} · {h.createdAt}
                </span>
                <div className="flex gap-2">
                  <button className="btn btn-secondary btn-sm" onClick={() => setViewItem(h)}>
                    <Eye size={14} /> View
                  </button>
                  <button
                    className="btn btn-ghost btn-sm"
                    style={{ color: 'var(--error-600)' }}
                    onClick={() => setDeleteId(h.id)}
                    aria-label="Delete interaction"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* View full response modal */}
      {viewItem && (
        <Modal
          title="AI Interaction"
          onClose={() => setViewItem(null)}
          size="lg"
          footer={
            <button className="btn btn-secondary" onClick={() => setViewItem(null)}>
              <X size={16} /> Close
            </button>
          }
        >
          <div className="flex-between wrap gap-2 mb-4">
            <div>
              <span className="badge badge-ai">{viewItem.taskType}</span>
              <h3 className="mt-2" style={{ fontSize: 18 }}>
                {viewItem.projectName}
              </h3>
            </div>
            <span className="muted" style={{ fontSize: 13 }}>
              {viewItem.modelName} · {viewItem.createdAt}
            </span>
          </div>

          <div className="history-prompt-box">
            <span className="form-label">User Prompt</span>
            <p className="mt-2">{viewItem.prompt}</p>
          </div>

          <div className="ai-sections mt-4">
            {sectionLabels.map(([key, label]) => {
              const value = viewItem.fullResponse?.[key]
              if (!value) return null
              return (
                <div key={key} className="ai-section">
                  <h3>{label}</h3>
                  {Array.isArray(value) ? (
                    <ul>
                      {value.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                  ) : (
                    <p>{value}</p>
                  )}
                </div>
              )
            })}
          </div>
        </Modal>
      )}

      {deleteId && (
        <ConfirmDialog
          title="Delete AI interaction?"
          message={`This will permanently remove the interaction "${itemToDelete?.prompt}".`}
          confirmLabel="Delete"
          onConfirm={confirmDelete}
          onCancel={() => setDeleteId(null)}
        />
      )}
    </div>
  )
}
