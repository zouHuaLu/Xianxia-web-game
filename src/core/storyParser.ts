import mammoth from 'mammoth';
import type { StoryChoice, StoryDefinition, StoryNode } from './types';

type UntrustedStory = Partial<StoryDefinition>;

export async function parseStoryFile(file: File): Promise<StoryDefinition> {
  const extension = file.name.split('.').pop()?.toLowerCase();

  if (extension === 'json') {
    return parseJsonStory(await file.text());
  }

  if (extension === 'docx') {
    const result = await mammoth.extractRawText({ arrayBuffer: await file.arrayBuffer() });
    return parseStoryText(result.value, file.name);
  }

  if (extension === 'pdf') {
    return parseStoryText(await extractPdfText(file), file.name);
  }

  throw new Error('请选择 JSON、DOCX 或 PDF 文件。');
}

function parseJsonStory(text: string): StoryDefinition {
  let value: UntrustedStory;

  try {
    value = JSON.parse(text) as UntrustedStory;
  } catch {
    throw new Error('JSON 格式无效。');
  }

  if (
    !value.title ||
    !value.protagonist?.name ||
    !value.startNodeId ||
    !Array.isArray(value.nodes) ||
    value.nodes.length === 0
  ) {
    throw new Error('JSON 需包含 title、protagonist.name、startNodeId 和 nodes。');
  }

  const nodes = value.nodes.map((node, index) => normalizeNode(node, index));
  const nodeIds = new Set(nodes.map((node) => node.id));

  if (!nodeIds.has(value.startNodeId)) {
    throw new Error('startNodeId 未指向有效的剧情节点。');
  }

  for (const node of nodes) {
    for (const choice of node.choices) {
      if (choice.nextId && !nodeIds.has(choice.nextId)) {
        throw new Error(`选项“${choice.text}”指向了不存在的节点“${choice.nextId}”。`);
      }
    }
  }

  return {
    title: value.title,
    protagonist: { name: value.protagonist.name },
    startNodeId: value.startNodeId,
    nodes,
  };
}

function normalizeNode(node: unknown, index: number): StoryNode {
  const value = node as Partial<StoryNode>;

  if (!value.id || !value.title || !value.text || !Array.isArray(value.choices)) {
    throw new Error(`第 ${index + 1} 个剧情节点缺少 id、title、text 或 choices。`);
  }

  return {
    id: value.id,
    title: value.title,
    text: value.text,
    choices: value.choices.map((choice, choiceIndex) => normalizeChoice(choice, choiceIndex)),
  };
}

function normalizeChoice(choice: unknown, index: number): StoryChoice {
  const value = choice as Partial<StoryChoice>;

  if (!value.id || !value.text) {
    throw new Error(`第 ${index + 1} 个选项缺少 id 或 text。`);
  }

  return {
    id: value.id,
    text: value.text,
    nextId: value.nextId,
    effects: value.effects,
  };
}

function parseStoryText(text: string, filename: string): StoryDefinition {
  const cleaned = text.replace(/\r/g, '').trim();

  if (!cleaned) {
    throw new Error('文件中没有可解析的文本。');
  }

  const title = cleaned.match(/^(?:标题|书名)\s*[:：]\s*(.+)$/m)?.[1]?.trim() ?? filename.replace(/\.[^.]+$/, '');
  const protagonist = cleaned.match(/^(?:主角|主人公)\s*[:：]\s*(.+)$/m)?.[1]?.trim() ?? '无名修士';
  const sections = cleaned.split(/(?=^(?:第.+?[章节]|章节\s*[:：]|#\s+.+)$)/m).filter(Boolean);
  const chapterSections = sections.filter((section) => /^(?:第.+?[章节]|章节\s*[:：]|#\s+.+)$/m.test(section));
  const sourceSections = chapterSections.length > 0 ? chapterSections : [cleaned];
  const nodes = sourceSections.map((section, index) => parseTextNode(section, index));
  const nodeIdByTitle = new Map(nodes.map((node) => [node.title, node.id]));

  nodes.forEach((node, index) => {
    node.choices = node.choices.map((choice, choiceIndex) => ({
      ...choice,
      nextId: nodeIdByTitle.get(choice.nextId ?? '') ?? choice.nextId ?? nodes[index + 1]?.id,
      id: choice.id || `choice-${index + 1}-${choiceIndex + 1}`,
    }));
  });

  return {
    title,
    protagonist: { name: protagonist },
    startNodeId: nodes[0].id,
    nodes,
  };
}

function parseTextNode(section: string, index: number): StoryNode {
  const lines = section.split('\n').map((line) => line.trim()).filter(Boolean);
  const heading = lines[0]?.replace(/^(?:章节\s*[:：]|#\s*)/, '') ?? `第 ${index + 1} 章`;
  const choiceStart = lines.findIndex((line) => /^(?:选择|抉择|选项)\s*[:：]?$/.test(line));
  const contentLines = (choiceStart >= 0 ? lines.slice(1, choiceStart) : lines.slice(1)).filter(
    (line) => !/^(?:标题|书名|主角|主人公)\s*[:：]/.test(line),
  );
  const choiceLines = choiceStart >= 0 ? lines.slice(choiceStart + 1) : [];
  const choices: StoryChoice[] = [];

  choiceLines.forEach((line, choiceIndex) => {
    const match = line.match(/^(?:[-*]|\d+[.、])\s*(.+?)(?:\s*(?:->|=>|→)\s*(\S+))?$/);

    if (match) {
      choices.push({
        id: `choice-${index + 1}-${choiceIndex + 1}`,
        text: match[1].trim(),
        nextId: match[2]?.trim(),
      });
    }
  });

  return {
    id: `chapter-${index + 1}`,
    title: heading,
    text: contentLines.join('\n\n') || '故事仍在继续。',
    choices,
  };
}

async function extractPdfText(file: File) {
  const pdfjs = await import('pdfjs-dist/legacy/build/pdf');
  const document = await pdfjs.getDocument({ data: new Uint8Array(await file.arrayBuffer()) }).promise;
  const pages: string[] = [];

  for (let pageNumber = 1; pageNumber <= document.numPages; pageNumber += 1) {
    const page = await document.getPage(pageNumber);
    const content = await page.getTextContent();
    pages.push(content.items.map((item) => ('str' in item ? item.str : '')).join(''));
  }

  return pages.join('\n');
}
