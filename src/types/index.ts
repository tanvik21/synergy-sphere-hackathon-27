export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'progress' | 'done';
  priority: 'low' | 'medium' | 'high';
  assignee: User;
  dueDate: string;
  createdAt: string;
  projectId: string;
  checklist?: ChecklistItem[];
  attachments?: string[];
}

export interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
}

export interface Comment {
  id: string;
  text: string;
  user: User;
  timestamp: string;
  projectId: string;
  reactions?: Reaction[];
}

export interface Reaction {
  id: string;
  emoji: string;
  users: User[];
}

export interface Project {
  id: string;
  name: string;
  description: string;
  members: User[];
  tasks: Task[];
  comments: Comment[];
  createdAt: string;
  deadline?: string;
  icon?: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'task' | 'comment' | 'project';
  timestamp: string;
  read: boolean;
}