const fs = require('fs');
const path = require('path');

const filePath = path.resolve(__dirname, '../src/i18n/translations.ts');
let content = fs.readFileSync(filePath, 'utf8');

const newTranslations = {
  sharedVillageTransportHeader: {
    en: 'Shared Village Transport · Zero Freight Loss',
    hi: 'साझा ग्रामीण परिवहन · शून्य मालवाहतूक नुकसान',
    gu: 'સહિયારું ગ્રામીણ પરિવહન · શૂન્ય નૂર નુકસાન',
    mr: 'सामूहिक ग्रामीण वाहतूक · शून्य वाहतूक नुकसान',
  },
  howSharedPickupWorks: {
    en: 'How Shared Farm-Gate Pickup Works',
    hi: 'साझा फार्म-गेट पिकअप कैसे काम करता है',
    gu: 'સહિયારું ફાર્મ-ગેટ પિકઅપ કેવી રીતે કાર્ય કરે છે',
    mr: 'सामूहिक शेतावरील पिकअप कसे कार्य करते',
  },
  sharedPickupSubtitle: {
    en: 'Small farmers often lose ₹10,000–₹25,000 hiring an entire truck alone. In KrushiSetu, 1 large truck collects produce from neighboring farms along your village road, cutting your transport bill by 57%.',
    hi: 'अकेले पूरा ट्रक किराए पर लेने से छोटे किसानों को ₹10,000-₹25,000 का नुकसान होता है। कृषिसेतु में, 1 बड़ा ट्रक आपके गांव के रास्ते के पड़ोसी खेतों से उपज एकत्र करता है, जिससे आपका परिवहन खर्च 57% कम हो जाता है।',
    gu: 'નાના ખેડૂતો એકલા આખો ટ્રક ભાડે રાખીને ઘણીવાર ₹10,000–₹25,000 ગુમાવે છે. કૃષિસેતુમાં, 1 મોટો ટ્રક તમારા ગામના રસ્તા પરના પડોશી ખેતરોમાંથી પાક એકત્રિત કરે છે, જેનાથી તમારો નૂર ખર્ચ 57% ઘટે છે.',
    mr: 'एकट्याने संपूर्ण ट्रक भाड्याने घेतल्याने लहान शेतकऱ्यांचे ₹10,000-₹25,000 चे नुकसान होते. कृषीसेतूमध्ये, 1 मोठा ट्रक आपल्या गावातील शेजारील शेतांमधून शेतमाल गोळा करतो, ज्यामुळे वाहतूक खर्च 57% कमी होतो.',
  },
  farmersPoolProduceTitle: {
    en: 'Farmers Pool Produce',
    hi: 'किसान उपज एकत्र करते हैं',
    gu: 'ખેડૂતો પાક એકત્રિત કરે છે',
    mr: 'शेतकरी शेतमाल एकत्र करतात',
  },
  farmersPoolProduceDesc: {
    en: "Whether you have 2 tonnes or 10 tonnes, you don't need to rent an entire truck. KrushiSetu groups you with farmers in your taluka selling to the same hub.",
    hi: 'चाहे आपके पास 2 टन हो या 10 टन, आपको पूरा ट्रक किराए पर लेने की जरूरत नहीं है। कृषिसेतु आपको उसी हब में बेचने वाले आपके तालुका के किसानों के साथ जोड़ता है।',
    gu: 'તમારી પાસે 2 ટન હોય કે 10 ટન, તમારે આખો ટ્રક ભાડે લેવાની જરૂર નથી. કૃષિસેતુ તમને તમારા તાલુકાના સમાન હબમાં વેચતા ખેડૂતો સાથે જોડે છે.',
    mr: 'आपल्याकडे 2 टन असो वा 10 टन, संपूर्ण ट्रक भाड्याने घेण्याची गरज नाही. कृषीसेतू आपल्याला एकाच खरेदी केंद्रावर माल विकणाऱ्या तालुक्यातील शेतकऱ्यांशी जोडतो.',
  },
  noMinTruckPenalty: {
    en: '✓ No minimum truck-hire penalty',
    hi: '✓ कोई न्यूनतम ट्रक-किराया जुर्माना नहीं',
    gu: '✓ કોઈ ન્યૂનતમ ટ્રક-ભાડા પેનલ્ટી નહીં',
    mr: '✓ कोणताही किमान ट्रक भाडे दंड नाही',
  },
  oneTruckPickupTitle: {
    en: 'One Truck Village Pickup',
    hi: 'एक ट्रक ग्रामीण पिकअप',
    gu: 'એક ટ્રક ગ્રામીણ પિકઅપ',
    mr: 'एक ट्रक ग्रामीण पिकअप',
  },
  oneTruckPickupDesc: {
    en: 'A verified heavy vehicle comes straight to your farm-gate. An on-site electronic weighment receipt is issued, and your load is locked under transit insurance.',
    hi: 'एक सत्यापित भारी वाहन सीधे आपके खेत के गेट पर आता है। मौके पर इलेक्ट्रॉनिक वजन रसीद जारी की जाती है और माल पारगमन बीमा के तहत सुरक्षित होता है।',
    gu: 'ચકાસાયેલ વાહન સીધું તમારા ખેતરના દરવાજે આવે છે. સ્થળ પર જ ઈલેક્ટ્રોનિક વજન રસીદ આપવામાં આવે છે, અને તમારો માલ વીમા હેઠળ સુરક્ષિત થાય છે.',
    mr: 'प्रमाणित वाहन थेट आपल्या शेतावर येते. जागेवरच इलेक्ट्रॉनिक वजन पावती दिली जाते आणि आपला माल वाहतूक विम्यांतर्गत सुरक्षित केला जातो.',
  },
  farmGateLoadingGps: {
    en: '✓ Farm-gate loading & GPS tracked',
    hi: '✓ फार्म-गेट लोडिंग और जीपीएस ट्रैक्ड',
    gu: '✓ ફાર્મ-ગેટ લોડિંગ અને GPS ટ્રેકિંગ',
    mr: '✓ शेतावर लोडिंग आणि जीपीएस ट्रॅकिंग',
  },
  payOnlyForWeightTitle: {
    en: 'Pay Only For Your Weight',
    hi: 'केवल अपने वजन का भुगतान करें',
    gu: 'માત્ર તમારા વજનનું જ ભાડું ચૂકવો',
    mr: 'फक्त आपल्या वजनाचे भाडे द्या',
  },
  payOnlyForWeightDesc: {
    en: 'You only pay ₹1.50 per kg instead of private tempo charges of ₹3.50 per kg. Direct delivery to buyer factory gate with zero middleman cuts.',
    hi: 'निजी टेम्पो के ₹3.50 प्रति किग्रा के बजाय आप केवल ₹1.50 प्रति किग्रा का भुगतान करते हैं। बिना बिचौलिए के खरीदार की फैक्ट्री तक सीधी डिलीवरी।',
    gu: 'ખાનગી ટેમ્પોના ₹3.50 પ્રતિ કિલોના બદલે તમે માત્ર ₹1.50 પ્રતિ કિલો ચૂકવો છો. વચેટિયા વિના સીધી ખરીદદારની ફેક્ટરી સુધી પહોંચ.',
    mr: 'खाजगी वाहनांच्या ₹3.50 प्रति किलो ऐवजी आपण फक्त ₹1.50 प्रति किलो देता. मध्यस्थांशिवाय थेट खरेदीदाराच्या कारखान्यापर्यंत वाहतूक.',
  },
  keepExtraProfit: {
    en: '✓ Keep ₹10,000+ extra per harvest',
    hi: '✓ प्रति फसल ₹10,000+ अतिरिक्त बचत',
    gu: '✓ દર પાકે ₹10,000+ વધારાનો નફો મેળવો',
    mr: '✓ प्रत्येक हंगामात ₹10,000+ अतिरिक्त नफा मिळवा',
  },
  instantFreightCalc: {
    en: 'Instant Freight Savings Calculator',
    hi: 'त्वरित मालवाहतूक बचत कैलकुलेटर',
    gu: 'ત્વરિત નૂર બચત કેલ્ક્યુલેટર',
    mr: 'त्वरित वाहतूक बचत गणक',
  },
  seeHowMuchYouSave: {
    en: 'See How Much You Save',
    hi: 'देखें आपकी कितनी बचत होगी',
    gu: 'જુઓ તમારી કેટલી બચત થશે',
    mr: 'पहा तुमची किती बचत होते',
  },
  calcSubtitle: {
    en: 'Enter your harvest quantity to see your direct cash savings vs booking a private truck.',
    hi: 'निजी ट्रक की तुलना में अपनी सीधी नकद बचत देखने के लिए अपनी उपज की मात्रा दर्ज करें।',
    gu: 'ખાનગી ટ્રકની સરખામણીમાં તમારી રોકડ બચત જોવા માટે તમારા પાકનો જથ્થો દાખલ કરો.',
    mr: 'खाजगी ट्रकच्या तुलनेत आपली थेट रोख बचत पाहण्यासाठी आपल्या शेतमालाचे प्रमाण टाका.',
  },
  yourCropWeightLabel: {
    en: 'Your Crop Weight (Tonnes):',
    hi: 'आपकी फसल का वजन (टन):',
    gu: 'તમારા પાકનું વજન (ટન):',
    mr: 'आपल्या शेतमालाचे वजन (टन):',
  },
  soloPrivateTruck: {
    en: 'Solo Private Truck',
    hi: 'अकेला निजी ट्रक',
    gu: 'એકલો ખાનગી ટ્રક',
    mr: 'स्वतंत्र खाजगी ट्रक',
  },
  krushiSetuPooled: {
    en: 'KrushiSetu Pooled',
    hi: 'कृषिसेतु साझा वाहन',
    gu: 'કૃષિસેતુ સહિયારું',
    mr: 'कृषीसेतू एकत्रित',
  },
  directMoneySaved: {
    en: 'Direct Money Saved',
    hi: 'सीधी नकद बचत',
    gu: 'સીધી રોકડ બચત',
    mr: 'थेट पैशांची बचत',
  },
  extraProfitToPocket: {
    en: 'Extra profit straight to your pocket',
    hi: 'अतिरिक्त मुनाफा सीधे आपकी जेब में',
    gu: 'વધારાનો નફો સીધો તમારા ખિસ્સામાં',
    mr: 'अतिरिक्त नफा थेट आपल्या खिशात',
  },
  joinTodayPickupBtn: {
    en: "Join Today's Shared Village Pickup",
    hi: 'आज के साझा ग्रामीण पिकअप में शामिल हों',
    gu: 'આજના સહિયારા ગ્રામીણ પિકઅપમાં જોડાઓ',
    mr: 'आजच्या सामूहिक ग्रामीण पिकअपमध्ये सामील व्हा',
  },
  liveRouteCluster: {
    en: 'Live Route · Cluster',
    hi: 'लाइव रूट · क्लस्टर',
    gu: 'લાઇવ રૂટ · ક્લસ્ટર',
    mr: 'थेट मार्ग · क्लस्टर',
  },
  todayConsolidatedRun: {
    en: "Today's Consolidated 30 MT Truck Run",
    hi: 'आज का 30 मीट्रिक टन संयुक्त ट्रक फेरा',
    gu: 'આજનો ૩૦ MT સંયુક્ત ટ્રક રન',
    mr: 'आजची एकत्रित ३० मेट्रिक टन ट्रक फेरी',
  },
  sampleRouteDescription: {
    en: 'Baramati ➔ Daund ➔ Shirur ➔ Sahyadri Agro Processing Hub, Pune',
    hi: 'बारामती ➔ दौंड ➔ शिरूर ➔ सह्याद्री ऍग्रो प्रोसेसिंग हब, पुणे',
    gu: 'બારામતી ➔ દૌંડ ➔ શિરુર ➔ સહ્યાદ્રી એગ્રો પ્રોસેસિંગ હબ, પુણે',
    mr: 'बारामती ➔ दौंड ➔ शिरूर ➔ सह्याद्री अ‍ॅग्रो प्रोसेसिंग हब, पुणे',
  },
  truckCapacityFilled: {
    en: 'Truck Capacity Filled:',
    hi: 'ट्रक क्षमता भरी गई:',
    gu: 'ટ્રકની ભરાયેલી ક્ષમતા:',
    mr: 'ट्रकची भरलेली क्षमता:',
  },
  simulateTruckBtn: {
    en: 'Simulate Truck',
    hi: 'ट्रक सिमुलेट करें',
    gu: 'ટ્રક સિમ્યુલેટ કરો',
    mr: 'ट्रक हालचाल पहा',
  },
  truckMovingBtn: {
    en: 'Truck Moving...',
    hi: 'ट्रक चल रहा है...',
    gu: 'ટ્રક ગતિમાં છે...',
    mr: 'ट्रक मार्गस्थ आहे...',
  },
  transitInsurance100: {
    en: '100% In-Transit Cargo Insurance',
    hi: '१००% पारगमन कार्गो बीमा',
    gu: '૧૦૦% ઇન-ટ્રાન્ઝિટ કાર્ગો વીમો',
    mr: '१००% वाहतूक माल विमा',
  },
  cutsFuelEmissions: {
    en: 'Cuts -33.8% transit fuel & carbon emissions',
    hi: 'परिवहन ईंधन और कार्बन उत्सर्जन में -33.8% की कमी',
    gu: 'ઈંધણ અને કાર્બન ઉત્સર્જનમાં -33.8% નો ઘટાડો',
    mr: 'इंधन आणि कार्बन उत्सर्जनात -३३.८% घट',
  },
  pickedUpStatus: {
    en: 'Picked Up',
    hi: 'पिकअप संपन्न',
    gu: 'પિકઅપ થયું',
    mr: 'पिकअप झाले',
  },
  enRouteStatus: {
    en: 'En Route',
    hi: 'रास्ते में है',
    gu: 'રસ્તામાં છે',
    mr: 'वाटेवर आहे',
  },
  upcomingStatus: {
    en: 'Upcoming',
    hi: 'आगामी',
    gu: 'આગામી',
    mr: 'पुढील',
  },
  activeStatusBadge: {
    en: 'Active',
    hi: 'सक्रिय',
    gu: 'સક્રિય',
    mr: 'सक्रिय',
  },
  automatedEscrowGatewayHeader: {
    en: 'Automated State Escrow Clearing Gateway',
    hi: 'स्वचालित राज्य एस्क्रो समाशोधन गेटवे',
    gu: 'ઓટોમેટેડ સ્ટેટ એસ્ક્રૉ ક્લિયરિંગ ગેટવે',
    mr: 'स्वयंचलित राज्य एस्क्रो क्लिअरिंग गेटवे',
  },
  totalEscrowDeposited: {
    en: 'Total Escrow Pool Deposited',
    hi: 'कुल जमा एस्क्रो राशि',
    gu: 'જમા થયેલ કુલ એસ્ક્રૉ રકમ',
    mr: 'एकूण जमा एस्क्रो निधी',
  },
  automated6MilestoneAuditTrail: {
    en: 'Automated 6-Milestone Verification Audit Trail',
    hi: 'स्वचालित 6-चरण सत्यापन ऑडिट ट्रेल',
    gu: 'ઓટોમેટેડ ૬-તબક્કા વેરિફિકેશન ઓડિટ ટ્રેલ',
    mr: 'स्वयंचलित ६-टप्पे पडताळणी ऑडिट ट्रेल',
  },
  simulateInstantPayoutBtn: {
    en: 'Simulate Instant IMPS Escrow Release →',
    hi: 'त्वरित IMPS एस्क्रो रिलीज सिमुलेट करें →',
    gu: 'ત્વરિત IMPS એસ્ક્રૉ ચુકવણી સિમ્યુલેટ કરો →',
    mr: 'त्वरित IMPS एस्क्रो वितरण पहा →',
  },
  milestoneApproved: {
    en: 'Approved',
    hi: 'स्वीकृत',
    gu: 'મંજૂર',
    mr: 'मंजूर',
  },
  milestoneVerifying: {
    en: 'Verifying',
    hi: 'सत्यापन जारी',
    gu: 'ચકાસણી ચાલુ',
    mr: 'पडताळणी सुरू',
  },
  milestonePending: {
    en: 'Pending',
    hi: 'लंबित',
    gu: 'બાકી',
    mr: 'प्रलंबित',
  },
  instantImpsCompleted: {
    en: 'Just now (Instant IMPS Transfer)',
    hi: 'अभी-अभी (त्वरित IMPS ट्रांसफर)',
    gu: 'હમણાં જ (ત્વરિત IMPS ટ્રાન્સફર)',
    mr: 'आत्ताच (त्वरित IMPS वर्ग)',
  },
  farmerCounterOfferAlert: {
    en: 'Farmer Counter-Offer',
    hi: 'किसान का प्रति-प्रस्ताव',
    gu: 'ખેડૂતનો કાઉન્ટર-ઓફર (પ્રતિ-પ્રસ્તાવ)',
    mr: 'शेतकऱ्याची प्रति-ऑफर',
  },
  proposedCounterRate: {
    en: 'New Price: ₹{price}/Qtl',
    hi: 'नया भाव: ₹{price}/क्विंटल',
    gu: 'નવો ભાવ: ₹{price}/ક્વિન્ટલ',
    mr: 'नवीन दर: ₹{price}/क्विंटल',
  },
  acceptCounterOfferBtn: {
    en: 'Accept Counter Offer',
    hi: 'प्रति-प्रस्ताव स्वीकारें',
    gu: 'કાઉન્ટર ઓફર સ્વીકારો',
    mr: 'प्रति-ऑफर स्वीकारा',
  },
  declineCounterOfferBtn: {
    en: 'Decline',
    hi: 'अस्वीकार करें',
    gu: 'અસ્વીકાર કરો',
    mr: 'नाकारा',
  },
  counterBackBtn: {
    en: 'Counter Back',
    hi: 'नया प्रस्ताव भेजें',
    gu: 'સામે નવો ભાવ આપો',
    mr: 'प्रति-प्रस्ताव द्या',
  },
  counterBackModalTitle: {
    en: 'Counter Back — {crop}',
    hi: 'नया प्रस्ताव भेजें — {crop}',
    gu: 'સામે નવો ભાવ મોકલો — {crop}',
    mr: 'प्रति-प्रस्ताव पाठवा — {crop}',
  },
  yourCounterPriceLabel: {
    en: 'Your Counter Price (₹/Qtl) *',
    hi: 'आपका नया भाव (₹/क्विंटल) *',
    gu: 'તમારો નવો ભાવ (₹/ક્વિન્ટલ) *',
    mr: 'आपला नवीन दर (₹/क्विंटल) *',
  },
  messageToFarmerOptional: {
    en: 'Message to Farmer (Optional)',
    hi: 'किसान को संदेश (वैकल्पिक)',
    gu: 'ખેડૂતને સંદેશ (વૈકલ્પિક)',
    mr: 'शेतकऱ्याला संदेश (पर्यायी)',
  },
  submitCounterBackBtn: {
    en: 'Submit Counter Offer',
    hi: 'नया प्रस्ताव जमा करें',
    gu: 'કાઉન્ટર ઓફર મોકલો',
    mr: 'प्रति-ऑफर सादर करा',
  },
  allMaharashtraDistricts: {
    en: 'All Districts',
    hi: 'सभी जिले',
    gu: 'બધા જિલ્લા',
    mr: 'सर्व जिल्हे',
  },
  escrowTrackingTitle: {
    en: 'Payment Escrow Tracking',
    hi: 'भुगतान एस्क्रो ट्रैकिंग',
    gu: 'પેમેન્ટ એસ્ક્રૉ ટ્રેકિંગ',
    mr: 'पेमेंट एस्क्रो ट्रॅकिंग',
  },
  guaranteedEscrowBadge: {
    en: '100% Guaranteed Escrow',
    hi: '१००% सुरक्षित एस्क्रो',
    gu: '૧૦૦% ગેરંટીડ એસ્ક્રૉ',
    mr: '१००% हमीचे एस्क्रो',
  },
  transparentEscrowTimeline: {
    en: 'Transparent Escrow Payment Timeline',
    hi: 'पारदर्शी एस्क्रो भुगतान समयरेखा',
    gu: 'પારદર્શક એસ્ક્રૉ ચુકવણી સમયરેખા',
    mr: 'पारदर्शक एस्क्रो पेमेंट वेळापत्रक',
  },
  step1AdvanceTitle: {
    en: 'Advance Escrow',
    hi: 'अग्रिम एस्क्रो',
    gu: 'એડવાન્સ એસ્ક્રૉ',
    mr: 'अ‍ॅडव्हान्स एस्क्रो',
  },
  step2DispatchTitle: {
    en: 'Weighment & Dispatch',
    hi: 'वजन एवं प्रेषण',
    gu: 'વજન અને રવાનગી',
    mr: 'वजन आणि पाठवणी',
  },
  step3QualityTitle: {
    en: 'Assay & Quality Check',
    hi: 'गुणवत्ता परीक्षण एवं जांच',
    gu: 'ગુણવત્તા અને ગુણવત્તા ચકાસણી',
    mr: 'गुणवत्ता चाचणी व तपासणी',
  },
  step4SettlementTitle: {
    en: 'Direct Bank Credit',
    hi: 'सीधे बैंक खाते में जमा',
    gu: 'સીધું બેંકમાં જમા',
    mr: 'थेट बँक खात्यात जमा',
  },
  gradeAVerified: {
    en: 'Grade A (Verified)',
    hi: 'ग्रेड ए (सत्यापित)',
    gu: 'ગ્રેડ A (વેરિફાઈડ)',
    mr: 'ग्रेड ए (प्रमाणित)',
  },
  proposedCounterLabel: {
    en: 'Proposed Counter: ₹{price}/Qtl',
    hi: 'प्रस्तावित प्रति-भाव: ₹{price}/क्विंटल',
    gu: 'સૂચવેલ કાઉન્ટર ભાવ: ₹{price}/ક્વિન્ટલ',
    mr: 'प्रस्तावित प्रति-दर: ₹{price}/क्विंटल',
  },
  modifyCounterAcceptBtn: {
    en: 'Modify Counter / Accept',
    hi: 'काउंटर संशोधित करें / स्वीकारें',
    gu: 'કાઉન્ટર સુધારો / સ્વીકારો',
    mr: 'प्रति-ऑफर बदला / स्वीकारा',
  },
  counterReasonPlaceholder: {
    en: 'Reason or note for buyer (e.g. Higher grade, pickup transport included)...',
    hi: 'खरीदार के लिए नोट या कारण (उदा. उच्च ग्रेड, पिकअप परिवहन शामिल)...',
    gu: 'ખરીદદાર માટે નોંધ કે કારણ (દા.ત. ઉચ્ચ ગુણવત્તા, પિકઅપ પરિવહન સામેલ)...',
    mr: 'खरेदीदारासाठी कारण किंवा टीप (उदा. उच्च दर्जा, शेतावरून वाहतूक समाविष्ट)...',
  },
  addNewCropBtn: {
    en: 'Add New Crop',
    hi: 'नई फसल जोड़ें',
    gu: 'નવો પાક ઉમેરો',
    mr: 'नवीन पीक जोडा',
  },
  registerCropNowBtn: {
    en: 'Register "{crop}" Now',
    hi: 'अब "{crop}" पंजीकृत करें',
    gu: 'હમણાં "{crop}" નોંધણી કરો',
    mr: 'आता "{crop}" नोंदणी करा',
  },
  cropNotFoundInDirectory: {
    en: '"{crop}" is not in the directory. Add this crop.',
    hi: '"{crop}" निर्देशिका में नहीं है। इस फसल को जोड़ें।',
    gu: '"{crop}" ડિરેક્ટરીમાં નથી. આ પાક ઉમેરો.',
    mr: '"{crop}" सूचीमध्ये नाही. हे पीक जोडा.',
  },
  draftSavedToast: {
    en: '✓ Draft Saved',
    hi: '✓ ड्राफ्ट सहेजा गया',
    gu: '✓ ડ્રાફ્ટ સાચવવામાં આવ્યો',
    mr: '✓ मसुदा जतन केला',
  },
  totalAvailableLotLabel: {
    en: 'Total available lot',
    hi: 'उपलब्ध कुल लॉट',
    gu: 'ઉપલબ્ધ કુલ લોટ',
    mr: 'उपलब्ध एकूण लॉट',
  },
  cultivarSubTypeLabel: {
    en: 'Cultivar / Sub-type',
    hi: 'किस्म / उप-प्रकार',
    gu: 'જાત / પેટા-પ્રકાર',
    mr: 'वाण / उप-प्रकार',
  },
  varietyPlaceholder: {
    en: 'e.g. JS-335, Phule Kalyani...',
    hi: 'उदा. जेएस-335, फुले कल्याणी...',
    gu: 'દા.ત. JS-335, ફૂલે કલ્યાણી...',
    mr: 'उदा. जेएस-३३५, फुले कल्याणी...',
  },
  unitTonne: {
    en: 'Tonne (MT)',
    hi: 'टन (मीट्रिक टन)',
    gu: 'ટન (MT)',
    mr: 'टन (मेट्रिक टन)',
  },
  unitQuintal: {
    en: 'Quintal (100 Kg)',
    hi: 'क्विंटल (100 किग्रा)',
    gu: 'ક્વિન્ટલ (૧૦૦ કિલો)',
    mr: 'ક્વિન્ટલ (૧૦૦ કિલો)',
    mr: 'क्विंटल (१०० किलो)',
  },
  unitKg: {
    en: 'Kg',
    hi: 'किग्रा',
    gu: 'કિલો',
    mr: 'किलो',
  },
  gujaratVerifiedBuyerPool: {
    en: 'Verified Buyer Pool',
    hi: 'सत्यापित खरीदार समूह',
    gu: 'વેરિફાઈડ ખરીદદાર સમૂહ',
    mr: 'प्रमाणित खरेदीदार समूह',
  },
  offeredRateLabel: {
    en: 'Offered Rate',
    hi: 'प्रस्तावित दर',
    gu: 'ઓફર કરેલ ભાવ',
    mr: 'प्रस्तावित दर',
  },
  escrowProtectedBadge: {
    en: 'Escrow Protected',
    hi: 'एस्क्रो सुरक्षित',
    gu: 'એસ્ક્રૉ સુરક્ષિત',
    mr: 'એસ્ક્રૉ સુરક્ષિત',
    mr: 'एस्क्रो सुरक्षित',
  },
  searchBuyerCropPlaceholder: {
    en: 'Search buyer, district, or crop...',
    hi: 'खरीदार, जिला या फसल खोजें...',
    gu: 'ખરીદદાર, જિલ્લો અથવા પાક શોધો...',
    mr: 'खरेदीदार, जिल्हा किंवा पीक शोधा...',
  },
  categoryAll: {
    en: 'All',
    hi: 'सभी',
    gu: 'બધા',
    mr: 'सर्व',
  },
  categoryCereals: {
    en: 'Cereals',
    hi: 'अनाज',
    gu: 'અનાજ',
    mr: 'तृणधान्ये',
  },
  categoryPulses: {
    en: 'Pulses',
    hi: 'दलहन',
    gu: 'કઠોળ',
    mr: 'कडधान्ये',
  },
  categoryOilseeds: {
    en: 'Oilseeds',
    hi: 'तिलहन',
    gu: 'તેલીબિયાં',
    mr: 'गळित धान्ये (गळिता)',
  },
  categorySpices: {
    en: 'Spices',
    hi: 'मसाले',
    gu: 'મસાલા',
    mr: 'मसाले',
  },
  categoryVegetables: {
    en: 'Vegetables',
    hi: 'सब्जियां',
    gu: 'શાકભાજી',
    mr: 'भाजीपाला',
  },
  categoryFruits: {
    en: 'Fruits',
    hi: 'फल',
    gu: 'ફળો',
    mr: 'फळे',
  },
  disputeWeighmentMismatch: {
    en: 'Weighment Mismatch',
    hi: 'वजन विसंगति',
    gu: 'તોલાઈ તફાવત',
    mr: 'वजन तफावत',
  },
  disputeQualityDispute: {
    en: 'Quality Grade Dispute',
    hi: 'गुणवत्ता ग्रेड विवाद',
    gu: 'ગુણવત્તા વિવાદ',
    mr: 'गुणवत्ता वाद',
  },
  disputePaymentDelay: {
    en: 'Payment Delay',
    hi: 'भुगतान में देरी',
    gu: 'ચુકવણીમાં વિલંબ',
    mr: 'पेमेंट उशीर',
  },
  disputeLogisticsDelay: {
    en: 'Logistics Delay',
    hi: 'परिवहन में देरी',
    gu: 'પરિવહનમાં વિલંબ',
    mr: 'वाहतूक उशीर',
  },
  disputeContractDefault: {
    en: 'Contract Default',
    hi: 'अनुबंध उल्लंघन',
    gu: 'કરાર ભંગ',
    mr: 'करार उल्लंघन',
  },
  activeFpoArbitrationTickets: {
    en: 'Active FPO Arbitration Tickets',
    hi: 'सक्रिय एफपीओ मध्यस्थता टिकट',
    gu: 'સક્રિય FPO લવાદ ટિકિટો',
    mr: 'सक्रिय एफपीओ लवाद तक्रारी',
  },
  fpoConciliationSla: {
    en: 'FPO Conciliation & Farmer Protection SLA',
    hi: 'एफपीओ सुलह एवं किसान संरक्षण एसएलए',
    gu: 'FPO સમાધાન અને ખેડૂત સુરક્ષા SLA',
    mr: 'एफपीओ समेट आणि शेतकरी संरक्षण हमी',
  },
  ratePerKgLabel: {
    en: 'Rate',
    hi: 'दर',
    gu: 'ભાવ',
    mr: 'दर',
  },
  beneficiaryLabel: {
    en: 'Beneficiary',
    hi: 'लाभार्थी',
    gu: 'લાભાર્થી',
    mr: 'लाभार्थी',
  },
  refNumberLabel: {
    en: 'Ref',
    hi: 'संदर्भ',
    gu: 'સંદર્ભ',
    mr: 'संदर्भ',
  }
};

