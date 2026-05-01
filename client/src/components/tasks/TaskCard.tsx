import { format, isPast, isToday, isTomorrow } from 'date-fns';
import { Calendar, Pencil, Trash2, AlertCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Task, TaskStatus } from '@/types';
import { useDeleteTask } from '@/hooks/useTasks';
import { cn } from '@/lib/utils';

const statusConfig: Record<
  TaskStatus,
  { label: string; variant: any; dot: string }
> = {
  TODO: { label: 'To Do', variant: 'secondary', dot: 'bg-slate-400' },
  IN_PROGRESS: { label: 'In Progress', variant: 'info', dot: 'bg-blue-500' },
  COMPLETED: { label: 'Completed', variant: 'success', dot: 'bg-emerald-500' },
  BLOCKED: { label: 'Blocked', variant: 'destructive', dot: 'bg-red-500' },
};

interface Props {
  task: Task;
  projectId: string;
  isAdmin: boolean;
  onEdit: (task: Task) => void;
}

export default function TaskCard({ task, projectId, isAdmin, onEdit }: Props) {
  const deleteTask = useDeleteTask(projectId);
  const { dot } = statusConfig[task.status];

  const dueDate = task.dueDate ? new Date(task.dueDate) : null;
  const isOverdue = dueDate && task.status !== 'COMPLETED' && isPast(dueDate);
  const isDueToday = dueDate && isToday(dueDate);
  const isDueTomorrow = dueDate && isTomorrow(dueDate);

  const dueDateLabel = dueDate
    ? isToday(dueDate)
      ? 'Today'
      : isTomorrow(dueDate)
      ? 'Tomorrow'
      : format(dueDate, 'MMM d')
    : null;

  return (
    <div
      className={cn(
        'bg-white rounded-xl border p-3.5 group hover:shadow-md transition-all duration-150 cursor-pointer',
        isOverdue
          ? 'border-orange-300 bg-orange-50/40 hover:border-orange-400'
          : 'border-slate-200 hover:border-slate-300'
      )}
      onClick={() => onEdit(task)}
    >
      {/* Title row */}
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex items-start gap-2 flex-1 min-w-0">
          <span className={cn('w-2 h-2 rounded-full mt-1.5 flex-shrink-0', dot)} />
          <h4 className="text-sm font-medium text-slate-800 leading-snug line-clamp-2">
            {task.title}
          </h4>
        </div>
        {/* Action buttons — stop propagation so clicking them doesn't open edit */}
        <div
          className="flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
          onClick={(e) => e.stopPropagation()}
        >
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 text-slate-400 hover:text-slate-700"
            onClick={() => onEdit(task)}
          >
            <Pencil className="w-3 h-3" />
          </Button>
          {isAdmin && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 text-slate-400 hover:text-destructive"
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Task</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete "{task.title}"? This cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    onClick={() => deleteTask.mutate(task.id)}
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
      </div>

      {/* Description */}
      {task.description && (
        <p className="text-xs text-slate-400 mb-3 line-clamp-2 leading-relaxed pl-4">
          {task.description}
        </p>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between gap-2 pl-4">
        {/* Assignee */}
        {task.assignee ? (
          <div className="flex items-center gap-1.5">
            <div className="w-5 h-5 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-semibold text-[9px] flex-shrink-0">
              {task.assignee.name[0].toUpperCase()}
            </div>
            <span className="text-xs text-slate-500 hidden sm:inline truncate max-w-[80px]">
              {task.assignee.name.split(' ')[0]}
            </span>
          </div>
        ) : (
          <span className="text-xs text-slate-300">Unassigned</span>
        )}

        {/* Due date */}
        {dueDateLabel && (
          <div
            className={cn(
              'flex items-center gap-1 text-xs font-medium rounded-full px-2 py-0.5',
              isOverdue
                ? 'bg-orange-100 text-orange-700'
                : isDueToday
                ? 'bg-yellow-100 text-yellow-700'
                : isDueTomorrow
                ? 'bg-blue-50 text-blue-600'
                : 'bg-slate-100 text-slate-500'
            )}
          >
            {isOverdue ? (
              <AlertCircle className="w-3 h-3" />
            ) : (
              <Calendar className="w-3 h-3" />
            )}
            {dueDateLabel}
          </div>
        )}
      </div>
    </div>
  );
}
