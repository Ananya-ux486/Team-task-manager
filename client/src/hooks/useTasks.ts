import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { tasksApi } from '../lib/api';
import { TaskStatus } from '../types';

interface TaskFilters {
  status?: TaskStatus;
  assigneeId?: string;
  overdue?: boolean;
}

export const useTasks = (projectId: string, filters?: TaskFilters) =>
  useQuery({
    queryKey: ['tasks', projectId, filters],
    queryFn: () => tasksApi.getByProject(projectId, filters),
    enabled: !!projectId,
  });

export const useCreateTask = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: tasksApi.create,
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: ['tasks', vars.projectId] });
      qc.invalidateQueries({ queryKey: ['dashboard'] });
      qc.invalidateQueries({ queryKey: ['projects'] });
    },
  });
};

export const useUpdateTask = (projectId: string) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Parameters<typeof tasksApi.update>[1] }) =>
      tasksApi.update(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['tasks', projectId] });
      qc.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
};

export const useDeleteTask = (projectId: string) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: tasksApi.delete,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['tasks', projectId] });
      qc.invalidateQueries({ queryKey: ['dashboard'] });
      qc.invalidateQueries({ queryKey: ['projects'] });
    },
  });
};
