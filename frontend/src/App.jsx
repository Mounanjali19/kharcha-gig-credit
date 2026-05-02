import { useEffect, useMemo, useRef, useState } from 'react'
import { motion } from 'framer-motion'

// ── PHONE → PERSONA MAP (Exact demo numbers) ──────────────
const PHONE_MAP = {
  '7777777777': 'suresh',
  '8888888888': 'ravi',
  '9999999999': 'meena',
}

// ── PERSONAS ──────────────────────────────────────────────
const personas = {
  suresh: {
    name: 'Suresh Babu', initial: 'S',
    sub: 'UrbanCo Plumber · Bengaluru · Member since Oct 2023',
    quote: '"Stable work, stable score. Kharcha finally reflects that."',
    score: 742, scoreThen: 698, improvement: 44,
    badge: '⬆ Very Good',
    badgeStyle: { background: 'rgba(34,197,94,0.2)', border: '1px solid rgba(34,197,94,0.4)', color: '#4ADE80' },
    factors: [
      { name: 'Income Consistency', value: 88, weight: 30 },
      { name: 'Earning Trend',       value: 79, weight: 25 },
      { name: 'Transaction Volume',  value: 74, weight: 25 },
      { name: 'Expense Control',     value: 82, weight: 20 },
    ],
    stats: [
      { value: '₹28,067', sub: '↑ 14% vs last month', tone: 'up' },
      { value: '61',       sub: '↑ High activity',     tone: 'up' },
      { value: 'UrbanCo',  sub: '77% of income',       tone: 'note' },
      { value: 'Very Low', sub: '↑ Strong signal',     tone: 'up' },
    ],
    loan: '₹50,000 – ₹1,00,000',
    loanDetail: 'Est. 12% interest · Microloan · 18–36 months',
    bars: [22000,24000,24500,25000,25500,28067],
    barMonths: ['Nov','Dec','Jan','Feb','Mar','Apr'],
    dataSub: '8 months · 427 transactions analyzed',
    journeyLabel: { en:'Suresh improved 44 points in 6 months', kn:'ಸುರೇಶ್ 6 ತಿಂಗಳಲ್ಲಿ 44 ಅಂಕ ಸುಧಾರಿಸಿದ್ದಾರೆ', hi:'सुरेश ने 6 महीने में 44 अंक सुधारे', ta:'சுரேஷ் 6 மாதங்களில் 44 புள்ளிகள் மேம்பட்டார்', te:'సురేష్ 6 నెలల్లో 44 పాయింట్లు మెరుగుపరచాడు' },
    tips: [
      { icon:'⭐', title:'Tier 1 eligible — act now',   body:"Your score qualifies for KreditBee's lowest interest rate. Apply this month before rates change.", bg:'#FEF3C7' },
      { icon:'📊', title:'Build an emergency buffer',   body:"You're strong — route ₹3,000/month to a liquid fund. This further improves Expense Control.", bg:'#DCFCE7' },
      { icon:'🤝', title:'Refer and earn credit bonus', body:"UrbanCo's partner program can add verified work certificates that strengthen your profile.", bg:'#FEE2E2' },
    ],
    welcome: {
      kn: 'ಸ್ವಾಗತ ಸುರೇಶ್! ಸ್ಕೋರ್ 742 — ತುಂಬಾ ಒಳ್ಳೆಯದು. ನೀವು ಟಾಪ್ 15% ನಲ್ಲಿದ್ದೀರಿ!',
      hi: 'स्वागत है सुरेश! स्कोर 742 — बहुत अच्छा। आप शीर्ष 15% में हैं!',
      ta: 'வரவேற்கிறோம் சுரேஷ்! ஸ்கோர் 742 — மிகவும் நல்லது.',
      te: 'స్వాగతం సురేష్! స్కోరు 742 — చాలా మంచిది. మీరు టాప్ 15%లో ఉన్నారు!',
      en: 'Welcome Suresh! Score 742 — Very Good. You are in the top 15%!',
    },
    context: 'Suresh Babu, Score 742/850, Income ₹28,067, Top payer UrbanCo, Loan ₹50,000–₹1,00,000.',
  },
  ravi: {
    name: 'Ravi Kumar', initial: 'R',
    sub: 'Swiggy Delivery · Bengaluru · Member since Jan 2023',
    quote: '"3 years delivering. Kharcha finally gave me a credit identity."',
    score: 684, scoreThen: 601, improvement: 83,
    badge: '↗ Good',
    badgeStyle: { background: 'rgba(251,191,36,0.2)', border: '1px solid rgba(251,191,36,0.4)', color: '#FBBF24' },
    factors: [
      { name: 'Income Consistency', value: 75, weight: 30 },
      { name: 'Earning Trend',       value: 71, weight: 25 },
      { name: 'Transaction Volume',  value: 80, weight: 25 },
      { name: 'Expense Control',     value: 68, weight: 20 },
    ],
    stats: [
      { value: '₹21,340', sub: '↑ 8% vs last month',    tone: 'up' },
      { value: '89',       sub: '↑ Very high activity',  tone: 'up' },
      { value: 'Swiggy',   sub: '91% of income',         tone: 'note' },
      { value: 'Moderate', sub: '↔ Improving',           tone: 'note' },
    ],
    loan: '₹25,000 – ₹50,000',
    loanDetail: 'Est. 14% interest · Microloan · 12–24 months',
    bars: [16000,17500,18000,19000,20000,21340],
    barMonths: ['Nov','Dec','Jan','Feb','Mar','Apr'],
    dataSub: '6 months · 312 transactions analyzed',
    journeyLabel: { en:'Ravi improved 83 points in 6 months', kn:'ರವಿ 6 ತಿಂಗಳಲ್ಲಿ 83 ಅಂಕ ಸುಧಾರಿಸಿದ್ದಾರೆ', hi:'रवि ने 6 महीने में 83 अंक सुधारे', ta:'ரவி 6 மாதங்களில் 83 புள்ளிகள் மேம்பட்டார்', te:'రవి 6 నెలల్లో 83 పాయింట్లు మెరుగుపరచాడు' },
    tips: [
      { icon:'📈', title:'Boost your score 30 points', body:'Maintain consistent daily earnings above ₹700. Weekday regularity matters more than weekend spikes.', bg:'#FEF3C7' },
      { icon:'🏦', title:'Open a savings sub-account',  body:'Route ₹2,000/month to a separate savings UPI. Expense control is your weakest factor.', bg:'#DCFCE7' },
      { icon:'🎯', title:'Diversify income sources',    body:'Add one more platform to raise your Transaction Volume score.', bg:'#FEE2E2' },
    ],
    welcome: {
      kn: 'ಸ್ವಾಗತ ರವಿ! ಸ್ಕೋರ್ 684. ನೀವು ಚೆನ್ನಾಗಿ ಬೆಳೆಯುತ್ತಿದ್ದೀರಿ!',
      hi: 'स्वागत है रवि! स्कोर 684। आप अच्छी प्रगति कर रहे हैं!',
      ta: 'வரவேற்கிறோம் ரவி! ஸ்கோர் 684. நீங்கள் நன்றாக முன்னேறுகிறீர்கள்!',
      te: 'స్వాగతం రవి! స్కోరు 684. మీరు బాగా అభివృద్ధి చెందుతున్నారు!',
      en: 'Welcome Ravi! Score 684. You are improving steadily!',
    },
    context: 'Ravi Kumar, Score 684/850, Income ₹21,340, Top payer Swiggy, Loan ₹25,000–₹50,000.',
  },
  meena: {
    name: 'Meena Devi', initial: 'M',
    sub: 'Ola Driver · Bengaluru · Member since Mar 2023',
    quote: '"Income goes up and down, but Kharcha understands my work."',
    score: 521, scoreThen: 498, improvement: 23,
    badge: '⚠ Fair',
    badgeStyle: { background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.35)', color: '#F87171' },
    factors: [
      { name: 'Income Consistency', value: 55, weight: 30 },
      { name: 'Earning Trend',       value: 48, weight: 25 },
      { name: 'Transaction Volume',  value: 62, weight: 25 },
      { name: 'Expense Control',     value: 51, weight: 20 },
    ],
    stats: [
      { value: '₹14,820', sub: '↓ 5% vs last month', tone: 'down' },
      { value: '43',       sub: '↔ Moderate',         tone: 'note' },
      { value: 'Ola',      sub: '68% of income',      tone: 'note' },
      { value: 'High',     sub: '⚠ Volatile income',  tone: 'down' },
    ],
    loan: '₹10,000 – ₹25,000',
    loanDetail: 'Est. 18% interest · Microloan · 6–12 months',
    bars: [12000,15000,11000,17000,13000,14820],
    barMonths: ['Nov','Dec','Jan','Feb','Mar','Apr'],
    dataSub: '5 months · 198 transactions analyzed',
    journeyLabel: { en:'Meena improved 23 points in 6 months', kn:'ಮೀನಾ 6 ತಿಂಗಳಲ್ಲಿ 23 ಅಂಕ ಸುಧಾರಿಸಿದ್ದಾರೆ', hi:'मीना ने 6 महीने में 23 अंक सुधारे', ta:'மீனா 6 மாதங்களில் 23 புள்ளிகள் மேம்பட்டார்', te:'మీనా 6 నెలల్లో 23 పాయింట్లు మెరుగుపరచింది' },
    tips: [
      { icon:'📅', title:'Work consistent hours',          body:'Income variance is hurting your score most. Aim for ₹600/day minimum.', bg:'#FEF3C7' },
      { icon:'🚗', title:'Register on one more platform',  body:'Rapido or Namma Yatri as backup reduces volatility.', bg:'#DCFCE7' },
      { icon:'💰', title:'Avoid large gap days',           body:'Three or more zero-income days in a month flags inconsistency.', bg:'#FEE2E2' },
    ],
    welcome: {
      kn: 'ಸ್ವಾಗತ ಮೀನಾ! ಸ್ಕೋರ್ 521. ಆದಾಯ ಸ್ಥಿರಗೊಳಿಸಿದರೆ ಸ್ಕೋರ್ ಹೆಚ್ಚಾಗುತ್ತದೆ.',
      hi: 'स्वागत मीना! स्कोर 521। आय को स्थिर करने से स्कोर बढ़ेगा।',
      ta: 'வரவேற்கிறோம் மீனா! ஸ்கோர் 521. வருமானம் நிலையானால் ஸ்கோர் உயரும்.',
      te: 'స్వాగతం మీనా! స్కోరు 521. స్థిరమైన ఆదాయంతో స్కోరు పెరుగుతుంది.',
      en: 'Welcome Meena! Score 521. Stabilising income will improve your score.',
    },
    context: 'Meena Devi, Score 521/850, Income ₹14,820, Top payer Ola, Loan ₹10,000–₹25,000.',
  },
}

