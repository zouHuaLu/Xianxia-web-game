export function InventoryPanel() {
  return (
    <aside className="flex gap-4 lg:min-h-[calc(100vh-3rem)] lg:flex-col">
      <section className="flex-1 rounded-lg border border-stone-800 bg-stone-900/80 p-5">
        <h2 className="text-lg font-semibold text-white">背包</h2>
        <div className="mt-5 rounded-md border border-dashed border-stone-700 p-4 text-sm leading-6 text-stone-400">
          暂无物品。后续掉落、武器和丹药会从 loot 与 battle 模块接入这里。
        </div>
      </section>

      <section className="flex-1 rounded-lg border border-stone-800 bg-stone-900/80 p-5">
        <h2 className="text-lg font-semibold text-white">日志</h2>
        <ol className="mt-5 space-y-3 text-sm leading-6 text-stone-400">
          <li>你在无名山谷中醒来。</li>
          <li>丹田内尚有一缕灵气可供运转。</li>
        </ol>
      </section>
    </aside>
  );
}
