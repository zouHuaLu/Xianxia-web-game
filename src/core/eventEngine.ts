import enemiesData from '../data/enemies.json';
import eventsData from '../data/events.json';
import { resolveBattle } from './battle';
import { rollRandomRewards } from './loot';
import type { Enemy, GameChoice, GameEvent, GameState, Player, Reward } from './types';

const events = eventsData as GameEvent[];
const enemies = enemiesData as Enemy[];

export function getAvailableEvents(player: Player) {
  return events.filter((event) => event.stage === player.realm);
}

export function pickWeightedEvent(availableEvents: GameEvent[]) {
  const totalWeight = availableEvents.reduce((total, event) => total + event.weight, 0);

  if (availableEvents.length === 0 || totalWeight <= 0) {
    return undefined;
  }

  let roll = Math.random() * totalWeight;

  for (const event of availableEvents) {
    roll -= event.weight;

    if (roll <= 0) {
      return event;
    }
  }

  return availableEvents[availableEvents.length - 1];
}

export function getEventById(eventId: string) {
  return events.find((event) => event.id === eventId);
}

function applyRewards(player: Player, rewards: Reward[]) {
  return rewards.reduce<Player>((nextPlayer, reward) => {
    switch (reward.type) {
      case 'gold':
        return {
          ...nextPlayer,
          gold: nextPlayer.gold + reward.amount,
        };
      case 'weapon':
        return {
          ...nextPlayer,
          inventory: [...nextPlayer.inventory, reward.weapon],
        };
    }
  }, player);
}

function formatRewards(rewards: Reward[]) {
  return rewards
    .map((reward) => {
      switch (reward.type) {
        case 'gold':
          return `${reward.amount} 金`;
        case 'weapon':
          return reward.weapon.name;
      }
    })
    .join('、');
}

export function resolveChoice(choice: GameChoice, gameState: GameState): GameState {
  const logs: string[] = [];
  const result = choice.result;
  let player = { ...gameState.player };

  switch (result.type) {
    case 'battle': {
      const enemy = enemies.find((item) => item.id === result.enemy);

      if (!enemy) {
        logs.push('敌人数据缺失，事件被命运轻轻跳过。');
        break;
      }

      const battleResult = resolveBattle(player, enemy);
      player = applyRewards(
        {
          ...player,
          hp: Math.max(0, player.hp - battleResult.hpLost),
        },
        battleResult.rewards,
      );

      if (battleResult.win) {
        const rewardText = formatRewards(battleResult.rewards);
        logs.push(
          rewardText
            ? `你击败了${enemy.name}，损失 ${battleResult.hpLost} 气血，获得 ${rewardText}。`
            : `你击败了${enemy.name}，损失 ${battleResult.hpLost} 气血。`,
        );
      } else {
        logs.push(`${enemy.name}击倒了你，你损失 ${battleResult.hpLost} 气血。`);
      }
      break;
    }
    case 'escape': {
      const escaped = Math.random() * 10 < player.agility + player.luck * 0.4;
      player = {
        ...player,
        hp: escaped ? player.hp : Math.max(1, player.hp - 4),
      };
      logs.push(escaped ? '你抓住空隙脱身。' : '你逃得慢了一步，背后挨了一击。');
      break;
    }
    case 'rest':
      player = {
        ...player,
        hp: Math.min(player.maxHp, player.hp + result.hp),
      };
      logs.push('你暂避风头，调息恢复。');
      break;
    case 'gold':
      player = {
        ...player,
        gold: player.gold + result.amount,
      };
      logs.push(`你获得 ${result.amount} 金。`);
      break;
    case 'loot': {
      const rewards = rollRandomRewards(result);
      player = applyRewards(player, rewards);
      const rewardText = formatRewards(rewards);
      logs.push(rewardText ? `你获得 ${rewardText}。` : '你仔细搜寻了一番，却没有找到可用之物。');
      break;
    }
  }

  const nextEvent = pickWeightedEvent(getAvailableEvents(player));

  return {
    ...gameState,
    player,
    currentEventId: nextEvent?.id ?? gameState.currentEventId,
    day: gameState.day + 1,
    log: [...logs, ...gameState.log].slice(0, 20),
  };
}
