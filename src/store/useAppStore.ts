import { create } from 'zustand';
import { User, Project, Task, Comment, Notification } from '@/types';
import { dummyUsers, dummyProjects, dummyNotifications, currentUser } from '@/data/dummyData';

interface AppState {
  // Auth
  user: User | null;
  isAuthenticated: boolean;
  
  // Projects
  projects: Project[];
  currentProject: Project | null;
  
  // Tasks
  tasks: Task[];
  
  // Notifications
  notifications: Notification[];
  unreadCount: number;
  
  // UI State
  showTaskModal: boolean;
  editingTask: Task | null;
  showProjectModal: boolean;
  activeTab: 'tasks' | 'discussion';
  
  // Actions
  login: (email: string, password: string) => boolean;
  logout: () => void;
  signup: (name: string, email: string, password: string) => boolean;
  
  // Project actions
  setCurrentProject: (project: Project | null) => void;
  createProject: (name: string, description: string) => void;
  
  // Task actions
  createTask: (task: Omit<Task, 'id' | 'createdAt'>) => void;
  updateTask: (taskId: string, updates: Partial<Task>) => void;
  updateTaskStatus: (taskId: string, status: Task['status']) => void;
  deleteTask: (taskId: string) => void;
  
  // Comment actions
  addComment: (projectId: string, text: string) => void;
  
  // Notification actions
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  
  // UI actions
  setShowTaskModal: (show: boolean) => void;
  setEditingTask: (task: Task | null) => void;
  setShowProjectModal: (show: boolean) => void;
  setActiveTab: (tab: 'tasks' | 'discussion') => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  // Initial state
  user: currentUser,
  isAuthenticated: true, // Start authenticated for demo
  projects: dummyProjects,
  currentProject: null,
  tasks: dummyProjects.flatMap(p => p.tasks),
  notifications: dummyNotifications,
  unreadCount: dummyNotifications.filter(n => !n.read).length,
  showTaskModal: false,
  editingTask: null,
  showProjectModal: false,
  activeTab: 'tasks',
  
  // Auth actions
  login: (email: string, password: string) => {
    // Simple demo login - in real app, this would make API call
    const user = dummyUsers.find(u => u.email === email);
    if (user && password) {
      set({ user, isAuthenticated: true });
      return true;
    }
    return false;
  },
  
  logout: () => {
    set({ user: null, isAuthenticated: false, currentProject: null });
  },
  
  signup: (name: string, email: string, password: string) => {
    // Simple demo signup
    if (name && email && password) {
      const newUser: User = {
        id: Date.now().toString(),
        name,
        email,
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
        role: 'Team Member'
      };
      set({ user: newUser, isAuthenticated: true });
      return true;
    }
    return false;
  },
  
  // Project actions
  setCurrentProject: (project) => {
    set({ currentProject: project });
  },
  
  createProject: (name: string, description: string) => {
    const newProject: Project = {
      id: Date.now().toString(),
      name,
      description,
      members: [get().user!],
      tasks: [],
      comments: [],
      createdAt: new Date().toISOString()
    };
    
    set(state => ({
      projects: [...state.projects, newProject],
      showProjectModal: false
    }));
  },
  
  // Task actions
  createTask: (taskData) => {
    const newTask: Task = {
      ...taskData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    
    set(state => ({
      tasks: [...state.tasks, newTask],
      projects: state.projects.map(p => 
        p.id === taskData.projectId 
          ? { ...p, tasks: [...p.tasks, newTask] }
          : p
      ),
      showTaskModal: false,
      editingTask: null
    }));
  },
  
  updateTask: (taskId: string, updates: Partial<Task>) => {
    set(state => ({
      tasks: state.tasks.map(task => 
        task.id === taskId ? { ...task, ...updates } : task
      ),
      projects: state.projects.map(project => ({
        ...project,
        tasks: project.tasks.map(task => 
          task.id === taskId ? { ...task, ...updates } : task
        )
      })),
      showTaskModal: false,
      editingTask: null
    }));
  },
  
  updateTaskStatus: (taskId: string, status: Task['status']) => {
    get().updateTask(taskId, { status });
  },
  
  deleteTask: (taskId: string) => {
    set(state => ({
      tasks: state.tasks.filter(task => task.id !== taskId),
      projects: state.projects.map(project => ({
        ...project,
        tasks: project.tasks.filter(task => task.id !== taskId)
      }))
    }));
  },
  
  // Comment actions
  addComment: (projectId: string, text: string) => {
    const newComment: Comment = {
      id: Date.now().toString(),
      text,
      user: get().user!,
      timestamp: new Date().toISOString(),
      projectId
    };
    
    set(state => ({
      projects: state.projects.map(project => 
        project.id === projectId 
          ? { ...project, comments: [...project.comments, newComment] }
          : project
      )
    }));
  },
  
  // Notification actions
  markNotificationRead: (id: string) => {
    set(state => ({
      notifications: state.notifications.map(n => 
        n.id === id ? { ...n, read: true } : n
      ),
      unreadCount: state.notifications.filter(n => n.id !== id && !n.read).length
    }));
  },
  
  markAllNotificationsRead: () => {
    set(state => ({
      notifications: state.notifications.map(n => ({ ...n, read: true })),
      unreadCount: 0
    }));
  },
  
  // UI actions
  setShowTaskModal: (show: boolean) => {
    if (!show) {
      set({ showTaskModal: show, editingTask: null });
    } else {
      set({ showTaskModal: show });
    }
  },
  
  setEditingTask: (task: Task | null) => {
    set({ editingTask: task, showTaskModal: !!task });
  },
  
  setShowProjectModal: (show: boolean) => {
    set({ showProjectModal: show });
  },
  
  setActiveTab: (tab: 'tasks' | 'discussion') => {
    set({ activeTab: tab });
  }
}));