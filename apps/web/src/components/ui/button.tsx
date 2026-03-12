import { cva, type VariantProps } from 'class-variance-authority';
import type { ButtonHTMLAttributes } from 'react';

import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/60 disabled:cursor-not-allowed disabled:opacity-60',
  {
    variants: {
      variant: {
        primary:
          'bg-gradient-to-r from-sky-300 to-cyan-300 px-4 py-2 text-slate-900 shadow-[0_8px_24px_rgba(56,189,248,0.2)] hover:from-sky-200 hover:to-cyan-200',
        outline:
          'border border-slate-600/70 bg-slate-900/40 px-4 py-2 text-slate-100 hover:border-sky-300/40 hover:bg-slate-800/70',
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
