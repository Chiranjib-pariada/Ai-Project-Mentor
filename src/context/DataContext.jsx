import { createContext, useContext, useMemo, useState } from 'react'
import {
  mockProjects,
  mockTasks,
  mockAIHistory,
} from '../data/mockData'

const DataContext = createContext(null)

// Central in-memory store for the frontend demo.
// All CRUD operations work on local React state using mock data.
// When the Python backend is ready, replace these functions with
// calls from src/services/api.js.
export function DataProvider({ children }) {
  const [projects, setProjects] = useState(mockProjects)
  const [tasks, setTasks] = useState(mockTasks)
  const [aiHistory, setAiHistory] = useState(mockAIHistory)

  // ---- Project helpers ----
  const addProject = (data) => {
    const newProject = {
      id: Date.now(),
      createdAt: new Date().toISOString().slice(0, 10),
      ...data,
    }
    setProjects((prev) => [newProject, ...prev])
    return newProject
  }

  const updateProject = (id, data) => {
    setProjects((prev) => prev.map((p) => (p.id === id ? { ...p, ...data } : p)))
  }

  const removeProject = (id) => {
    setProjects((prev) => prev.filter((p) => p.id !== id))
    setTasks((prev) => prev.filter((t) => t.projectId !== id))
  }

  const getProject = (id) => projects.find((p) => p.id === Number(id))

  // ---- Task helpers ----
  const addTask = (data) => {
    const now = new Date().toISOString().slice(0, 10)
    const newTask = {
      id: Date.now(),
      createdAt: now,
      updatedAt: now,
      ...data,
    }
    setTasks((prev) => [newTask, ...prev])
    return newTask
  }

  const updateTask = (id, data) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, ...data, updatedAt: new Date().toISOString().slice(0, 10) } : t,
      ),
    )
  }

  const updateTaskStatus = (id, status) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, status, updatedAt: new Date().toISOString().slice(0, 10) } : t,
      ),
    )
  }

  const removeTask = (id) => {
    setTasks((prev) => prev.filter((t) => t.id !== id))
  }

  const getTask = (id) => tasks.find((t) => t.id === Number(id))

  const tasksForProject = (projectId) => tasks.filter((t) => t.projectId === Number(projectId))

  // ---- AI history helpers ----
  const addAIHistory = (entry) => {
    const newEntry = {
      id: Date.now(),
      createdAt: new Date().toISOString().slice(0, 10),
      ...entry,
    }
    setAiHistory((prev) => [newEntry, ...prev])
    return newEntry
  }

  const removeAIHistory = (id) => {
    setAiHistory((prev) => prev.filter((h) => h.id !== id))
  }

  const value = useMemo(
    () => ({
      projects,
      tasks,
      aiHistory,
      addProject,
      updateProject,
      removeProject,
      getProject,
      addTask,
      updateTask,
      updateTaskStatus,
      removeTask,
      getTask,
      tasksForProject,
      addAIHistory,
      removeAIHistory,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [projects, tasks, aiHistory],
  )

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>
}

export function useData() {
  const ctx = useContext(DataContext)
  if (!ctx) throw new Error('useData must be used within DataProvider')
  return ctx
}
