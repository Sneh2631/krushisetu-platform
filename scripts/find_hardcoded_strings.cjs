const fs = require('fs');
const path = require('path');

function getFiles(dir, exts = ['.tsx']) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) {
      results = results.concat(getFiles(fullPath, exts));
    } else {
      if (exts.includes(path.extname(file))) {
        results.push(fullPath);
      }
    }
  });
  return results;
}

const files = getFiles(path.join(__dirname, '../src'));

console.log('Scanning ' + files.length + ' tsx files for potential hardcoded strings...');

// For each file, check for hardcoded strings in JSX
// E.g. >Some English Text< or placeholder="Some text" or title="Some text"
// We also want to check files without useTranslation
files.forEach(f => {
  const content = fs.readFileSync(f, 'utf8');
  const rel = path.relative(path.join(__dirname, '..'), f);

  // Find JSX text between > and <
  const lines = content.split('\n');
  const hardcoded = [];

  lines.forEach((line, idx) => {
    // Skip imports, comments
    const trimmed = line.trim();
    if (trimmed.startsWith('//') || trimmed.startsWith('/*') || trimmed.startsWith('*') || trimmed.startsWith('import ')) return;

    // Check for >Text< with 2 or more English words
    const matches = line.match(/>\s*([A-Za-z][A-Za-z0-9 ,.?!'"()&/-]{3,}[A-Za-z0-9])\s*</g);
    if (matches) {
      matches.forEach(m => {
        const text = m.replace(/^>\s*/, '').replace(/\s*<$/, '').trim();
        // Ignore single words like div, span, or code tokens
        if (text.split(' ').length >= 2 && !text.includes('{') && !text.includes('}')) {
          hardcoded.push({ line: idx + 1, text });
        }
      });
    }
  });

  if (hardcoded.length > 0) {
    console.log(`\n[${rel}] (${hardcoded.length} candidate hardcoded texts)`);
    hardcoded.slice(0, 8).forEach(h => console.log(`  L${h.line}: "${h.text}"`));
    if (hardcoded.length > 8) {
      console.log(`  ... and ${hardcoded.length - 8} more`);
    }
  }
});
