export type UserRole = 'ADMIN' | 'MEMBER';
export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'COMPLETED' | 'BLOCKED';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}

export interface Project {
  id: string;
  name: string;
  description: string | null;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  userRole: UserRole;
  memberCount?: number;
  taskStats?: Record<TaskStatus, number>;
}

export interface ProjectDetail extends Project {
  members: ProjectMember[];
}

export interface Task {
  id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  dueDate: string | null;
  projectId: string;
  assigneeId: string | null;
  assignee: Pick<User, 'id' | 'name' | 'email'> | null;
  createdAt: string;
  updatedAt: string;
}

export interface ProjectMember {
  id: string;
  projectId: string;
  userId: string;
  role: UserRole;
  name: string;
  email: string;
}

export interface DashboardStats {
  tasksByStatus: Record<TaskStatus, number>;
  overdueCount: number;
  assignedToMe: number;
  totalTasks: number;
  projects: Array<{ id: string; name: string; taskCount: number }>;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}
