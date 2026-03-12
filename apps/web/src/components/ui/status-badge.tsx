import { cva, type VariantProps } from 'class-variance-authority';
import type { PropsWithChildren } from 'react';

import { cn } from '@/lib/utils';

const statusBadgeVariants = cva(
  'inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-medium',
  {
    variants: {
      tone: {
        neutral: 'border-[var(--color-border)] bg-[var(--color-surface-muted)] text-[var(--color-text-muted)]',
        success: 'border-[var(--color-success-border)] bg-[var(--color-success-bg)] text-[var(--color-success-text)]',
        warning: 'border-[var(--color-warning-border)] bg-[var(--color-warning-bg)] text-[var(--color-warning-text)]',
        danger: 'border-[var(--color-danger-border)] bg-[var(--color-danger-bg)] text-[var(--color-danger-text)]',
        info: 'border-[var(--color-info-border)] bg-[var(--color-info-bg)] text-[var(--color-info-text)]',
      },
    },
    defaultVariants: {
      tone: 'neutral',
    },
  },
);

type StatusBadgeProps = PropsWithChildren<
  VariantProps<typeof statusBadgeVariants> & {
    className?: string;
  }
>;

export function StatusBadge({ className, tone, children }: StatusBadgeProps): JSX.Element {
  return <span className={cn(statusBadgeVariants({ tone }), className)}>{children}</span>;
}
