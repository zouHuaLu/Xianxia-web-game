import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type GameState = {
  name: string;
  realmIndex: number;
  cultivation: number;
  spiritStones: number;
  cultivate: () => void;
  breakthrough: () => void;
  reset: () => void;
};

const initialState = {
  name: '云游散修',
  realmIndex: 0,
  cultivation: 0,
  spiritStones: 12,
};

export const useGameStore = create<GameState>()(
  persist(
    (set) => ({
      ...initialState,
      cultivate: () =>
        set((state) => ({
          cultivation: Math.min(state.cultivation + 12, 100),
          spiritStones: state.spiritStones + 1,
        })),
      breakthrough: () =>
        set((state) => {
          if (state.cultivation < 100 || state.realmIndex >= 4) {
            return state;
          }

          return {
            realmIndex: state.realmIndex + 1,
            cultivation: 0,
            spiritStones: state.spiritStones + 10,
          };
        }),
      reset: () => set(initialState),
    }),
    {
      name: 'xianxia-web-game-save',
    },
  ),
);
