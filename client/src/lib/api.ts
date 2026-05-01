import axios from 'axios';
import apiClient from './apiClient';
import {
  AuthResponse,
  Project,
  ProjectDetail,
  Task,
  TaskStatus,
  DashboardStats,
  ProjectMember,
  User,
  UserRole,
} from '../types';

// Auth
export const authApi = {
  signup: async (data: { email: string; password: string; name: string }) => {
    const res = await apiClient.post<{ success: true; data: AuthResponse }>('/auth/signup', data);
    return res.data.data;
  },
  login: async (data: { email: string; password: string }) => {
    const res = await apiClient.post<{ success: true; data: AuthResponse }>('/auth/login', data);
    return res.data.data;
  },
  logout: async (refreshToken: string) => {
    await apiClient.post('/auth/logout', { refreshToken });
  },
  forgotPassword: async (email: string) => {
    const res = await apiClient.post<{
      success: true;
      data: { message: string; resetToken?: string; expiresInMinutes?: number };
    }>('/auth/forgot-password', { email });
    return res.data.data;
  },
  resetPassword: async (token: string, password: string) => {
    const res = await apiClient.post<{ success: true; data: { message: string } }>(
      '/auth/reset-password',
      { token, password }
    );
    return res.data.data;
  },
};

// Projects
export const projectsApi = {
  getAll: async (): Promise<Project[]> => {
    const res = await apiClient.get<{ success: true; data: Project[] }>('/projects');
    return res.data.data;
  },
  getById: async (id: string): Promise<ProjectDetail> => {
    const res = await apiClient.get<{ success: true; data: ProjectDetail }>(`/projects/${id}`);
    return res.data.data;
  },
  create: async (data: { name: string; description?: string }): Promise<Project> => {
    const res = await apiClient.post<{ success: true; data: Project }>('/projects', data);
    return res.data.data;
  },
  update: async (id: string, data: { name?: string; description?: string }): Promise<Project> => {
    const res = await apiClient.put<{ success: true; data: Project }>(`/projects/${id}`, data);
    return res.data.data;
  },
  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/projects/${id}`);
  },
  addMember: async (projectId: string, data: { userId: string; role: UserRole }): Promise<ProjectMember> => {
    const res = await apiClient.post<{ success: true; data: ProjectMember }>(
      `/projects/${projectId}/members`,
      data
    );
    return res.data.data;
  },
  removeMember: async (projectId: string, userId: string): Promise<void> => {
    await apiClient.delete(`/projects/${projectId}/members/${userId}`);
  },
  getMembers: async (projectId: string): Promise<ProjectMember[]> => {
    const res = await apiClient.get<{ success: true; data: ProjectMember[] }>(
      `/projects/${projectId}/members`
    );
    return res.data.data;
  },
};

// Tasks
export const tasksApi = {
  getByProject: async (
    projectId: string,
    filters?: { status?: TaskStatus; assigneeId?: string; overdue?: boolean }
  ): Promise<Task[]> => {
    const params = new URLSearchParams();
    if (filters?.status) params.set('status', filters.status);
    if (filters?.assigneeId) params.set('assigneeId', filters.assigneeId);
    if (filters?.overdue) params.set('overdue', 'true');
    const res = await apiClient.get<{ success: true; data: Task[] }>(
      `/projects/${projectId}/tasks?${params.toString()}`
    );
    return res.data.data;
  },
  create: async (data: {
    title: string;
    description?: string;
    projectId: string;
    dueDate?: string;
    assigneeId?: string;
  }): Promise<Task> => {
    const res = await apiClient.post<{ success: true; data: Task }>('/tasks', data);
    return res.data.data;
  },
  update: async (
    id: string,
    data: {
      title?: string;
      description?: string;
      status?: TaskStatus;
      dueDate?: string | null;
      assigneeId?: string | null;
    }
  ): Promise<Task> => {
    const res = await apiClient.put<{ success: true; data: Task }>(`/tasks/${id}`, data);
    return res.data.data;
  },
  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/tasks/${id}`);
  },
};

// Dashboard
export const dashboardApi = {
  getStats: async (projectId?: string): Promise<DashboardStats> => {
    const params = projectId ? `?projectId=${projectId}` : '';
    const res = await apiClient.get<{ success: true; data: DashboardStats }>(
      `/dashboard${params}`
    );
    return res.data.data;
  },
};

// Users
export const usersApi = {
  search: async (search?: string): Promise<User[]> => {
    const params = search ? `?search=${encodeURIComponent(search)}` : '';
    const res = await apiClient.get<{ success: true; data: User[] }>(`/users${params}`);
    return res.data.data;
  },
};

export const getErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.error ?? 'Network error. Please check your connection.';
  }
  if (error instanceof Error) return error.message;
  return 'An unexpected error occurred.';
};
