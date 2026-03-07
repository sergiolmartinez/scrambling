import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { EmptyState } from '@/components/state/empty-state';
import { ErrorState } from '@/components/state/error-state';
import { LoadingState } from '@/components/state/loading-state';
import { Card, CardDescription, CardTitle } from '@/components/ui/card';
import { useSummaryQuery } from '@/lib/queries';
import { useRoundSessionStore } from '@/store/round-session';
export function SummaryRoute() {
    const roundId = useRoundSessionStore((state) => state.roundId);
    const summary = useSummaryQuery();
    if (roundId === null) {
        return _jsx(EmptyState, { title: 'No active round', description: 'Create a round in Setup before viewing summary.' });
    }
    if (summary.isPending) {
        return _jsx(LoadingState, { title: 'Summary' });
    }
    if (summary.isError) {
        return _jsx(ErrorState, { message: 'Failed to load round summary.' });
    }
    return (_jsxs(Card, { children: [_jsx(CardTitle, { children: "Round Summary" }), _jsx(CardDescription, { children: "Completion-oriented summary payload from API." }), _jsxs("div", { className: 'mt-4 space-y-2 text-sm', children: [_jsxs("p", { children: ["Round status: ", summary.data.round.status] }), _jsxs("p", { children: ["Course: ", summary.data.course?.name ?? 'Not assigned'] }), _jsxs("p", { children: ["Total players: ", summary.data.players.length] }), _jsxs("p", { children: ["Hole score records: ", summary.data.hole_scores.length] })] })] }));
}
