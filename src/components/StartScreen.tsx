import { useState, type ChangeEvent } from 'react';
import { parseStoryFile } from '../core/storyParser';
import type { StoryDefinition } from '../core/types';
import { useGameStore } from '../store/gameStore';

export function StartScreen() {
  const { rollTalents, selectedTalents, startGame, startStory } = useGameStore();
  const [story, setStory] = useState<StoryDefinition>();
  const [fileName, setFileName] = useState('');
  const [error, setError] = useState('');
  const [isParsing, setIsParsing] = useState(false);

  async function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) return;

    setIsParsing(true);
    setError('');

    try {
      const nextStory = await parseStoryFile(file);
      setStory(nextStory);
      setFileName(file.name);
    } catch (reason) {
      setStory(undefined);
      setFileName('');
      setError(reason instanceof Error ? reason.message : '文件解析失败。');
    } finally {
      setIsParsing(false);
      event.target.value = '';
    }
  }

  return (
    <main className="min-h-screen bg-stone-950 px-5 py-8 text-stone-100">
      <section className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-5xl flex-col justify-center">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-amber-300">
          Xianxia Web Game
        </p>
        <h1 className="mt-4 text-4xl font-semibold text-white sm:text-6xl">
          问道长生
        </h1>
        <p className="mt-5 max-w-2xl leading-8 text-stone-300">
          命数未定，道途将启。你将从凡人期开始，沿凡人、炼气、筑基、结丹、元婴一路修至飞升。
          开局会随机抽取三个天赋，它们会影响你的气血、攻击、敏捷、幸运与金钱。
        </p>

        <section className="mt-8 grid gap-4 md:grid-cols-3">
          {selectedTalents.map((talent) => (
            <article
              className="rounded-lg border border-stone-800 bg-stone-900/80 p-5"
              key={talent.id}
            >
              <h2 className="text-xl font-semibold text-white">{talent.name}</h2>
              <p className="mt-3 min-h-16 text-sm leading-6 text-stone-400">
                {talent.description}
              </p>
              <dl className="mt-4 grid grid-cols-2 gap-2 text-sm">
                {Object.entries(talent.modifiers).map(([key, value]) => (
                  <div className="rounded-md bg-stone-950/70 p-3" key={key}>
                    <dt className="text-stone-500">{modifierLabels[key] ?? key}</dt>
                    <dd className="mt-1 font-semibold text-amber-200">
                      {value > 0 ? `+${value}` : value}
                    </dd>
                  </div>
                ))}
              </dl>
            </article>
          ))}
        </section>

        <section className="mt-8 border-y border-stone-800 py-6">
          <div className="flex flex-wrap items-start justify-between gap-5">
            <div>
              <h2 className="text-lg font-semibold text-white">剧本</h2>
              <p className="mt-2 text-sm leading-6 text-stone-400">导入后将按剧情节点推进，只在故事设定的分岔处出现选择。</p>
              <a className="mt-2 inline-block text-sm text-amber-200 hover:text-amber-100" download href="/story-template.json">
                下载 JSON 剧本模板
              </a>
            </div>
            <label className="cursor-pointer rounded-md border border-amber-300/70 px-4 py-2.5 text-sm font-medium text-amber-200 transition hover:bg-amber-300 hover:text-stone-950">
              {isParsing ? '正在解析...' : '导入剧本'}
              <input
                accept=".json,.docx,.pdf,application/json,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/pdf"
                className="sr-only"
                disabled={isParsing}
                type="file"
                onChange={handleFileChange}
              />
            </label>
          </div>
          {story ? (
            <div className="mt-5 grid gap-3 text-sm sm:grid-cols-3">
              <StoryFact label="剧本" value={story.title} />
              <StoryFact label="主角" value={story.protagonist.name} />
              <StoryFact label="剧情节点" value={`${story.nodes.length} 段`} />
              <p className="sm:col-span-3 text-xs text-stone-500">已载入：{fileName}</p>
            </div>
          ) : null}
          {error ? <p className="mt-4 text-sm text-rose-300">{error}</p> : null}
        </section>

        <div className="mt-8 flex flex-wrap gap-3">
          <button
            className="rounded-md bg-amber-300 px-6 py-3 font-medium text-stone-950 transition hover:bg-amber-200"
            type="button"
            onClick={() => (story ? startStory(story) : startGame())}
          >
            {story ? '开始剧本' : '开始历程'}
          </button>
          <button
            className="rounded-md border border-stone-700 px-6 py-3 font-medium text-stone-200 transition hover:border-stone-500 hover:bg-stone-900"
            type="button"
            onClick={rollTalents}
          >
            重新抽取
          </button>
        </div>
      </section>
    </main>
  );
}

type StoryFactProps = {
  label: string;
  value: string;
};

function StoryFact({ label, value }: StoryFactProps) {
  return (
    <div className="rounded-md border border-stone-800 bg-stone-950/60 p-3">
      <dt className="text-stone-500">{label}</dt>
      <dd className="mt-1 font-medium text-stone-100">{value}</dd>
    </div>
  );
}

const modifierLabels: Record<string, string> = {
  maxHp: '气血',
  attack: '攻击',
  agility: '敏捷',
  luck: '幸运',
  gold: '金钱',
};
