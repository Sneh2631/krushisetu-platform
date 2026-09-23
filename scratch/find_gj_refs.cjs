const fs = require('fs');

const content = fs.readFileSync('src/i18n/translations.ts', 'utf8');
const words = ['Gujarat', 'GSAMB', 'Deesa', 'Valsad', 'Sanand', 'Mahuva', 'Bhavnagar', 'Ahmedabad', 'ડીસા', 'મહુવા', 'ભાવનગર', 'અમદાવાદ'];
const lines = content.split('\n');

lines.forEach((line, idx) => {
  for (const w of words) {
    if (line.includes(w)) {
      console.log('Line ' + (idx + 1) + ' [' + w + ']: ' + line.trim());
      break;
    }
  }
});
