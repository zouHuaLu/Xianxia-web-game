import { useGameStore } from '../store/gameStore';
import { cultivationStages, getCultivationStage } from '../core/world';

export function PlayerPanel() {
  const { player, selectedTalents, unequipWeapon } = useGameStore();
  const stage = getCultivationStage(player.realm ?? 'early');
  const currentStageIndex = cultivationStages.findIndex(({ id }) => id === player.realm);
  const totalAttack = player.attack + (player.weapon?.attack ?? 0);

  return (
    <aside className="rounded-lg border border-stone-800 bg-stone-900/80 p-4 sm:p-5 xl:min-h-[calc(100vh-3rem)]">
      <div className="flex items-baseline justify-between gap-3">
        <h2 className="text-lg font-semibold text-white">角色</h2>
        <p className="min-w-0 truncate text-sm text-amber-200">{player.name ?? '无名修士'}</p>
      </div>
      <dl className="mt-5 grid grid-cols-2 gap-3">
        <Stat label="境界" value={stage.name} />
        <Stat label="气血" value={`${player.hp}/${player.maxHp}`} />
        <Stat label="攻击" value={totalAttack.toString()} />
        <Stat label="身法" value={player.agility.toString()} />
        <Stat label="幸运" value={player.luck.toString()} />
        <Stat label="金钱" value={player.gold.toString()} />
        <div className="group col-span-2">
          <dt className="text-sm text-stone-400">武器</dt>
          <dd className="mt-1 flex items-start justify-between gap-2">
            <span className="min-w-0 text-lg font-semibold text-white">
              {player.weapon?.name ?? '赤手空拳'}
            </span>
            {player.weapon ? (
              <button
                className="rounded-md border border-stone-700 px-3 py-1.5 text-xs font-medium text-stone-300 xl:opacity-0 xl:transition hover:border-amber-300 hover:text-amber-200 xl:group-hover:opacity-100"
                type="button"
                onClick={unequipWeapon}
              >
                卸下
              </button>
            ) : null}
          </dd>
          {player.weapon ? (
            <p className="mt-2 text-xs leading-5 text-stone-500">
              攻击 +{player.weapon.attack}
              {player.weapon.affixes.length > 0 ? ` · ${player.weapon.affixes.join('、')}` : ''}
            </p>
          ) : null}
        </div>
      </dl>
      <div className="mt-6 rounded-md bg-stone-950/70 p-4">
        <h3 className="text-sm font-medium text-stone-300">修行之路</h3>
        <ol className="mt-4 grid grid-cols-3 gap-x-2 gap-y-3 text-center text-xs">
          {cultivationStages.map((item, index) => {
            const isCurrent = item.id === player.realm;
            const isReached = index <= currentStageIndex;

            return (
              <li className="flex min-w-0 flex-col items-center gap-1.5" key={item.id}>
                <span
                  aria-hidden="true"
                  className={`flex h-6 w-6 items-center justify-center rounded-full border text-xs font-semibold ${
                    isCurrent
                      ? 'border-amber-300 bg-amber-300 text-stone-950'
                      : isReached
                        ? 'border-amber-300/60 text-amber-200'
                        : 'border-stone-700 text-stone-600'
                  }`}
                >
                  {index + 1}
                </span>
                <span className={isCurrent ? 'font-medium text-amber-200' : 'text-stone-500'}>
                  {item.name}
                </span>
              </li>
            );
          })}
        </ol>
      </div>
      <div className="mt-6 rounded-md bg-stone-950/70 p-4">
        <h3 className="text-sm font-medium text-stone-300">天赋</h3>
        <ul className="mt-3 space-y-2 text-sm text-stone-400">
          {selectedTalents.map((talent) => (
            <li key={talent.id}>{talent.name}</li>
          ))}
        </ul>
      </div>
    </aside>
  );
}

type StatProps = {
  label: string;
  value: string;
};

function Stat({ label, value }: StatProps) {
  return (
    <div className="rounded-md border border-stone-800 bg-stone-950/40 p-3">
      <dt className="text-sm text-stone-400">{label}</dt>
      <dd className="mt-1 text-lg font-semibold text-white">{value}</dd>
    </div>
  );
}