// ── LANGUAGES (+ Telugu) ──────────────────────────────────
const LANGS = [
  { value: 'kn', label: 'ಕನ್ನಡ',   api: 'Kannada' },
  { value: 'hi', label: 'हिंदी',    api: 'Hindi' },
  { value: 'ta', label: 'தமிழ்',    api: 'Tamil' },
  { value: 'te', label: 'తెలుగు',   api: 'Telugu' },
  { value: 'en', label: 'English',  api: 'English' },
]

const NAV_TABS = [
  { key: 'score',   label: 'Credit Score' },
  { key: 'income',  label: 'My Income' },
  { key: 'loan',    label: 'Loan Chances' },
  { key: 'tips',    label: 'Smart Tips' },
  { key: 'journey', label: 'My Progress' },
  { key: 'chat',    label: 'AI Helper' },
]

// ── UI TRANSLATIONS (EN / KN / HI / TA / TE) ─────────────
const UI = {
  en: {
    score:'Credit Score', breakdown:'Score Breakdown', chart:'Monthly Income (₹)',
    tips:'AI Financial Tips', l1:'Avg Monthly Income', l2:'Transactions / Month',
    l3:'Top Payer', l4:'Income Variance', loan:'Loan Eligibility',
    journey:'Score Journey — 6 Months', ago:'6 Months Ago', today:'Today',
    chatTitle:'Kharcha Assistant', chatSub:'Financial advisor for gig workers',
    placeholder:'Ask about your score, loans, tips...', download:'📄 Download Report',
    whatsapp:'Share on WhatsApp', lender:'Lender Portal ↗', why:'Why this score? →',
    source:'📊 Source: UPI transaction history · No salary slip needed',
    signInTitle:'Welcome back', signInSub:'Sign in to view your Gig Credit Score',
    mobileLabel:'Mobile Number', mobilePlaceholder:'Enter your 10-digit number',
    pinLabel:'PIN / Password', pinPlaceholder:'Enter your 4-digit PIN',
    signInBtn:'Sign In Securely', signInFooter:"New here?", signInCreate:'Create account →',
    signInError:'Invalid demo login. Try 7777777777, 8888888888, or 9999999999.',
    loggedInAs:'Logged in as',
  },
  kn: {
    score:'ಕ್ರೆಡಿಟ್ ಸ್ಕೋರ್', breakdown:'ಸ್ಕೋರ್ ವಿಶ್ಲೇಷಣೆ', chart:'ಮಾಸಿಕ ಆದಾಯ (₹)',
    tips:'AI ಆರ್ಥಿಕ ಸಲಹೆ', l1:'ಸರಾಸರಿ ಮಾಸಿಕ ಆದಾಯ', l2:'ವ್ಯವಹಾರ / ತಿಂಗಳು',
    l3:'ಮುಖ್ಯ ಪಾವತಿದಾರ', l4:'ಆದಾಯ ವ್ಯತ್ಯಾಸ', loan:'ಸಾಲ ಅರ್ಹತೆ',
    journey:'ಸ್ಕೋರ್ ಪ್ರಯಾಣ — 6 ತಿಂಗಳು', ago:'6 ತಿಂಗಳ ಹಿಂದೆ', today:'ಇಂದು',
    chatTitle:'Kharcha ಸಹಾಯಕ', chatSub:'ಗಿಗ್ ಕಾರ್ಮಿಕರಿಗೆ ಆರ್ಥಿಕ ಸಲಹೆಗಾರ',
    placeholder:'ನಿಮ್ಮ ಸ್ಕೋರ್, ಸಾಲ, ಸಲಹೆ ಕೇಳಿ...', download:'📄 ವರದಿ ಡೌನ್‌ಲೋಡ್',
    whatsapp:'WhatsApp ನಲ್ಲಿ ಹಂಚಿ', lender:'ಸಾಲದಾತ ಪೋರ್ಟಲ್ ↗', why:'ಯಾಕೆ ಈ ಸ್ಕೋರ್? →',
    source:'📊 ಮೂಲ: UPI ವ್ಯವಹಾರ ಇತಿಹಾಸ · ಸಂಬಳ ಚೀಟಿ ಬೇಡ',
    signInTitle:'ಮರಳಿ ಸ್ವಾಗತ', signInSub:'ನಿಮ್ಮ ಗಿಗ್ ಕ್ರೆಡಿಟ್ ಸ್ಕೋರ್ ನೋಡಲು ಸೈನ್ ಇನ್ ಮಾಡಿ',
    mobileLabel:'ಮೊಬೈಲ್ ಸಂಖ್ಯೆ', mobilePlaceholder:'10 ಅಂಕಿಯ ಸಂಖ್ಯೆ ನಮೂದಿಸಿ',
    pinLabel:'PIN / ಪಾಸ್‌ವರ್ಡ್', pinPlaceholder:'4 ಅಂಕಿಯ PIN ನಮೂದಿಸಿ',
    signInBtn:'ಸುರಕ್ಷಿತವಾಗಿ ಸೈನ್ ಇನ್', signInFooter:'ಹೊಸಬರೇ?', signInCreate:'ಖಾತೆ ತೆರೆಯಿರಿ →',
    signInError:'ಅಮಾನ್ಯ ಡೆಮೊ ಲಾಗಿನ್. 7777777777, 8888888888, ಅಥವಾ 9999999999 ಬಳಸಿ.',
    loggedInAs:'ಲಾಗಿನ್ ಆಗಿದ್ದಾರೆ',
  },
  hi: {
    score:'क्रेडिट स्कोर', breakdown:'स्कोर विश्लेषण', chart:'मासिक आय (₹)',
    tips:'AI वित्तीय सलाह', l1:'औसत मासिक आय', l2:'लेनदेन / माह',
    l3:'मुख्य भुगतानकर्ता', l4:'आय भिन्नता', loan:'ऋण पात्रता',
    journey:'स्कोर यात्रा — 6 महीने', ago:'6 महीने पहले', today:'आज',
    chatTitle:'Kharcha सहायक', chatSub:'गिग वर्कर्स के लिए वित्तीय सलाहकार',
    placeholder:'स्कोर, लोन, सुझाव के बारे में पूछें...', download:'📄 रिपोर्ट डाउनलोड',
    whatsapp:'WhatsApp पर शेयर', lender:'ऋणदाता पोर्टल ↗', why:'यह स्कोर क्यों? →',
    source:'📊 स्रोत: UPI लेनदेन इतिहास · वेतन पर्ची की जरूरत नहीं',
    signInTitle:'वापस स्वागत है', signInSub:'अपना गिग क्रेडिट स्कोर देखने के लिए साइन इन करें',
    mobileLabel:'मोबाइल नंबर', mobilePlaceholder:'10 अंकों का नंबर दर्ज करें',
    pinLabel:'PIN / पासवर्ड', pinPlaceholder:'4 अंकों का PIN दर्ज करें',
    signInBtn:'सुरक्षित साइन इन', signInFooter:'नए हैं?', signInCreate:'खाता बनाएं →',
    signInError:'अमान्य डेमो लॉगिन। 7777777777, 8888888888, या 9999999999 आज़माएं।',
    loggedInAs:'लॉग इन हैं',
  },
  ta: {
    score:'கிரெடிட் ஸ்கோர்', breakdown:'மதிப்பெண் பகுப்பாய்வு', chart:'மாதாந்திர வருமானம் (₹)',
    tips:'AI நிதி ஆலோசனை', l1:'சராசரி மாத வருமானம்', l2:'பரிவர்த்தனை / மாதம்',
    l3:'முக்கிய செலுத்துபவர்', l4:'வருமான மாறுபாடு', loan:'கடன் தகுதி',
    journey:'மதிப்பெண் பயணம் — 6 மாதங்கள்', ago:'6 மாதங்களுக்கு முன்', today:'இன்று',
    chatTitle:'Kharcha உதவியாளர்', chatSub:'கிக் தொழிலாளர்களுக்கு நிதி ஆலோசகர்',
    placeholder:'உங்கள் ஸ்கோர், கடன், ஆலோசனை கேளுங்கள்...', download:'📄 அறிக்கை பதிவிறக்கம்',
    whatsapp:'WhatsApp இல் பகிர்', lender:'கடன் வழங்குநர் போர்டல் ↗', why:'இந்த ஸ்கோர் ஏன்? →',
    source:'📊 மூலம்: UPI பரிவர்த்தனை வரலாறு · சம்பள சீட்டு தேவையில்லை',
    signInTitle:'மீண்டும் வரவேற்கிறோம்', signInSub:'உங்கள் கிக் கிரெடிட் ஸ்கோரைப் பார்க்க உள்நுழையுங்கள்',
    mobileLabel:'மொபைல் எண்', mobilePlaceholder:'10 இலக்க எண்ணை உள்ளிடவும்',
    pinLabel:'PIN / கடவுச்சொல்', pinPlaceholder:'4 இலக்க PIN உள்ளிடவும்',
    signInBtn:'பாதுகாப்பாக உள்நுழை', signInFooter:'புதியவரா?', signInCreate:'கணக்கு உருவாக்கு →',
    signInError:'தவறான டெமோ உள்நுழைவு. 7777777777, 8888888888, அல்லது 9999999999 முயற்சிக்கவும்.',
    loggedInAs:'உள்நுழைந்துள்ளவர்',
  },
  te: {
    score:'క్రెడిట్ స్కోరు', breakdown:'స్కోరు విశ్లేషణ', chart:'నెలవారీ ఆదాయం (₹)',
    tips:'AI ఆర్థిక సలహాలు', l1:'సగటు నెలవారీ ఆదాయం', l2:'లావాదేవీలు / నెల',
    l3:'ముఖ్య చెల్లింపుదారు', l4:'ఆదాయ వ్యత్యాసం', loan:'రుణ అర్హత',
    journey:'స్కోరు ప్రయాణం — 6 నెలలు', ago:'6 నెలల క్రితం', today:'ఈరోజు',
    chatTitle:'Kharcha సహాయకుడు', chatSub:'గిగ్ కార్మికులకు ఆర్థిక సలహాదారు',
    placeholder:'మీ స్కోరు, రుణం, చిట్కాలు అడగండి...', download:'📄 నివేదిక డౌన్‌లోడ్',
    whatsapp:'WhatsApp లో పంచుకోండి', lender:'రుణదాత పోర్టల్ ↗', why:'ఈ స్కోరు ఎందుకు? →',
    source:'📊 మూలం: UPI లావాదేవీ చరిత్ర · జీతం స్లిప్ అవసరం లేదు',
    signInTitle:'తిరిగి స్వాగతం', signInSub:'మీ గిగ్ క్రెడిట్ స్కోరు చూడటానికి సైన్ ఇన్ చేయండి',
    mobileLabel:'మొబైల్ నంబర్', mobilePlaceholder:'10 అంకెల నంబర్ నమోదు చేయండి',
    pinLabel:'PIN / పాస్‌వర్డ్', pinPlaceholder:'4 అంకెల PIN నమోదు చేయండి',
    signInBtn:'సురక్షితంగా సైన్ ఇన్', signInFooter:'కొత్తవారా?', signInCreate:'ఖాతా తెరవండి →',
    signInError:'తప్పు డెమో లాగిన్. 7777777777, 8888888888, లేదా 9999999999 వాడండి.',
    loggedInAs:'లాగిన్ అయ్యారు',
  },
}

