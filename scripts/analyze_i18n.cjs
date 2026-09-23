const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../src/i18n/translations.ts');
const content = fs.readFileSync(filePath, 'utf8');

const enMatch = content.match(/en\s*:\s*\{([\s\S]*?)\n\s*\},?\s*hi\s*:/);
const hiMatch = content.match(/hi\s*:\s*\{([\s\S]*?)\n\s*\},?\s*gu\s*:/);
const guMatch = content.match(/gu\s*:\s*\{([\s\S]*?)\n\s*\},?\s*mr\s*:/);
const mrMatch = content.match(/mr\s*:\s*\{([\s\S]*?)\n\s*\}\s*;/);

function parseDict(str) {
  const dict = {};
  const re = /'([^']+)'\s*:\s*'((?:\\'|[^'])*)'/g;
  let m;
  while ((m = re.exec(str)) !== null) {
    dict[m[1]] = m[2].replace(/\\'/g, "'");
  }
  return dict;
}

const en = parseDict(enMatch ? enMatch[1] : '');
const hi = parseDict(hiMatch ? hiMatch[1] : '');
const gu = parseDict(guMatch ? guMatch[1] : '');
const mr = parseDict(mrMatch ? mrMatch[1] : '');

console.log('Key counts:', {
  en: Object.keys(en).length,
  hi: Object.keys(hi).length,
  gu: Object.keys(gu).length,
  mr: Object.keys(mr).length
});

const enKeys = Object.keys(en);
const missingInGu = enKeys.filter(k => !(k in gu));
const missingInHi = enKeys.filter(k => !(k in hi));
const missingInMr = enKeys.filter(k => !(k in mr));

console.log('Missing in gu:', missingInGu.length);
if (missingInGu.length) console.log('  sample:', missingInGu.slice(0, 10));
console.log('Missing in hi:', missingInHi.length);
if (missingInHi.length) console.log('  sample:', missingInHi.slice(0, 10));
console.log('Missing in mr:', missingInMr.length);
if (missingInMr.length) console.log('  sample:', missingInMr.slice(0, 10));

// Check values in gu that match en or have no Gujarati characters
function hasGujarati(str) {
  return /[઀-૿]/.test(str);
}
function hasDevanagari(str) {
  return /[ऀ-ॿ]/.test(str);
}

const guEnglishValues = [];
for (const [k, v] of Object.entries(gu)) {
  if (!hasGujarati(v) && /[a-zA-Z]{3,}/.test(v)) {
    guEnglishValues.push({ key: k, en: en[k], val: v });
  }
}
console.log('GU values containing latin words and no Gujarati script:', guEnglishValues.length);
guEnglishValues.slice(0, 15).forEach(x => console.log('  [GU]', x.key, '=>', x.val));

const hiEnglishValues = [];
for (const [k, v] of Object.entries(hi)) {
  if (!hasDevanagari(v) && /[a-zA-Z]{3,}/.test(v)) {
    hiEnglishValues.push({ key: k, en: en[k], val: v });
  }
}
console.log('HI values containing latin words and no Devanagari script:', hiEnglishValues.length);
hiEnglishValues.slice(0, 10).forEach(x => console.log('  [HI]', x.key, '=>', x.val));

const mrEnglishValues = [];
for (const [k, v] of Object.entries(mr)) {
  if (!hasDevanagari(v) && /[a-zA-Z]{3,}/.test(v)) {
    mrEnglishValues.push({ key: k, en: en[k], val: v });
  }
}
console.log('MR values containing latin words and no Devanagari script:', mrEnglishValues.length);
mrEnglishValues.slice(0, 10).forEach(x => console.log('  [MR]', x.key, '=>', x.val));
