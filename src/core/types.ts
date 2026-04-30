export type Item = {
  id: string;
  name: string;
  type: 'consumable' | 'material' | 'quest';
  description?: string;
};

export type Weapon = {
  name: string;
  rarity: 'common' | 'rare' | 'epic';
  attack: number;
  affixes: string[];
};

export type CultivationStageId =
  | 'early'
  | 'qi'
  | 'foundation'
  | 'core'
  | 'soul'
  | 'ascension';

export type CultivationStage = {
  id: CultivationStageId;
  name: string;
  description: string;
  isEnding?: boolean;
};

export type Player = {
  realm: CultivationStageId;
  hp: number;
  maxHp: number;
  attack: number;
  agility: number;
  luck: number;
  gold: number;
  weapon?: Weapon;
  inventory: Array<Item | Weapon>;
};

export type TalentModifier = Partial<
  Pick<Player, 'maxHp' | 'attack' | 'agility' | 'luck' | 'gold'>
>;

export type Talent = {
  id: string;
  name: string;
  description: string;
  modifiers: TalentModifier;
};

export type Reward =
  | {
      type: 'gold';
      amount: number;
    }
  | {
      type: 'weapon';
      weapon: Weapon;
    };

export type Enemy = {
  id: string;
  name: string;
  hp: number;
  attack: number;
  reward: {
    gold?: [number, number];
    weaponChance?: number;
  };
};

export type BattleResult = {
  win: boolean;
  hpLost: number;
  rewards: Reward[];
};

export type EventResult =
  | {
      type: 'battle';
      enemy: string;
    }
  | {
      type: 'escape';
    }
  | {
      type: 'rest';
      hp: number;
    }
  | {
      type: 'gold';
      amount: number;
    }
  | {
      type: 'loot';
      gold?: [number, number];
      weaponChance?: number;
    };

export type GameChoice = {
  text: string;
  result: EventResult;
};

export type GameEvent = {
  id: string;
  stage: CultivationStageId;
  weight: number;
  text: string;
  choices: GameChoice[];
};

export type GameState = {
  isStarted: boolean;
  player: Player;
  currentEventId: string;
  day: number;
  seed: number;
  log: string[];
  selectedTalents: Talent[];
};
