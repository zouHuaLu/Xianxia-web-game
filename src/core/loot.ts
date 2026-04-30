import { chance } from './rng';
import { randomInt } from './rng';
import type { Item, Reward, Weapon } from './types';

export type LootItem = Item & {
  dropRate: number;
};

export function rollLoot(table: LootItem[]) {
  return table.filter((item) => chance(item.dropRate));
}

type EquipmentTemplate = {
  common: string;
  rare: string;
  epic: string;
  attackRange: [number, number];
};

const equipmentTemplates: EquipmentTemplate[] = [
  {
    common: '破旧铁剑',
    rare: '青锋剑',
    epic: '玄霜剑',
    attackRange: [5, 20],
  },
  {
    common: '缺口短刀',
    rare: '血纹刀',
    epic: '饮血魔刀',
    attackRange: [6, 22],
  },
  {
    common: '旧木杖',
    rare: '聚灵杖',
    epic: '星河法杖',
    attackRange: [4, 18],
  },
  {
    common: '粗布披风',
    rare: '血色披风',
    epic: '流火披风',
    attackRange: [0, 4],
  },
];

const affixPool = [
  '暴击 +5%',
  '吸血',
  '破甲',
  '闪避 +20%',
  '先攻 +2',
  '灵力 +10%',
  '气血 +8',
  '幸运 +2',
];

function rollRarity(): Weapon['rarity'] {
  const roll = Math.random();

  if (roll < 0.08) {
    return 'epic';
  }

  if (roll < 0.32) {
    return 'rare';
  }

  return 'common';
}

function getAttackByRarity(template: EquipmentTemplate, rarity: Weapon['rarity']) {
  const [min, max] = template.attackRange;

  switch (rarity) {
    case 'common':
      return randomInt(min, Math.max(min, Math.floor((min + max) / 2)));
    case 'rare':
      return randomInt(Math.ceil((min + max) / 2), max);
    case 'epic':
      return randomInt(max, max + 6);
  }
}

function getAffixCount(rarity: Weapon['rarity']) {
  switch (rarity) {
    case 'common':
      return Math.random() < 0.25 ? 1 : 0;
    case 'rare':
      return 1;
    case 'epic':
      return 2;
  }
}

function pickAffixes(count: number) {
  return [...affixPool]
    .sort(() => Math.random() - 0.5)
    .slice(0, count);
}

export function generateRandomWeapon(): Weapon {
  const template = equipmentTemplates[randomInt(0, equipmentTemplates.length - 1)];
  const rarity = rollRarity();

  return {
    name: template[rarity],
    rarity,
    attack: getAttackByRarity(template, rarity),
    affixes: pickAffixes(getAffixCount(rarity)),
  };
}

export function rollRandomRewards(options: { gold?: [number, number]; weaponChance?: number }) {
  const rewards: Reward[] = [];

  if (options.gold) {
    const [min, max] = options.gold;
    rewards.push({
      type: 'gold',
      amount: randomInt(min, max),
    });
  }

  if (options.weaponChance && chance(options.weaponChance)) {
    rewards.push({
      type: 'weapon',
      weapon: generateRandomWeapon(),
    });
  }

  return rewards;
}
