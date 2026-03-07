import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Outlet } from 'react-router-dom';
import { NavItem } from '@/components/ui/nav-item';
const navItems = [
    { to: '/setup', label: 'Setup' },
    { to: '/scoring', label: 'Scoring' },
    { to: '/leaderboard', label: 'Leaderboard' },
    { to: '/summary', label: 'Summary' },
];
export function AppLayout() {
    return (_jsxs("div", { className: 'min-h-screen bg-gradient-to-b from-zinc-950 via-zinc-900 to-zinc-950 text-zinc-100', children: [_jsx("header", { className: 'border-b border-zinc-800/80 bg-zinc-950/70 backdrop-blur', children: _jsxs("div", { className: 'mx-auto flex max-w-6xl items-center justify-between px-6 py-4', children: [_jsxs("div", { children: [_jsx("h1", { className: 'text-xl font-semibold tracking-tight', children: "Scrambling" }), _jsx("p", { className: 'text-xs text-zinc-400', children: "MVP Web Shell" })] }), _jsx("nav", { className: 'flex gap-2', children: navItems.map((item) => (_jsx(NavItem, { to: item.to, children: item.label }, item.to))) })] }) }), _jsx("main", { className: 'mx-auto max-w-6xl px-6 py-8', children: _jsx(Outlet, {}) })] }));
}
