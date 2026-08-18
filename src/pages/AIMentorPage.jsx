import { useState } from 'react'
import { Sparkles, Save, PlusCircle, Eraser, Send } from 'lucide-react'
import { useData } from '../context/DataContext'
import LoadingSpinner from '../components/Common/LoadingSpinner'
import SuccessMessage from '../components/Common/SuccessMessage'
import ErrorMessage from '../components/Common/ErrorMessage'
import EmptyState from '../components/Common/EmptyState'
import { aiTaskTypes } from '../data/mockData'
import './AIMentorPage.css'

// Builds a structured mock AI response based on the chosen task type.
// Later this will be replaced by a call to POST /api/ai/plan on the FastAPI backend.
function buildMockResponse(projectName, requirement, taskType) {
  return {
    requirementUnderstanding: `For ${projectName}, the requirement "${requirement}" is interpreted as a ${taskType.toLowerCase()} request. The AI mentor analyses the project scope, existing tasks, and technology stack to produce a structured plan.`,
    frontendTasks: [
      `Create React components for the "${requirement}" feature in ${projectName}.`,
      'Add form validation and loading states for user inputs.',
      'Connect the UI to the future FastAPI endpoints using Axios.',
    ],
    backendTasks: [
      `Add a FastAPI route to support the "${requirement}" workflow.`,
      'Validate request payloads and return clear error messages.',
      'Persist results in SQL Server using parameterized queries.',
    ],
    databaseTasks: [
      'Create or update the relevant tables with proper primary and foreign keys.',
      'Add indexes on columns used for filtering and joins.',
      'Write migration scripts so schema changes are repeatable.',
    ],
    testingSteps: [
      'Write unit tests for the new React components.',
      'Test the FastAPI endpoint with valid and invalid input.',
      'Verify the database writes with a simple integration test.',
    ],
    possibleBlockers: [
      'The Ollama API may rate-limit long-running requests.',
      'Schema changes may affect existing project tasks.',
      'Browser compatibility for any new UI components.',
    ],
    recommendedNextAction:
      'Start with the backend route so the frontend can integrate against a stable contract, then build the UI and finally add tests.',
  }
}

const sectionLabels = [
  ['requirementUnderstanding', 'Requirement Understanding'],
  ['frontendTasks', 'Frontend Tasks'],
  ['backendTasks', 'Backend Tasks'],
  ['databaseTasks', 'Database Tasks'],
  ['testingSteps', 'Testing Steps'],
  ['possibleBlockers', 'Possible Blockers'],
  ['recommendedNextAction', 'Recommended Next Action'],
]

const emptyForm = { projectId: '', requirement: '', taskType: aiTaskTypes[0] }

