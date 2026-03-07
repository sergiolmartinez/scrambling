import { jsx as _jsx } from "react/jsx-runtime";
export function Skeleton({ className }) {
    return _jsx("div", { className: `animate-pulse rounded-md bg-zinc-800 ${className ?? ''}` });
}
