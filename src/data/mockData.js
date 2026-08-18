// Mock data for the AI Project Mentor frontend.
// Replace these arrays with real API calls once the Python backend is available.

export const mockProjects = [
  {
    id: 1,
    name: 'Student Placement Portal',
    description:
      'A web portal for students to register, upload resumes, and apply for campus placement drives. Recruiters can post openings and shortlist candidates.',
    techStack: ['React', 'FastAPI', 'SQL Server', 'Ollama'],
    createdAt: '2026-07-02',
  },
  {
    id: 2,
    name: 'Hospital Appointment System',
    description:
      'An online appointment booking system for a hospital. Patients can choose doctors, book slots, and receive appointment reminders.',
    techStack: ['React', 'FastAPI', 'SQL Server'],
    createdAt: '2026-07-18',
  },
  {
    id: 3,
    name: 'AI Resume Mentor',
    description:
      'An AI-powered resume review tool that scores resumes, suggests improvements, and recommends relevant skills based on job descriptions.',
    techStack: ['React', 'FastAPI', 'SQL Server', 'GPT-OSS'],
    createdAt: '2026-08-01',
  },
]

export const mockTasks = [
  {
    id: 1,
    projectId: 1,
    title: 'Design student registration form',
    description: 'Create a responsive registration form with validation for student details.',
    priority: 'High',
    status: 'Completed',
    aiGenerated: false,
    createdAt: '2026-07-03',
    updatedAt: '2026-07-05',
  },
  {
    id: 2,
    projectId: 1,
    title: 'Build resume upload component',
    description: 'Allow students to upload PDF resumes and preview them before submission.',
    priority: 'Medium',
    status: 'In Progress',
    aiGenerated: false,
    createdAt: '2026-07-06',
    updatedAt: '2026-07-20',
  },
  {
    id: 3,
    projectId: 1,
    title: 'Create recruiter dashboard',
    description: 'Dashboard for recruiters to view applicants and shortlist resumes.',
    priority: 'High',
    status: 'Pending',
    aiGenerated: false,
    createdAt: '2026-07-10',
    updatedAt: '2026-07-10',
  },
  {
    id: 4,
    projectId: 1,
    title: 'Integrate Ollama resume scoring',
    description: 'Use the Ollama API to score uploaded resumes against job descriptions.',
    priority: 'Medium',
    status: 'Pending',
    aiGenerated: true,
    createdAt: '2026-07-12',
    updatedAt: '2026-07-12',
  },
  {
    id: 5,
    projectId: 2,
    title: 'Design doctor availability calendar',
    description: 'Display available appointment slots for each doctor on a weekly calendar.',
    priority: 'High',
    status: 'Completed',
    aiGenerated: false,
    createdAt: '2026-07-19',
    updatedAt: '2026-07-25',
  },
  {
    id: 6,
    projectId: 2,
    title: 'Build patient booking flow',
    description: 'Multi-step booking flow including slot selection and confirmation.',
    priority: 'Medium',
    status: 'In Progress',
    aiGenerated: false,
    createdAt: '2026-07-22',
    updatedAt: '2026-08-02',
  },
  {
    id: 7,
    projectId: 2,
    title: 'Send appointment email reminders',
    description: 'Send confirmation and reminder emails to patients before appointments.',
    priority: 'Low',
    status: 'Pending',
    aiGenerated: true,
    createdAt: '2026-07-28',
    updatedAt: '2026-07-28',
  },
  {
    id: 8,
    projectId: 3,
    title: 'Create resume parser service',
    description: 'Parse uploaded resumes into structured data for AI analysis.',
    priority: 'High',
    status: 'In Progress',
    aiGenerated: false,
    createdAt: '2026-08-02',
    updatedAt: '2026-08-10',
  },
  {
    id: 9,
    projectId: 3,
    title: 'Build resume scoring dashboard',
    description: 'Display AI scores, strengths, and improvement suggestions to users.',
    priority: 'Medium',
    status: 'Pending',
    aiGenerated: true,
    createdAt: '2026-08-04',
    updatedAt: '2026-08-04',
  },
  {
    id: 10,
    projectId: 3,
    title: 'Recommend missing skills',
    description: 'Compare resume skills with a job description and suggest missing skills.',
    priority: 'Low',
    status: 'Pending',
    aiGenerated: true,
    createdAt: '2026-08-06',
    updatedAt: '2026-08-06',
  },
]