export default function AIMentorPage() {
  const { projects, addTask, addAIHistory } = useData()

  const [form, setForm] = useState(emptyForm)
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [response, setResponse] = useState(null)
  const [responseMeta, setResponseMeta] = useState(null)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')

  const validate = () => {
    const e = {}
    if (!form.projectId) e.projectId = 'Please select a project.'
    if (!form.requirement.trim()) e.requirement = 'Please describe your requirement or question.'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleGenerate = (e) => {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    setError('')
    setResponse(null)

    // Simulate an AI request. Replace with generateAIPlan() from services/api.js
    // when the Python backend is available.
    setTimeout(() => {
      const project = projects.find((p) => p.id === Number(form.projectId))
      const mock = buildMockResponse(project.name, form.requirement.trim(), form.taskType)
      setResponse(mock)
      setResponseMeta({
        projectName: project.name,
        prompt: form.requirement.trim(),
        taskType: form.taskType,
        modelName: 'GPT-OSS',
      })
      setLoading(false)
    }, 1600)
  }

  const handleSave = () => {
    if (!response || !responseMeta) return
    addAIHistory({
      projectId: Number(form.projectId),
      projectName: responseMeta.projectName,
      taskType: responseMeta.taskType,
      prompt: responseMeta.prompt,
      responsePreview: response.frontendTasks[0],
      fullResponse: response,
      modelName: responseMeta.modelName,
    })
    setSuccess('Recommendation saved to AI History.')
    setTimeout(() => setSuccess(''), 3000)
  }

  const handleCreateTasks = () => {
    if (!response) return
    const projectId = Number(form.projectId)
    const all = [
      ...response.frontendTasks.map((t) => ({ label: t, group: 'Frontend' })),
      ...response.backendTasks.map((t) => ({ label: t, group: 'Backend' })),
      ...response.databaseTasks.map((t) => ({ label: t, group: 'Database' })),
      ...response.testingSteps.map((t) => ({ label: t, group: 'Testing' })),
    ]
    all.forEach((item) => {
      addTask({
        projectId,
        title: item.label,
        description: `${item.group} task generated by AI Mentor.`,
        priority: 'Medium',
        status: 'Pending',
        aiGenerated: true,
      })
    })
    setSuccess(`${all.length} tasks created from the recommendation.`)
    setTimeout(() => setSuccess(''), 4000)
  }

  const handleClear = () => {
    setResponse(null)
    setResponseMeta(null)
    setForm(emptyForm)
    setErrors({})
  }

  return (
    <div className="fade-in">
      {success && <SuccessMessage message={success} onDismiss={() => setSuccess('')} />}
      {error && <ErrorMessage message={error} onDismiss={() => setError('')} />}

      <div className="ai-grid">
        {/* Form panel */}
        <section className="card card-pad ai-form-panel">
          <div className="flex-center gap-2 mb-4">
            <span className="ai-badge">
              <Sparkles size={18} />
            </span>
            <h2>Ask AI Mentor</h2>
          </div>

          <form onSubmit={handleGenerate} noValidate>
            <div className="form-group">
              <label className="form-label" htmlFor="ai-project">
                Select Project
              </label>
              <select
                id="ai-project"
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
              <label className="form-label" htmlFor="ai-requirement">
                Requirement or Question
              </label>
              <textarea
                id="ai-requirement"
                className="form-textarea"
                value={form.requirement}
                onChange={(e) => setForm({ ...form, requirement: e.target.value })}
                placeholder="Describe the feature or question you want the AI mentor to analyse..."
                style={{ minHeight: 120 }}
              />
              {errors.requirement && <span className="form-error">{errors.requirement}</span>}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="ai-tasktype">
                AI Task Type
              </label>
              <select
                id="ai-tasktype"
                className="form-select"
                value={form.taskType}
                onChange={(e) => setForm({ ...form, taskType: e.target.value })}
              >
                {aiTaskTypes.map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
            </div>

            <button className="btn btn-primary btn-block" type="submit" disabled={loading}>
              <Send size={16} /> Generate AI Recommendation
            </button>
          </form>

          <p className="form-hint mt-4">
            The AI Mentor uses a mock response for this demo. The Ollama API key will stay in the
            Python backend.
          </p>
        </section>

        {/* Response panel */}
        <section className="ai-response-panel">
          {loading ? (
            <div className="card card-pad">
              <LoadingSpinner message="AI Mentor is analysing your project..." />
            </div>
          ) : response ? (
            <div className="card card-pad">
              <div className="flex-between mb-4 wrap gap-3">
                <div>
                  <span className="badge badge-ai">{responseMeta.taskType}</span>
                  <h2 className="mt-2" style={{ fontSize: 19 }}>
                    {responseMeta.projectName}
                  </h2>
                </div>
                <span className="muted" style={{ fontSize: 13 }}>
                  Model: {responseMeta.modelName}
                </span>
              </div>

              <div className="ai-sections">
                {sectionLabels.map(([key, label]) => {
                  const value = response[key]
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

              <div className="ai-actions mt-4">
                <button className="btn btn-secondary" onClick={handleSave}>
                  <Save size={16} /> Save Recommendation
                </button>
                <button className="btn btn-primary" onClick={handleCreateTasks}>
                  <PlusCircle size={16} /> Create Tasks from Recommendation
                </button>
                <button className="btn btn-ghost" onClick={handleClear}>
                  <Eraser size={16} /> Clear Response
                </button>
              </div>
            </div>
          ) : (
            <div className="card card-pad">
              <EmptyState
                icon={Sparkles}
                title="No recommendation yet"
                description="Select a project, describe a requirement, and generate an AI recommendation to see it here."
              />
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
