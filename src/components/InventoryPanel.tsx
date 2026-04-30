import { useGameStore } from '../store/gameStore';

export function InventoryPanel() {
  const {
    discardInventoryItem,
    log,
    player,
    useInventoryItem: equipInventoryItem,
  } = useGameStore();

  return (
    <aside className="flex gap-4 lg:min-h-[calc(100vh-3rem)] lg:flex-col">
      <section className="flex-1 rounded-lg border border-stone-800 bg-stone-900/80 p-5">
        <h2 className="text-lg font-semibold text-white">背包</h2>
        {player.inventory.length > 0 ? (
          <ul className="mt-5 space-y-3 text-sm text-stone-300">
            {player.inventory.map((item, index) => (
              <li
                key={`${item.name}-${index}`}
                className="group rounded-md border border-stone-800 p-3 transition hover:border-stone-600 hover:bg-stone-950/50"
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="font-medium text-stone-100">{item.name}</span>
                  {'rarity' in item ? (
                    <span className="text-xs uppercase text-amber-300">{item.rarity}</span>
                  ) : null}
                </div>
                {'attack' in item ? (
                  <p className="mt-2 text-stone-400">攻击 +{item.attack}</p>
                ) : null}
                {'affixes' in item && item.affixes.length > 0 ? (
                  <p className="mt-2 text-stone-400">词条：{item.affixes.join('、')}</p>
                ) : null}
                <div className="mt-3 flex gap-2 opacity-0 transition group-hover:opacity-100">
                  {'attack' in item ? (
                    <button
                      className="rounded-md bg-amber-300 px-3 py-1.5 text-xs font-medium text-stone-950 transition hover:bg-amber-200"
                      type="button"
                      onClick={() => equipInventoryItem(index)}
                    >
                      使用
                    </button>
                  ) : null}
                  <button
                    className="rounded-md border border-stone-700 px-3 py-1.5 text-xs font-medium text-stone-300 transition hover:border-rose-400 hover:text-rose-200"
                    type="button"
                    onClick={() => discardInventoryItem(index)}
                  >
                    丢弃
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="mt-5 rounded-md border border-dashed border-stone-700 p-4 text-sm leading-6 text-stone-400">
            暂无物品。后续掉落、武器和丹药会从 loot 与 battle 模块接入这里。
          </div>
        )}
      </section>

      <section className="flex-1 rounded-lg border border-stone-800 bg-stone-900/80 p-5">
        <h2 className="text-lg font-semibold text-white">日志</h2>
        <ol className="mt-5 space-y-3 text-sm leading-6 text-stone-400">
          {log.map((entry, index) => (
            <li key={`${entry}-${index}`}>{entry}</li>
          ))}
        </ol>
      </section>
    </aside>
  );
}
