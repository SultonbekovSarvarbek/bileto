// Собирает docs/legal/*.md в src/legal/docs.ts, чтобы приложение показывало те же тексты.
// Запуск: npm run legal
import { readFileSync, writeFileSync } from 'node:fs';

const langs = ['ru', 'en', 'uz'];
const docs = ['terms', 'privacy'];
const out = { };
for (const lang of langs) {
  out[lang] = {};
  for (const doc of docs) out[lang][doc] = readFileSync(`docs/legal/${doc}.${lang}.md`, 'utf8').trim();
}
writeFileSync(
  'src/legal/docs.ts',
  `// Сгенерировано scripts/build-legal.mjs из docs/legal/*.md — не редактировать вручную.\n` +
    `import type { Lang } from '../i18n';\n\n` +
    `export type LegalDoc = 'terms' | 'privacy';\n\n` +
    `export const LEGAL: Record<Lang, Record<LegalDoc, string>> = ${JSON.stringify(out, null, 2)};\n`,
);
console.log('src/legal/docs.ts updated');
