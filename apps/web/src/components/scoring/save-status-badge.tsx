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
  if (error) {
    return (
      <span className='inline-flex rounded-full border border-rose-300/40 bg-rose-400/10 px-2.5 py-1 text-xs text-rose-200'>
        Save failed
      </span>
    );
  }

  if (isSaving) {
    return (
      <span className='inline-flex rounded-full border border-sky-300/40 bg-sky-400/10 px-2.5 py-1 text-xs text-sky-200'>
        Saving...
      </span>
    );
  }

  if (savedAt !== null) {
    const time = new Date(savedAt).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
    return (
      <span className='inline-flex rounded-full border border-emerald-300/40 bg-emerald-400/10 px-2.5 py-1 text-xs text-emerald-200'>
        Saved at {time}
      </span>
    );
  }

  return (
    <span className='inline-flex rounded-full border border-slate-600/70 bg-slate-900/60 px-2.5 py-1 text-xs text-slate-300'>
      {idleLabel}
    </span>
  );
}
