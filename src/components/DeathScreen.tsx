import { getCultivationStage } from '../core/world';
import { useGameStore } from '../store/gameStore';

export function DeathScreen() {
  const { deathRecord, returnToStart, startGame } = useGameStore();

  if (!deathRecord) {
    return null;
  }

  const stage = getCultivationStage(deathRecord.realm);
  const stats = deathRecord.finalStats;

  return (
    <main className="min-h-screen bg-neutral-950 px-5 py-8 text-stone-100">
      <section className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-5xl flex-col justify-center">
        <div className="border-y border-red-950/80 py-10">
          <p className="text-sm font-medium uppercase tracking-[0.28em] text-red-500">
            The Flame Has Faded
          </p>
          <h1 className="mt-5 text-5xl font-semibold tracking-normal text-red-200 sm:text-7xl">
            你已身死道消
          </h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-stone-300">
            {deathRecord.cause}
          </p>
        </div>

        <section className="mt-8 grid gap-4 md:grid-cols-4">
          <DeathStat label="存活" value={`第 ${deathRecord.day} 日`} />
          <DeathStat label="境界" value={stage.name} />
          <DeathStat label="武器" value={stats.weaponName} />
          <DeathStat label="遗金" value={`${stats.gold} 金`} />
        </section>

        <section className="mt-5 grid gap-4 md:grid-cols-[1fr_1.4fr]">
          <div className="rounded-lg border border-stone-800 bg-stone-900/80 p-5">
            <h2 className="text-base font-semibold text-stone-100">终局状态</h2>
            <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
              <DeathStatSmall label="气血上限" value={stats.maxHp.toString()} />
              <DeathStatSmall label="总攻击" value={stats.attack.toString()} />
              <DeathStatSmall label="身法" value={stats.agility.toString()} />
              <DeathStatSmall label="幸运" value={stats.luck.toString()} />
            </dl>
          </div>

          <div className="rounded-lg border border-stone-800 bg-stone-900/80 p-5">
            <h2 className="text-base font-semibold text-stone-100">临终回响</h2>
            <ol className="mt-4 space-y-3 text-sm leading-6 text-stone-400">
              {deathRecord.recentLog.map((entry, index) => (
                <li key={`${entry}-${index}`}>{entry}</li>
              ))}
            </ol>
          </div>
        </section>

        <div className="mt-8 flex flex-wrap gap-3">
          <button
            className="rounded-md bg-red-300 px-6 py-3 font-medium text-neutral-950 transition hover:bg-red-200"
            type="button"
            onClick={startGame}
          >
            再燃命火
          </button>
          <button
            className="rounded-md border border-stone-700 px-6 py-3 font-medium text-stone-200 transition hover:border-stone-500 hover:bg-stone-900"
            type="button"
            onClick={returnToStart}
          >
            重选天命
          </button>
        </div>
      </section>
    </main>
  );
}

type DeathStatProps = {
  label: string;
  value: string;
};

function DeathStat({ label, value }: DeathStatProps) {
  return (
    <div className="rounded-lg border border-stone-800 bg-stone-900/80 p-4">
      <dt className="text-sm text-stone-500">{label}</dt>
      <dd className="mt-2 text-xl font-semibold text-stone-100">{value}</dd>
    </div>
  );
}

function DeathStatSmall({ label, value }: DeathStatProps) {
  return (
    <div className="rounded-md border border-stone-800 bg-neutral-950/60 p-3">
      <dt className="text-stone-500">{label}</dt>
      <dd className="mt-1 font-semibold text-stone-100">{value}</dd>
    </div>
  );
}
