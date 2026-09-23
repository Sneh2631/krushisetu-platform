const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'src', 'i18n', 'translations.ts');
let content = fs.readFileSync(filePath, 'utf8');

const keysToAdd = {
  en: `    'deliveryLocationLabel': 'Delivery:',
    'dealsLabel': 'deals',
    'grievanceDescPlaceholder': 'Describe what occurred at the farm gate or delivery point...',
    'slaRemainingLabel': 'SLA: {days} Days Remaining',
    'counterBetweenRangePlaceholder': 'Between {min} - {max}',
    'explainCounterPlaceholder': 'Explain your counter offer...',
    'farmerCounterLabel': "Farmer's Counter: ₹{price}/Qtl",
    'yourOriginalOfferLabel': 'Your Original Offer: ₹{price}/Qtl',
    'farmersNoteLabel': "Farmer's Note:",
`,
  hi: `    'deliveryLocationLabel': 'वितरण:',
    'dealsLabel': 'सौदे',
    'grievanceDescPlaceholder': 'खेत के गेट या वितरण स्थल पर क्या हुआ इसका विवरण दें...',
    'slaRemainingLabel': 'SLA: {days} दिन शेष',
    'counterBetweenRangePlaceholder': '{min} - {max} के बीच',
    'explainCounterPlaceholder': 'अपने जवाबी प्रस्ताव का विवरण दें...',
    'farmerCounterLabel': 'किसान का प्रति-प्रस्ताव: ₹{price}/क्विंटल',
    'yourOriginalOfferLabel': 'आपका मूल प्रस्ताव: ₹{price}/क्विंटल',
    'farmersNoteLabel': 'किसान की टिप्पणी:',
`,
  gu: `    'deliveryLocationLabel': 'ડિલિવરી:',
    'dealsLabel': 'સોદા',
    'grievanceDescPlaceholder': 'ખેતરના દરવાજે અથવા ડિલિવરી પોઇન્ટ પર શું બન્યું તેનું વર્ણન કરો...',
    'slaRemainingLabel': 'SLA: {days} દિવસ બાકી',
    'counterBetweenRangePlaceholder': '{min} - {max} વચ્ચે',
    'explainCounterPlaceholder': 'તમારા વળતા પ્રસ્તાવની વિગત આપો...',
    'farmerCounterLabel': 'ખેડૂતનો વળતો પ્રસ્તાવ: ₹{price}/ક્વિન્ટલ',
    'yourOriginalOfferLabel': 'તમારો મૂળ પ્રસ્તાવ: ₹{price}/ક્વિન્ટલ',
    'farmersNoteLabel': 'ખેડૂતની નોંધ:',
`,
  mr: `    'deliveryLocationLabel': 'वितरण:',
    'dealsLabel': 'सौदे',
    'grievanceDescPlaceholder': 'शेत शिवारात किंवा वितरण केंद्रावर काय घडले याचे वर्णन करा...',
    'slaRemainingLabel': 'SLA: {days} दिवस शिल्लक',
    'counterBetweenRangePlaceholder': '{min} - {max} दरम्यान',
    'explainCounterPlaceholder': 'आपल्या प्रति-प्रस्तावाचे स्पष्टीकरण द्या...',
    'farmerCounterLabel': 'शेतकऱ्याचा प्रति-प्रस्ताव: ₹{price}/क्विंटल',
    'yourOriginalOfferLabel': 'आपली मूळ ऑफर: ₹{price}/क्विंटल',
    'farmersNoteLabel': 'शेतकऱ्याची नोंद:',
`,
};

// Injection points after refNumberLabel in each language block
content = content.replace(
  /('refNumberLabel': 'Ref',\r?\n)/,
  `$1${keysToAdd.en}`
);

content = content.replace(
  /('refNumberLabel': 'संदर्भ',\r?\n\r?\n  },\r?\n\r?\n  gu:)/,
  `'refNumberLabel': 'संदर्भ',\n${keysToAdd.hi}\n  },\n\n  gu:`
);

content = content.replace(
  /('refNumberLabel': 'સંદર્ભ',\r?\n\r?\n  },\r?\n\r?\n  mr:)/,
  `'refNumberLabel': 'સંદર્ભ',\n${keysToAdd.gu}\n  },\n\n  mr:`
);

content = content.replace(
  /('refNumberLabel': 'संदर्भ',\r?\n\r?\n  },\r?\n};)/,
  `'refNumberLabel': 'संदर्भ',\n${keysToAdd.mr}\n  },\n};`
);

fs.writeFileSync(filePath, content, 'utf8');
console.log('Successfully injected phase 3 translation keys!');
