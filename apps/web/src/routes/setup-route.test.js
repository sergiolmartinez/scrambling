import { jsx as _jsx } from "react/jsx-runtime";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { SetupRoute } from '@/routes/setup-route';
const { createRoundMock, searchCoursesMock } = vi.hoisted(() => ({
    createRoundMock: vi.fn(),
    searchCoursesMock: vi.fn(),
}));
vi.mock('@/lib/api', () => ({
    apiClient: {
        createRound: createRoundMock,
        searchCourses: searchCoursesMock,
    },
}));
function renderSetup() {
    const client = new QueryClient({
        defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
    });
    return render(_jsx(QueryClientProvider, { client: client, children: _jsx(SetupRoute, {}) }));
}
describe('SetupRoute', () => {
    it('creates round and stores ID in view', async () => {
        createRoundMock.mockResolvedValueOnce({ id: 42 });
        searchCoursesMock.mockResolvedValue([]);
        renderSetup();
        fireEvent.click(screen.getByRole('button', { name: /create round/i }));
        await waitFor(() => {
            expect(screen.getByText(/current round id: 42/i)).toBeInTheDocument();
        });
    });
});
