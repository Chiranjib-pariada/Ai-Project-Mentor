import axios from 'axios'

// Base URL for the future Python FastAPI backend.
// Read from the Vite environment variable, falling back to the local dev URL.
const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000'

// Whether to use mock data instead of calling the backend.
// Defaults to true so the frontend runs without a backend.
export const useMockData =
  String(import.meta.env.VITE_USE_MOCK_DATA ?? 'true').toLowerCase() !== 'false'

// Reusable axios instance for future API calls.
const apiClient = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' },
})

// ---- Project endpoints ----
export const getProjects = () => apiClient.get('/api/projects').then((r) => r.data)
export const getProjectById = (projectId) =>
  apiClient.get(`/api/projects/${projectId}`).then((r) => r.data)
export const createProject = (projectData) =>
  apiClient.post('/api/projects', projectData).then((r) => r.data)
export const updateProject = (projectId, projectData) =>
  apiClient.put(`/api/projects/${projectId}`, projectData).then((r) => r.data)
export const deleteProject = (projectId) =>
  apiClient.delete(`/api/projects/${projectId}`).then((r) => r.data)

// ---- Task endpoints ----
export const getTasks = () => apiClient.get('/api/tasks').then((r) => r.data)
export const createTask = (taskData) => apiClient.post('/api/tasks', taskData).then((r) => r.data)
export const updateTask = (taskId, taskData) =>
  apiClient.put(`/api/tasks/${taskId}`, taskData).then((r) => r.data)
export const updateTaskStatus = (taskId, status) =>
  apiClient.patch(`/api/tasks/${taskId}/status`, { status }).then((r) => r.data)
export const deleteTask = (taskId) => apiClient.delete(`/api/tasks/${taskId}`).then((r) => r.data)

// ---- AI endpoints ----
export const generateAIPlan = (requestData) =>
  apiClient.post('/api/ai/plan', requestData).then((r) => r.data)
export const recommendNextTask = (requestData) =>
  apiClient.post('/api/ai/next-task', requestData).then((r) => r.data)
export const getAIHistory = (projectId) =>
  apiClient.get(`/api/ai/history/${projectId}`).then((r) => r.data)

// ---- Dashboard & health ----
export const getDashboardStatistics = () => apiClient.get('/api/dashboard').then((r) => r.data)
export const checkBackendHealth = () => apiClient.get('/api/health').then((r) => r.data)

export default apiClient
