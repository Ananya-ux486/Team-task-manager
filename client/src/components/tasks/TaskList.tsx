import { format, isPast } from 'date-fns';
import { Calendar, Pencil, Trash2, User } from 'lucide-react';
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

const statusConfig: Record<TaskStatus, { label: string; variant: any; dot: string }> = {
  TODO: { label: 'To Do', variant: 'secondary', dot: 'bg-slate-400' },
  IN_PROGRESS: { label: 'In Progress', variant: 'info', dot: 'bg-blue-500' },
  COMPLETED: { label: 'Completed', variant: 'success', dot: 'bg-green-500' },
  BLOCKED: { label: 'Blocked', variant: 'destructive', dot: 'bg-red-500' },
};

interface Props {
  tasks: Task[];
  projectId: string;
  isAdmin: boolean;
  onEditTask: (task: Task) => void;
}

export default function TaskList({ tasks, projectId, isAdmin, onEditTask }: Props) {
  const deleteTask = useDeleteTask(projectId);

  if (tasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <p className="text-slate-500">No tasks found.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b bg-slate-50">
            <th className="text-left px-4 py-3 font-medium text-slate-600">Task</th>
            <th className="text-left px-4 py-3 font-medium text-slate-600 hidden md:table-cell">
              Status
            </th>
            <th className="text-left px-4 py-3 font-medium text-slate-600 hidden lg:table-cell">
              Assignee
            </th>
            <th className="text-left px-4 py-3 font-medium text-slate-600 hidden md:table-cell">
              Due Date
            </th>
            <th className="px-4 py-3" />
          </tr>
        </thead>
        <tbody className="divide-y">
          {tasks.map((task) => {
            const { label, variant, dot } = statusConfig[task.status];
            const isOverdue =
              task.dueDate && task.status !== 'COMPLETED' && isPast(new Date(task.dueDate));

            return (
              <tr
                key={task.id}
                className={cn(
                  'hover:bg-slate-50 transition-colors group',
                  isOverdue && 'bg-orange-50/50'
                )}
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full flex-shrink-0 ${dot}`} />
                    <span className="font-medium text-slate-800 line-clamp-1">{task.title}</span>
                  </div>
                  {task.description && (
                    <p className="text-xs text-slate-400 mt-0.5 ml-4 line-clamp-1">
                      {task.description}
                    </p>
                  )}
                </td>
                <td className="px-4 py-3 hidden md:table-cell">
                  <Badge variant={variant} className="text-xs">
                    {label}
                  </Badge>
                </td>
                <td className="px-4 py-3 hidden lg:table-cell">
                  {task.assignee ? (
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium text-xs">
                        {task.assignee.name[0].toUpperCase()}
                      </div>
                      <span className="text-slate-600">{task.assignee.name}</span>
                    </div>
                  ) : (
                    <span className="text-slate-400 text-xs">Unassigned</span>
                  )}
                </td>
                <td className="px-4 py-3 hidden md:table-cell">
                  {task.dueDate ? (
                    <span
                      className={cn(
                        'text-xs',
                        isOverdue ? 'text-orange-600 font-medium' : 'text-slate-500'
                      )}
                    >
                      {format(new Date(task.dueDate), 'MMM d, yyyy')}
                      {isOverdue && ' (overdue)'}
                    </span>
                  ) : (
                    <span className="text-slate-400 text-xs">—</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity justify-end">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      onClick={() => onEditTask(task)}
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </Button>
                    {isAdmin && (
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-destructive hover:text-destructive"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Task</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete "{task.title}"?
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
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
