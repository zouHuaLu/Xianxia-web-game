import { chance } from './rng';

export type LootItem = {
  id: string;
  name: string;
  dropRate: number;
};

export function rollLoot(table: LootItem[]) {
  return table.filter((item) => chance(item.dropRate));
}
