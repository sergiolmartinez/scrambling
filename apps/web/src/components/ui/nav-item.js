import { jsx as _jsx } from "react/jsx-runtime";
import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';
export function NavItem({ to, children }) {
    return (_jsx(NavLink, { className: ({ isActive }) => cn('rounded-md px-3 py-1.5 text-sm font-medium transition-colors', isActive ? 'bg-zinc-100 text-zinc-900' : 'text-zinc-300 hover:bg-zinc-800 hover:text-white'), to: to, children: children }));
}
