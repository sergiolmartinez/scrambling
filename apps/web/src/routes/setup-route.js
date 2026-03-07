import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { EmptyState } from '@/components/state/empty-state';
import { ErrorState } from '@/components/state/error-state';
import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { apiClient } from '@/lib/api';
import { useRoundSessionStore } from '@/store/round-session';
const courseSearchSchema = z.object({
    query: z.string().min(2, 'Enter at least 2 characters.'),
});
export function SetupRoute() {
    const roundId = useRoundSessionStore((state) => state.roundId);
    const setRoundId = useRoundSessionStore((state) => state.setRoundId);
    const form = useForm({
        resolver: zodResolver(courseSearchSchema),
        defaultValues: { query: '' },
    });
    const query = form.watch('query');
    const courseSearch = useQuery({
        queryKey: ['courses-search', query],
        queryFn: () => apiClient.searchCourses(query),
        enabled: query.length >= 2,
    });
    const createRound = useMutation({
        mutationFn: () => apiClient.createRound(),
        onSuccess: (created) => setRoundId(created.id),
    });
    return (_jsxs("div", { className: 'grid gap-6 lg:grid-cols-2', children: [_jsxs(Card, { children: [_jsx(CardTitle, { children: "Round Setup" }), _jsx(CardDescription, { children: "Create a round and keep its ID in local session state." }), _jsxs("div", { className: 'mt-4 space-y-3', children: [_jsx(Button, { onClick: () => createRound.mutate(), type: 'button', children: "Create Round" }), roundId !== null ? (_jsxs("p", { className: 'text-sm text-zinc-300', children: ["Current round ID: ", roundId] })) : (_jsx("p", { className: 'text-sm text-zinc-500', children: "No round selected yet." })), createRound.isError ? _jsx(ErrorState, { message: 'Failed to create round.' }) : null] })] }), _jsxs(Card, { children: [_jsx(CardTitle, { children: "Course Search" }), _jsx(CardDescription, { children: "Search the API for course records before assignment." }), _jsxs("form", { className: 'mt-4 space-y-3', onSubmit: form.handleSubmit(() => undefined), children: [_jsx(Input, { placeholder: 'Search courses...', ...form.register('query') }), form.formState.errors.query ? (_jsx("p", { className: 'text-sm text-rose-300', children: form.formState.errors.query.message })) : null] }), _jsxs("div", { className: 'mt-4 space-y-2', children: [courseSearch.isError ? _jsx(ErrorState, { message: 'Course search failed.' }) : null, courseSearch.isSuccess && courseSearch.data.length === 0 ? (_jsx(EmptyState, { title: 'No courses found', description: 'Try a different query string.' })) : null, courseSearch.data?.map((course) => (_jsxs("div", { className: 'rounded-md border border-zinc-800 px-3 py-2 text-sm', children: [_jsx("p", { className: 'font-medium', children: course.name }), _jsxs("p", { className: 'text-zinc-400', children: [course.city ?? 'Unknown city', ", ", course.state ?? 'Unknown state'] })] }, course.id)))] })] })] }));
}
