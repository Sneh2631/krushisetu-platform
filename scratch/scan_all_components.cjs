const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(filePath));
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      results.push(filePath);
    }
  });
  return results;
}

const files = walk('src');
const gujaratiRegex = /[\u0A80-\u0AFF]/;
const gjWords = ['GSAMB', 'Deesa', 'Mahuva', 'Bhavnagar', 'Valsad', 'Sanand', 'GJ-'];

console.log('--- SCANNING FOR GUJARATI TEXT OR GUJARAT REFS IN SRC ---');
files.forEach(f => {
  // skip translations files or test files
  if (f.includes('translations.ts') || f.includes('checkTranslations.ts') || f.includes('translations') && f.includes('.ts')) {
    return;
  }
  const content = fs.readFileSync(f, 'utf8');
  const lines = content.split('\n');
  let hasGu = 0;
  let hasWord = 0;
  lines.forEach((line, idx) => {
    if (gujaratiRegex.test(line)) {
      hasGu++;
    }
    for (const w of gjWords) {
      if (line.includes(w)) {
        hasWord++;
        break;
      }
    }
  });

  if (hasGu > 0 || hasWord > 0) {
    console.log(`${f}: ${hasGu} lines with Gujarati script, ${hasWord} lines with Gujarat references`);
  }
});
