import { useGameStore } from '../store/gameStore';

const realms = ['炼气', '筑基', '结丹', '元婴', '化神'];

export function StoryPanel() {
  const { name, realmIndex, cultivation } = useGameStore();
  const currentRealm = realms[realmIndex] ?? realms[realms.length - 1];

  return (
    <section className="flex flex-1 flex-col rounded-lg border border-stone-800 bg-stone-900/80 p-6">
      <div className="border-b border-stone-800 pb-5">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-amber-300">
          Xianxia Web Game
        </p>
        <h1 className="mt-3 text-3xl font-semibold text-white sm:text-4xl">
          {name}
        </h1>
        <p className="mt-3 text-sm text-stone-400">
          当前境界：{currentRealm}，修为：{cultivation}/100
        </p>
      </div>

      <article className="flex-1 py-8">
        <p className="text-lg leading-9 text-stone-200">
          你在无名山谷中醒来，丹田中仅存一缕灵气。远处云海翻涌，似有机缘，也似有杀机。
        </p>
        <p className="mt-5 leading-8 text-stone-300">
          石壁上残留着剑痕，草叶间还有未散尽的妖气。你需要决定下一步，是静心打坐稳住灵息，
          还是冒险向山谷深处探去。
        </p>
      </article>

      <div className="h-3 overflow-hidden rounded-full bg-stone-800">
        <div
          className="h-full bg-amber-300 transition-all duration-300"
          style={{ width: `${Math.min(cultivation, 100)}%` }}
        />
      </div>
    </section>
  );
}
