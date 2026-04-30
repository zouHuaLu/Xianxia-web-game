import { getEventById } from '../core/eventEngine';
import { useGameStore } from '../store/gameStore';
import { getCultivationStage } from '../core/world';

export function StoryPanel() {
  const { currentEventId, day, player } = useGameStore();
  const stage = getCultivationStage(player.realm ?? 'early');
  const event = getEventById(currentEventId);
  const hpPercent = (player.hp / player.maxHp) * 100;

  return (
    <section className="flex flex-1 flex-col rounded-lg border border-stone-800 bg-stone-900/80 p-6">
      <div className="border-b border-stone-800 pb-5">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-amber-300">
          第 {day} 日
        </p>
        <h1 className="mt-3 text-3xl font-semibold text-white sm:text-4xl">
          山谷初醒
        </h1>
        <p className="mt-3 text-sm text-stone-400">
          当前境界：{stage.name} · 当前事件：{currentEventId}
        </p>
      </div>

      <article className="flex-1 py-8">
        <p className="text-lg leading-9 text-stone-200">
          {event?.text ?? '四周寂静无声，暂时没有事件发生。'}
        </p>
        <p className="mt-5 leading-8 text-stone-300">
          你需要根据当前处境作出选择。每一次选择都会推动时间流逝，也可能改变气血、金钱与后续遭遇。
        </p>
        <p className="mt-5 text-sm leading-7 text-stone-400">
          修行路径：凡人 → 炼气 → 筑基 → 结丹 → 元婴 → 飞升。
        </p>
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
