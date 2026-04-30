import { useGameStore } from '../store/gameStore';

const realms = ['炼气', '筑基', '结丹', '元婴', '化神'];

export function ChoiceList() {
  const { realmIndex, cultivation, cultivate, breakthrough, reset } = useGameStore();
  const nextRealm = realms[realmIndex + 1];
  const canBreakthrough = cultivation >= 100 && Boolean(nextRealm);

  return (
    <section className="rounded-lg border border-stone-800 bg-stone-900/80 p-4">
      <h2 className="mb-3 text-sm font-medium text-stone-400">选项</h2>
      <div className="grid gap-3 sm:grid-cols-3">
      <button
        className="rounded-md bg-amber-300 px-5 py-3 font-medium text-stone-950 transition hover:bg-amber-200"
        type="button"
        onClick={cultivate}
      >
        打坐修炼
      </button>
      <button
        className="rounded-md bg-emerald-400 px-5 py-3 font-medium text-stone-950 transition enabled:hover:bg-emerald-300 disabled:cursor-not-allowed disabled:bg-stone-700 disabled:text-stone-400"
        type="button"
        disabled={!canBreakthrough}
        onClick={breakthrough}
      >
        突破{nextRealm ? `至${nextRealm}` : ''}
      </button>
      <button
        className="rounded-md border border-stone-700 px-5 py-3 font-medium text-stone-200 transition hover:border-stone-500 hover:bg-stone-900"
        type="button"
        onClick={reset}
      >
        重置存档
      </button>
      </div>
    </section>
  );
}
