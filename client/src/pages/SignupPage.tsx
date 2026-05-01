import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { CheckSquare, Loader2, Mail, Lock, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useSignup } from '@/hooks/useAuth';
import { getErrorMessage } from '@/lib/api';

const schema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});
type FormData = z.infer<typeof schema>;

export default function SignupPage() {
  const signup = useSignup();
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900">
      {/* Left panel */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 p-12 text-white">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 bg-blue-500 rounded-xl shadow-lg shadow-blue-500/40">
            <CheckSquare className="w-6 h-6 text-white" />
          </div>
          <span className="font-bold text-xl">TaskFlow</span>
        </div>
        <div>
          <h2 className="text-4xl font-bold leading-tight mb-4">
            Start managing your<br />
            <span className="text-blue-400">team's tasks today.</span>
          </h2>
          <p className="text-slate-400 text-lg leading-relaxed">
            Sign up for free and get access to unlimited projects, tasks, and team collaboration tools.
          </p>
          <div className="mt-8 space-y-3">
            {[
              '✓ Create unlimited projects',
              '✓ Invite team members',
              '✓ Kanban & list views',
              '✓ Track overdue tasks',
            ].map((f) => (
              <p key={f} className="text-slate-300 text-sm">{f}</p>
            ))}
          </div>
        </div>
        <p className="text-slate-500 text-sm">© 2024 TaskFlow. Built for teams.</p>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="flex items-center gap-3 mb-8 lg:hidden">
            <div className="flex items-center justify-center w-10 h-10 bg-blue-500 rounded-xl">
              <CheckSquare className="w-6 h-6 text-white" />
            </div>
            <span className="font-bold text-xl text-white">TaskFlow</span>
          </div>

          <div className="bg-white rounded-2xl shadow-2xl p-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-1">Create account</h2>
            <p className="text-slate-500 text-sm mb-6">Join TaskFlow and start managing your team.</p>

            {signup.error && (
              <Alert variant="destructive" className="mb-5">
                <AlertDescription>{getErrorMessage(signup.error)}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit((d) => signup.mutate(d))} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="name">Full name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input id="name" type="text" placeholder="Jane Doe" className="pl-9" autoComplete="name" {...register('name')} />
                </div>
                {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input id="email" type="email" placeholder="you@example.com" className="pl-9" autoComplete="email" {...register('email')} />
                </div>
                {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input id="password" type="password" placeholder="Min. 8 characters" className="pl-9" autoComplete="new-password" {...register('password')} />
                </div>
                {errors.password && <p className="text-xs text-destructive">{errors.password.message}</p>}
              </div>

              <Button type="submit" className="w-full h-11 text-sm font-semibold" disabled={signup.isPending}>
                {signup.isPending ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Creating account...</> : 'Create account'}
              </Button>
            </form>

            <div className="mt-5 pt-5 border-t text-center">
              <p className="text-sm text-slate-500">
                Already have an account?{' '}
                <Link to="/login" className="text-blue-600 font-semibold hover:underline">Sign in</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
