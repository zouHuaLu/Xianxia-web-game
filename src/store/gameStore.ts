import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import talentsData from '../data/talents.json';
import { getAvailableEvents, pickWeightedEvent, resolveChoice } from '../core/eventEngine';
import { clearSave, SAVE_KEY } from '../core/save';
import { startingStageId } from '../core/world';
import type {
  DeathRecord,
  GameChoice,
  GameState,
  Player,
  Talent,
  TalentModifier,
  Weapon,
} from '../core/types';

type GameActions = {
  rollTalents: () => void;
  startGame: () => void;
  choose: (choice: GameChoice) => void;
  useInventoryItem: (index: number) => void;
  discardInventoryItem: (index: number) => void;
  unequipWeapon: () => void;
  rest: () => void;
  train: () => void;
  addLog: (message: string) => void;
  returnToStart: () => void;
  reset: () => void;
};

type GameStore = GameState & GameActions;

const talents = talentsData as Talent[];

function isWeapon(item: Player['inventory'][number]): item is Weapon {
  return 'attack' in item && 'affixes' in item;
}

function createBasePlayer(): Player {
  return {
    realm: startingStageId,
    hp: 100,
    maxHp: 100,
    attack: 10,
    agility: 10,
    luck: 10,
    gold: 10,
    weapon: {
      name: '桃木剑',
      rarity: 'common',
      attack: 2,
      affixes: [],
    },
    inventory: [],
  };
}

function pickRandomTalents(count: number) {
  return [...talents]
    .sort(() => Math.random() - 0.5)
    .slice(0, count);
}

function applyTalentModifiers(player: Player, selectedTalents: Talent[]): Player {
  const modifiers = selectedTalents.reduce<TalentModifier>(
    (total, talent) => ({
      maxHp: (total.maxHp ?? 0) + (talent.modifiers.maxHp ?? 0),
      attack: (total.attack ?? 0) + (talent.modifiers.attack ?? 0),
      agility: (total.agility ?? 0) + (talent.modifiers.agility ?? 0),
      luck: (total.luck ?? 0) + (talent.modifiers.luck ?? 0),
      gold: (total.gold ?? 0) + (talent.modifiers.gold ?? 0),
    }),
    {},
  );

  const maxHp = Math.max(1, player.maxHp + (modifiers.maxHp ?? 0));

  return {
    ...player,
    maxHp,
    hp: maxHp,
    attack: Math.max(1, player.attack + (modifiers.attack ?? 0)),
    agility: Math.max(1, player.agility + (modifiers.agility ?? 0)),
    luck: Math.max(0, player.luck + (modifiers.luck ?? 0)),
    gold: Math.max(0, player.gold + (modifiers.gold ?? 0)),
  };
}

function createInitialState(): GameState {
  return {
    isStarted: false,
    player: createBasePlayer(),
    currentEventId: 'awakening',
    day: 1,
    seed: Date.now(),
    log: ['等待入世。'],
    selectedTalents: pickRandomTalents(3),
    deathRecord: undefined,
  };
}

function createDeathRecord(state: GameState, cause: string): DeathRecord {
  return {
    day: state.day,
    realm: state.player.realm,
    cause,
    finalStats: {
      maxHp: state.player.maxHp,
      attack: state.player.attack + (state.player.weapon?.attack ?? 0),
      agility: state.player.agility,
      luck: state.player.luck,
      gold: state.player.gold,
      weaponName: state.player.weapon?.name ?? '赤手空拳',
    },
    recentLog: state.log.slice(0, 6),
  };
}

function createDeathState(deathRecord: DeathRecord): GameState {
  return {
    ...createInitialState(),
    deathRecord,
    log: ['你已死亡，当前局已清除。'],
  };
}

export const useGameStore = create<GameStore>()(
  persist(
    (set) => ({
      ...createInitialState(),
      rollTalents: () =>
        set((state) => ({
          selectedTalents: pickRandomTalents(3),
          seed: Date.now(),
          log: state.isStarted ? state.log : ['命数重新流转。'],
        })),
      startGame: () =>
        set((state) => {
          const player = applyTalentModifiers(createBasePlayer(), state.selectedTalents);
          const firstEvent = pickWeightedEvent(getAvailableEvents(player));

          return {
            isStarted: true,
            player,
            currentEventId: firstEvent?.id ?? 'forest_wolf',
            day: 1,
            deathRecord: undefined,
            log: [
              `你携 ${state.selectedTalents.map((talent) => talent.name).join('、')} 入世。`,
              '你在无名山谷中醒来。',
            ],
          };
        }),
      choose: (choice) =>
        set((state) => {
          const nextState = resolveChoice(choice, state);

          if (nextState.player.hp <= 0) {
            const cause = nextState.log[0] ?? '你倒在无名道途中。';
            const deathRecord = createDeathRecord(nextState, cause);
            clearSave();
            return createDeathState(deathRecord);
          }

          return nextState;
        }),
      useInventoryItem: (index) =>
        set((state) => {
          const item = state.player.inventory[index];

          if (!item || !isWeapon(item)) {
            return state;
          }

          return {
            player: {
              ...state.player,
              inventory: [
                ...state.player.inventory.filter((_, itemIndex) => itemIndex !== index),
                ...(state.player.weapon ? [state.player.weapon] : []),
              ],
              weapon: item,
            },
            log: [`你装备了${item.name}。`, ...state.log].slice(0, 20),
          };
        }),
      discardInventoryItem: (index) =>
        set((state) => {
          const item = state.player.inventory[index];

          if (!item) {
            return state;
          }

          const inventory = state.player.inventory.filter((_, itemIndex) => itemIndex !== index);

          return {
            player: {
              ...state.player,
              inventory,
            },
            log: [`你丢弃了${item.name}。`, ...state.log].slice(0, 20),
          };
        }),
      unequipWeapon: () =>
        set((state) => ({
          player: {
            ...state.player,
            inventory: state.player.weapon
              ? [...state.player.inventory, state.player.weapon]
              : state.player.inventory,
            weapon: undefined,
          },
          log: state.player.weapon
            ? [`你卸下了${state.player.weapon.name}。`, ...state.log].slice(0, 20)
            : state.log,
        })),
      rest: () =>
        set((state) => ({
          player: {
            ...state.player,
            hp: Math.min(state.player.maxHp, state.player.hp + 8),
          },
          day: state.day + 1,
          log: ['你调息一夜，气血逐渐平复。', ...state.log].slice(0, 20),
        })),
      train: () =>
        set((state) => ({
          player: {
            ...state.player,
            attack: state.player.attack + 1,
            hp: Math.max(1, state.player.hp - 2),
          },
          day: state.day + 1,
          log: ['你演练剑诀，攻势更稳了一分。', ...state.log].slice(0, 20),
        })),
      addLog: (message) =>
        set((state) => ({
          log: [message, ...state.log].slice(0, 20),
        })),
      returnToStart: () => set(createInitialState()),
      reset: () => set(createInitialState()),
    }),
    {
      name: SAVE_KEY,
    },
  ),
);
