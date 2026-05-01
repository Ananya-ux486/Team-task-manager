import { useQuery } from '@tanstack/react-query';
import { dashboardApi } from '../lib/api';

export const useDashboard = (projectId?: string) =>
  useQuery({
    queryKey: ['dashboard', projectId],
    queryFn: () => dashboardApi.getStats(projectId),
  });
