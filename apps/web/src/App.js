import { jsx as _jsx } from "react/jsx-runtime";
import { AppProviders } from '@/app/providers';
import { router } from '@/app/router';
import { RouterProvider } from 'react-router-dom';
export function App() {
    return (_jsx(AppProviders, { children: _jsx(RouterProvider, { router: router }) }));
}
