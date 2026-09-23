const fs = require('fs');

const file = 'src/i18n/translations.ts';
let content = fs.readFileSync(file, 'utf8');

// Replacements for old Gujarat references
content = content.replace(
  "'authDeliveryPlaceholder': 'e.g. Sanand Industrial Park, Ahmedabad',",
  "'authDeliveryPlaceholder': 'e.g. Baramati MIDC, Pune / Ranjangaon, Pune',"
);
content = content.replace(
  "'farmerRecoBuyer': 'Recommended Buyer: Balaji Wafers & Agro (Valsad Plant)',",
  "'farmerRecoBuyer': 'Recommended Buyer: Sahyadri Farmers Producer Co. / Chitale Agro (Baramati Plant)',"
);
content = content.replace(
  "'authDeliveryPlaceholder': 'उदा. साणंद इंडस्ट्रियल पार्क, अहमदाबाद',",
  "'authDeliveryPlaceholder': 'उदा. बारामती एमआईडीसी, पुणे / रांजणगांव, पुणे',"
);
content = content.replace(
  "'farmerRecoBuyer': 'अनुशंसित खरीदार: बालाजी वेफर्स एवं एग्रो (वलसाड प्लांट)',",
  "'farmerRecoBuyer': 'अनुशंसित खरीदार: चितळे ॲग्रो / सह्याद्री फार्म्स (बारामती/नाशिक)',"
);
content = content.replace(
  "'authDeliveryPlaceholder': 'દા.ત. સાણંદ ઇન્ડસ્ટ્રિયલ પાર્ક, અમદાવાદ',",
  "'authDeliveryPlaceholder': 'દા.ત. બારામતી MIDC, પુણે / રાંજણગાંવ, પુણે',"
);
content = content.replace(
  "'farmerRecoBuyer': 'ભલામણ કરેલ ખરીદદાર: બાલાજી વેફર્સ એન્ડ એગ્રો (વલસાડ પ્લાન્ટ)',",
  "'farmerRecoBuyer': 'ભલામણ કરેલ ખરીદદાર: ચિતાલે એગ્રો / સહ્યાદ્રી ફાર્મ્સ (બારામતી/નાસિક)',"
);
content = content.replace(
  "'farmerRecoBuyer': 'अनुशंसित खरीदार: बालाजी वेफर्स एवं एग्रो (वलसाड प्लांट)',",
  "'farmerRecoBuyer': 'शिफारस केलेले खरेदीदार: चितळे ॲग्रो / सह्याद्री फार्म्स (बारामती/नाशिक)',"
);

fs.writeFileSync(file, content, 'utf8');
console.log('Successfully updated Gujarat references in translations.ts');
