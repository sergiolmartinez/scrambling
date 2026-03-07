import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { EmptyState } from '@/components/state/empty-state';
import { ErrorState } from '@/components/state/error-state';
import { LoadingState } from '@/components/state/loading-state';
import { Card, CardDescription, CardTitle } from '@/components/ui/card';
import { useLeaderboardQuery } from '@/lib/queries';
import { useRoundSessionStore } from '@/store/round-session';
export function LeaderboardRoute() {
    const roundId = useRoundSessionStore((state) => state.roundId);
    const leaderboard = useLeaderboardQuery();
    if (roundId === null) {
        return _jsx(EmptyState, { title: 'No active round', description: 'Create a round in Setup before viewing leaderboard.' });
    }
    if (leaderboard.isPending) {
        return _jsx(LoadingState, { title: 'Leaderboard' });
    }
    if (leaderboard.isError) {
        return _jsx(ErrorState, { message: 'Failed to load leaderboard data.' });
    }
    if (leaderboard.data.length === 0) {
        return _jsx(EmptyState, { title: 'No contributions yet', description: 'Record shot contributions in Scoring first.' });
    }
    return (_jsxs(Card, { children: [_jsx(CardTitle, { children: "Leaderboard" }), _jsx(CardDescription, { children: "Live contribution totals by player." }), _jsx("ol", { className: 'mt-4 space-y-2', children: leaderboard.data.map((entry, index) => (_jsxs("li", { className: 'flex items-center justify-between rounded-md border border-zinc-800 px-3 py-2', children: [_jsxs("span", { className: 'text-sm', children: ["#", index + 1, " ", entry.display_name] }), _jsx("span", { className: 'text-sm font-semibold', children: entry.total_contributions })] }, entry.round_player_id))) })] }));
}
