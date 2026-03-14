import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { z } from 'zod';

import { useAuth } from '@/app/auth-state';
import { AuthShell } from '@/components/auth/auth-shell';
import { ErrorState } from '@/components/state/error-state';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { apiClient } from '@/lib/api';

const signInSchema = z.object({
  email: z.string().email('Enter a valid email address.'),
  password: z.string().min(8, 'Password must be at least 8 characters.'),
});

type SignInValues = z.infer<typeof signInSchema>;

export function SignInRoute(): JSX.Element {
  const location = useLocation();
  const navigate = useNavigate();
  const { refreshSession } = useAuth();
  const next = new URLSearchParams(location.search).get('next') || '/setup';

  const form = useForm<SignInValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: '', password: '' },
  });

  const signIn = useMutation({
    mutationFn: (values: SignInValues) => apiClient.signIn(values),
    onSuccess: async () => {
      await refreshSession();
      navigate(next, { replace: true });
    },
  });

  return (
    <AuthShell
      title='Welcome back'
      description='Sign in to continue your rounds and scoring flow.'
    >
      <form className='space-y-3' onSubmit={form.handleSubmit((values) => signIn.mutate(values))}>
        <div className='space-y-1.5'>
          <label className='text-sm text-[var(--color-text-muted)]' htmlFor='email'>
            Email
          </label>
          <Input id='email' autoComplete='email' type='email' {...form.register('email')} />
          {form.formState.errors.email ? (
            <p className='text-sm text-rose-300'>{form.formState.errors.email.message}</p>
          ) : null}
        </div>

        <div className='space-y-1.5'>
          <label className='text-sm text-[var(--color-text-muted)]' htmlFor='password'>
            Password
          </label>
          <Input
            id='password'
            autoComplete='current-password'
            type='password'
            {...form.register('password')}
          />
          {form.formState.errors.password ? (
            <p className='text-sm text-rose-300'>{form.formState.errors.password.message}</p>
          ) : null}
        </div>

        {signIn.isError ? (
          <ErrorState message='Sign in failed. Check your email and password and try again.' />
        ) : null}

        <Button type='submit' className='min-h-11 w-full' disabled={signIn.isPending}>
          {signIn.isPending ? 'Signing in...' : 'Sign In'}
        </Button>
      </form>

      <p className='text-sm text-[var(--color-text-muted)]'>
        New to Scrambling?{' '}
        <Link className='font-medium text-[var(--color-primary)]' to={`/sign-up?next=${encodeURIComponent(next)}`}>
          Create your account
        </Link>
      </p>
    </AuthShell>
  );
}
