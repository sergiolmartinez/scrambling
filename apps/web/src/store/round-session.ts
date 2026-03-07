import { create } from 'zustand';

type RoundSessionState = {
  roundId: number | null;
  setRoundId: (roundId: number | null) => void;
};

export const useRoundSessionStore = create<RoundSessionState>((set) => ({
  roundId: null,
  setRoundId: (roundId) => set({ roundId }),
}));
