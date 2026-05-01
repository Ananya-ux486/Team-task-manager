import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Plus,
  LayoutGrid,
  List,
  Users,
  CheckCircle2,
  Clock,
  CircleDot,
  Ban,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useProject } from '@/hooks/useProjects';
import { useTasks } from '@/hooks/useTasks';
import { useAuthStore } from '@/store/authStore';
import { Task, TaskStatus } from '@/types';
import KanbanBoard from '@/components/tasks/KanbanBoard';
import TaskList from '@/components/tasks/TaskList';
import TaskFilters from '@/components/tasks/TaskFilters';
import CreateTaskModal from '@/components/tasks/CreateTaskModal';
import EditTaskModal from '@/components/tasks/EditTaskModal';
import TeamManagementModal from '@/components/team/TeamManagementModal';
import { cn } from '@/lib/utils';

const statusIcons = {
  TODO: { icon: CircleDot, color: 'text-slate-500', bg: 'bg-slate-100' },
  IN_PROGRESS: { icon: Clock, color: 'text-blue-600', bg: 'bg-blue-100' },
  COMPLETED: { icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-100' },
  BLOCKED: { icon: Ban, color: 'text-red-600', bg: 'bg-red-100' },
};

export default function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: project, isLoading: projectLoading } = useProject(id!);
  const { user } = useAuthStore();

  const [view, setView] = useState<'kanban' | 'list'>('kanban');
  const [filters, setFilters] = useState<{
    status?: TaskStatus;
    assigneeId?: string;
    overdue?: boolean;
  }>({});
  const [createTaskOpen, setCreateTaskOpen] = useState(false);
  const [editTask, setEditTask] = useState<Task | null>(null);
  const [teamOpen, setTeamOpen] = useState(false);

  const { data: tasks, isLoading: tasksLoading } = useTasks(id!, filters);
  const isProjectAdmin = project?.userRole === 'ADMIN';

  if (projectLoading) {
    return (
      <div className="p-6 space-y-4">
        <Skeleton className="h-6 w-40" />
        <Skeleton className="h-12 w-full" />
        <div className="grid grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-64 rounded-2xl" />)}
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="p-6 text-center py-20">
        <p className="text-slate-500 mb-4">Project not found.</p>
        <Button variant="outline" asChild>
          <Link to="/projects"><ArrowLeft className="w-4 h-4 mr-2" />Back to Projects</Link>
        </Button>
      </div>
    );
  }

  const taskStats = tasks
    ? {
        TODO: tasks.filter((t) => t.status === 'TODO').length,
        IN_PROGRESS: tasks.filter((t) => t.status === 'IN_PROGRESS').length,
        COMPLETED: tasks.filter((t) => t.status === 'COMPLETED').length,
        BLOCKED: tasks.filter((t) => t.status === 'BLOCKED').length,
      }
    : null;

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-6 py-4 bg-white border-b">
        {/* Breadcrumb */}
        <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-3">
          <Link to="/projects" className="hover:text-blue-600 flex items-center gap-1 transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" />
            Projects
          </Link>
          <span>/</span>
          <span className="text-slate-700 font-medium">{project.name}</span>
        </div>

        <div className="flex items-start justify-between flex-wrap gap-3">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-xl font-bold text-slate-900">{project.name}</h1>
              <Badge
                variant={isProjectAdmin ? 'default' : 'secondary'}
                className="text-xs"
              >
                {project.userRole}
              </Badge>
            </div>
            {project.description && (
              <p className="text-sm text-slate-500">{project.description}</p>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="gap-2 text-xs"
              onClick={() => setTeamOpen(true)}
            >
              <Users className="w-3.5 h-3.5" />
              Team
              <Badge variant="secondary" className="text-[10px] h-4 px-1.5 ml-0.5">
                {project.members?.length ?? 0}
              </Badge>
            </Button>
            {isProjectAdmin && (
              <Button size="sm" className="gap-2 text-xs shadow-sm" onClick={() => setCreateTaskOpen(true)}>
                <Plus className="w-3.5 h-3.5" />
                New Task
              </Button>
            )}
          </div>
        </div>

        {/* Mini stats bar */}
        {taskStats && (
          <div className="flex items-center gap-4 mt-4 pt-4 border-t">
            {(Object.entries(statusIcons) as [TaskStatus, typeof statusIcons[TaskStatus]][]).map(
              ([status, { icon: Icon, color, bg }]) => (
                <div key={status} className="flex items-center gap-1.5">
                  <div className={cn('p-1 rounded-md', bg)}>
                    <Icon className={cn('w-3 h-3', color)} />
                  </div>
                  <span className="text-xs font-semibold text-slate-700">
                    {taskStats[status]}
                  </span>
                  <span className="text-xs text-slate-400 hidden sm:inline">
                    {status === 'IN_PROGRESS' ? 'In Progress' : status.charAt(0) + status.slice(1).toLowerCase().replace('_', ' ')}
                  </span>
                </div>
              )
            )}
          </div>
        )}
      </div>

      {/* Toolbar */}
      <div className="px-6 py-2.5 bg-slate-50 border-b flex items-center justify-between gap-3 flex-wrap">
        <TaskFilters
          filters={filters}
          members={project.members ?? []}
          onChange={setFilters}
        />
        <div className="flex items-center gap-1 bg-white border rounded-lg p-0.5">
          <button
            onClick={() => setView('kanban')}
            className={cn(
              'flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition-all',
              view === 'kanban'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-700'
            )}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Kanban</span>
          </button>
          <button
            onClick={() => setView('list')}
            className={cn(
              'flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition-all',
              view === 'list'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-700'
            )}
          >
            <List className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">List</span>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
        {tasksLoading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-64 w-full rounded-2xl" />
            ))}
          </div>
        ) : view === 'kanban' ? (
          <KanbanBoard
            tasks={tasks ?? []}
            projectId={id!}
            isAdmin={isProjectAdmin}
            onEditTask={setEditTask}
          />
        ) : (
          <TaskList
            tasks={tasks ?? []}
            projectId={id!}
            isAdmin={isProjectAdmin}
            onEditTask={setEditTask}
          />
        )}
      </div>

      {/* Modals */}
      <CreateTaskModal
        open={createTaskOpen}
        projectId={id!}
        members={project.members ?? []}
        onClose={() => setCreateTaskOpen(false)}
      />
      {editTask && (
        <EditTaskModal
          task={editTask}
          projectId={id!}
          members={project.members ?? []}
          isAdmin={isProjectAdmin}
          open={!!editTask}
          onClose={() => setEditTask(null)}
        />
      )}
      <TeamManagementModal
        open={teamOpen}
        project={project}
        onClose={() => setTeamOpen(false)}
      />
    </div>
  );
}