function formatEntry(key, val) {
  const escaped = val.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
  return `    '${key}': '${escaped}',\n`;
}

['en', 'hi', 'gu', 'mr'].forEach((lang) => {
  let entries = '';
  for (const [key, obj] of Object.entries(newTranslations)) {
    entries += formatEntry(key, obj[lang]);
  }

  if (lang === 'en') {
    content = content.replace("    'pendingCropApproval': 'Pending crop approval',\n", "    'pendingCropApproval': 'Pending crop approval',\n" + entries);
  } else if (lang === 'hi') {
    content = content.replace("    'pendingCropApproval': 'फसल अनुमोदन लंबित',\n", "    'pendingCropApproval': 'फसल अनुमोदन लंबित',\n" + entries);
  } else if (lang === 'gu') {
    content = content.replace("    'pendingCropApproval': 'પાક મંજૂરી બાકી',\n", "    'pendingCropApproval': 'પાક મંજૂરી બાકી',\n" + entries);
  } else if (lang === 'mr') {
    content = content.replace("    'pendingCropApproval': 'पीक मंजुरी प्रलंबित',\n", "    'pendingCropApproval': 'पीक मंजुरी प्रलंबित',\n" + entries);
  }
});

fs.writeFileSync(filePath, content, 'utf8');
console.log('Successfully injected phase 2 translations into all 4 languages in src/i18n/translations.ts');
