import type { CultivationStage, CultivationStageId, Player, Weapon } from './types';

export const cultivationStages: CultivationStage[] = [
  {
    id: 'early',
    name: '凡人期',
    description: '未入仙途，以凡躯求一线机缘。',
  },
  {
    id: 'qi',
    name: '炼气期',
    description: '引灵入体，初窥修行门径。',
  },
  {
    id: 'foundation',
    name: '筑基期',
    description: '铸就道基，寿元与体魄皆有蜕变。',
  },
  {
    id: 'core',
    name: '结丹期',
    description: '凝结金丹，自此可称一方高修。',
  },
  {
    id: 'soul',
    name: '元婴期',
    description: '元婴成形，神魂离体而不灭。',
  },
  {
    id: 'ascension',
    name: '飞升',
    description: '破界而去，游戏通关。',
    isEnding: true,
  },
];

export const startingStageId: CultivationStageId = 'early';

export function getCultivationStage(stageId: CultivationStageId) {
  return cultivationStages.find((stage) => stage.id === stageId) ?? cultivationStages[0];
}

const cultivationStageOrder: CultivationStageId[] = [
  'early',
  'qi',
  'foundation',
  'core',
  'soul',
  'ascension',
];

type BreakthroughBonus = {
  maxHp: number;
  attack: number;
  agility: number;
  luck: number;
};

type BreakthroughRequirement = {
  from: CultivationStageId;
  to: CultivationStageId;
  minDay: number;
  minGold: number;
  minTotalAttack: number;
  minHpRatio: number;
  minMaxHp?: number;
  minAgility?: number;
  minWeaponRarity?: Weapon['rarity'];
  costGold: number;
  bonus: BreakthroughBonus;
};

const weaponRarityRank: Record<Weapon['rarity'], number> = {
  common: 1,
  rare: 2,
  epic: 3,
};

const breakthroughRequirements: BreakthroughRequirement[] = [
  {
    from: 'early',
    to: 'qi',
    minDay: 10,
    minGold: 20,
    minTotalAttack: 16,
    minHpRatio: 0.8,
    costGold: 20,
    bonus: {
      maxHp: 25,
      attack: 4,
      agility: 2,
      luck: 1,
    },
  },
  {
    from: 'qi',
    to: 'foundation',
    minDay: 30,
    minGold: 80,
    minTotalAttack: 32,
    minHpRatio: 0.85,
    minMaxHp: 120,
    minAgility: 12,
    minWeaponRarity: 'rare',
    costGold: 80,
    bonus: {
      maxHp: 45,
      attack: 8,
      agility: 4,
      luck: 2,
    },
  },
  {
    from: 'foundation',
    to: 'core',
    minDay: 60,
    minGold: 180,
    minTotalAttack: 50,
    minHpRatio: 0.9,
    minMaxHp: 165,
    minAgility: 16,
    minWeaponRarity: 'rare',
    costGold: 180,
    bonus: {
      maxHp: 70,
      attack: 14,
      agility: 6,
      luck: 3,
    },
  },
  {
    from: 'core',
    to: 'soul',
    minDay: 100,
    minGold: 400,
    minTotalAttack: 64,
    minHpRatio: 0.9,
    minMaxHp: 235,
    minAgility: 22,
    minWeaponRarity: 'epic',
    costGold: 400,
    bonus: {
      maxHp: 100,
      attack: 24,
      agility: 8,
      luck: 4,
    },
  },
  {
    from: 'soul',
    to: 'ascension',
    minDay: 150,
    minGold: 900,
    minTotalAttack: 88,
    minHpRatio: 0.95,
    minMaxHp: 340,
    minAgility: 30,
    minWeaponRarity: 'epic',
    costGold: 900,
    bonus: {
      maxHp: 0,
      attack: 0,
      agility: 0,
      luck: 0,
    },
  },
];

function getTotalAttack(player: Player) {
  return player.attack + (player.weapon?.attack ?? 0);
}

function hasRequiredWeapon(player: Player, rarity: Weapon['rarity']) {
  if (!player.weapon) {
    return false;
  }

  return weaponRarityRank[player.weapon.rarity] >= weaponRarityRank[rarity];
}

export function getNextCultivationStageId(stageId: CultivationStageId) {
  const currentIndex = cultivationStageOrder.indexOf(stageId);

  if (currentIndex < 0 || currentIndex >= cultivationStageOrder.length - 1) {
    return undefined;
  }

  return cultivationStageOrder[currentIndex + 1];
}

export function getBreakthroughRequirement(stageId: CultivationStageId) {
  return breakthroughRequirements.find((requirement) => requirement.from === stageId);
}

export function canBreakthrough(player: Player, day: number) {
  const requirement = getBreakthroughRequirement(player.realm);

  if (!requirement) {
    return false;
  }

  const hpRatio = player.hp / player.maxHp;

  return (
    day >= requirement.minDay &&
    player.gold >= requirement.minGold &&
    getTotalAttack(player) >= requirement.minTotalAttack &&
    hpRatio >= requirement.minHpRatio &&
    (!requirement.minMaxHp || player.maxHp >= requirement.minMaxHp) &&
    (!requirement.minAgility || player.agility >= requirement.minAgility) &&
    (!requirement.minWeaponRarity || hasRequiredWeapon(player, requirement.minWeaponRarity))
  );
}

export function resolveBreakthrough(player: Player, day: number) {
  const requirement = getBreakthroughRequirement(player.realm);

  if (!requirement || !canBreakthrough(player, day)) {
    return {
      player,
      logs: [],
    };
  }

  const nextStage = getCultivationStage(requirement.to);
  const maxHp = player.maxHp + requirement.bonus.maxHp;

  return {
    player: {
      ...player,
      realm: requirement.to,
      gold: Math.max(0, player.gold - requirement.costGold),
      maxHp,
      hp: maxHp,
      attack: player.attack + requirement.bonus.attack,
      agility: player.agility + requirement.bonus.agility,
      luck: player.luck + requirement.bonus.luck,
    },
    logs: [
      requirement.to === 'ascension'
        ? '你灵台澄明，破界飞升，此世修行圆满。'
        : `你消耗 ${requirement.costGold} 金整备突破，成功踏入${nextStage.name}。`,
    ],
  };
}
