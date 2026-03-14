import { CheckCircleIcon } from '@/components/ui/icons';
import { cn } from '@/lib/utils';

type ProgressChecklistItem = {
  label: string;
  complete: boolean;
};

type ProgressChecklistProps = {
  items: ProgressChecklistItem[];
};

export function ProgressChecklist({ items }: ProgressChecklistProps): JSX.Element {
  return (
    <ul className='grid gap-2 sm:grid-cols-3' aria-label='Round setup progress'>
      {items.map((item, index) => (
        <li
          className={cn(
            'flex items-center gap-2 rounded-xl border px-3 py-2 text-sm',
            item.complete
              ? 'border-[var(--color-success-border)] bg-[var(--color-success-bg)] text-[var(--color-success-text)]'
              : 'border-[var(--color-border)] bg-[var(--color-surface-muted)] text-[var(--color-text-muted)]',
          )}
          key={item.label}
        >
          <span className='inline-flex h-6 w-6 items-center justify-center rounded-full border border-current/30 text-[11px] font-semibold'>
            {item.complete ? <CheckCircleIcon className='h-3.5 w-3.5' /> : index + 1}
          </span>
          <span className='font-medium'>{item.label}</span>
        </li>
      ))}
    </ul>
  );
}
