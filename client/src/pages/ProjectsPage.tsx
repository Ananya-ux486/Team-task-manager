import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Plus,
  FolderKanban,
  ArrowRight,
  Users,
  CheckSquare,
  Loader2,
  Pencil,
  Trash2,
  Search,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useProjects, useDeleteProject } from '@/hooks/useProjects';
import { Project } from '@/types';
import CreateProjectModal from '@/components/projects/CreateProjectModal';
import EditProjectModal from '@/components/projects/EditProjectModal';
import { cn } from '@/lib/utils';

const PROJECT_COLORS = [
  'from-blue-500 to-blue-600',
  'from-violet-500 to-violet-600',
  'from-emerald-500 to-emerald-600',
  'from-orange-500 to-orange-600',
  'from-pink-500 to-pink-600',
  'from-cyan-500 to-cyan-600',
];

export default function ProjectsPage() {
  const { data: projects, isLoading } = useProjects();
  const deleteProject = useDeleteProject();
  const [createOpen, setCreateOpen] = useState(false);
  const [editProject, setEditProject] = useState<Project | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  const filtered = projects?.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Projects</h1>
          <p className="text-slate-500 mt-0.5 text-sm">
            {projects?.length ?? 0} project{projects?.length !== 1 ? 's' : ''} total
          </p>
        </div>
        <Button onClick={() => setCreateOpen(true)} className="gap-2 shadow-sm">
          <Plus className="w-4 h-4" />
          New Project
        </Button>
      </div>

      {/* Search */}
      {(projects?.length ?? 0) > 0 && (
        <div className="relative mb-6 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            placeholder="Search projects..."
            className="pl-9 bg-white"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      )}

      {/* Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-52 w-full rounded-2xl" />
          ))}
        </div>
      ) : filtered?.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mb-4">
            <FolderKanban className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="text-lg font-semibold text-slate-700 mb-2">
            {search ? 'No projects match your search' : 'No projects yet'}
          </h3>
          <p className="text-slate-500 mb-6 max-w-sm text-sm">
            {search
              ? 'Try a different search term.'
              : 'Create your first project to start organizing tasks for your team.'}
          </p>
          {!search && (
            <Button onClick={() => setCreateOpen(true)} className="gap-2">
              <Plus className="w-4 h-4" />
              Create Project
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered?.map((project, i) => (
            <ProjectCard
              key={project.id}
              project={project}
              colorClass={PROJECT_COLORS[i % PROJECT_COLORS.length]}
              onEdit={() => setEditProject(project)}
              onDelete={() => setDeleteId(project.id)}
            />
          ))}
        </div>
      )}

      <CreateProjectModal open={createOpen} onClose={() => setCreateOpen(false)} />
      {editProject && (
        <EditProjectModal
          project={editProject}
          open={!!editProject}
          onClose={() => setEditProject(null)}
        />
      )}

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Project</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the project and all its tasks. This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => {
                if (deleteId) deleteProject.mutate(deleteId);
                setDeleteId(null);
              }}
            >
              {deleteProject.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function ProjectCard({
  project,
  colorClass,
  onEdit,
  onDelete,
}: {
  project: Project;
  colorClass: string;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const isProjectAdmin = project.userRole === 'ADMIN';
  const taskTotal = project.taskStats
    ? Object.values(project.taskStats).reduce((a, b) => a + b, 0)
    : 0;
  const completed = project.taskStats?.COMPLETED ?? 0;
  const inProgress = project.taskStats?.IN_PROGRESS ?? 0;
  const blocked = project.taskStats?.BLOCKED ?? 0;
  const progress = taskTotal > 0 ? Math.round((completed / taskTotal) * 100) : 0;

  return (
    <Card className="group hover:shadow-lg transition-all duration-200 border-slate-200 overflow-hidden">
      {/* Color bar */}
      <div className={cn('h-1.5 w-full bg-gradient-to-r', colorClass)} />
      <CardContent className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div
              className={cn(
                'w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 bg-gradient-to-br',
                colorClass,
                'shadow-sm'
              )}
            >
              <FolderKanban className="w-5 h-5 text-white" />
            </div>
            <div className="min-w-0">
              <h3 className="font-semibold text-slate-900 leading-tight line-clamp-1 text-sm">
                {project.name}
              </h3>
              <Badge
                variant={isProjectAdmin ? 'default' : 'secondary'}
                className="text-[10px] mt-0.5 h-4 px-1.5"
              >
                {project.userRole}
              </Badge>
            </div>
          </div>
          {isProjectAdmin && (
            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity ml-2">
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-slate-400 hover:text-slate-700"
                onClick={(e) => { e.preventDefault(); onEdit(); }}
              >
                <Pencil className="w-3.5 h-3.5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-slate-400 hover:text-destructive"
                onClick={(e) => { e.preventDefault(); onDelete(); }}
              >
                <Trash2 className="w-3.5 h-3.5" />
              </Button>
            </div>
          )}
        </div>

        {project.description && (
          <p className="text-xs text-slate-500 mb-4 line-clamp-2 leading-relaxed">
            {project.description}
          </p>
        )}

        {/* Progress */}
        <div className="mb-4">
          <div className="flex justify-between text-xs text-slate-500 mb-1.5">
            <span className="font-medium">Progress</span>
            <span className="font-semibold text-slate-700">{progress}%</span>
          </div>
          <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
            <div
              className={cn('h-full rounded-full bg-gradient-to-r transition-all duration-500', colorClass)}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Mini stats */}
        <div className="flex items-center gap-2 mb-4 flex-wrap">
          {inProgress > 0 && (
            <span className="inline-flex items-center gap-1 text-[11px] bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
              {inProgress} in progress
            </span>
          )}
          {blocked > 0 && (
            <span className="inline-flex items-center gap-1 text-[11px] bg-red-50 text-red-700 px-2 py-0.5 rounded-full font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
              {blocked} blocked
            </span>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 text-xs text-slate-500">
            <span className="flex items-center gap-1">
              <CheckSquare className="w-3.5 h-3.5" />
              {taskTotal} tasks
            </span>
            <span className="flex items-center gap-1">
              <Users className="w-3.5 h-3.5" />
              {project.memberCount ?? 0}
            </span>
          </div>
          <Link
            to={`/projects/${project.id}`}
            className="flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors"
          >
            Open <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
