import type { CultivationStage, CultivationStageId } from './types';

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
