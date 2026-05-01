import { Link } from 'react-router-dom';
import {
  CheckCircle2,
  Clock,
  AlertTriangle,
  CircleDot,
  Ban,
  ArrowRight,
  TrendingUp,
  User,
  FolderKanban,
  Plus,
  Activity,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { useDashboard } from '@/hooks/useDashboard';
import { useAuthStore } from '@/store/authStore';
import { cn } from '@/lib/utils';

const statusCards = [
  {
    key: 'TODO' as const,
    label: 'To Do',
    icon: CircleDot,
    gradient: 'from-slate-500 to-slate-600',
    light: 'bg-slate-50 border-slate-200',
    text: 'text-slate-700',
    iconBg: 'bg-slate-100',
    iconColor: 'text-slate-600',
  },
  {
    key: 'IN_PROGRESS' as const,
    label: 'In Progress',
    icon: Clock,
    gradient: 'from-blue-500 to-blue-600',
    light: 'bg-blue-50 border-blue-200',
    text: 'text-blue-700',
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-600',
  },
  {
    key: 'COMPLETED' as const,
    label: 'Completed',
    icon: CheckCircle2,
    gradient: 'from-emerald-500 to-emerald-600',
    light: 'bg-emerald-50 border-emerald-200',
    text: 'text-emerald-700',
    iconBg: 'bg-emerald-100',
    iconColor: 'text-emerald-600',
  },
  {
    key: 'BLOCKED' as const,
    label: 'Blocked',
    icon: Ban,
    gradient: 'from-red-500 to-red-600',
    light: 'bg-red-50 border-red-200',
    text: 'text-red-700',
    iconBg: 'bg-red-100',
    iconColor: 'text-red-600',
  },
];

export default function DashboardPage() {
  const { data: stats, isLoading } = useDashboard();
  const { user } = useAuthStore();

  const completionRate =
    stats && stats.totalTasks > 0
      ? Math.round((stats.tasksByStatus.COMPLETED / stats.totalTasks) * 100)
      : 0;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Welcome back, {user?.name?.split(' ')[0]}! 👋
          </h1>
          <p className="text-slate-500 mt-1 text-sm">
            Here's an overview of your team's progress.
          </p>
        </div>
        <Button asChild size="sm" className="gap-2 hidden sm:flex">
          <Link to="/projects">
            <Plus className="w-4 h-4" />
            New Project
          </Link>
        </Button>
      </div>

      {/* Status cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statusCards.map(({ key, label, icon: Icon, light, text, iconBg, iconColor }) => (
          <Card key={key} className={cn('border', light, 'hover:shadow-md transition-shadow')}>
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-4">
                <div className={cn('p-2.5 rounded-xl', iconBg)}>
                  <Icon className={cn('w-5 h-5', iconColor)} />
                </div>
                {!isLoading && stats && stats.totalTasks > 0 && (
                  <span className={cn('text-xs font-medium', text)}>
                    {Math.round((stats.tasksByStatus[key] / stats.totalTasks) * 100)}%
                  </span>
                )}
              </div>
              {isLoading ? (
                <Skeleton className="h-9 w-16 mb-1" />
              ) : (
                <p className="text-3xl font-bold text-slate-900 mb-0.5">
                  {stats?.tasksByStatus[key] ?? 0}
                </p>
              )}
              <p className={cn('text-xs font-medium', text)}>{label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Middle row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Overdue */}
        <Card className="border-orange-200 bg-gradient-to-br from-orange-50 to-amber-50 hover:shadow-md transition-shadow">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="p-3 bg-orange-100 rounded-2xl flex-shrink-0">
              <AlertTriangle className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <p className="text-xs font-semibold text-orange-600 uppercase tracking-wide">
                Overdue
              </p>
              {isLoading ? (
                <Skeleton className="h-8 w-12 mt-1" />
              ) : (
                <p className="text-3xl font-bold text-orange-900">{stats?.overdueCount ?? 0}</p>
              )}
              <p className="text-xs text-orange-600/70 mt-0.5">tasks past due date</p>
            </div>
          </CardContent>
        </Card>

        {/* Assigned to me */}
        <Card className="border-violet-200 bg-gradient-to-br from-violet-50 to-purple-50 hover:shadow-md transition-shadow">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="p-3 bg-violet-100 rounded-2xl flex-shrink-0">
              <User className="w-6 h-6 text-violet-600" />
            </div>
            <div>
              <p className="text-xs font-semibold text-violet-600 uppercase tracking-wide">
                My Tasks
              </p>
              {isLoading ? (
                <Skeleton className="h-8 w-12 mt-1" />
              ) : (
                <p className="text-3xl font-bold text-violet-900">{stats?.assignedToMe ?? 0}</p>
              )}
              <p className="text-xs text-violet-600/70 mt-0.5">assigned to me</p>
            </div>
          </CardContent>
        </Card>

        {/* Completion rate */}
        <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-sky-50 hover:shadow-md transition-shadow">
          <CardContent className="p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-3 bg-blue-100 rounded-2xl flex-shrink-0">
                <Activity className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-xs font-semibold text-blue-600 uppercase tracking-wide">
                  Completion
                </p>
                {isLoading ? (
                  <Skeleton className="h-8 w-12 mt-1" />
                ) : (
                  <p className="text-3xl font-bold text-blue-900">{completionRate}%</p>
                )}
              </div>
            </div>
            <div className="h-2 bg-blue-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-700"
                style={{ width: `${completionRate}%` }}
              />
            </div>
            <p className="text-xs text-blue-600/70 mt-1.5">
              {stats?.tasksByStatus.COMPLETED ?? 0} of {stats?.totalTasks ?? 0} tasks done
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Projects list */}
      <Card className="border-slate-200 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between pb-2 pt-5 px-6">
          <div className="flex items-center gap-2">
            <FolderKanban className="w-4 h-4 text-slate-500" />
            <CardTitle className="text-base font-semibold text-slate-800">My Projects</CardTitle>
            {!isLoading && (
              <Badge variant="secondary" className="text-xs">
                {stats?.projects.length ?? 0}
              </Badge>
            )}
          </div>
          <Button variant="ghost" size="sm" asChild className="text-blue-600 hover:text-blue-700 gap-1 text-xs">
            <Link to="/projects">
              View all <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </Button>
        </CardHeader>
        <CardContent className="px-6 pb-5">
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-14 w-full rounded-xl" />
              ))}
            </div>
          ) : !stats?.projects.length ? (
            <div className="text-center py-10">
              <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                <FolderKanban className="w-6 h-6 text-slate-400" />
              </div>
              <p className="text-slate-500 text-sm mb-3">No projects yet</p>
              <Button size="sm" asChild className="gap-2">
                <Link to="/projects">
                  <Plus className="w-4 h-4" /> Create Project
                </Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-1.5">
              {stats.projects.map((project, i) => {
                const colors = [
                  'bg-blue-500',
                  'bg-violet-500',
                  'bg-emerald-500',
                  'bg-orange-500',
                  'bg-pink-500',
                ];
                const color = colors[i % colors.length];
                return (
                  <Link
                    key={project.id}
                    to={`/projects/${project.id}`}
                    className="flex items-center justify-between p-3.5 rounded-xl hover:bg-slate-50 transition-colors group border border-transparent hover:border-slate-200"
                  >
                    <div className="flex items-center gap-3">
                      <div className={cn('w-2.5 h-2.5 rounded-full flex-shrink-0', color)} />
                      <span className="font-medium text-slate-800 group-hover:text-blue-600 transition-colors text-sm">
                        {project.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-xs font-medium">
                        {project.taskCount} tasks
                      </Badge>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-blue-500 transition-colors" />
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