const CHAT_PROMPTS = {
  kn: 'ನೀವು ಕನ್ನಡದಲ್ಲಿ ಮಾತ್ರ ಉತ್ತರಿಸಿ. ನೀವು "Kharcha ಸಹಾಯಕ" — ಗಿಗ್ ಕಾರ್ಮಿಕರಿಗೆ ಆರ್ಥಿಕ ಸಲಹೆಗಾರ. ಸರಳ, ಸ್ನೇಹಪರ ಮತ್ತು ಸ್ಪಷ್ಟ ಉತ್ತರ ನೀಡಿ.',
  hi: 'आप केवल हिंदी में उत्तर दें। आप "Kharcha सहायक" हैं — गिग कर्मचारियों के लिए वित्तीय सलाहकार। सरल और मित्रवत उत्तर दें।',
  ta: 'நீங்கள் தமிழில் மட்டும் பதில் கூறுங்கள். நீங்கள் "Kharcha உதவியாளர்" — கிக் தொழிலாளர்களுக்கு நிதி ஆலோசகர்.',
  te: 'మీరు తెలుగులో మాత్రమే సమాధానం ఇవ్వండి. మీరు "Kharcha సహాయకుడు" — గిగ్ కార్మికులకు ఆర్థిక సలహాదారు.',
  en: 'You are "Kharcha Assistant" — a friendly financial advisor for gig workers in India. Give simple, warm, actionable advice.',
}

