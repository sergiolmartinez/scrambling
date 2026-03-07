import { cva, type VariantProps } from 'class-variance-authority';
import type { ButtonHTMLAttributes } from 'react';

import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-60',
  {
    variants: {
      variant: {
        primary: 'bg-cyan-400 px-4 py-2 text-zinc-900 hover:bg-cyan-300',
        outline: 'border border-zinc-700 px-4 py-2 text-zinc-100 hover:bg-zinc-800',
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
