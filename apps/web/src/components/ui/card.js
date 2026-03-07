import { jsx as _jsx } from "react/jsx-runtime";
import { cn } from '@/lib/utils';
export function Card({ className, children }) {
    return _jsx("section", { className: cn('rounded-xl border border-zinc-800 bg-zinc-900/70 p-5', className), children: children });
}
export function CardTitle({ children }) {
    return _jsx("h2", { className: 'text-lg font-semibold tracking-tight', children: children });
}
export function CardDescription({ children }) {
    return _jsx("p", { className: 'mt-1 text-sm text-zinc-400', children: children });
}
