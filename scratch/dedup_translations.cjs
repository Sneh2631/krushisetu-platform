const fs = require('fs');

const content = fs.readFileSync('src/i18n/translations.ts', 'utf8');

// Parse each language
const languages = ['en', 'hi', 'gu', 'mr'];
const dicts = {};

languages.forEach(lang => {
  dicts[lang] = new Map();
  const startMarker = `  ${lang}: {`;
  const startIndex = content.indexOf(startMarker);
  let endIndex = content.indexOf('\n  },', startIndex);
  if (endIndex === -1) {
    endIndex = content.indexOf('\n  };', startIndex);
  }
  const slice = content.substring(startIndex, endIndex);
  const lines = slice.split('\n');
  lines.forEach(line => {
    // Match 'key': 'value',
    const match = line.match(/^\s*'([a-zA-Z0-9_]+)':\s*(.+),?\s*$/);
    if (match) {
      const key = match[1];
      let val = match[2].trim();
      if (val.endsWith(',')) val = val.slice(0, -1);
      dicts[lang].set(key, val);
    }
  });
  console.log(`Parsed ${dicts[lang].size} unique keys for ${lang}`);
});

// Re-serialize src/i18n/translations.ts cleanly
let output = `import type { Language } from '../types';

export interface TranslationDictionary {
  [key: string]: string;
}

export const TRANSLATIONS: Record<Language, TranslationDictionary> = {
`;

languages.forEach((lang, idx) => {
  output += `  ${lang}: {\n`;
  for (const [k, v] of dicts[lang].entries()) {
    output += `    '${k}': ${v},\n`;
  }
  output += idx === languages.length - 1 ? `  }\n` : `  },\n`;
});

output += `};\n`;

fs.writeFileSync('src/i18n/translations.ts', output, 'utf8');
console.log('Successfully de-duplicated and regenerated src/i18n/translations.ts!');
