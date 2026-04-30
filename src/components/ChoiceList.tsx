import { getEventById } from '../core/eventEngine';
import { useGameStore } from '../store/gameStore';

export function ChoiceList() {
  const { choose, currentEventId, reset } = useGameStore();
  const event = getEventById(currentEventId);

  return (
    <section className="rounded-lg border border-stone-800 bg-stone-900/80 p-4">
      <h2 className="mb-3 text-sm font-medium text-stone-400">选项</h2>
      <div className="grid gap-3 sm:grid-cols-3">
        {event?.choices.map((choice) => (
          <button
            className="rounded-md bg-amber-300 px-5 py-3 font-medium text-stone-950 transition hover:bg-amber-200"
            key={choice.text}
            type="button"
            onClick={() => choose(choice)}
          >
            {choice.text}
          </button>
        ))}
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
