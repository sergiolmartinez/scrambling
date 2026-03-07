import { create } from 'zustand';
export const useRoundSessionStore = create((set) => ({
    roundId: null,
    setRoundId: (roundId) => set({ roundId }),
}));
