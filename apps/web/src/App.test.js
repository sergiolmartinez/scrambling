import { jsx as _jsx } from "react/jsx-runtime";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { AppLayout } from '@/app/layout';
describe('AppLayout', () => {
    it('renders shell navigation labels', () => {
        const client = new QueryClient();
        render(_jsx(QueryClientProvider, { client: client, children: _jsx(MemoryRouter, { initialEntries: ['/setup'], children: _jsx(Routes, { children: _jsx(Route, { element: _jsx(AppLayout, {}), children: _jsx(Route, { path: '/setup', element: _jsx("div", { children: "Setup Page" }) }) }) }) }) }));
        expect(screen.getByText(/scrambling/i)).toBeInTheDocument();
        expect(screen.getByRole('link', { name: /setup/i })).toBeInTheDocument();
        expect(screen.getByRole('link', { name: /scoring/i })).toBeInTheDocument();
        expect(screen.getByRole('link', { name: /leaderboard/i })).toBeInTheDocument();
        expect(screen.getByRole('link', { name: /summary/i })).toBeInTheDocument();
    });
});
