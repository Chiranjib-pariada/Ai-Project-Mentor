import { Link } from 'react-router-dom'
import { Plus, Eye, Pencil, Trash2, FolderKanban } from 'lucide-react'
import { useState } from 'react'
import { useData } from '../context/DataContext'
import Modal from '../components/Common/Modal'
import ConfirmDialog from '../components/Common/ConfirmDialog'
import SuccessMessage from '../components/Common/SuccessMessage'
import EmptyState from '../components/Common/EmptyState'
import './ProjectsPage.css'

const emptyForm = { name: '', description: '', techStack: '' }

export default function ProjectsPage() {
  const { projects, tasks, addProject, updateProject, removeProject } = useData()

  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [errors, setErrors] = useState({})
  const [success, setSuccess] = useState('')
  const [deleteId, setDeleteId] = useState(null)

  const openCreate = () => {
    setEditing(null)
    setForm(emptyForm)
    setErrors({})
    setModalOpen(true)
  }

  const openEdit = (project) => {
    setEditing(project)
    setForm({
      name: project.name,
      description: project.description,
      techStack: project.techStack.join(', '),
    })
    setErrors({})
    setModalOpen(true)
  }

  const validate = () => {
    const e = {}
    if (!form.name.trim()) e.name = 'Project name is required.'
    if (!form.description.trim()) e.description = 'Description is required.'
    if (!form.techStack.trim()) e.techStack = 'Technology stack is required.'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSave = (e) => {
    e.preventDefault()
    if (!validate()) return

    const data = {
      name: form.name.trim(),
      description: form.description.trim(),
      techStack: form.techStack.split(',').map((s) => s.trim()).filter(Boolean),
    }

    if (editing) {
      updateProject(editing.id, data)
      setSuccess('Project updated successfully.')
    } else {
      addProject(data)
      setSuccess('Project created successfully.')
    }
    setModalOpen(false)
    setTimeout(() => setSuccess(''), 3000)
  }

  const confirmDelete = () => {
    removeProject(deleteId)
    setDeleteId(null)
    setSuccess('Project deleted successfully.')
    setTimeout(() => setSuccess(''), 3000)
  }

  const projectToDelete = projects.find((p) => p.id === deleteId)

  return (
    <div className="fade-in">
      {success && <SuccessMessage message={success} onDismiss={() => setSuccess('')} />}

      <div className="flex-between mb-4">
        <p className="muted">Manage your software projects and their details.</p>
        <button className="btn btn-primary" onClick={openCreate}>
          <Plus size={16} /> Create Project
        </button>
      </div>

      {projects.length === 0 ? (
        <EmptyState
          icon={FolderKanban}
          title="No projects yet"
          description="Create your first project to start adding tasks and AI recommendations."
          action={
            <button className="btn btn-primary" onClick={openCreate}>
              <Plus size={16} /> Create Project
            </button>
          }
        />
      ) : (
        <div className="project-grid">
          {projects.map((p) => {
            const pTasks = tasks.filter((t) => t.projectId === p.id)
            const done = pTasks.filter((t) => t.status === 'Completed').length
            const pct = pTasks.length ? Math.round((done / pTasks.length) * 100) : 0
            return (
              <article key={p.id} className="card project-card">
                <div className="project-card-head">
                  <span className="project-id">#{p.id}</span>
                  <h3>{p.name}</h3>
                </div>

                <p className="project-desc muted">{p.description}</p>

                <div className="tech-row mb-4">
                  {p.techStack.map((t) => (
                    <span key={t} className="tech-chip">
                      {t}
                    </span>
                  ))}
                </div>

                <div className="project-stats">
                  <div>
                    <span className="project-stat-num">{pTasks.length}</span>
                    <span className="project-stat-label">Tasks</span>
                  </div>
                  <div>
                    <span className="project-stat-num">{done}</span>
                    <span className="project-stat-label">Done</span>
                  </div>
                  <div>
                    <span className="project-stat-num">{pct}%</span>
                    <span className="project-stat-label">Progress</span>
                  </div>
                </div>

                <div className="progress mb-4">
                  <div className="progress-bar" style={{ width: `${pct}%` }} />
                </div>

                <div className="project-card-foot">
                  <span className="muted" style={{ fontSize: 12 }}>
                    Created {p.createdAt}
                  </span>
                  <div className="flex gap-2">
                    <Link className="btn btn-secondary btn-sm" to={`/projects/${p.id}`}>
                      <Eye size={14} /> View
                    </Link>
                    <button className="btn btn-secondary btn-sm" onClick={() => openEdit(p)}>
                      <Pencil size={14} /> Edit
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => setDeleteId(p.id)}
                      aria-label={`Delete ${p.name}`}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      )}

      {modalOpen && (
        <Modal
          title={editing ? 'Edit Project' : 'Create Project'}
          onClose={() => setModalOpen(false)}
          footer={
            <>
              <button className="btn btn-secondary" onClick={() => setModalOpen(false)}>
                Cancel
              </button>
              <button className="btn btn-primary" type="submit" form="project-form">
                Save Project
              </button>
            </>
          }
        >
          <form id="project-form" onSubmit={handleSave} noValidate>
            <div className="form-group">
              <label className="form-label" htmlFor="proj-name">
                Project Name
              </label>
              <input
                id="proj-name"
                className="form-input"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="e.g. Student Placement Portal"
              />
              {errors.name && <span className="form-error">{errors.name}</span>}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="proj-desc">
                Project Description
              </label>
              <textarea
                id="proj-desc"
                className="form-textarea"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Describe the goal of this project"
              />
              {errors.description && <span className="form-error">{errors.description}</span>}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="proj-tech">
                Technology Stack
              </label>
              <input
                id="proj-tech"
                className="form-input"
                value={form.techStack}
                onChange={(e) => setForm({ ...form, techStack: e.target.value })}
                placeholder="Comma-separated, e.g. React, FastAPI, SQL Server"
              />
              {errors.techStack && <span className="form-error">{errors.techStack}</span>}
              <span className="form-hint">Separate technologies with commas.</span>
            </div>
          </form>
        </Modal>
      )}

      {deleteId && (
        <ConfirmDialog
          title="Delete project?"
          message={`This will permanently remove "${projectToDelete?.name}" and all of its tasks. This cannot be undone.`}
          confirmLabel="Delete Project"
          onConfirm={confirmDelete}
          onCancel={() => setDeleteId(null)}
        />
      )}
    </div>
  )
}
