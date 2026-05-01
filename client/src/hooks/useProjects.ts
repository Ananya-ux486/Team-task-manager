import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { projectsApi } from '../lib/api';
import { UserRole } from '../types';

export const useProjects = () =>
  useQuery({
    queryKey: ['projects'],
    queryFn: projectsApi.getAll,
  });

export const useProject = (id: string) =>
  useQuery({
    queryKey: ['projects', id],
    queryFn: () => projectsApi.getById(id),
    enabled: !!id,
  });

export const useCreateProject = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: projectsApi.create,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['projects'] });
    },
  });
};

export const useUpdateProject = (id: string) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: { name?: string; description?: string }) =>
      projectsApi.update(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['projects'] });
      qc.invalidateQueries({ queryKey: ['projects', id] });
    },
  });
};

export const useDeleteProject = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: projectsApi.delete,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['projects'] });
    },
  });
};

export const useAddMember = (projectId: string) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: { userId: string; role: UserRole }) =>
      projectsApi.addMember(projectId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['projects', projectId] });
    },
  });
};

export const useRemoveMember = (projectId: string) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (userId: string) => projectsApi.removeMember(projectId, userId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['projects', projectId] });
      qc.invalidateQueries({ queryKey: ['tasks', projectId] });
    },
  });
};
