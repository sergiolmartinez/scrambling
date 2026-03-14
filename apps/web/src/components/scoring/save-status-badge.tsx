import { SaveStatusBadge as BaseSaveStatusBadge } from '@/components/state/save-status-badge';

type SaveStatusBadgeProps = {
  isSaving: boolean;
  error: string | null;
  savedAt: number | null;
  idleLabel: string;
};

export function SaveStatusBadge({
  isSaving,
  error,
  savedAt,
  idleLabel,
}: SaveStatusBadgeProps): JSX.Element {
  const status = error ? 'error' : isSaving ? 'saving' : savedAt !== null ? 'saved' : 'idle';
  return <BaseSaveStatusBadge status={status} savedAt={savedAt} errorMessage={error} idleLabel={idleLabel} />;
}
