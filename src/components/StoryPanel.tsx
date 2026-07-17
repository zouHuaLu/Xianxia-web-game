import { getEventById } from '../core/eventEngine';
import { useGameStore } from '../store/gameStore';
import { getCultivationStage } from '../core/world';

export function StoryPanel() {
  const { currentEventId, currentStoryNodeId, day, player, story } = useGameStore();
  const stage = getCultivationStage(player.realm ?? 'early');
  const event = getEventById(currentEventId);
  const storyNode = story?.nodes.find((node) => node.id === currentStoryNodeId);
  const hpPercent = (player.hp / player.maxHp) * 100;

  return (
    <section className="flex min-h-0 flex-1 flex-col overflow-y-auto rounded-lg border border-stone-800 bg-stone-900/80 p-4 sm:p-6">
      <div className="border-b border-stone-800 pb-5">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-amber-300">
          第 {day} 日
        </p>
        <h1 className="mt-3 text-3xl font-semibold text-white sm:text-4xl">
          {storyNode?.title ?? (story ? '故事尾声' : '山谷初醒')}
        </h1>
        <p className="mt-3 text-sm text-stone-400">当前境界：{stage.name}</p>
      </div>

      <article className="flex-1 py-8">
        <p className="text-lg leading-9 text-stone-200">
          {storyNode?.text ?? (story ? '这段故事已走到尽头。' : event?.text ?? '四周寂静无声，暂时没有事件发生。')}
        </p>
        {storyNode?.choices.length ? (
          <p className="mt-5 leading-8 text-stone-300">命运在此分岔，选择将决定下一段经历。</p>
        ) : null}
      </article>

      <div className="h-3 overflow-hidden rounded-full bg-stone-800">
        <div
          className="h-full bg-rose-400 transition-all duration-300"
          style={{ width: `${hpPercent}%` }}
        />
      </div>
    </section>
  );
}
