import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { EmptyState } from '@/components/state/empty-state';
import { ErrorState } from '@/components/state/error-state';
import { LoadingState } from '@/components/state/loading-state';
import { Card, CardDescription, CardTitle } from '@/components/ui/card';
import { useRoundAggregateQuery } from '@/lib/queries';
import { useRoundSessionStore } from '@/store/round-session';
export function ScoringRoute() {
    const roundId = useRoundSessionStore((state) => state.roundId);
    const aggregate = useRoundAggregateQuery();
    if (roundId === null) {
        return _jsx(EmptyState, { title: 'No active round', description: 'Create a round in Setup before scoring.' });
    }
    if (aggregate.isPending) {
        return _jsx(LoadingState, { title: 'Scoring' });
    }
    if (aggregate.isError) {
        return _jsx(ErrorState, { message: 'Failed to load round aggregate for scoring.' });
    }
    return (_jsxs(Card, { children: [_jsx(CardTitle, { children: "Scoring Shell" }), _jsx(CardDescription, { children: "Route module scaffold for hole-by-hole scoring." }), _jsxs("div", { className: 'mt-4 space-y-2 text-sm', children: [_jsxs("p", { children: ["Round ID: ", aggregate.data.round.id] }), _jsxs("p", { children: ["Status: ", aggregate.data.round.status] }), _jsxs("p", { children: ["Players: ", aggregate.data.players.length] }), _jsxs("p", { children: ["Saved hole scores: ", aggregate.data.hole_scores.length] })] })] }));
}
