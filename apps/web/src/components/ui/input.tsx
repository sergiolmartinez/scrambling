import type { InputHTMLAttributes } from 'react';
import { forwardRef } from 'react';

import { cn } from '@/lib/utils';

type InputProps = InputHTMLAttributes<HTMLInputElement>;

export const Input = forwardRef<HTMLInputElement, InputProps>(({ className, ...props }, ref) => {
  return (
    <input
      className={cn(
        'h-10 w-full rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] px-3 text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-ring)]',
        className,
      )}
      ref={ref}
      {...props}
    />
  );
});

Input.displayName = 'Input';
