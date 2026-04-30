import { useGameStore } from '../store/gameStore';

export function StartScreen() {
  const { rollTalents, selectedTalents, startGame } = useGameStore();

  return (
    <main className="min-h-screen bg-stone-950 px-5 py-8 text-stone-100">
      <section className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-5xl flex-col justify-center">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-amber-300">
          Xianxia Web Game
        </p>
        <h1 className="mt-4 text-4xl font-semibold text-white sm:text-6xl">
          问道长生
        </h1>
        <p className="mt-5 max-w-2xl leading-8 text-stone-300">
          命数未定，道途将启。你将从凡人期开始，沿凡人、炼气、筑基、结丹、元婴一路修至飞升。
          开局会随机抽取三个天赋，它们会影响你的气血、攻击、敏捷、幸运与金钱。
        </p>

        <section className="mt-8 grid gap-4 md:grid-cols-3">
          {selectedTalents.map((talent) => (
            <article
              className="rounded-lg border border-stone-800 bg-stone-900/80 p-5"
              key={talent.id}
            >
              <h2 className="text-xl font-semibold text-white">{talent.name}</h2>
              <p className="mt-3 min-h-16 text-sm leading-6 text-stone-400">
                {talent.description}
              </p>
              <dl className="mt-4 grid grid-cols-2 gap-2 text-sm">
                {Object.entries(talent.modifiers).map(([key, value]) => (
                  <div className="rounded-md bg-stone-950/70 p-3" key={key}>
                    <dt className="text-stone-500">{modifierLabels[key] ?? key}</dt>
                    <dd className="mt-1 font-semibold text-amber-200">
                      {value > 0 ? `+${value}` : value}
                    </dd>
                  </div>
                ))}
              </dl>
            </article>
          ))}
        </section>

        <div className="mt-8 flex flex-wrap gap-3">
          <button
            className="rounded-md bg-amber-300 px-6 py-3 font-medium text-stone-950 transition hover:bg-amber-200"
            type="button"
            onClick={startGame}
          >
            开始
          </button>
          <button
            className="rounded-md border border-stone-700 px-6 py-3 font-medium text-stone-200 transition hover:border-stone-500 hover:bg-stone-900"
            type="button"
            onClick={rollTalents}
          >
            重新抽取
          </button>
        </div>
      </section>
    </main>
  );
}

const modifierLabels: Record<string, string> = {
  maxHp: '气血',
  attack: '攻击',
  agility: '敏捷',
  luck: '幸运',
  gold: '金钱',
};
