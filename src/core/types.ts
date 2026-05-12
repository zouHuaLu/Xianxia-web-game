/** 非装备类背包物品，用于丹药、材料、任务道具等。 */
export type Item = {
  id: string;
  name: string;
  type:
    /** 可消耗物品，例如丹药、符箓。 */
    | 'consumable'
    /** 材料物品，例如妖兽材料、矿石。 */
    | 'material'
    /** 任务物品，通常不直接消耗。 */
    | 'quest';
  description?: string;
};

/** 可装备武器，可由掉落随机生成，也可由内容数据直接发放。 */
export type Weapon = {
  name: string;
  rarity:
    /** 普通品质，数值较低，可能没有词条。 */
    | 'common'
    /** 稀有品质，数值较高，通常带 1 条词条。 */
    | 'rare'
    /** 史诗品质，数值最高，通常带多条词条。 */
    | 'epic';
  /** 固定攻击加成，会叠加到玩家基础攻击上。 */
  attack: number;
  /** 当前仅作为文本展示的词条，后续可接入真实战斗效果。 */
  affixes: string[];
};

/** 修行境界标识，用于筛选事件和展示流程进度。 */
export type CultivationStageId =
  /** 凡人期，MVP 起始阶段。 */
  | 'early'
  /** 炼气期，MVP 的第一个进阶目标。 */
  | 'qi'
  /** 筑基期，后续扩展阶段。 */
  | 'foundation'
  /** 结丹期，后续扩展阶段。 */
  | 'core'
  /** 元婴期，后续扩展阶段。 */
  | 'soul'
  /** 飞升结局阶段。 */
  | 'ascension';

/** 境界展示信息。 */
export type CultivationStage = {
  id: CultivationStageId;
  name: string;
  description: string;
  /** 是否为终局境界，例如飞升或通关。 */
  isEnding?: boolean;
};

/** 当前周目的玩家属性和持有物。 */
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

/** 天赋对开局属性的修正。 */
export type TalentModifier = Partial<
  Pick<Player, 'maxHp' | 'attack' | 'agility' | 'luck' | 'gold'>
>;

/** 开局天赋，显示在开始页，并在开局时应用到玩家身上。 */
export type Talent = {
  id: string;
  name: string;
  description: string;
  modifiers: TalentModifier;
};

/** 战斗或搜刮结算后产生的具体奖励。 */
export type Reward =
  | {
      /** 金钱奖励。 */
      type: 'gold';
      amount: number;
    }
  | {
      /** 武器奖励。 */
      type: 'weapon';
      weapon: Weapon;
    };

/** 敌人数据，由 enemies.json 读取并交给战斗系统使用。 */
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

/** 自动战斗结算返回的摘要。 */
export type BattleResult = {
  win: boolean;
  /** 本场战斗中玩家损失的总气血。 */
  hpLost: number;
  rewards: Reward[];
};

/** 事件引擎当前支持结算的选项结果。 */
export type EventResult =
  | {
      /** 进入战斗。 */
      type: 'battle';
      /** enemies.json 中的敌人 id。 */
      enemy: string;
    }
  | {
      /** 尝试逃跑，按身法和幸运判定是否成功。 */
      type: 'escape';
    }
  | {
      /** 恢复气血。 */
      type: 'rest';
      hp: number;
    }
  | {
      /** 直接获得固定数量金钱。 */
      type: 'gold';
      amount: number;
    }
  | {
      /** 遭遇陷阱或事故，损失气血。 */
      type: 'damage';
      hp: number;
    }
  | {
      /** 修炼或机缘带来的属性成长。 */
      type: 'stat';
      stat:
        /** 提升气血上限，并同步恢复同等气血。 */
        | 'maxHp'
        /** 提升基础攻击。 */
        | 'attack'
        /** 提升身法。 */
        | 'agility'
        /** 提升幸运。 */
        | 'luck';
      amount: number;
    }
  | {
      /** 搜刮奖励，可随机获得金钱和武器。 */
      type: 'loot';
      /** 随机金钱范围，包含最小值和最大值。 */
      gold?: [number, number];
      /** 生成随机武器的概率，取值 0 到 1。 */
      weaponChance?: number;
    };

/** 事件中的玩家可选项。 */
export type GameChoice = {
  text: string;
  result: EventResult;
};

/** 由境界和权重随机抽取的内容事件。 */
export type GameEvent = {
  id: string;
  stage: CultivationStageId;
  /** 权重越高，在同境界事件池中越容易被抽中。 */
  weight: number;
  text: string;
  choices: GameChoice[];
};

/** 当前局死亡后保留的结算摘要，用于死亡页反馈。 */
export type DeathRecord = {
  day: number;
  realm: CultivationStageId;
  cause: string;
  finalStats: {
    maxHp: number;
    attack: number;
    agility: number;
    luck: number;
    gold: number;
    weaponName: string;
  };
  recentLog: string[];
};

/** 当前周目的顶层状态，会被持久化到本地存档。 */
export type GameState = {
  isStarted: boolean;
  player: Player;
  /** 当前剧情面板显示的事件 id。 */
  currentEventId: string;
  day: number;
  /** 当前用于标识周目和调试；随机系统尚未完全按 seed 确定。 */
  seed: number;
  /** 日志按最新在前保存，并由 store 控制最大数量。 */
  log: string[];
  selectedTalents: Talent[];
  deathRecord?: DeathRecord;
};
