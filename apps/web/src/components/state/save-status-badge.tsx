import { CheckCircleIcon, SpinnerIcon, WifiOffIcon } from '@/components/ui/icons';
import { StatusBadge } from '@/components/ui/status-badge';

export type SaveStatus = 'idle' | 'saved' | 'saving' | 'syncing' | 'offline' | 'error';

type SaveStatusBadgeProps = {
  status: SaveStatus;
  savedAt?: number | null;
  errorMessage?: string | null;
  idleLabel?: string;
};

export function SaveStatusBadge({
  status,
  savedAt = null,
  errorMessage = null,
  idleLabel = 'No changes yet',
}: SaveStatusBadgeProps): JSX.Element {
  if (status === 'error') {
    return <StatusBadge tone='danger'>{errorMessage ?? "Couldn't save. Try again."}</StatusBadge>;
  }

  if (status === 'offline') {
    return (
      <StatusBadge tone='warning'>
        <WifiOffIcon className='h-3.5 w-3.5' />
        Offline
      </StatusBadge>
    );
  }

  if (status === 'saving' || status === 'syncing') {
    return (
      <StatusBadge tone='info'>
        <SpinnerIcon className='h-3.5 w-3.5 animate-spin' />
        {status === 'saving' ? 'Saving...' : 'Syncing...'}
      </StatusBadge>
    );
  }

  if (status === 'saved') {
    const suffix =
      savedAt !== null
        ? new Date(savedAt).toLocaleTimeString([], {
            hour: 'numeric',
            minute: '2-digit',
          })
        : null;

    return (
      <StatusBadge tone='success'>
        <CheckCircleIcon className='h-3.5 w-3.5' />
        {suffix ? `Saved ${suffix}` : 'Saved'}
      </StatusBadge>
    );
  }

  return <StatusBadge tone='neutral'>{idleLabel}</StatusBadge>;
}
