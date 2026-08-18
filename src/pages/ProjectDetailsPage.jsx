import { useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  Plus,
  Pencil,
  Sparkles,
  Trash2,
  CalendarDays,
  Layers,
} from 'lucide-react'
import { useData } from '../context/DataContext'
import { StatusBadge, PriorityBadge } from '../components/Common/Badges'
import Modal from '../components/Common/Modal'
import ConfirmDialog from '../components/Common/ConfirmDialog'
import SuccessMessage from '../components/Common/SuccessMessage'
import EmptyState from '../components/Common/EmptyState'
import { priorityOptions, statusOptions } from '../data/mockData'
import './ProjectDetailsPage.css'

const emptyTaskForm = {
  title: '',
  description: '',
  priority: 'Medium',
  status: 'Pending',
  aiGenerated: false,
}

export default function ProjectDetailsPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const {
    getProject,
    tasksForProject,
    addTask,
    updateTask,
    removeTask,
    updateProject,
  } = useData()

  const project = getProject(id)
  const projectTasks = tasksForProject(id)

  const [taskModalOpen, setTaskModalOpen] = useState(false)
  const [editingTask, setEditingTask] = useState(null)
  const [taskForm, setTaskForm] = useState(emptyTaskForm)
  const [taskErrors, setTaskErrors] = useState({})
  const [success, setSuccess] = useState('')
  const [deleteTaskId, setDeleteTaskId] = useState(null)

  const [editProjectOpen, setEditProjectOpen] = useState(false)
  const [projectForm, setProjectForm] = useState({
    name: '',
    description: '',
    techStack: '',
  })
  const [projectErrors, setProjectErrors] = useState({})

  if (!project) {
    return (
      <div className="fade-in">
        <EmptyState
          title="Project not found"
          description="The project you are looking for does not exist or has been removed."
          action={
            <Link className="btn btn-primary" to="/projects">
              <ArrowLeft size={16} /> Back to Projects
            </Link>
          }
        />
      </div>
    )
  }

  const done = projectTasks.filter((t) => t.status === 'Completed').length
  const pct = projectTasks.length ? Math.round((done / projectTasks.length) * 100) : 0

  const openCreateTask = () => {
    setEditingTask(null)
    setTaskForm(emptyTaskForm)
    setTaskErrors({})
    setTaskModalOpen(true)
  }

  const openEditTask = (task) => {
    setEditingTask(task)
    setTaskForm({
      title: task.title,
      description: task.description,
      priority: task.priority,
      status: task.status,
      aiGenerated: task.aiGenerated,
    })
    setTaskErrors({})
    setTaskModalOpen(true)
  }

  const validateTask = () => {
    const e = {}
    if (!taskForm.title.trim()) e.title = 'Task title is required.'
    if (!taskForm.description.trim()) e.description = 'Task description is required.'
    setTaskErrors(e)
    return Object.keys(e).length === 0
  }

  const handleTaskSave = (e) => {
    e.preventDefault()
    if (!validateTask()) return
    const data = {
      projectId: project.id,
      title: taskForm.title.trim(),
      description: taskForm.description.trim(),
      priority: taskForm.priority,
      status: taskForm.status,
      aiGenerated: taskForm.aiGenerated,
    }
    if (editingTask) {
      updateTask(editingTask.id, data)
      setSuccess('Task updated successfully.')
    } else {
      addTask(data)
      setSuccess('Task added successfully.')
    }
    setTaskModalOpen(false)
    setTimeout(() => setSuccess(''), 3000)
  }

  const confirmDeleteTask = () => {
    removeTask(deleteTaskId)
    setDeleteTaskId(null)
    setSuccess('Task deleted successfully.')
    setTimeout(() => setSuccess(''), 3000)
  }

  const openEditProject = () => {
    setProjectForm({
      name: project.name,
      description: project.description,
      techStack: project.techStack.join(', '),
    })
    setProjectErrors({})
    setEditProjectOpen(true)
  }

  const validateProject = () => {
    const e = {}
    if (!projectForm.name.trim()) e.name = 'Project name is required.'
    if (!projectForm.description.trim()) e.description = 'Description is required.'
    if (!projectForm.techStack.trim()) e.techStack = 'Technology stack is required.'
    setProjectErrors(e)
    return Object.keys(e).length === 0
  }

  const handleProjectSave = (e) => {
    e.preventDefault()
    if (!validateProject()) return
    updateProject(project.id, {
      name: projectForm.name.trim(),
      description: projectForm.description.trim(),
      techStack: projectForm.techStack.split(',').map((s) => s.trim()).filter(Boolean),
    })
    setEditProjectOpen(false)
    setSuccess('Project updated successfully.')
    setTimeout(() => setSuccess(''), 3000)
  }

  return (
    <div className="fade-in">
      {success && <SuccessMessage message={success} onDismiss={() => setSuccess('')} />}

      <button className="btn btn-ghost btn-sm mb-4" onClick={() => navigate('/projects')}>
        <ArrowLeft size={16} /> Back to Projects
      </button>

      {/* Project summary */}
      <section className="card card-pad detail-summary">
        <div className="flex-between wrap gap-4">
          <div className="detail-summary-head">
            <h2>{project.name}</h2>
            <div className="flex gap-3 wrap mt-2">
              <span className="detail-meta">
                <CalendarDays size={15} /> Created {project.createdAt}
              </span>
              <span className="detail-meta">
                <Layers size={15} /> {projectTasks.length} tasks · {done} completed
              </span>
            </div>
          </div>
          <div className="flex gap-2 wrap">
            <button className="btn btn-primary" onClick={openCreateTask}>
              <Plus size={16} /> Add Task
            </button>
            <button className="btn btn-secondary" onClick={openEditProject}>
              <Pencil size={16} /> Edit Project
            </button>
            <Link className="btn btn-secondary" to="/ai-mentor">
              <Sparkles size={16} /> Ask AI Mentor
            </Link>
          </div>
        </div>

        <p className="muted mt-4">{project.description}</p>

        <div className="tech-row mt-4">
          {project.techStack.map((t) => (
            <span key={t} className="tech-chip">
              {t}
            </span>
          ))}
        </div>

        <div className="detail-progress mt-4">
          <div className="flex-between mb-2">
            <span className="form-label">Overall Progress</span>
            <span className="muted" style={{ fontSize: 13 }}>
              {pct}%
            </span>
          </div>
          <div className="progress">
            <div className="progress-bar" style={{ width: `${pct}%` }} />
          </div>
        </div>
      </section>

      {/* Tasks list */}
      <section className="mt-5">
        <div className="flex-between mb-4">
          <h2>Tasks</h2>
          <button className="btn btn-primary btn-sm" onClick={openCreateTask}>
            <Plus size={16} /> Add Task
          </button>
        </div>

        {projectTasks.length === 0 ? (
          <EmptyState
            title="No tasks yet"
            description="Add development tasks to this project or ask the AI Mentor to break a requirement into tasks."
            action={
              <button className="btn btn-primary" onClick={openCreateTask}>
                <Plus size={16} /> Add Task
              </button>
            }
          />
        ) : (
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Task</th>
                  <th>Priority</th>
                  <th>Status</th>
                  <th>AI</th>
                  <th>Updated</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {projectTasks.map((t) => (
                  <tr key={t.id}>
                    <td>
                      <div style={{ fontWeight: 600 }}>{t.title}</div>
                      <div className="muted" style={{ fontSize: 12 }}>
                        #{t.id}
                      </div>
                    </td>
                    <td>
                      <PriorityBadge priority={t.priority} />
                    </td>
                    <td>
                      <StatusBadge status={t.status} />
                    </td>
                    <td>{t.aiGenerated ? <span className="badge badge-ai">AI</span> : '—'}</td>
                    <td className="muted">{t.updatedAt}</td>
                    <td>
                      <div className="flex gap-2">
                        <button
                          className="btn btn-ghost btn-sm"
                          onClick={() => openEditTask(t)}
                          aria-label={`Edit ${t.title}`}
                        >
                          <Pencil size={14} />
                        </button>
                        <button
                          className="btn btn-ghost btn-sm"
                          style={{ color: 'var(--error-600)' }}
                          onClick={() => setDeleteTaskId(t.id)}
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
      </section>

      {/* Task modal */}
      {taskModalOpen && (
        <Modal
          title={editingTask ? 'Edit Task' : 'Add Task'}
          onClose={() => setTaskModalOpen(false)}
          footer={
            <>
              <button className="btn btn-secondary" onClick={() => setTaskModalOpen(false)}>
                Cancel
              </button>
              <button className="btn btn-primary" type="submit" form="task-form-detail">
                {editingTask ? 'Update Task' : 'Add Task'}
              </button>
            </>
          }
        >
          <form id="task-form-detail" onSubmit={handleTaskSave} noValidate>
            <div className="form-group">
              <label className="form-label" htmlFor="td-title">
                Task Title
              </label>
              <input
                id="td-title"
                className="form-input"
                value={taskForm.title}
                onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
                placeholder="e.g. Build login page"
              />
              {taskErrors.title && <span className="form-error">{taskErrors.title}</span>}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="td-desc">
                Task Description
              </label>
              <textarea
                id="td-desc"
                className="form-textarea"
                value={taskForm.description}
                onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })}
                placeholder="Describe what this task involves"
              />
              {taskErrors.description && (
                <span className="form-error">{taskErrors.description}</span>
              )}
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label" htmlFor="td-priority">
                  Priority
                </label>
                <select
                  id="td-priority"
                  className="form-select"
                  value={taskForm.priority}
                  onChange={(e) => setTaskForm({ ...taskForm, priority: e.target.value })}
                >
                  {priorityOptions.map((p) => (
                    <option key={p}>{p}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="td-status">
                  Status
                </label>
                <select
                  id="td-status"
                  className="form-select"
                  value={taskForm.status}
                  onChange={(e) => setTaskForm({ ...taskForm, status: e.target.value })}
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
                  checked={taskForm.aiGenerated}
                  onChange={(e) => setTaskForm({ ...taskForm, aiGenerated: e.target.checked })}
                />
                <span className="form-label">AI Generated task</span>
              </label>
            </div>
          </form>
        </Modal>
      )}

      {/* Edit project modal */}
      {editProjectOpen && (
        <Modal
          title="Edit Project"
          onClose={() => setEditProjectOpen(false)}
          footer={
            <>
              <button className="btn btn-secondary" onClick={() => setEditProjectOpen(false)}>
                Cancel
              </button>
              <button className="btn btn-primary" type="submit" form="project-edit-form">
                Save Project
              </button>
            </>
          }
        >
          <form id="project-edit-form" onSubmit={handleProjectSave} noValidate>
            <div className="form-group">
              <label className="form-label" htmlFor="pe-name">
                Project Name
              </label>
              <input
                id="pe-name"
                className="form-input"
                value={projectForm.name}
                onChange={(e) => setProjectForm({ ...projectForm, name: e.target.value })}
              />
              {projectErrors.name && <span className="form-error">{projectErrors.name}</span>}
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="pe-desc">
                Project Description
              </label>
              <textarea
                id="pe-desc"
                className="form-textarea"
                value={projectForm.description}
                onChange={(e) =>
                  setProjectForm({ ...projectForm, description: e.target.value })
                }
              />
              {projectErrors.description && (
                <span className="form-error">{projectErrors.description}</span>
              )}
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="pe-tech">
                Technology Stack
              </label>
              <input
                id="pe-tech"
                className="form-input"
                value={projectForm.techStack}
                onChange={(e) => setProjectForm({ ...projectForm, techStack: e.target.value })}
              />
              {projectErrors.techStack && (
                <span className="form-error">{projectErrors.techStack}</span>
              )}
              <span className="form-hint">Separate technologies with commas.</span>
            </div>
          </form>
        </Modal>
      )}

      {deleteTaskId && (
        <ConfirmDialog
          title="Delete task?"
          message="This will permanently remove this task from the project."
          confirmLabel="Delete Task"
          onConfirm={confirmDeleteTask}
          onCancel={() => setDeleteTaskId(null)}
        />
      )}
    </div>
  )
}
