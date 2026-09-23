const fs = require('fs');
const path = require('path');

function getFiles(dir, exts = ['.tsx', '.ts']) {
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

const files = getFiles(path.join(__dirname, '../src/components'));

console.log('Total component files:', files.length);

const componentsWithoutUseTranslation = [];
const componentsWithUseTranslation = [];

files.forEach(f => {
  const code = fs.readFileSync(f, 'utf8');
  const rel = path.relative(path.join(__dirname, '..'), f);
  if (code.includes('useTranslation')) {
    componentsWithUseTranslation.push(rel);
  } else {
    componentsWithoutUseTranslation.push(rel);
  }
});

console.log('\n--- Components USING useTranslation (' + componentsWithUseTranslation.length + ') ---');
componentsWithUseTranslation.forEach(c => console.log('  ' + c));

console.log('\n--- Components NOT using useTranslation (' + componentsWithoutUseTranslation.length + ') ---');
componentsWithoutUseTranslation.forEach(c => console.log('  ' + c));
