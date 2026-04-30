import { useGameStore } from '../store/gameStore';
import { getCultivationStage } from '../core/world';

export function PlayerPanel() {
  const { day, player, seed, selectedTalents, unequipWeapon } = useGameStore();
  const stage = getCultivationStage(player.realm ?? 'early');
  const weaponAttack = player.weapon?.attack ?? 0;
  const totalAttack = player.attack + weaponAttack;

  return (
    <aside className="rounded-lg border border-stone-800 bg-stone-900/80 p-5 lg:min-h-[calc(100vh-3rem)]">
      <h2 className="text-lg font-semibold text-white">角色</h2>
      <dl className="mt-5 space-y-4">
        <Stat label="境界" value={stage.name} />
        <Stat label="气血" value={`${player.hp}/${player.maxHp}`} />
        <div className="group">
          <dt className="text-sm text-stone-400">武器</dt>
          <dd className="mt-1 flex items-center justify-between gap-3">
            <span className="text-xl font-semibold text-white">
              {player.weapon?.name ?? '赤手空拳'}
            </span>
            {player.weapon ? (
              <button
                className="rounded-md border border-stone-700 px-3 py-1.5 text-xs font-medium text-stone-300 opacity-0 transition hover:border-amber-300 hover:text-amber-200 group-hover:opacity-100"
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
        <Stat label="金钱" value={player.gold.toString()} />
      </dl>
      <div className="mt-6 rounded-md bg-stone-950/70 p-4">
        <h3 className="text-sm font-medium text-stone-300">属性</h3>
        <dl className="mt-3 grid grid-cols-2 gap-3 text-sm">
          <StatSmall label="攻击" value={`${totalAttack}`} />
          <StatSmall label="武器攻击" value={`+${weaponAttack}`} />
          <StatSmall label="敏捷" value={player.agility.toString()} />
          <StatSmall label="幸运" value={player.luck.toString()} />
          <StatSmall label="日数" value={day.toString()} />
        </dl>
      </div>
      <div className="mt-6 rounded-md bg-stone-950/70 p-4">
        <h3 className="text-sm font-medium text-stone-300">天赋</h3>
        <ul className="mt-3 space-y-2 text-sm text-stone-400">
          {selectedTalents.map((talent) => (
            <li key={talent.id}>{talent.name}</li>
          ))}
        </ul>
      </div>
      <p className="mt-5 break-all text-xs leading-5 text-stone-500">Seed: {seed}</p>
    </aside>
  );
}

type StatProps = {
  label: string;
  value: string;
};

function Stat({ label, value }: StatProps) {
  return (
    <div>
      <dt className="text-sm text-stone-400">{label}</dt>
      <dd className="mt-1 text-xl font-semibold text-white">{value}</dd>
    </div>
  );
}

function StatSmall({ label, value }: StatProps) {
  return (
    <div className="rounded-md border border-stone-800 p-3">
      <dt className="text-stone-500">{label}</dt>
      <dd className="mt-1 font-semibold text-stone-100">{value}</dd>
    </div>
  );
}
