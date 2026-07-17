import { getEventById } from '../core/eventEngine';
import { useGameStore } from '../store/gameStore';

export function ChoiceList() {
  const { choose, chooseStoryChoice, currentEventId, currentStoryNodeId, reset, story } = useGameStore();
  const event = getEventById(currentEventId);
  const storyNode = story?.nodes.find((node) => node.id === currentStoryNodeId);

  if (story && !storyNode) {
    return <section className="shrink-0 border-t border-stone-800 pt-4 text-sm text-stone-500">故事已经结束。</section>;
  }

  if (storyNode) {
    if (storyNode.choices.length === 0) {
      return (
        <section className="shrink-0 border-t border-stone-800 pt-4 text-sm text-stone-500">
          本段故事暂告一段落。
        </section>
      );
    }

    return (
      <section className="shrink-0 rounded-lg border border-stone-800 bg-stone-900/95 p-4 shadow-lg shadow-stone-950/30 sm:p-5">
        <h2 className="mb-3 text-sm font-medium text-stone-400">你的选择</h2>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {storyNode.choices.map((choice) => (
            <button
              className="rounded-md bg-amber-300 px-5 py-3 font-medium text-stone-950 transition hover:bg-amber-200"
              key={choice.id}
              type="button"
              onClick={() => chooseStoryChoice(choice)}
            >
              {choice.text}
            </button>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="shrink-0 rounded-lg border border-stone-800 bg-stone-900/95 p-4 shadow-lg shadow-stone-950/30 sm:p-5">
      <h2 className="mb-3 text-sm font-medium text-stone-400">选项</h2>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
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
