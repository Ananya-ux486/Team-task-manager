import { TaskStatus, ProjectMember } from '@/types';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { AlertTriangle, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Filters {
  status?: TaskStatus;
  assigneeId?: string;
  overdue?: boolean;
}

interface Props {
  filters: Filters;
  members: ProjectMember[];
  onChange: (filters: Filters) => void;
}

const STATUS_OPTIONS: { value: TaskStatus; label: string }[] = [
  { value: 'TODO', label: 'To Do' },
  { value: 'IN_PROGRESS', label: 'In Progress' },
  { value: 'COMPLETED', label: 'Completed' },
  { value: 'BLOCKED', label: 'Blocked' },
];

export default function TaskFilters({ filters, members, onChange }: Props) {
  const hasFilters = filters.status || filters.assigneeId || filters.overdue;

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <Select
        value={filters.status ?? 'all'}
        onValueChange={(v) =>
          onChange({ ...filters, status: v === 'all' ? undefined : (v as TaskStatus) })
        }
      >
        <SelectTrigger className="h-8 w-36 text-xs">
          <SelectValue placeholder="All statuses" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All statuses</SelectItem>
          {STATUS_OPTIONS.map((s) => (
            <SelectItem key={s.value} value={s.value}>
              {s.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={filters.assigneeId ?? 'all'}
        onValueChange={(v) =>
          onChange({ ...filters, assigneeId: v === 'all' ? undefined : v })
        }
      >
        <SelectTrigger className="h-8 w-36 text-xs">
          <SelectValue placeholder="All members" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All members</SelectItem>
          {members.map((m) => (
            <SelectItem key={m.userId} value={m.userId}>
              {m.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <button
        onClick={() => onChange({ ...filters, overdue: !filters.overdue })}
        className={cn(
          'flex items-center gap-1.5 h-8 px-3 rounded-md text-xs font-medium border transition-colors',
          filters.overdue
            ? 'bg-orange-100 text-orange-700 border-orange-300'
            : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
        )}
      >
        <AlertTriangle className="w-3.5 h-3.5" />
        Overdue
      </button>

      {hasFilters && (
        <Button
          variant="ghost"
          size="sm"
          className="h-8 px-2 text-xs text-slate-500"
          onClick={() => onChange({})}
        >
          <X className="w-3.5 h-3.5 mr-1" />
          Clear
        </Button>
      )}
    </div>
  );
}
