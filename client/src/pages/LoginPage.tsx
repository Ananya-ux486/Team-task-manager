import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { CheckSquare, Loader2, Mail, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useLogin } from '@/hooks/useAuth';
import { getErrorMessage } from '@/lib/api';
const schema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});
type FormData = z.infer<typeof schema>;

export default function LoginPage() {
  const login = useLogin();
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900">
      {/* Left panel — branding */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 p-12 text-white">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 bg-blue-500 rounded-xl shadow-lg shadow-blue-500/40">
            <CheckSquare className="w-6 h-6 text-white" />
          </div>
          <span className="font-bold text-xl">TaskFlow</span>
        </div>
        <div>
          <h2 className="text-4xl font-bold leading-tight mb-4">
            Manage your team's work,<br />
            <span className="text-blue-400">all in one place.</span>
          </h2>
          <p className="text-slate-400 text-lg leading-relaxed">
            Track tasks, deadlines, and team accountability in real-time.
          </p>
          <div className="flex gap-6 mt-8">
            {[
              { label: 'Projects', value: '∞' },
              { label: 'Team Members', value: '∞' },
              { label: 'Task Statuses', value: '4' },
            ].map(({ label, value }) => (
              <div key={label}>
                <p className="text-2xl font-bold text-white">{value}</p>
                <p className="text-xs text-slate-400 mt-0.5">{label}</p>
              </div>
            ))}
          </div>
        </div>
        <p className="text-slate-500 text-sm">© 2024 TaskFlow. Built for teams.</p>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="flex items-center gap-3 mb-8 lg:hidden">
            <div className="flex items-center justify-center w-10 h-10 bg-blue-500 rounded-xl">
              <CheckSquare className="w-6 h-6 text-white" />
            </div>
            <span className="font-bold text-xl text-white">TaskFlow</span>
          </div>

          <div className="bg-white rounded-2xl shadow-2xl p-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-1">Sign in</h2>
            <p className="text-slate-500 text-sm mb-6">Welcome back! Enter your credentials.</p>

            {login.error && (
              <Alert variant="destructive" className="mb-5">
                <AlertDescription>{getErrorMessage(login.error)}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit((d) => login.mutate(d))} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input id="email" type="email" placeholder="you@example.com" className="pl-9" autoComplete="email" {...register('email')} />
                </div>
                {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Link
                    to="/forgot-password"
                    className="text-xs text-blue-600 hover:underline font-medium"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input id="password" type="password" placeholder="••••••••" className="pl-9" autoComplete="current-password" {...register('password')} />
                </div>
                {errors.password && <p className="text-xs text-destructive">{errors.password.message}</p>}
              </div>

              <Button type="submit" className="w-full h-11 text-sm font-semibold" disabled={login.isPending}>
                {login.isPending ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Signing in...</> : 'Sign in'}
              </Button>
            </form>

            <div className="mt-5 pt-5 border-t text-center">
              <p className="text-sm text-slate-500">
                Don't have an account?{' '}
                <Link to="/signup" className="text-blue-600 font-semibold hover:underline">Create one</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
