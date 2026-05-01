import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { CheckSquare, Loader2, Mail, ArrowLeft, Copy, CheckCheck, KeyRound } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { authApi, getErrorMessage } from '@/lib/api';

const schema = z.object({
  email: z.string().email('Please enter a valid email address'),
});
type FormData = z.infer<typeof schema>;

export default function ForgotPasswordPage() {
  const [resetToken, setResetToken] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const mutation = useMutation({
    mutationFn: (email: string) => authApi.forgotPassword(email),
    onSuccess: (data) => {
      if (data.resetToken) setResetToken(data.resetToken);
    },
  });

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const resetLink = resetToken
    ? `${window.location.origin}/reset-password?token=${resetToken}`
    : null;

  const copyLink = async () => {
    if (!resetLink) return;
    await navigator.clipboard.writeText(resetLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

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
          {!resetToken ? (
            <>
              {/* Step 1 — Enter email */}
              <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-2xl mx-auto mb-4">
                <KeyRound className="w-6 h-6 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 text-center mb-1">
                Forgot password?
              </h2>
              <p className="text-slate-500 text-sm text-center mb-6">
                Enter your email and we'll generate a password reset link for you.
              </p>

              {mutation.error && (
                <Alert variant="destructive" className="mb-5">
                  <AlertDescription>{getErrorMessage(mutation.error)}</AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleSubmit((d) => mutation.mutate(d.email))} className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="email">Email address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      className="pl-9"
                      autoComplete="email"
                      {...register('email')}
                    />
                  </div>
                  {errors.email && (
                    <p className="text-xs text-destructive">{errors.email.message}</p>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full h-11 font-semibold"
                  disabled={mutation.isPending}
                >
                  {mutation.isPending ? (
                    <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Generating link...</>
                  ) : (
                    'Generate Reset Link'
                  )}
                </Button>
              </form>
            </>
          ) : (
            <>
              {/* Step 2 — Show reset link */}
              <div className="flex items-center justify-center w-12 h-12 bg-emerald-100 rounded-2xl mx-auto mb-4">
                <CheckCheck className="w-6 h-6 text-emerald-600" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 text-center mb-1">
                Reset link ready!
              </h2>
              <p className="text-slate-500 text-sm text-center mb-6">
                Your password reset link has been generated. Click the button below to reset your password, or copy the link.
              </p>

              {/* Reset link display */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 mb-4">
                <p className="text-xs text-slate-500 mb-2 font-medium">Reset link (expires in 30 min):</p>
                <p className="text-xs text-slate-700 break-all font-mono leading-relaxed">
                  {resetLink}
                </p>
              </div>

              <div className="flex gap-2 mb-4">
                <Button
                  className="flex-1 gap-2"
                  onClick={() => window.location.href = resetLink!}
                >
                  <KeyRound className="w-4 h-4" />
                  Reset Password Now
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={copyLink}
                  title="Copy link"
                >
                  {copied ? (
                    <CheckCheck className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </Button>
              </div>

              <p className="text-xs text-slate-400 text-center">
                This link can only be used once and expires in 30 minutes.
              </p>
            </>
          )}

          <div className="mt-6 pt-5 border-t text-center">
            <Link
              to="/login"
              className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-blue-600 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Back to sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