// ── SVG GAUGE ─────────────────────────────────────────────
function ScoreGauge({ score, animKey }) {
  const DASH = 226
  const pct = Math.max(0, Math.min(1, (score - 300) / 550))
  const offset = DASH - DASH * pct
  return (
    <svg className="gauge-svg" viewBox="0 0 180 100">
      <defs>
        <linearGradient id="gaugeGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#F97316"/>
          <stop offset="50%" stopColor="#FBBF24"/>
          <stop offset="100%" stopColor="#22C55E"/>
        </linearGradient>
      </defs>
      <path d="M 18 90 A 72 72 0 0 1 162 90" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="12" strokeLinecap="round"/>
      <motion.path
        key={animKey}
        d="M 18 90 A 72 72 0 0 1 162 90"
        fill="none" stroke="url(#gaugeGrad)" strokeWidth="12" strokeLinecap="round"
        strokeDasharray={DASH}
        initial={{ strokeDashoffset: DASH }}
        animate={{ strokeDashoffset: offset }}
        transition={{ duration: 1.4, ease: [0.4, 0, 0.2, 1] }}
      />
      <circle cx="18" cy="90" r="6" fill="#FBBF24" />
      <text x="18"  y="98" fill="rgba(255,255,255,0.4)" fontSize="10" fontFamily="Sora" textAnchor="middle">300</text>
      <text x="150" y="98" fill="rgba(255,255,255,0.4)" fontSize="10" fontFamily="Sora">850</text>
    </svg>
  )
}

// ── CLAUDE API ─────────────────────────────────────────────
async function askClaude(system, userMsg) {
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 300,
      system,
      messages: [{ role: 'user', content: userMsg }],
    }),
  })
  const data = await res.json()
  return data.content?.[0]?.text || 'Sorry, could not get a response.'
}

