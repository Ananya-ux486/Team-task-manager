import { Task, TaskStatus } from '@/types';
import TaskCard from './TaskCard';
import { cn } from '@/lib/utils';

const COLUMNS: {
  status: TaskStatus;
  label: string;
  color: string;
  bg: string;
  border: string;
  dot: string;
}[] = [
  {
    status: 'TODO',
    label: 'To Do',
    color: 'text-slate-600',
    bg: 'bg-slate-50',
    border: 'border-slate-200',
    dot: 'bg-slate-400',
  },
  {
    status: 'IN_PROGRESS',
    label: 'In Progress',
    color: 'text-blue-600',
    bg: 'bg-blue-50/50',
    border: 'border-blue-200',
    dot: 'bg-blue-500',
  },
  {
    status: 'COMPLETED',
    label: 'Completed',
    color: 'text-emerald-600',
    bg: 'bg-emerald-50/50',
    border: 'border-emerald-200',
    dot: 'bg-emerald-500',
  },
  {
    status: 'BLOCKED',
    label: 'Blocked',
    color: 'text-red-600',
    bg: 'bg-red-50/50',
    border: 'border-red-200',
    dot: 'bg-red-500',
  },
];

interface Props {
  tasks: Task[];
  projectId: string;
  isAdmin: boolean;
  onEditTask: (task: Task) => void;
}

export default function KanbanBoard({ tasks, projectId, isAdmin, onEditTask }: Props) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 min-h-[500px] items-start">
      {COLUMNS.map(({ status, label, color, bg, border, dot }) => {
        const columnTasks = tasks.filter((t) => t.status === status);
        return (
          <div key={status} className="flex flex-col">
            {/* Column header */}
            <div className={cn('flex items-center justify-between px-3 py-2.5 rounded-t-xl border border-b-0', bg, border)}>
              <div className="flex items-center gap-2">
                <span className={cn('w-2 h-2 rounded-full', dot)} />
                <span className={cn('text-xs font-semibold uppercase tracking-wide', color)}>
                  {label}
                </span>
              </div>
              <span
                className={cn(
                  'inline-flex items-center justify-center w-5 h-5 rounded-full text-xs font-bold',
                  bg,
                  color,
                  'border',
                  border
                )}
              >
                {columnTasks.length}
              </span>
            </div>

            {/* Cards container */}
            <div
              className={cn(
                'flex-1 space-y-2.5 min-h-[120px] rounded-b-xl border p-3',
                bg,
                border
              )}
            >
              {columnTasks.length === 0 ? (
                <div className="flex items-center justify-center h-24 text-xs text-slate-400 border-2 border-dashed border-slate-200 rounded-xl">
                  No tasks here
                </div>
              ) : (
                columnTasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    projectId={projectId}
                    isAdmin={isAdmin}
                    onEdit={onEditTask}
                  />
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