export const mockAIHistory = [
  {
    id: 1,
    projectId: 1,
    projectName: 'Student Placement Portal',
    taskType: 'Break Requirement into Tasks',
    prompt: 'Break the resume upload feature into development tasks.',
    responsePreview:
      'Frontend: build upload form, file preview, validation. Backend: upload endpoint, storage, parsing.',
    fullResponse: {
      requirementUnderstanding:
        'The resume upload feature lets students securely upload PDF resumes and preview them before submitting to a placement drive.',
      frontendTasks: [
        'Create an upload form with drag-and-drop support.',
        'Preview the uploaded PDF in a modal.',
        'Validate file type and size on the client side.',
      ],
      backendTasks: [
        'Add a FastAPI endpoint to receive resume files.',
        'Store resumes in a secure file storage location.',
        'Save resume metadata in SQL Server.',
      ],
      databaseTasks: [
        'Create a Resumes table with student id, file path, and upload date.',
        'Add an index on student id for faster lookups.',
      ],
      testingSteps: [
        'Test upload with a valid PDF.',
        'Test upload with an invalid file type.',
        'Test upload exceeding the maximum file size.',
      ],
      possibleBlockers: [
        'Large file uploads may exceed default FastAPI limits.',
        'PDF preview may not render on older browsers.',
      ],
      recommendedNextAction:
        'Start with the backend upload endpoint so the frontend can integrate against it immediately.',
    },
    modelName: 'GPT-OSS',
    createdAt: '2026-07-12',
  },
  {
    id: 2,
    projectId: 2,
    projectName: 'Hospital Appointment System',
    taskType: 'Generate Project Plan',
    prompt: 'Generate a project plan for the hospital appointment system.',
    responsePreview:
      'Plan covers patient booking, doctor calendar, email reminders, and admin reporting.',
    fullResponse: {
      requirementUnderstanding:
        'The hospital appointment system lets patients book, view, and manage appointments with available doctors.',
      frontendTasks: [
        'Build a patient booking flow.',
        'Display a doctor availability calendar.',
        'Show appointment confirmation and reminders.',
      ],
      backendTasks: [
        'Create appointment booking endpoints.',
        'Manage doctor schedules and slot availability.',
        'Trigger email reminder jobs.',
      ],
      databaseTasks: [
        'Create Doctors, Patients, and Appointments tables.',
        'Store slot availability per doctor per day.',
      ],
      testingSteps: [
        'Test booking a slot that is already taken.',
        'Test reminder email delivery.',
        'Test canceling an appointment.',
      ],
      possibleBlockers: [
        'Concurrent bookings may cause double-booking without locking.',
        'Email delivery may be delayed by the provider.',
      ],
      recommendedNextAction:
        'Define the database schema first so both frontend and backend can agree on data shapes.',
    },
    modelName: 'GPT-OSS',
    createdAt: '2026-07-22',
  },
  {
    id: 3,
    projectId: 3,
    projectName: 'AI Resume Mentor',
    taskType: 'Recommend Next Task',
    prompt: 'What should I work on next for the AI Resume Mentor project?',
    responsePreview:
      'Recommend building the resume parser service before the scoring dashboard.',
    fullResponse: {
      requirementUnderstanding:
        'The AI Resume Mentor project needs structured resume data before scoring can begin.',
      frontendTasks: ['Prepare a loading state for the scoring dashboard.'],
      backendTasks: [
        'Build the resume parser service.',
        'Extract skills, experience, and education from resumes.',
      ],
      databaseTasks: ['Store parsed resume sections for quick retrieval.'],
      testingSteps: ['Test parsing with different resume templates.'],
      possibleBlockers: ['Inconsistent resume formats may reduce parsing accuracy.'],
      recommendedNextAction:
        'Build the resume parser service next because the scoring dashboard depends on its output.',
    },
    modelName: 'GPT-OSS',
    createdAt: '2026-08-05',
  },
  {
    id: 4,
    projectId: 1,
    projectName: 'Student Placement Portal',
    taskType: 'Identify Project Blockers',
    prompt: 'Identify blockers for the placement portal project.',
    responsePreview:
      'Blockers include file upload limits, Ollama API rate limits, and recruiter onboarding flow.',
    fullResponse: {
      requirementUnderstanding:
        'The placement portal has several integration points that may cause delays.',
      frontendTasks: ['Review the recruiter onboarding flow for missing validation.'],
      backendTasks: [
        'Increase FastAPI file upload limits for large resumes.',
        'Add retry logic for Ollama API calls.',
      ],
      databaseTasks: ['Add constraints to avoid duplicate student registrations.'],
      testingSteps: ['Test upload of a 10MB resume file.', 'Test Ollama API timeout handling.'],
      possibleBlockers: [
        'Ollama API rate limits may slow batch scoring.',
        'Recruiters may upload invalid job descriptions.',
      ],
      recommendedNextAction:
        'Add retry logic for the Ollama API and increase upload limits before the next release.',
    },
    modelName: 'GPT-OSS',
    createdAt: '2026-08-09',
  },
]

// AI Task Type options used on the AI Mentor page.
export const aiTaskTypes = [
  'Generate Project Plan',
  'Break Requirement into Tasks',
  'Recommend Next Task',
  'Identify Project Blockers',
  'Explain Implementation',
  'Generate Testing Checklist',
]

// Priority and status options reused across forms and badges.
export const priorityOptions = ['Low', 'Medium', 'High']
export const statusOptions = ['Pending', 'In Progress', 'Completed']
