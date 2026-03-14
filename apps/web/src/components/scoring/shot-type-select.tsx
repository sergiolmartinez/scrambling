import { useEffect, useRef, useState } from 'react';

import { ChevronDownIcon } from '@/components/ui/icons';

export const SHOT_TYPE_OPTIONS = [
  'Drive',
  'Par 3 Tee Shot',
  'Fairway Wood',
  'Hybrid',
  'Long Iron',
  'Mid Iron',
  'Short Iron',
  'Approach',
  'Pitch',
  'Chip',
  'Bunker',
  'Putt',
  'Gimme',
  'Water Hazard',
  'Out of Bounds',
  'Penalty',
] as const;

type ShotTypeSelectProps = {
  value: string;
  disabled: boolean;
  onChange: (value: string) => void;
};

export function ShotTypeSelect({ value, disabled, onChange }: ShotTypeSelectProps): JSX.Element {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) {
      return;
    }

    const onPointerDown = (event: MouseEvent): void => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    const onEscape = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') {
        setOpen(false);
      }
    };

    window.addEventListener('mousedown', onPointerDown);
    window.addEventListener('keydown', onEscape);
    return () => {
      window.removeEventListener('mousedown', onPointerDown);
      window.removeEventListener('keydown', onEscape);
    };
  }, [open]);

  return (
    <div className='relative space-y-2' ref={rootRef}>
      <label className='text-xs font-medium uppercase tracking-wide text-[var(--color-text-muted)]' htmlFor='shot-type-trigger'>
        Shot Type
      </label>
      <button
        id='shot-type-trigger'
        type='button'
        aria-haspopup='listbox'
        aria-expanded={open}
        disabled={disabled}
        className='flex h-10 w-full items-center justify-between rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] px-3 text-sm text-[var(--color-text)] focus:border-[var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-ring)] disabled:cursor-not-allowed disabled:opacity-60'
        onClick={() => setOpen((previous) => !previous)}
      >
        <span>{value || 'Select a shot type'}</span>
        <ChevronDownIcon className={`h-4 w-4 text-[var(--color-text-muted)] transition ${open ? 'rotate-180' : ''}`} />
      </button>

      {open ? (
        <div className='absolute z-20 mt-1 w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-1 shadow-lg'>
          <ul role='listbox' aria-label='Shot type options' className='max-h-56 space-y-1 overflow-auto'>
            <li>
              <button
                type='button'
                className='w-full rounded-lg px-3 py-2 text-left text-sm text-[var(--color-text)] hover:bg-[var(--color-surface-muted)]'
                onClick={() => {
                  onChange('');
                  setOpen(false);
                }}
              >
                Select a shot type
              </button>
            </li>
            {SHOT_TYPE_OPTIONS.map((option) => (
              <li key={option}>
                <button
                  type='button'
                  className={`w-full rounded-lg px-3 py-2 text-left text-sm ${
                    option === value
                      ? 'bg-[var(--color-primary)]/15 text-[var(--color-text)]'
                      : 'text-[var(--color-text)] hover:bg-[var(--color-surface-muted)]'
                  }`}
                  onClick={() => {
                    onChange(option);
                    setOpen(false);
                  }}
                >
                  {option}
                </button>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
