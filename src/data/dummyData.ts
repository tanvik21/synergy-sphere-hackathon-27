import { User, Project, Task, Comment, Notification } from '@/types';

export const dummyUsers: User[] = [
  {
    id: '1',
    name: 'Sarah Chen',
    email: 'sarah@synergysphere.com',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b787?w=150&h=150&fit=crop&crop=face',
    role: 'Product Manager'
  },
  {
    id: '2',
    name: 'Marcus Rodriguez',
    email: 'marcus@synergysphere.com',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    role: 'Frontend Developer'
  },
  {
    id: '3',
    name: 'Emily Johnson',
    email: 'emily@synergysphere.com',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    role: 'UX Designer'
  },
  {
    id: '4',
    name: 'David Kim',
    email: 'david@synergysphere.com',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    role: 'Backend Developer'
  }
];

export const currentUser = dummyUsers[0];

const createTask = (id: string, title: string, status: Task['status'], assigneeId: string, projectId: string, daysOffset: number = 0, priority: Task['priority'] = 'medium'): Task => ({
  id,
  title,
  description: `Description for ${title}`,
  status,
  priority,
  assignee: dummyUsers.find(u => u.id === assigneeId) || dummyUsers[0],
  dueDate: new Date(Date.now() + daysOffset * 24 * 60 * 60 * 1000).toISOString(),
  createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
  projectId,
  checklist: [
    { id: '1', text: 'Review requirements', completed: true },
    { id: '2', text: 'Design mockups', completed: false },
    { id: '3', text: 'Get stakeholder approval', completed: false }
  ],
  attachments: ['design-mockup.figma', 'requirements.pdf']
});

const createComment = (id: string, text: string, userId: string, projectId: string, hoursAgo: number = 0): Comment => ({
  id,
  text,
  user: dummyUsers.find(u => u.id === userId) || dummyUsers[0],
  timestamp: new Date(Date.now() - hoursAgo * 60 * 60 * 1000).toISOString(),
  projectId
});

export const dummyProjects: Project[] = [
  {
    id: '1',
    name: 'Project Alpha',
    description: 'Revolutionary product launch with innovative features',
    icon: '🚀',
    deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
    members: [dummyUsers[0], dummyUsers[1], dummyUsers[2]],
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    tasks: [
      createTask('1', 'Design user interface mockups', 'done', '3', '1', 7, 'high'),
      createTask('2', 'Implement authentication system', 'progress', '2', '1', 3, 'high'),
      createTask('3', 'Set up database schema', 'done', '4', '1', 5, 'medium'),
      createTask('4', 'Create API endpoints', 'progress', '4', '1', 2, 'medium'),
      createTask('5', 'Write unit tests', 'todo', '2', '1', 1, 'low'),
      createTask('6', 'Deploy to staging', 'todo', '4', '1', -1, 'high'),
      createTask('7', 'Conduct user testing', 'todo', '3', '1', -2, 'medium')
    ],
    comments: [
      createComment('1', 'Great progress on the authentication system! The JWT implementation looks solid.', '1', '1', 2),
      createComment('2', 'Thanks Sarah! I\'ll have the OAuth integration ready by tomorrow.', '2', '1', 1),
      createComment('3', 'The UI mockups are approved by the client. Moving to development phase.', '3', '1', 4),
      createComment('4', 'Database performance looks good after the recent optimizations.', '4', '1', 6)
    ]
  },
  {
    id: '2',
    name: 'Project Beta',
    description: 'Mobile app development with cross-platform support',
    icon: '📱',
    deadline: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString(),
    members: [dummyUsers[0], dummyUsers[2], dummyUsers[3]],
    createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
    tasks: [
      createTask('8', 'Research mobile frameworks', 'done', '2', '2', 10, 'medium'),
      createTask('9', 'Create wireframes', 'done', '3', '2', 8, 'high'),
      createTask('10', 'Develop core components', 'progress', '2', '2', 4, 'high'),
      createTask('11', 'Implement push notifications', 'progress', '4', '2', 1, 'medium'),
      createTask('12', 'Optimize for iOS', 'todo', '2', '2', -3, 'low'),
      createTask('13', 'Android testing', 'todo', '4', '2', -1, 'medium'),
      createTask('14', 'App store submission', 'todo', '1', '2', -5, 'low')
    ],
    comments: [
      createComment('5', 'The React Native setup is complete. Ready for component development.', '2', '2', 3),
      createComment('6', 'Push notification service is integrated with Firebase.', '4', '2', 1),
      createComment('7', 'Wireframes look fantastic! The user flow is very intuitive.', '1', '2', 5)
    ]
  }
];

export const dummyNotifications: Notification[] = [
  {
    id: '1',
    title: 'Task Overdue',
    message: 'Task "Deploy to staging" is overdue',
    type: 'task',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    read: false
  },
  {
    id: '2',
    title: 'New Comment',
    message: 'New comment in Project Alpha discussion',
    type: 'comment',
    timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    read: false
  },
  {
    id: '3',
    title: 'Task Assigned',
    message: 'You have been assigned "Optimize for iOS"',
    type: 'task',
    timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    read: true
  },
  {
    id: '4',
    title: 'Project Update',
    message: 'Project Beta milestone completed',
    type: 'project',
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    read: true
  }
];