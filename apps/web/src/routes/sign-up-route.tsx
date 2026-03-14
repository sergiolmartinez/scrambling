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
import { getAuthErrorMessage } from '@/lib/auth-error';

const signUpSchema = z.object({
  display_name: z.string().min(1, 'Display name is required.').max(120),
  email: z.string().email('Enter a valid email address.'),
  password: z.string().min(8, 'Password must be at least 8 characters.').max(128),
});

type SignUpValues = z.infer<typeof signUpSchema>;

export function SignUpRoute(): JSX.Element {
  const location = useLocation();
  const navigate = useNavigate();
  const { refreshSession } = useAuth();
  const next = new URLSearchParams(location.search).get('next') || '/setup';

  const form = useForm<SignUpValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: { display_name: '', email: '', password: '' },
  });

  const signUp = useMutation({
    mutationFn: (values: SignUpValues) => apiClient.signUp(values),
    onSuccess: async () => {
      await refreshSession();
      navigate(next, { replace: true });
    },
  });

  return (
    <AuthShell
      title='Create your account'
      description='Set up your profile to start and track your rounds.'
    >
      <form className='space-y-3' onSubmit={form.handleSubmit((values) => signUp.mutate(values))}>
        <div className='space-y-1.5'>
          <label className='text-sm text-[var(--color-text-muted)]' htmlFor='display_name'>
            Display name
          </label>
          <Input id='display_name' autoComplete='name' {...form.register('display_name')} />
          {form.formState.errors.display_name ? (
            <p className='text-sm text-rose-300'>{form.formState.errors.display_name.message}</p>
          ) : null}
        </div>

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
          <Input id='password' autoComplete='new-password' type='password' {...form.register('password')} />
          {form.formState.errors.password ? (
            <p className='text-sm text-rose-300'>{form.formState.errors.password.message}</p>
          ) : null}
        </div>

        {signUp.isError ? <ErrorState message={getAuthErrorMessage(signUp.error, 'sign-up')} /> : null}

        <Button type='submit' className='min-h-11 w-full' disabled={signUp.isPending}>
          {signUp.isPending ? 'Creating account...' : 'Create Account'}
        </Button>
      </form>

      <p className='text-sm text-[var(--color-text-muted)]'>
        Already have an account?{' '}
        <Link className='font-medium text-[var(--color-primary)]' to={`/sign-in?next=${encodeURIComponent(next)}`}>
          Sign in
        </Link>
      </p>
    </AuthShell>
  );
}
