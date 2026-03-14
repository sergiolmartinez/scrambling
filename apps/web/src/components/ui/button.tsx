import { cva, type VariantProps } from 'class-variance-authority';
import type { ButtonHTMLAttributes } from 'react';

import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ring)] disabled:cursor-not-allowed disabled:opacity-60',
  {
    variants: {
      variant: {
        primary: 'bg-[var(--color-primary)] px-4 py-2 text-[var(--color-primary-foreground)] hover:brightness-110',
        outline: 'border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2 text-[var(--color-text)] hover:bg-[var(--color-surface-muted)]',
      },
    },
    defaultVariants: {
      variant: 'primary',
    },
  },
);

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & VariantProps<typeof buttonVariants>;

export function Button({ className, variant, ...props }: ButtonProps): JSX.Element {
  return <button className={cn(buttonVariants({ variant }), className)} {...props} />;
}
