const fs = require('fs');

const content = fs.readFileSync('src/i18n/translations.ts', 'utf8');

function extractKeys(lang) {
  const startMarker = `  ${lang}: {`;
  const startIndex = content.indexOf(startMarker);
  if (startIndex === -1) return new Set();
  
  // Find closing of that dict
  let endIndex = content.indexOf('\n  },', startIndex);
  if (endIndex === -1) {
    endIndex = content.indexOf('\n  };', startIndex);
  }
  const slice = content.substring(startIndex, endIndex);
  const keys = new Set();
  const regex = /'([a-zA-Z0-9_]+)':/g;
  let match;
  while ((match = regex.exec(slice)) !== null) {
    keys.add(match[1]);
  }
  return keys;
}

const en = extractKeys('en');
const hi = extractKeys('hi');
const gu = extractKeys('gu');
const mr = extractKeys('mr');

console.log(`Key counts: en=${en.size}, hi=${hi.size}, gu=${gu.size}, mr=${mr.size}`);

// Check differences
for (const k of en) {
  if (!hi.has(k)) console.log(`Missing in hi: ${k}`);
  if (!gu.has(k)) console.log(`Missing in gu: ${k}`);
  if (!mr.has(k)) console.log(`Missing in mr: ${k}`);
}
console.log('Parity check completed!');
