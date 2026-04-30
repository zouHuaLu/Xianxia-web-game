import { useGameStore } from '../store/gameStore';

const realms = ['炼气', '筑基', '结丹', '元婴', '化神'];

export function PlayerPanel() {
  const { name, realmIndex, spiritStones } = useGameStore();
  const currentRealm = realms[realmIndex] ?? realms[realms.length - 1];

  return (
    <aside className="rounded-lg border border-stone-800 bg-stone-900/80 p-5 lg:min-h-[calc(100vh-3rem)]">
      <h2 className="text-lg font-semibold text-white">角色</h2>
      <dl className="mt-5 space-y-4">
        <Stat label="道号" value={name} />
        <Stat label="境界" value={currentRealm} />
        <Stat label="灵石" value={spiritStones.toString()} />
      </dl>
      <div className="mt-6 rounded-md bg-stone-950/70 p-4">
        <h3 className="text-sm font-medium text-stone-300">属性</h3>
        <dl className="mt-3 grid grid-cols-2 gap-3 text-sm">
          <StatSmall label="体魄" value="10" />
          <StatSmall label="神识" value="8" />
          <StatSmall label="悟性" value="7" />
          <StatSmall label="气运" value="5" />
        </dl>
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
