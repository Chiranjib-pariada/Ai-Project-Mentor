import { useMemo, useState } from 'react'
import { Plus, Pencil, Trash2, ListTodo, Filter, Search } from 'lucide-react'
import { useData } from '../context/DataContext'
import { PriorityBadge } from '../components/Common/Badges'
import Modal from '../components/Common/Modal'
import ConfirmDialog from '../components/Common/ConfirmDialog'
import SuccessMessage from '../components/Common/SuccessMessage'
import EmptyState from '../components/Common/EmptyState'
import { priorityOptions, statusOptions } from '../data/mockData'
import './TasksPage.css'

const emptyForm = {
  projectId: '',
  title: '',
  description: '',
  priority: 'Medium',
  status: 'Pending',
  aiGenerated: false,
}

export default function TasksPage() {
  const { projects, tasks, addTask, updateTask, updateTaskStatus, removeTask } = useData()

  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [errors, setErrors] = useState({})
  const [success, setSuccess] = useState('')
  const [deleteId, setDeleteId] = useState(null)

  // Filters
  const [filterProject, setFilterProject] = useState('')
  const [filterPriority, setFilterPriority] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [search, setSearch] = useState('')

  const filteredTasks = useMemo(() => {
    return tasks.filter((t) => {
      if (filterProject && t.projectId !== Number(filterProject)) return false
      if (filterPriority && t.priority !== filterPriority) return false
      if (filterStatus && t.status !== filterStatus) return false
      if (search && !t.title.toLowerCase().includes(search.toLowerCase())) return false
      return true
    })
  }, [tasks, filterProject, filterPriority, filterStatus, search])

  const projectName = (pid) => projects.find((p) => p.id === pid)?.name || '—'

  const openCreate = () => {
    setEditing(null)
    setForm({ ...emptyForm, projectId: projects[0]?.id || '' })
    setErrors({})
    setModalOpen(true)
  }

  const openEdit = (task) => {
    setEditing(task)
    setForm({
      projectId: task.projectId,
      title: task.title,
      description: task.description,
      priority: task.priority,
      status: task.status,
      aiGenerated: task.aiGenerated,
    })
    setErrors({})
    setModalOpen(true)
  }

  const validate = () => {
    const e = {}
    if (!form.projectId) e.projectId = 'Please select a project.'
    if (!form.title.trim()) e.title = 'Task title is required.'
    if (!form.description.trim()) e.description = 'Task description is required.'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSave = (e) => {
    e.preventDefault()
    if (!validate()) return
    const data = {
      projectId: Number(form.projectId),
      title: form.title.trim(),
      description: form.description.trim(),
      priority: form.priority,
      status: form.status,
      aiGenerated: form.aiGenerated,
    }
    if (editing) {
      updateTask(editing.id, data)
      setSuccess('Task updated successfully.')
    } else {
      addTask(data)
      setSuccess('Task created successfully.')
    }
    setModalOpen(false)
    setTimeout(() => setSuccess(''), 3000)
  }

  const confirmDelete = () => {
    removeTask(deleteId)
    setDeleteId(null)
    setSuccess('Task deleted successfully.')
    setTimeout(() => setSuccess(''), 3000)
  }

  const clearFilters = () => {
    setFilterProject('')
    setFilterPriority('')
    setFilterStatus('')
    setSearch('')
  }

  const taskToDelete = tasks.find((t) => t.id === deleteId)

  return (
    <div className="fade-in">
      {success && <SuccessMessage message={success} onDismiss={() => setSuccess('')} />}

      <div className="flex-between mb-4 wrap gap-3">
        <p className="muted">All development tasks across your projects.</p>
        <button className="btn btn-primary" onClick={openCreate}>
          <Plus size={16} /> Add Task
        </button>
      </div>

      {/* Filters */}
      <div className="card card-pad mb-4 task-filters">
        <div className="flex-center gap-2 mb-3">
          <Filter size={16} className="muted" />
          <span className="form-label">Filters</span>
        </div>
        <div className="filter-grid">
          <div className="form-group">
            <label className="form-label" htmlFor="f-project">
              Project
            </label>
            <select
              id="f-project"
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
            <label className="form-label" htmlFor="f-priority">
              Priority
            </label>
            <select
              id="f-priority"
              className="form-select"
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
            >
              <option value="">All priorities</option>
              {priorityOptions.map((p) => (
                <option key={p}>{p}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="f-status">
              Status
            </label>
            <select
              id="f-status"
              className="form-select"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="">All statuses</option>
              {statusOptions.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="f-search">
              Search title
            </label>
            <div className="filter-search">
              <Search size={15} />
              <input
                id="f-search"
                className="form-input"
                placeholder="Search tasks..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </div>
        <div className="mt-2">
          <button className="btn btn-ghost btn-sm" onClick={clearFilters}>
            Clear filters
          </button>
        </div>
      </div>

      {/* Tasks table */}
      {filteredTasks.length === 0 ? (
        <EmptyState
          icon={ListTodo}
          title="No tasks found"
          description="No tasks match your filters. Try clearing them or add a new task."
          action={
            <button className="btn btn-primary" onClick={openCreate}>
              <Plus size={16} /> Add Task
            </button>
          }
        />
      ) : (
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Task</th>
                <th>Project</th>
                <th>Priority</th>
                <th>Status</th>
                <th>AI</th>
                <th>Updated</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTasks.map((t) => (
                <tr key={t.id}>
                  <td className="muted">#{t.id}</td>
                  <td>
                    <div style={{ fontWeight: 600 }}>{t.title}</div>
                    <div className="muted task-desc-cell">{t.description}</div>
                  </td>
                  <td>{projectName(t.projectId)}</td>
                  <td>
                    <PriorityBadge priority={t.priority} />
                  </td>
                  <td>
                    <select
                      className="status-select"
                      value={t.status}
                      onChange={(e) => updateTaskStatus(t.id, e.target.value)}
                      aria-label={`Change status for ${t.title}`}
                    >
                      {statusOptions.map((s) => (
                        <option key={s}>{s}</option>
                      ))}
                    </select>
                  </td>
                  <td>{t.aiGenerated ? <span className="badge badge-ai">AI</span> : '—'}</td>
                  <td className="muted">{t.updatedAt}</td>
                  <td>
                    <div className="flex gap-2">
                      <button
                        className="btn btn-ghost btn-sm"
                        onClick={() => openEdit(t)}
                        aria-label={`Edit ${t.title}`}
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        className="btn btn-ghost btn-sm"
                        style={{ color: 'var(--error-600)' }}
                        onClick={() => setDeleteId(t.id)}
                        aria-label={`Delete ${t.title}`}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Task modal */}
      {modalOpen && (
        <Modal
          title={editing ? 'Edit Task' : 'Add Task'}
          onClose={() => setModalOpen(false)}
          footer={
            <>
              <button className="btn btn-secondary" onClick={() => setModalOpen(false)}>
                Cancel
              </button>
              <button className="btn btn-primary" type="submit" form="task-form">
                {editing ? 'Update Task' : 'Add Task'}
              </button>
            </>
          }
        >
          <form id="task-form" onSubmit={handleSave} noValidate>
            <div className="form-group">
              <label className="form-label" htmlFor="t-project">
                Select Project
              </label>
              <select
                id="t-project"
                className="form-select"
                value={form.projectId}
                onChange={(e) => setForm({ ...form, projectId: e.target.value })}
              >
                <option value="">Choose a project...</option>
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
              {errors.projectId && <span className="form-error">{errors.projectId}</span>}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="t-title">
                Task Title
              </label>
              <input
                id="t-title"
                className="form-input"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="e.g. Build login page"
              />
              {errors.title && <span className="form-error">{errors.title}</span>}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="t-desc">
                Task Description
              </label>
              <textarea
                id="t-desc"
                className="form-textarea"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Describe what this task involves"
              />
              {errors.description && <span className="form-error">{errors.description}</span>}
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label" htmlFor="t-priority">
                  Priority
                </label>
                <select
                  id="t-priority"
                  className="form-select"
                  value={form.priority}
                  onChange={(e) => setForm({ ...form, priority: e.target.value })}
                >
                  {priorityOptions.map((p) => (
                    <option key={p}>{p}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="t-status">
                  Status
                </label>
                <select
                  id="t-status"
                  className="form-select"
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                >
                  {statusOptions.map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="checkbox-row">
                <input
                  type="checkbox"
                  checked={form.aiGenerated}
                  onChange={(e) => setForm({ ...form, aiGenerated: e.target.checked })}
                />
                <span className="form-label">AI Generated task</span>
              </label>
            </div>
          </form>
        </Modal>
      )}

      {deleteId && (
        <ConfirmDialog
          title="Delete task?"
          message={`This will permanently remove "${taskToDelete?.title}". This cannot be undone.`}
          confirmLabel="Delete Task"
          onConfirm={confirmDelete}
          onCancel={() => setDeleteId(null)}
        />
      )}
    </div>
  )
}