// ── APP ────────────────────────────────────────────────────
export default function App() {
  const [screen, setScreen]               = useState('hero')
  const [heroFading, setHeroFading]       = useState(false)
  const [activePersona, setActivePersona] = useState('suresh')
  const [loggedInPersona, setLoggedInPersona] = useState(null) // set on successful login
  const [lang, setLang]                   = useState('kn')
  const [activeSection, setActiveSection] = useState('score')
  const [chatInput, setChatInput]         = useState('')
  const [chatLog, setChatLog]             = useState([])
  const [chatLoading, setChatLoading]     = useState(false)
  const [whyLoading, setWhyLoading]       = useState(false)
  const [displayScore, setDisplayScore]   = useState(0)
  const [factorsReady, setFactorsReady]   = useState(false)
  const [barsReady, setBarsReady]         = useState(false)
  const [isSigningIn, setIsSigningIn]     = useState(false)
  const [phone, setPhone]                 = useState('')
  const [pin, setPin]                     = useState('')
  const [loginError, setLoginError]       = useState('')
  const [listening, setListening]         = useState(false)

  const chatEndRef  = useRef(null)
  const scoreAnimRef = useRef(null)
  const voiceRef    = useRef(null)

  const p = personas[activePersona]
  const L = UI[lang] || UI.en
  const langName = LANGS.find(l => l.value === lang)?.api || 'English'

  const barData = useMemo(() => {
    const max = Math.max(...p.bars)
    return p.bars.map((value, i) => ({
      value,
      label: p.barMonths[i],
      height: Math.round((value / max) * 140) + 20,
      fill: Math.round((value / max) * 100),
      isLatest: i === p.bars.length - 1,
    }))
  }, [p])

  // Auto fade hero → sign-in
  useEffect(() => {
    if (screen !== 'hero') return undefined
    const fadeTimer  = setTimeout(() => setHeroFading(true), 3500)
    const switchTimer = setTimeout(() => { setHeroFading(false); setScreen('signin') }, 4100)
    return () => { clearTimeout(fadeTimer); clearTimeout(switchTimer) }
  }, [screen])

  // Scroll to top on EVERY screen change (fires after React paints the new screen)
  useEffect(() => {
    setTimeout(() => {
      window.scrollTo(0, 0)
      document.documentElement.scrollTop = 0
      document.body.scrollTop = 0
    }, 50)
  }, [screen])

  // Reset chat greeting when persona or language changes
  useEffect(() => {
    setChatLog([{ role: 'bot', text: p.welcome[lang] || p.welcome.en }])
    setChatInput('')
  }, [activePersona, lang, p.welcome])

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [chatLog])

  // Animate score number
  useEffect(() => {
    if (screen !== 'dashboard') return undefined
    setDisplayScore(0)
    const start = performance.now()
    const duration = 1500
    const to = p.score
    const step = now => {
      const t = Math.min((now - start) / duration, 1)
      const ease = 1 - Math.pow(1 - t, 4)
      setDisplayScore(Math.round(to * ease))
      if (t < 1) scoreAnimRef.current = requestAnimationFrame(step)
    }
    cancelAnimationFrame(scoreAnimRef.current)
    scoreAnimRef.current = requestAnimationFrame(step)
    return () => cancelAnimationFrame(scoreAnimRef.current)
  }, [activePersona, p.score, screen])

  useEffect(() => {
    if (screen !== 'dashboard') return undefined
    setFactorsReady(false)
    setBarsReady(false)
    const t = setTimeout(() => { setFactorsReady(true); setBarsReady(true) }, 80)
    return () => clearTimeout(t)
  }, [activePersona, screen])

  const handleSectionSwitch = key => {
    setActiveSection(key)
    document.getElementById(`section-${key}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const handleSend = async () => {
    const msg = chatInput.trim()
    if (!msg || chatLoading) return
    setChatLog(prev => [...prev, { role: 'user', text: msg }])
    setChatInput('')
    setChatLoading(true)
    setChatLog(prev => [...prev, { role: 'bot', text: '...', loading: true }])
    try {
      const system = `${CHAT_PROMPTS[lang] || CHAT_PROMPTS.en} Worker context: ${p.context}`
      const reply = await askClaude(system, msg)
      setChatLog(prev => prev.map((m, i) => i === prev.length - 1 ? { role: 'bot', text: reply } : m))
    } catch {
      setChatLog(prev => prev.map((m, i) => i === prev.length - 1 ? { role: 'bot', text: 'Network error — please try again.', error: true } : m))
    }
    setChatLoading(false)
  }

  const handleWhyScore = async () => {
    if (whyLoading || chatLoading) return
    setWhyLoading(true)
    setChatLog(prev => [...prev,
      { role: 'user', text: L.why.replace(' →', '') },
      { role: 'bot', text: '...', loading: true },
    ])
    const sys = `Explain a gig worker's credit score simply and warmly. No jargon. Max 3 sentences. Reply ONLY in ${langName}.`
    const msg = `Name: ${p.name}. Score: ${p.score}/850. Factors: Income Consistency ${p.factors[0].value}% (30%), Earning Trend ${p.factors[1].value}% (25%), Transaction Volume ${p.factors[2].value}% (25%), Expense Control ${p.factors[3].value}% (20%). Explain simply.`
    try {
      const reply = await askClaude(sys, msg)
      setChatLog(prev => prev.map((m, i) => i === prev.length - 1 ? { role: 'bot', text: reply } : m))
    } catch {
      setChatLog(prev => prev.map((m, i) => i === prev.length - 1 ? { role: 'bot', text: 'Network error — please try again.', error: true } : m))
    }
    setWhyLoading(false)
  }

  // ── SIGN IN — phone-to-persona mapping ────────────────────
  const handleSignIn = () => {
    if (isSigningIn) return
    const mapped = PHONE_MAP[phone.trim()]
    if (!mapped) {
      setLoginError(L.signInError)
      return
    }
    setLoginError('')
    setIsSigningIn(true)
    setTimeout(() => {
      setIsSigningIn(false)
      setActivePersona(mapped)
      setLoggedInPersona(mapped)
      setActiveSection('score')
      setScreen('dashboard')
    }, 1400)
  }

  const handleSignOut = () => {
    setLoggedInPersona(null)
    setPhone('')
    setPin('')
    setLoginError('')
    setActiveSection('score')
    setScreen('signin')
  }

  const handleVoice = () => {
    if (listening && voiceRef.current) { voiceRef.current.stop(); setListening(false); return }
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SR) { window.alert('Voice input works in Chrome only.'); return }
    const rec = new SR()
    rec.lang = { kn:'kn-IN', hi:'hi-IN', ta:'ta-IN', te:'te-IN', en:'en-IN' }[lang] || 'en-IN'
    rec.onresult = e => { setChatInput(e.results[0][0].transcript); setListening(false) }
    rec.onerror  = () => setListening(false)
    rec.onend    = () => setListening(false)
    voiceRef.current = rec
    rec.start()
    setListening(true)
  }

  const handleWhatsApp = () => {
    const msg = encodeURIComponent(`Here is my Kharcha Financial Health Report — Score ${p.score}/850. I qualify for ${p.loan} microloan.`)
    window.open(`https://wa.me/?text=${msg}`, '_blank')
  }

  return (
    <div>
      <div className="glow-orb glow-orb-1" />
      <div className="glow-orb glow-orb-2" />
      <div className="glow-orb glow-orb-3" />

      {/* ── SCREEN 1: HERO ── */}
      <div className={`screen ${screen === 'hero' ? 'active' : ''} ${heroFading ? 'fade-out' : ''}`} id="screen-hero">
        {/* Animated gradient background */}
        <div style={{
          position:'fixed', inset:0, zIndex:0,
          background:'linear-gradient(135deg, #3EECFF 0%, #1CE1FF 25%, #87DFFE 50%, #65FE1E 80%, #580AFF 100%)',
          backgroundSize:'400% 400%',
          animation:'gradientShift 8s ease infinite',
        }} />
        {/* Frosted content layer */}
        <div className="hero-screen" style={{ position:'relative', zIndex:1 }}>

          {/* Floating blobs */}
          <div style={{ position:'absolute', top:'8%', left:'10%', width:220, height:220, borderRadius:'50%', background:'rgba(255,255,255,0.12)', filter:'blur(40px)', pointerEvents:'none' }} />
          <div style={{ position:'absolute', bottom:'12%', right:'8%', width:300, height:300, borderRadius:'50%', background:'rgba(101,254,30,0.15)', filter:'blur(60px)', pointerEvents:'none' }} />
          <div style={{ position:'absolute', top:'40%', right:'15%', width:160, height:160, borderRadius:'50%', background:'rgba(88,10,255,0.12)', filter:'blur(50px)', pointerEvents:'none' }} />

          {/* Logo */}
          <div style={{ marginBottom:'2rem', animation:'heroReveal 0.6s cubic-bezier(0.22,1,0.36,1) both' }}>
            <div style={{
              width:80, height:80, borderRadius:24,
              background:'rgba(255,255,255,0.25)',
              backdropFilter:'blur(16px)',
              border:'1.5px solid rgba(255,255,255,0.45)',
              display:'flex', alignItems:'center', justifyContent:'center',
              fontSize:36, fontWeight:800, color:'#fff',
              margin:'0 auto 1rem',
              boxShadow:'0 8px 32px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.4)',
            }}>K</div>
          </div>

          {/* Headline */}
          <div style={{ animation:'heroReveal 0.7s 0.1s cubic-bezier(0.22,1,0.36,1) both', marginBottom:'1.25rem' }}>
            <div style={{ fontSize:'clamp(32px,5vw,56px)', fontWeight:800, lineHeight:1.1, color:'#fff', textShadow:'0 2px 20px rgba(0,0,0,0.15)' }}>
              <div>8 crore gig workers.</div>
              <div style={{ color:'rgba(255,255,255,0.75)' }}>Zero credit products</div>
              <div style={{ color:'rgba(255,255,255,0.55)' }}>built for them.</div>
            </div>
          </div>

          {/* Subtext */}
          <p style={{
            fontSize:17, lineHeight:1.65, marginBottom:'2rem',
            maxWidth:420, textAlign:'center',
            color:'rgba(255,255,255,0.82)',
            animation:'heroReveal 0.8s 0.2s cubic-bezier(0.22,1,0.36,1) both',
          }}>
            Until now. <strong style={{ color:'#fff' }}>Kharcha</strong> turns your UPI history into a credit score lenders can trust.
          </p>

          {/* Trust badges */}
          <div style={{ display:'flex', gap:10, justifyContent:'center', flexWrap:'wrap', marginBottom:'2rem', animation:'heroReveal 0.8s 0.25s cubic-bezier(0.22,1,0.36,1) both' }}>
            {['🔒 Bank-grade security', '✅ RBI compliant', '⚡ 2-min setup'].map(badge => (
              <div key={badge} style={{
                padding:'6px 14px', borderRadius:99,
                background:'rgba(255,255,255,0.18)',
                backdropFilter:'blur(10px)',
                border:'1px solid rgba(255,255,255,0.3)',
                fontSize:12, color:'#fff', fontWeight:600,
              }}>{badge}</div>
            ))}
          </div>

          {/* Language picker */}
          <div style={{ display:'flex', gap:8, justifyContent:'center', flexWrap:'wrap', marginBottom:'2rem', animation:'heroReveal 0.8s 0.3s cubic-bezier(0.22,1,0.36,1) both' }}>
            {LANGS.map(l => (
              <button
                key={l.value}
                onClick={() => setLang(l.value)}
                style={{
                  padding:'6px 16px', borderRadius:99, border:'1.5px solid',
                  borderColor: lang === l.value ? '#fff' : 'rgba(255,255,255,0.35)',
                  background: lang === l.value ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.15)',
                  backdropFilter:'blur(8px)',
                  color: lang === l.value ? '#0F4C75' : '#fff',
                  fontFamily:'inherit', fontSize:13,
                  fontWeight: lang === l.value ? 700 : 500,
                  cursor:'pointer', transition:'all 0.18s',
                }}
              >{l.label}</button>
            ))}
          </div>

          {/* CTA */}
          <div style={{ animation:'heroReveal 0.8s 0.35s cubic-bezier(0.22,1,0.36,1) both' }}>
            <button
              onClick={() => { setHeroFading(false); setScreen('signin') }}
              style={{
                padding:'15px 44px', borderRadius:99, border:'none',
                background:'rgba(255,255,255,0.95)',
                color:'#0B3D6B', fontSize:16, fontWeight:800,
                fontFamily:'inherit', cursor:'pointer',
                boxShadow:'0 8px 32px rgba(0,0,0,0.18)',
                transition:'all 0.2s', letterSpacing:'0.01em',
              }}
              onMouseEnter={e => e.currentTarget.style.transform='translateY(-2px)'}
              onMouseLeave={e => e.currentTarget.style.transform='translateY(0)'}
            >
              Get Started →
            </button>
            <div style={{ marginTop:14, fontSize:12, color:'rgba(255,255,255,0.6)' }}>
              No documents needed · Free to use
            </div>
          </div>

        </div>
      </div>

      {/* ── SCREEN 2: SIGN IN ── */}
      <div className={`screen ${screen === 'signin' ? 'active' : ''}`} id="screen-signin">
        <div className="signin-wrap">
          <div className="signin-card">
            <div className="signin-logo">
              <div className="logo-dot">K</div>
              <span>Kharcha<span className="dot">.</span></span>
            </div>

            {/* Language switcher on sign-in */}
            <div style={{ display:'flex',justifyContent:'center',gap:6,marginBottom:'1.5rem',flexWrap:'wrap' }}>
              {LANGS.map(l => (
                <button
                  key={l.value}
                  onClick={() => setLang(l.value)}
                  style={{
                    padding:'5px 14px', borderRadius:99, border:'1.5px solid',
                    borderColor: lang === l.value ? 'var(--orange)' : 'rgba(249,115,22,0.25)',
                    background: lang === l.value ? 'linear-gradient(135deg,#FFF7ED,#FEF3C7)' : 'rgba(255,255,255,0.7)',
                    color: lang === l.value ? '#92400E' : 'var(--text2)',
                    fontFamily:'inherit', fontSize:13, fontWeight: lang === l.value ? 700 : 400,
                    cursor:'pointer', transition:'all 0.18s',
                  }}
                >
                  {l.label}
                </button>
              ))}
            </div>

            <div className="signin-tagline">
              <h1>{L.signInTitle}</h1>
              <p>{L.signInSub}</p>
            </div>

            <div className="trust-badges">
              <div className="trust-badge"><span className="icon">🔒</span> Bank-grade security</div>
              <div className="trust-badge"><span className="icon">✅</span> RBI compliant</div>
              <div className="trust-badge"><span className="icon">🛡️</span> Data protected</div>
            </div>

            <div className="field-group">
              <label>{L.mobileLabel}</label>
              <input
                type="tel"
                value={phone}
                onChange={e => { setPhone(e.target.value); setLoginError('') }}
                placeholder={L.mobilePlaceholder}
                maxLength={10}
                onKeyDown={e => e.key === 'Enter' && handleSignIn()}
              />
            </div>
            <div className="field-group">
              <label>{L.pinLabel}</label>
              <input
                type="password"
                value={pin}
                onChange={e => setPin(e.target.value)}
                placeholder={L.pinPlaceholder}
                onKeyDown={e => e.key === 'Enter' && handleSignIn()}
              />
            </div>

            {/* Error message */}
            {loginError && (
              <div style={{ background:'#FEF2F2',border:'1px solid #FECACA',borderRadius:10,padding:'10px 14px',marginBottom:'1rem',fontSize:13,color:'#991B1B',display:'flex',alignItems:'flex-start',gap:8 }}>
                <span>⚠️</span><span>{loginError}</span>
              </div>
            )}

            {/* Demo hint */}
            <div style={{ background:'var(--surface2)',border:'1px solid var(--border)',borderRadius:10,padding:'10px 14px',marginBottom:'1.25rem',fontSize:12,color:'var(--text2)' }}>
              <strong style={{ display:'block',marginBottom:4 }}>Demo numbers:</strong>
              <span style={{ fontFamily:'monospace' }}>7777777777</span> → Suresh &nbsp;·&nbsp;
              <span style={{ fontFamily:'monospace' }}>8888888888</span> → Ravi &nbsp;·&nbsp;
              <span style={{ fontFamily:'monospace' }}>9999999999</span> → Meena
            </div>

            <button className="btn-primary" onClick={handleSignIn} disabled={isSigningIn}>
              {isSigningIn ? <span className="spinner" /> : L.signInBtn}
            </button>

            <div className="security-note">
              <span>🔐</span>
              <span>Your UPI data never leaves your device. We only read, never store.</span>
            </div>
            <div className="signin-footer">
              {L.signInFooter} <a onClick={() => setScreen('dashboard')}>{L.signInCreate}</a>
            </div>
          </div>
        </div>
      </div>

      {/* ── SCREEN 3: DASHBOARD ── */}
      <div className={`screen ${screen === 'dashboard' ? 'active' : ''}`} id="screen-dashboard">
        <div className="navbar-wrap">
          <div className="nav-hero-title">
            <span className="brand-text">K<span className="brand-accent">H</span>ARCHA</span>
          </div>
          <nav className="navbar">
            <div className="nav-logo">
              <div className="logo-dot">K</div>
              Kharcha<span className="dot">.</span>
            </div>
            <div className="nav-spacer" />
            <div className="nav-tabs" id="nav-tabs">
              {NAV_TABS.map(tab => (
                <button
                  key={tab.key}
                  className={`nav-tab ${activeSection === tab.key ? 'active' : ''}`}
                  onClick={() => handleSectionSwitch(tab.key)}
                >
                  {tab.label}
                </button>
              ))}
            </div>
            <div className="nav-right">
              <select className="lang-select" value={lang} onChange={e => setLang(e.target.value)}>
                {LANGS.map(l => <option key={l.value} value={l.value}>{l.label}</option>)}
              </select>
              <div className="user-avatar" title="Sign out" onClick={handleSignOut}>{p.initial}</div>
            </div>
          </nav>

          {/* ── Logged-in strip (replaces persona row after login) ── */}
          {loggedInPersona ? (
            <div className="loggedin-strip">
              <span className="loggedin-dot">{p.initial}</span>
              <span className="loggedin-text">
                {L.loggedInAs} <strong>{p.name}</strong>
              </span>
              <button
                className="loggedin-signout"
                onClick={handleSignOut}
                style={{ background:'#FEF2F2', border:'1px solid #FECACA', color:'#DC2626', fontWeight:600 }}
              >
                🚪 Sign Out
              </button>
            </div>
          ) : (
            /* Persona row shown only before login (e.g. if user skipped sign-in) */
            <div className="persona-row">
              <span className="persona-label">Demo</span>
              {Object.keys(personas).map(key => (
                <button
                  key={key}
                  className={`persona-btn ${activePersona === key ? 'active' : ''}`}
                  onClick={() => setActivePersona(key)}
                >
                  👤 {key === 'ravi' ? 'Ravi · Swiggy' : key === 'meena' ? 'Meena · Ola' : 'Suresh · UrbanCo'}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="dashboard">
          <div className="worker-header">
            <div className="worker-avatar">{p.initial}</div>
            <div className="worker-info">
              <h2>{p.name}</h2>
              <p>{p.sub}</p>
            </div>
            <div className="worker-quote">{p.quote}</div>
          </div>

          {/* SCORE + FACTORS */}
          <div className="main-grid" id="section-score">
            <div className="score-card">
              <div className="score-card-label">{L.score}</div>
              <ScoreGauge score={p.score} animKey={activePersona} />
              <div className="score-number">
                <span className="big">{displayScore}</span><span className="of">/850</span>
              </div>
              <div className="score-badge" style={p.badgeStyle}>{p.badge}</div>
              <button className="why-score-btn" onClick={handleWhyScore} disabled={whyLoading}>
                {whyLoading ? '...' : L.why}
              </button>
            </div>

            <div className="factors-card">
              <div className="card-title">{L.breakdown}</div>
              {p.factors.map(factor => (
                <div className="factor-row" key={factor.name}>
                  <div className="factor-top">
                    <span className="factor-name">{factor.name}</span>
                    <div className="factor-meta">
                      <span className="factor-pct">{factor.value}%</span>
                      <span className="factor-weight">{factor.weight}%</span>
                    </div>
                  </div>
                  <div className="factor-bar">
                    <div className="factor-fill" style={{ width: factorsReady ? `${factor.value}%` : '0%' }} />
                  </div>
                </div>
              ))}
              <div className="factors-footer">
                <span>{L.source}</span>
                <span>{p.dataSub}</span>
              </div>
            </div>
          </div>

          {/* STATS */}
          <div className="stat-grid" id="section-income">
            {p.stats.map((stat, i) => (
              <div className="stat-card" key={`${stat.value}-${i}`}>
                <div className="stat-label">{[L.l1, L.l2, L.l3, L.l4][i]}</div>
                <div className="stat-value" style={{ fontSize: i === 2 || i === 3 ? 18 : 22 }}>{stat.value}</div>
                <div className={`stat-sub ${stat.tone}`}>{stat.sub}</div>
              </div>
            ))}
          </div>

          {/* LOAN */}
          <div className="loan-card" id="section-loan">
            <div>
              <div className="loan-label">{L.loan}</div>
              <div className="loan-amount">{p.loan}</div>
              <div className="loan-detail">{p.loanDetail}</div>
            </div>
            <div className="lender-chips">
              <div className="lender-chip">KreditBee</div>
              <div className="lender-chip">PaySense</div>
            </div>
          </div>

          {/* CHART + TIPS */}
          <div className="bottom-grid" id="section-tips">
            <div className="chart-card">
              <div className="card-title">{L.chart}</div>
              <div className="bar-chart">
                {barData.map(bar => (
                  <div className="bar-col" key={bar.label}>
                    <div className={`bar ${bar.isLatest ? 'active' : ''}`} style={{ height: barsReady ? `${bar.height}px` : '0px' }}>
                      <div className="bar-fill" style={{ height: barsReady ? `${bar.fill}%` : '0%' }} />
                    </div>
                    <div className="bar-label">{bar.label}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="tips-card">
              <div className="card-title">{L.tips}</div>
              <div id="tips-list">
                {p.tips.map(tip => (
                  <div className="tip-item" key={tip.title}>
                    <div className="tip-icon" style={{ background: tip.bg }}>{tip.icon}</div>
                    <div>
                      <div className="tip-title">{tip.title}</div>
                      <div className="tip-body">{tip.body}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* JOURNEY */}
          <div className="journey-card" id="section-journey">
            <div className="card-title">{L.journey}</div>
            <div className="journey-scores">
              <div className="journey-score-box then">
                <div className="journey-score-label">{L.ago}</div>
                <div className="journey-score-num then-num">{p.scoreThen}</div>
              </div>
              <div className="journey-arrow">→</div>
              <div className="journey-score-box now">
                <div className="journey-score-label">{L.today}</div>
                <div className="journey-score-num now-num">{p.score}</div>
              </div>
            </div>
            <div className="journey-pill">↑ {p.journeyLabel[lang] || p.journeyLabel.en}</div>
          </div>

          {/* CHAT */}
          <div className="chat-card" id="section-chat">
            <div className="chat-header">
              <div className="chat-agent-info">
                <div className="chat-agent-avatar">💬</div>
                <div>
                  <div className="chat-agent-name">{L.chatTitle}</div>
                  <div className="chat-agent-sub">{L.chatSub}</div>
                </div>
              </div>
              <select className="chat-lang" value={lang} onChange={e => setLang(e.target.value)}>
                {LANGS.map(l => <option key={l.value} value={l.value}>{l.label}</option>)}
              </select>
            </div>
            <div className="chat-messages">
              {chatLog.map((msg, i) => (
                <div key={`${msg.text}-${i}`} className={msg.error ? 'msg-error' : msg.role === 'user' ? 'msg-user' : 'msg-bot'}>
                  {msg.text}
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>
            <div className="chat-input-row">
              <button className={`voice-btn ${listening ? 'listening' : ''}`} onClick={handleVoice} title="Voice input">🎤</button>
              <input
                className="chat-input"
                value={chatInput}
                onChange={e => setChatInput(e.target.value)}
                placeholder={L.placeholder}
                onKeyDown={e => e.key === 'Enter' && handleSend()}
              />
              <button className="chat-send" onClick={handleSend} disabled={chatLoading}>
                <svg viewBox="0 0 24 24"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
              </button>
            </div>
          </div>

          {/* ACTIONS */}
          <div className="action-bar">
            <button className="action-btn primary"   onClick={() => window.alert('PDF report — wire to jsPDF + Claude API.')}>{L.download}</button>
            <button className="action-btn whatsapp"  onClick={handleWhatsApp}>{L.whatsapp}</button>
            <button className="action-btn lender"    onClick={() => window.alert('Lender portal — /lender route.')}>{L.lender}</button>
          </div>
        </div>
      </div>
    </div>
  )
}
// NOTE FOR TEAMMATE: Add this block to the bottom of App.css
/*
.loggedin-strip {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 1.5rem;
  background: rgba(255,255,255,0.75);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid rgba(249,115,22,0.15);
  font-size: 13px;
  color: var(--text2);
  pointer-events: all;
}
.loggedin-dot {
  width: 26px; height: 26px; border-radius: 50%;
  background: linear-gradient(135deg,#F97316,#FBBF24);
  display: flex; align-items: center; justify-content: center;
  color: #fff; font-size: 12px; font-weight: 700;
  flex-shrink: 0;
}
.loggedin-text { flex: 1; }
.loggedin-text strong { color: var(--text1); font-weight: 700; }
.loggedin-signout {
  background: transparent;
  border: 1px solid rgba(249,115,22,0.25);
  color: var(--text2); font-family: inherit; font-size: 12px;
  padding: 4px 12px; border-radius: 99px; cursor: pointer;
  transition: all 0.18s;
}
.loggedin-signout:hover { background: var(--surface2); border-color: var(--orange); color: var(--orange); }
*/