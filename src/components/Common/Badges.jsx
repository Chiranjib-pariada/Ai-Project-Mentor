const statusClassMap = {
  Pending: 'badge-pending',
  'In Progress': 'badge-progress',
  Completed: 'badge-completed',
}

const priorityClassMap = {
  Low: 'badge-low',
  Medium: 'badge-medium',
  High: 'badge-high',
}

export function StatusBadge({ status }) {
  return <span className={`badge ${statusClassMap[status] || 'badge-neutral'}`}>{status}</span>
}

export function PriorityBadge({ priority }) {
  return (
    <span className={`badge ${priorityClassMap[priority] || 'badge-neutral'}`}>{priority}</span>
  )
}
