import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useUpdateTask } from '@/hooks/useTasks';
import { getErrorMessage } from '@/lib/api';
import { Task, TaskStatus, ProjectMember } from '@/types';
import { format } from 'date-fns';

const STATUS_OPTIONS: { value: TaskStatus; label: string }[] = [
  { value: 'TODO', label: 'To Do' },
  { value: 'IN_PROGRESS', label: 'In Progress' },
  { value: 'COMPLETED', label: 'Completed' },
  { value: 'BLOCKED', label: 'Blocked' },
];

const adminSchema = z.object({
  title: z.string().min(1, 'Task title is required').max(200),
  description: z.string().max(2000).optional(),
  status: z.enum(['TODO', 'IN_PROGRESS', 'COMPLETED', 'BLOCKED']),
  dueDate: z.string().optional(),
  assigneeId: z.string().optional(),
});

const memberSchema = z.object({
  status: z.enum(['TODO', 'IN_PROGRESS', 'COMPLETED', 'BLOCKED']),
});

type AdminFormData = z.infer<typeof adminSchema>;
type MemberFormData = z.infer<typeof memberSchema>;

interface Props {
  task: Task;
  projectId: string;
  members: ProjectMember[];
  isAdmin: boolean;
  open: boolean;
  onClose: () => void;
}

export default function EditTaskModal({ task, projectId, members, isAdmin, open, onClose }: Props) {
  const updateTask = useUpdateTask(projectId);

  const adminForm = useForm<AdminFormData>({
    resolver: zodResolver(adminSchema),
    defaultValues: {
      title: task.title,
      description: task.description ?? '',
      status: task.status,
      dueDate: task.dueDate ? format(new Date(task.dueDate), 'yyyy-MM-dd') : '',
      assigneeId: task.assigneeId ?? '',
    },
  });

  const memberForm = useForm<MemberFormData>({
    resolver: zodResolver(memberSchema),
    defaultValues: { status: task.status },
  });

  useEffect(() => {
    adminForm.reset({
      title: task.title,
      description: task.description ?? '',
      status: task.status,
      dueDate: task.dueDate ? format(new Date(task.dueDate), 'yyyy-MM-dd') : '',
      assigneeId: task.assigneeId ?? '',
    });
    memberForm.reset({ status: task.status });
  }, [task]);

  const onAdminSubmit = (data: AdminFormData) => {
    updateTask.mutate(
      {
        id: task.id,
        data: {
          title: data.title,
          description: data.description,
          status: data.status,
          dueDate: data.dueDate ? new Date(data.dueDate).toISOString() : null,
          assigneeId: data.assigneeId || null,
        },
      },
      { onSuccess: onClose }
    );
  };

  const onMemberSubmit = (data: MemberFormData) => {
    updateTask.mutate({ id: task.id, data: { status: data.status } }, { onSuccess: onClose });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{isAdmin ? 'Edit Task' : 'Update Task Status'}</DialogTitle>
        </DialogHeader>

        {updateTask.error && (
          <Alert variant="destructive">
            <AlertDescription>{getErrorMessage(updateTask.error)}</AlertDescription>
          </Alert>
        )}

        {isAdmin ? (
          <form onSubmit={adminForm.handleSubmit(onAdminSubmit)} className="space-y-4">
            <div className="space-y-1.5">
              <Label>Title *</Label>
              <Input {...adminForm.register('title')} />
              {adminForm.formState.errors.title && (
                <p className="text-xs text-destructive">
                  {adminForm.formState.errors.title.message}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label>Description</Label>
              <Textarea rows={3} {...adminForm.register('description')} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Status</Label>
                <Select
                  value={adminForm.watch('status')}
                  onValueChange={(v) => adminForm.setValue('status', v as TaskStatus)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {STATUS_OPTIONS.map((s) => (
                      <SelectItem key={s.value} value={s.value}>
                        {s.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label>Due Date</Label>
                <Input type="date" {...adminForm.register('dueDate')} />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label>Assignee</Label>
              <Select
                value={adminForm.watch('assigneeId') || 'none'}
                onValueChange={(v) => adminForm.setValue('assigneeId', v === 'none' ? '' : v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Unassigned" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Unassigned</SelectItem>
                  {members.map((m) => (
                    <SelectItem key={m.userId} value={m.userId}>
                      {m.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={updateTask.isPending}>
                {updateTask.isPending ? (
                  <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Saving...</>
                ) : (
                  'Save Changes'
                )}
              </Button>
            </DialogFooter>
          </form>
        ) : (
          <form onSubmit={memberForm.handleSubmit(onMemberSubmit)} className="space-y-4">
            <div className="space-y-1.5">
              <Label>Status</Label>
              <Select
                value={memberForm.watch('status')}
                onValueChange={(v) => memberForm.setValue('status', v as TaskStatus)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {STATUS_OPTIONS.map((s) => (
                    <SelectItem key={s.value} value={s.value}>
                      {s.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={updateTask.isPending}>
                {updateTask.isPending ? (
                  <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Updating...</>
                ) : (
                  'Update Status'
                )}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
