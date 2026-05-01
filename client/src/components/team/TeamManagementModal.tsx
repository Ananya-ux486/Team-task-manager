import { useState } from 'react';
import { Loader2, UserPlus, Trash2, Search } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAddMember, useRemoveMember } from '@/hooks/useProjects';
import { usersApi, getErrorMessage } from '@/lib/api';
import { ProjectDetail, User, UserRole } from '@/types';
import { useAuthStore } from '@/store/authStore';
import { useQuery } from '@tanstack/react-query';

interface Props {
  open: boolean;
  project: ProjectDetail;
  onClose: () => void;
}

export default function TeamManagementModal({ open, project, onClose }: Props) {
  const { user: currentUser } = useAuthStore();
  const isProjectAdmin = project.userRole === 'ADMIN';
  const addMember = useAddMember(project.id);
  const removeMember = useRemoveMember(project.id);

  const [search, setSearch] = useState('');
  const [selectedUser, setSelectedUser] = useState<string>('');
  const [selectedRole, setSelectedRole] = useState<UserRole>('MEMBER');
  const [addError, setAddError] = useState('');

  const { data: users } = useQuery({
    queryKey: ['users', search],
    queryFn: () => usersApi.search(search),
    enabled: search.length > 0,
  });

  const memberUserIds = new Set(project.members?.map((m) => m.userId) ?? []);
  const availableUsers = users?.filter((u) => !memberUserIds.has(u.id)) ?? [];

  const handleAdd = () => {
    if (!selectedUser) return;
    setAddError('');
    addMember.mutate(
      { userId: selectedUser, role: selectedRole },
      {
        onSuccess: () => {
          setSelectedUser('');
          setSearch('');
        },
        onError: (err) => setAddError(getErrorMessage(err)),
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Team Members</DialogTitle>
        </DialogHeader>

        {/* Current members */}
        <div className="space-y-2 max-h-60 overflow-y-auto">
          {project.members?.map((member) => (
            <div
              key={member.id}
              className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold text-sm">
                  {member.name[0].toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-800">
                    {member.name}
                    {member.userId === currentUser?.id && (
                      <span className="text-xs text-slate-400 ml-1">(you)</span>
                    )}
                  </p>
                  <p className="text-xs text-slate-500">{member.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={member.role === 'ADMIN' ? 'default' : 'secondary'} className="text-xs">
                  {member.role}
                </Badge>
                {isProjectAdmin && member.userId !== currentUser?.id && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-destructive hover:text-destructive"
                    onClick={() => removeMember.mutate(member.userId)}
                    disabled={removeMember.isPending}
                  >
                    {removeMember.isPending ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Trash2 className="w-3.5 h-3.5" />
                    )}
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Add member (admin only) */}
        {isProjectAdmin && (
          <>
            <Separator />
            <div className="space-y-3">
              <p className="text-sm font-medium text-slate-700">Add Member</p>

              {addError && (
                <Alert variant="destructive">
                  <AlertDescription>{addError}</AlertDescription>
                </Alert>
              )}

              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  placeholder="Search by name or email..."
                  className="pl-9"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              {availableUsers.length > 0 && (
                <Select value={selectedUser} onValueChange={setSelectedUser}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a user" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableUsers.map((u) => (
                      <SelectItem key={u.id} value={u.id}>
                        {u.name} ({u.email})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}

              <div className="flex gap-2">
                <Select
                  value={selectedRole}
                  onValueChange={(v) => setSelectedRole(v as UserRole)}
                >
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MEMBER">Member</SelectItem>
                    <SelectItem value="ADMIN">Admin</SelectItem>
                  </SelectContent>
                </Select>

                <Button
                  className="flex-1 gap-2"
                  onClick={handleAdd}
                  disabled={!selectedUser || addMember.isPending}
                >
                  {addMember.isPending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <UserPlus className="w-4 h-4" />
                      Add Member
                    </>
                  )}
                </Button>
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
