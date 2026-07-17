import { ChoiceList } from './ChoiceList';
import { InventoryPanel } from './InventoryPanel';
import { PlayerPanel } from './PlayerPanel';
import { StoryPanel } from './StoryPanel';

export function GameLayout() {
  return (
    <main className="min-h-screen bg-stone-950 text-stone-100">
      <section className="mx-auto grid w-full max-w-7xl gap-4 px-4 py-4 sm:gap-5 sm:px-5 sm:py-6 md:grid-cols-[minmax(240px,280px)_minmax(0,1fr)] xl:min-h-screen xl:grid-cols-[280px_minmax(0,1fr)_320px]">
        <PlayerPanel />
        <div className="flex min-w-0 flex-col gap-4 md:sticky md:top-6 md:h-[calc(100vh-3rem)]">
          <StoryPanel />
          <ChoiceList />
        </div>
        <InventoryPanel />
      </section>
    </main>
  );
}
