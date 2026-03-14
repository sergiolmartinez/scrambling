import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { useAuth } from '@/app/auth-state';
import { useTheme } from '@/app/theme-context';
import { ErrorState } from '@/components/state/error-state';
import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { LogOutIcon, SettingsIcon } from '@/components/ui/icons';
import { StatusBadge } from '@/components/ui/status-badge';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { apiClient } from '@/lib/api';
import { getAuthErrorMessage } from '@/lib/auth-error';

const settingsSchema = z.object({
  display_name: z.string().min(1, 'Display name is required.').max(120),
});

type SettingsValues = z.infer<typeof settingsSchema>;

export function SettingsRoute(): JSX.Element {
  const { clearSession, refreshSession, user } = useAuth();
  const { mode, resolvedTheme } = useTheme();

  const form = useForm<SettingsValues>({
    resolver: zodResolver(settingsSchema),
    defaultValues: { display_name: user?.display_name ?? '' },
  });

  useEffect(() => {
    if (!user) {
      return;
    }
    form.reset({ display_name: user.display_name });
  }, [form, user]);

  const updateProfile = useMutation({
    mutationFn: (values: SettingsValues) => apiClient.updateCurrentUser(values),
    onSuccess: async () => {
      await refreshSession();
    },
  });

  return (
    <div className='space-y-4'>
      <Card>
        <CardTitle>
          <span className='inline-flex items-center gap-2'>
            <SettingsIcon className='h-5 w-5 text-[var(--color-primary)]' />
            Settings
          </span>
        </CardTitle>
        <CardDescription>Manage your account preferences and app behavior.</CardDescription>

        <div className='mt-4 space-y-4'>
          <section className='space-y-2'>
            <h3 className='text-sm font-semibold text-[var(--color-text)]'>Theme preference</h3>
            <ThemeToggle />
            <p className='text-xs text-[var(--color-text-muted)]'>
              Current mode: <span className='font-semibold'>{mode}</span> ({resolvedTheme} applied)
            </p>
          </section>

          <section className='space-y-2'>
            <h3 className='text-sm font-semibold text-[var(--color-text)]'>Display name</h3>
            <form
              className='grid gap-2 sm:grid-cols-[1fr_auto]'
              onSubmit={form.handleSubmit((values) => updateProfile.mutate(values))}
            >
              <Input {...form.register('display_name')} />
              <Button type='submit' className='min-h-10 sm:min-w-36' disabled={updateProfile.isPending}>
                {updateProfile.isPending ? 'Saving...' : 'Save'}
              </Button>
            </form>
            {form.formState.errors.display_name ? (
              <p className='text-sm text-rose-300'>{form.formState.errors.display_name.message}</p>
            ) : null}
            {updateProfile.isSuccess ? <StatusBadge tone='success'>Saved</StatusBadge> : null}
            {updateProfile.isError ? (
              <ErrorState message={getAuthErrorMessage(updateProfile.error, 'update-profile')} />
            ) : null}
          </section>
        </div>
      </Card>

      <Card>
        <CardTitle>Account</CardTitle>
        <CardDescription>Signed-in account details and actions.</CardDescription>
        <div className='mt-4 flex flex-wrap items-center justify-between gap-3'>
          <div className='text-sm text-[var(--color-text-muted)]'>
            <p>{user?.email ?? 'Unknown account'}</p>
            <p className='text-xs'>Session managed with secure HTTP-only cookies.</p>
          </div>
          <Button
            type='button'
            variant='outline'
            className='min-h-10 gap-2'
            onClick={async () => {
              try {
                await apiClient.signOut();
              } finally {
                clearSession();
              }
            }}
          >
            <LogOutIcon className='h-4 w-4' />
            Sign Out
          </Button>
        </div>
      </Card>
    </div>
  );
}
