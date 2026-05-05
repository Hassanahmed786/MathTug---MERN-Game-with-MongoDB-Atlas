import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const usePlayerStore = create(
  persist(
    (set, get) => ({
      xp: 0,
      level: 1,
      matchesWon: 0,
      matchesPlayed: 0,
      ageMode: 'explorers', // Default to Math Explorers

      addXp: (amount) => {
        const currentXp = get().xp + amount;
        const newLevel = Math.floor(currentXp / 100) + 1; // 100 XP per level
        set({ xp: currentXp, level: newLevel });
      },

      recordMatch: (isWin) => {
        set((state) => ({
          matchesPlayed: state.matchesPlayed + 1,
          matchesWon: isWin ? state.matchesWon + 1 : state.matchesWon,
        }));
      },

      setAgeMode: (modeId) => {
        set({ ageMode: modeId });
      },
    }),
    {
      name: 'mathtug-player-storage',
    }
  )
);
