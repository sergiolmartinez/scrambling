import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Card, CardDescription, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
export function LoadingState({ title }) {
    return (_jsxs(Card, { children: [_jsx(CardTitle, { children: title }), _jsx(CardDescription, { children: "Loading data from the API." }), _jsxs("div", { className: 'mt-4 space-y-2', children: [_jsx(Skeleton, { className: 'h-4 w-full' }), _jsx(Skeleton, { className: 'h-4 w-3/4' })] })] }));
}
