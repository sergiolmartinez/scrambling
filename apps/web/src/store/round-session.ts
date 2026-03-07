import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type RoundSessionState = {
  roundId: number | null;
  setRoundId: (roundId: number | null) => void;
};

export const useRoundSessionStore = create<RoundSessionState>()(
  persist(
    (set) => ({
      roundId: null,
      setRoundId: (roundId) => set({ roundId }),
    }),
    {
      name: 'scrambling-round-session',
    },
  ),
);
