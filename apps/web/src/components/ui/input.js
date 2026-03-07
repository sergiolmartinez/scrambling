import { jsx as _jsx } from "react/jsx-runtime";
import { forwardRef } from 'react';
import { cn } from '@/lib/utils';
export const Input = forwardRef(({ className, ...props }, ref) => {
    return (_jsx("input", { className: cn('h-10 w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 text-sm text-zinc-100 placeholder:text-zinc-500 focus:border-cyan-400 focus:outline-none', className), ref: ref, ...props }));
});
Input.displayName = 'Input';
