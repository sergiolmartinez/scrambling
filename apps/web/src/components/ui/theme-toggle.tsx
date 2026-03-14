import { useTheme, type ThemeMode } from '@/app/theme-context';
import { MoonIcon, SunIcon, SystemIcon } from '@/components/ui/icons';
import { cn } from '@/lib/utils';

const options: Array<{ value: ThemeMode; label: string; icon: JSX.Element }> = [
  { value: 'light', label: 'Light', icon: <SunIcon className='h-4 w-4' /> },
  { value: 'dark', label: 'Dark', icon: <MoonIcon className='h-4 w-4' /> },
  { value: 'system', label: 'System', icon: <SystemIcon className='h-4 w-4' /> },
];

export function ThemeToggle(): JSX.Element {
  const { mode, setMode } = useTheme();

  return (
    <div
      className='inline-flex items-center rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] p-1'
      role='group'
      aria-label='Theme preference'
    >
      {options.map((option) => (
        <button
          key={option.value}
          type='button'
          onClick={() => setMode(option.value)}
          className={cn(
            'inline-flex min-h-8 items-center gap-1 rounded-full px-2.5 text-xs font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ring)]',
            mode === option.value
              ? 'bg-[var(--color-primary)] text-[var(--color-primary-foreground)]'
              : 'text-[var(--color-text-muted)] hover:bg-[var(--color-surface-muted)]',
          )}
          aria-pressed={mode === option.value}
          title={`${option.label} theme`}
        >
          {option.icon}
          <span className='hidden sm:inline'>{option.label}</span>
        </button>
      ))}
    </div>
  );
}
