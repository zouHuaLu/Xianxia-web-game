import { randomInt } from './rng';
import { rollRandomRewards } from './loot';
import type { BattleResult, Enemy, Player } from './types';

function getPlayerAttack(player: Player) {
  return player.attack + (player.weapon?.attack ?? 0);
}

export function resolveBattle(player: Player, enemy: Enemy): BattleResult {
  let playerHp = player.hp;
  let enemyHp = enemy.hp;
  const startingHp = player.hp;

  while (playerHp > 0 && enemyHp > 0) {
    enemyHp -= Math.max(1, getPlayerAttack(player) + randomInt(0, 2));

    if (enemyHp <= 0) {
      break;
    }

    playerHp -= Math.max(1, enemy.attack + randomInt(0, 2));
  }

  const win = playerHp > 0;

  return {
    win,
    hpLost: Math.min(startingHp, startingHp - Math.max(0, playerHp)),
    rewards: win ? rollRandomRewards(enemy.reward) : [],
  };
}
