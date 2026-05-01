import { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  CheckSquare,
  Loader2,
  Lock,
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  Eye,
  EyeOff,
} from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { authApi, getErrorMessage } from '@/lib/api';

const schema = z
  .object({
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type FormData = z.infer<typeof schema>;

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [success, setSuccess] = useState(false);

  const mutation = useMutation({
    mutationFn: (data: FormData) => authApi.resetPassword(token!, data.password),
    onSuccess: () => {
      setSuccess(true);
      // Redirect to login after 3 seconds
      setTimeout(() => navigate('/login'), 3000);
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  // No token in URL
  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 p-4">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-2xl p-8 text-center">
            <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-2xl mx-auto mb-4">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 mb-2">Invalid Reset Link</h2>
            <p className="text-slate-500 text-sm mb-6">
              This password reset link is invalid or missing. Please request a new one.
            </p>
            <Button asChild className="w-full">
              <Link to="/forgot-password">Request New Link</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex items-center gap-3 mb-8 justify-center">
          <div className="flex items-center justify-center w-10 h-10 bg-blue-500 rounded-xl shadow-lg shadow-blue-500/40">
            <CheckSquare className="w-6 h-6 text-white" />
          </div>
          <span className="font-bold text-xl text-white">TaskFlow</span>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl p-8">
          {success ? (
            /* Success state */
            <div className="text-center">
              <div className="flex items-center justify-center w-14 h-14 bg-emerald-100 rounded-2xl mx-auto mb-4">
                <CheckCircle2 className="w-8 h-8 text-emerald-600" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Password Reset!</h2>
              <p className="text-slate-500 text-sm mb-6">
                Your password has been updated successfully. Redirecting you to sign in...
              </p>
              <div className="flex items-center justify-center gap-2 text-sm text-slate-400">
                <Loader2 className="w-4 h-4 animate-spin" />
                Redirecting in 3 seconds...
              </div>
              <Button asChild className="w-full mt-4">
                <Link to="/login">Sign in now</Link>
              </Button>
            </div>
          ) : (
            /* Reset form */
            <>
              <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-2xl mx-auto mb-4">
                <Lock className="w-6 h-6 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 text-center mb-1">
                Set new password
              </h2>
              <p className="text-slate-500 text-sm text-center mb-6">
                Choose a strong password for your account.
              </p>

              {mutation.error && (
                <Alert variant="destructive" className="mb-5">
                  <AlertDescription>{getErrorMessage(mutation.error)}</AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleSubmit((d) => mutation.mutate(d))} className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="password">New password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Min. 8 characters"
                      className="pl-9 pr-10"
                      autoComplete="new-password"
                      {...register('password')}
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      onClick={() => setShowPassword((v) => !v)}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-xs text-destructive">{errors.password.message}</p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="confirmPassword">Confirm new password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input
                      id="confirmPassword"
                      type={showConfirm ? 'text' : 'password'}
                      placeholder="Repeat your password"
                      className="pl-9 pr-10"
                      autoComplete="new-password"
                      {...register('confirmPassword')}
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      onClick={() => setShowConfirm((v) => !v)}
                    >
                      {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-xs text-destructive">{errors.confirmPassword.message}</p>
                  )}
                </div>

                {/* Password strength hints */}
                <ul className="text-xs text-slate-400 space-y-1 pl-1">
                  <li>• At least 8 characters</li>
                  <li>• Use a mix of letters, numbers, and symbols for best security</li>
                </ul>

                <Button
                  type="submit"
                  className="w-full h-11 font-semibold"
                  disabled={mutation.isPending}
                >
                  {mutation.isPending ? (
                    <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Resetting password...</>
                  ) : (
                    'Reset Password'
                  )}
                </Button>
              </form>

              <div className="mt-6 pt-5 border-t text-center">
                <Link
                  to="/login"
                  className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-blue-600 transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  Back to sign in
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
