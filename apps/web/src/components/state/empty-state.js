import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Card, CardDescription, CardTitle } from '@/components/ui/card';
export function EmptyState({ title, description }) {
    return (_jsxs(Card, { className: 'border-dashed', children: [_jsx(CardTitle, { children: title }), _jsx(CardDescription, { children: description })] }));
}
