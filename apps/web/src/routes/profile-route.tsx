import { useAuth } from '@/app/auth-state';
import { EmptyState } from '@/components/state/empty-state';
import { Card, CardDescription, CardTitle } from '@/components/ui/card';
import { UserCircleIcon } from '@/components/ui/icons';

export function ProfileRoute(): JSX.Element {
  const { user } = useAuth();

  if (!user) {
    return <EmptyState title='No profile loaded' description='Sign in again to load account details.' />;
  }

  return (
    <div className='grid gap-4 md:grid-cols-[220px_1fr]'>
      <Card className='flex flex-col items-center justify-center gap-3 text-center'>
        <div className='flex h-24 w-24 items-center justify-center rounded-full border border-[var(--color-border)] bg-[var(--color-surface-muted)] text-2xl font-semibold'>
          {getInitials(user.display_name)}
        </div>
        <p className='text-sm text-[var(--color-text-muted)]'>Profile avatar placeholder</p>
      </Card>

      <Card>
        <CardTitle>
          <span className='inline-flex items-center gap-2'>
            <UserCircleIcon className='h-5 w-5 text-[var(--color-primary)]' />
            Profile
          </span>
        </CardTitle>
        <CardDescription>Your account details for this Scrambling workspace.</CardDescription>

        <dl className='mt-4 space-y-3'>
          <div>
            <dt className='text-xs uppercase tracking-wide text-[var(--color-text-muted)]'>Display name</dt>
            <dd className='text-sm font-medium text-[var(--color-text)]'>{user.display_name}</dd>
          </div>
          <div>
            <dt className='text-xs uppercase tracking-wide text-[var(--color-text-muted)]'>Email</dt>
            <dd className='text-sm font-medium text-[var(--color-text)]'>{user.email}</dd>
          </div>
          <div>
            <dt className='text-xs uppercase tracking-wide text-[var(--color-text-muted)]'>Account created</dt>
            <dd className='text-sm font-medium text-[var(--color-text)]'>{formatDate(user.created_at)}</dd>
          </div>
        </dl>
      </Card>
    </div>
  );
}

function getInitials(name: string): string {
  const parts = name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2);
  if (parts.length === 0) {
    return '?';
  }
  return parts.map((value) => value[0]?.toUpperCase() ?? '').join('');
}

function formatDate(isoValue: string): string {
  const date = new Date(isoValue);
  if (Number.isNaN(date.getTime())) {
    return isoValue;
  }
  return new Intl.DateTimeFormat(undefined, { dateStyle: 'medium' }).format(date);
}
