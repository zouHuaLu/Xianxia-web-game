import { randomInt } from './rng';

export type Combatant = {
  name: string;
  hp: number;
  attack: number;
  defense: number;
};

export type BattleResult = {
  winner: 'player' | 'enemy';
  turns: number;
};

export function resolveBattle(player: Combatant, enemy: Combatant): BattleResult {
  let playerHp = player.hp;
  let enemyHp = enemy.hp;
  let turns = 0;

  while (playerHp > 0 && enemyHp > 0) {
    turns += 1;
    enemyHp -= Math.max(1, player.attack + randomInt(0, 3) - enemy.defense);

    if (enemyHp <= 0) {
      break;
    }

    playerHp -= Math.max(1, enemy.attack + randomInt(0, 3) - player.defense);
  }

  return {
    winner: playerHp > 0 ? 'player' : 'enemy',
    turns,
  };
}
