import { ChoiceList } from './ChoiceList';
import { InventoryPanel } from './InventoryPanel';
import { PlayerPanel } from './PlayerPanel';
import { StoryPanel } from './StoryPanel';

export function GameLayout() {
  return (
    <main className="min-h-screen bg-stone-950 text-stone-100">
      <section className="mx-auto grid min-h-screen w-full max-w-7xl gap-5 px-5 py-6 lg:grid-cols-[280px_minmax(0,1fr)_320px]">
        <PlayerPanel />
        <div className="flex min-h-[calc(100vh-3rem)] flex-col gap-4">
          <StoryPanel />
          <ChoiceList />
        </div>
        <InventoryPanel />
      </section>
    </main>
  );
}
