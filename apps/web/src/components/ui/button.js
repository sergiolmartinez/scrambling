import { jsx as _jsx } from "react/jsx-runtime";
import { cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';
const buttonVariants = cva('inline-flex items-center justify-center rounded-md text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-60', {
    variants: {
        variant: {
            primary: 'bg-cyan-400 px-4 py-2 text-zinc-900 hover:bg-cyan-300',
            outline: 'border border-zinc-700 px-4 py-2 text-zinc-100 hover:bg-zinc-800',
        },
    },
    defaultVariants: {
        variant: 'primary',
    },
});
export function Button({ className, variant, ...props }) {
    return _jsx("button", { className: cn(buttonVariants({ variant }), className), ...props });
}
