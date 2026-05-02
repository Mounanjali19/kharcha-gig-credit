import { useEffect, useMemo, useRef, useState } from 'react'
import { motion } from 'framer-motion'
<<<<<<< HEAD
import {
  Bar, BarChart, CartesianGrid, Cell,
  ResponsiveContainer, Tooltip, XAxis, YAxis,
} from 'recharts'
import { auth, googleProvider } from './firebase'
import { signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth'

// ── PERSONA BASE DATA (static display info only, scores come from API) ────────
const personaBase = {
  ravi: {
    name: 'Ravi Kumar', initial: 'R', csvFile: 'ravi.csv',
    sub: 'Swiggy Delivery Partner · Bengaluru · Member since Jan 2024',
    quote: '"Banks kept saying no. Kharcha showed them who I really am."',
    platform: 'Swiggy', topPayer: 'Swiggy',
    tips: [
      { icon: '📈', title: 'Boost your score 30 points',  body: 'Maintain consistent daily earnings above ₹700. Weekday regularity matters more than weekend spikes.' },
      { icon: '🏦', title: 'Open a savings sub-account',  body: 'Route ₹2,000/month to a separate savings UPI. Expense control is your weakest factor.' },
      { icon: '🎯', title: 'Diversify income sources',    body: 'Adding one more platform (Zomato, Porter) raises your Transaction Volume score significantly.' },
    ],
  },
  meena: {
    name: 'Meena Devi', initial: 'M', csvFile: 'meena.csv',
    sub: 'Ola Cab Driver · Bengaluru · Member since Mar 2024',
    quote: '"My income swings a lot. Kharcha explains exactly why that hurts my score."',
    platform: 'Ola', topPayer: 'Ola',
    tips: [
      { icon: '📅', title: 'Work consistent hours',          body: 'Income variance is hurting your score most. Aim for ₹600/day minimum, even on slow days.' },
      { icon: '🚗', title: 'Register on one more platform',  body: 'Rapido or Namma Yatri as backup reduces your income volatility score significantly.' },
      { icon: '💰', title: 'Avoid large gap days',           body: 'Three or more zero-income days in a month flags as inconsistency. Plan ahead for maintenance days.' },
    ],
  },
=======

// ── PHONE → PERSONA MAP (Exact demo numbers) ──────────────
const PHONE_MAP = {
  '7777777777': 'suresh',
  '8888888888': 'ravi',
  '9999999999': 'meena',
}

// ── PERSONAS ──────────────────────────────────────────────
const personas = {
>>>>>>> 15f3ade9e2046cf646d9396209f0c7587aa68134
  suresh: {
    name: 'Suresh Babu', initial: 'S', csvFile: 'suresh.csv',
    sub: 'UrbanCo Plumber · Bengaluru · Member since Oct 2023',
    quote: '"Stable work, stable score. Kharcha finally reflects that."',
<<<<<<< HEAD
    platform: 'UrbanCo', topPayer: 'UrbanCo',
    tips: [
      { icon: '⭐', title: 'Tier 1 eligible — act now',   body: "Your score qualifies for KreditBee's lowest interest rate. Apply this month before rates change." },
      { icon: '📊', title: 'Build an emergency buffer',   body: "You're strong — route ₹3,000/month to a liquid fund. This further improves Expense Control." },
      { icon: '🤝', title: 'Refer and earn credit bonus', body: "UrbanCo's partner program can add verified work certificates that strengthen your profile." },
    ],
  },
}

// ── LANGUAGES ─────────────────────────────────────────────────────────────────
=======
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
>>>>>>> 15f3ade9e2046cf646d9396209f0c7587aa68134
const LANGS = [
  { value: 'kn', label: 'ಕನ್ನಡ',   api: 'Kannada' },
  { value: 'hi', label: 'हिंदी',    api: 'Hindi' },
  { value: 'ta', label: 'தமிழ்',    api: 'Tamil' },
  { value: 'te', label: 'తెలుగు',   api: 'Telugu' },
  { value: 'en', label: 'English',  api: 'English' },
]

<<<<<<< HEAD
const UI = {
  en: {
    score: 'Kharcha Credit Score', breakdown: 'Score Breakdown', chart: 'Monthly Income (₹)',
    tips: 'AI Financial Tips', l1: 'Avg Monthly Income', l2: 'Transactions / Month',
    l3: 'Top Payer', l4: 'Income Variance', loan: 'Loan Eligibility Estimate',
    journey: 'Score Journey — 6 Months', ago: '6 Months Ago', today: 'Today',
    chatTitle: 'Kharcha Assistant', chatSub: 'Financial advisor for gig workers · Responds in your language',
    placeholder: 'Ask about your score, loans, tips...', download: '📄 Download Report',
    whatsapp: 'Share on WhatsApp', lender: 'Lender Portal ↗', why: 'Why this score? ↗',
    source: 'Data source: UPI transaction history · No salary slip needed',
    loading: 'Analysing transactions...', login: 'Login with Google', logout: 'Logout',
  },
  kn: {
    score: 'ಕ್ರೆಡಿಟ್ ಸ್ಕೋರ್', breakdown: 'ಸ್ಕೋರ್ ವಿಶ್ಲೇಷಣೆ', chart: 'ಮಾಸಿಕ ಆದಾಯ (₹)',
    tips: 'AI ಆರ್ಥಿಕ ಸಲಹೆ', l1: 'ಸರಾಸರಿ ಮಾಸಿಕ ಆದಾಯ', l2: 'ವ್ಯವಹಾರ / ತಿಂಗಳು',
    l3: 'ಮುಖ್ಯ ಪಾವತಿದಾರ', l4: 'ಆದಾಯ ವ್ಯತ್ಯಾಸ', loan: 'ಸಾಲ ಅರ್ಹತೆ',
    journey: 'ಸ್ಕೋರ್ ಪ್ರಯಾಣ — 6 ತಿಂಗಳು', ago: '6 ತಿಂಗಳ ಹಿಂದೆ', today: 'ಇಂದು',
    chatTitle: 'Kharcha ಸಹಾಯಕ', chatSub: 'ಗಿಗ್ ಕಾರ್ಮಿಕರಿಗೆ ಆರ್ಥಿಕ ಸಲಹೆಗಾರ',
    placeholder: 'ನಿಮ್ಮ ಸ್ಕೋರ್, ಸಾಲ, ಸಲಹೆ ಕೇಳಿ...', download: '📄 ವರದಿ ಡೌನ್ಲೋಡ್',
    whatsapp: 'WhatsApp ನಲ್ಲಿ ಹಂಚಿ', lender: 'ಸಾಲದಾತ ಪೋರ್ಟಲ್ ↗', why: 'ಯಾಕೆ ಈ ಸ್ಕೋರ್? ↗',
    source: 'ಮೂಲ: UPI ವ್ಯವಹಾರ ಇತಿಹಾಸ · ಸಂಬಳ ಚೀಟಿ ಬೇಡ',
    loading: 'ವ್ಯವಹಾರಗಳನ್ನು ವಿಶ್ಲೇಷಿಸಲಾಗುತ್ತಿದೆ...', login: 'Google ನಿಂದ ಲಾಗಿನ್', logout: 'ಲಾಗ್‌ಔಟ್',
  },
  hi: {
    score: 'क्रेडिट स्कोर', breakdown: 'स्कोर विश्लेषण', chart: 'मासिक आय (₹)',
    tips: 'AI वित्तीय सलाह', l1: 'औसत मासिक आय', l2: 'लेनदेन / माह',
    l3: 'मुख्य भुगतानकर्ता', l4: 'आय भिन्नता', loan: 'ऋण पात्रता',
    journey: 'स्कोर यात्रा — 6 महीने', ago: '6 महीने पहले', today: 'आज',
    chatTitle: 'Kharcha सहायक', chatSub: 'गिग वर्कर्स के लिए वित्तीय सलाहकार',
    placeholder: 'स्कोर, लोन, सुझाव के बारे में पूछें...', download: '📄 रिपोर्ट डाउनलोड',
    whatsapp: 'WhatsApp पर शेयर', lender: 'ऋणदाता पोर्टल ↗', why: 'यह स्कोर क्यों? ↗',
    source: 'स्रोत: UPI लेनदेन इतिहास · वेतन पर्ची की जरूरत नहीं',
    loading: 'लेनदेन का विश्लेषण हो रहा है...', login: 'Google से लॉगिन', logout: 'लॉगआउट',
  },
  ta: {
    score: 'கிரெடிட் ஸ்கோர்', breakdown: 'மதிப்பெண் பகுப்பாய்வு', chart: 'மாதாந்திர வருமானம் (₹)',
    tips: 'AI நிதி ஆலோசனை', l1: 'சராசரி மாத வருமானம்', l2: 'பரிவர்த்தனை / மாதம்',
    l3: 'முக்கிய செலுத்துபவர்', l4: 'வருமான மாறுபாடு', loan: 'கடன் தகுதி',
    journey: 'மதிப்பெண் பயணம் — 6 மாதங்கள்', ago: '6 மாதங்களுக்கு முன்', today: 'இன்று',
    chatTitle: 'Kharcha உதவியாளர்', chatSub: 'கிக் தொழிலாளர்களுக்கு நிதி ஆலோசகர்',
    placeholder: 'உங்கள் ஸ்கோர், கடன், ஆலோசனை கேளுங்கள்...', download: '📄 அறிக்கை பதிவிறக்கம்',
    whatsapp: 'WhatsApp இல் பகிர்', lender: 'கடன் வழங்குநர் போர்டல் ↗', why: 'இந்த ஸ்கோர் ஏன்? ↗',
    source: 'மூலம்: UPI பரிவர்த்தனை வரலாறு · சம்பள சீட்டு தேவையில்லை',
    loading: 'பரிவர்த்தனைகளை பகுப்பாய்கிறது...', login: 'Google மூலம் உள்நுழை', logout: 'வெளியேறு',
  },
}

const GREETINGS = {
  en: {
    ravi:   "Hi Ravi! Analysing your transactions now — your score will appear shortly.",
    meena:  "Namaste Meena! Loading your transaction history — score coming up.",
    suresh: "Welcome Suresh! Fetching your data — score will be ready in a moment.",
  },
  kn: {
    ravi:   "ನಮಸ್ಕಾರ ರವಿ! ನಿಮ್ಮ ವ್ಯವಹಾರಗಳನ್ನು ವಿಶ್ಲೇಷಿಸಲಾಗುತ್ತಿದೆ — ಸ್ಕೋರ್ ಶೀಘ್ರದಲ್ಲಿ ಗೋಚರಿಸುತ್ತದೆ.",
    meena:  "ನಮಸ್ಕಾರ ಮೀನಾ! ನಿಮ್ಮ ಡೇಟಾ ಲೋಡ್ ಆಗುತ್ತಿದೆ — ಸ್ಕೋರ್ ಬರುತ್ತಿದೆ.",
    suresh: "ಸ್ವಾಗತ ಸುರೇಶ್! ನಿಮ್ಮ ಮಾಹಿತಿ ತರಲಾಗುತ್ತಿದೆ — ಸ್ಕೋರ್ ಶೀಘ್ರದಲ್ಲಿ ಸಿಗುತ್ತದೆ.",
  },
  hi: {
    ravi:   "नमस्ते रवि! लेनदेन विश्लेषण हो रहा है — स्कोर जल्द आएगा।",
    meena:  "नमस्ते मीना! डेटा लोड हो रहा है — स्कोर आ रहा है।",
    suresh: "स्वागत सुरेश! डेटा फेच हो रहा है — स्कोर जल्द तैयार होगा।",
  },
  ta: {
    ravi:   "வணக்கம் ரவி! பரிவர்த்தனைகளை பகுப்பாய்கிறோம் — ஸ்கோர் விரைவில் வரும்.",
    meena:  "வணக்கம் மீனா! தரவு ஏற்றப்படுகிறது — ஸ்கோர் வருகிறது.",
    suresh: "வரவேற்கிறோம் சுரேஷ்! தகவல் கொண்டு வரப்படுகிறது — ஸ்கோர் விரைவில் தயாராகும்.",
  },
}

const deltaTone = { up: '#16A34A', down: '#DC2626', neutral: 'rgba(26,20,16,0.5)' }

function formatRupee(v) { return '₹' + v.toLocaleString('en-IN') }

// ── SCORE GAUGE ───────────────────────────────────────────────────────────────
function ScoreGauge({ score, color, animKey }) {
  const DASH = 195
  const offset = DASH - ((score - 300) / 550) * DASH
  return (
    <svg width="160" height="90" viewBox="0 0 160 90" style={{ display: 'block', margin: '0 auto' }}>
      <path d="M18,78 A62,62,0,0,1,142,78" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="9" strokeLinecap="round" />
=======
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
>>>>>>> 15f3ade9e2046cf646d9396209f0c7587aa68134
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

<<<<<<< HEAD
// ── CHAT API ──────────────────────────────────────────────────────────────────
async function askClaude(userMsg, language, workerContext, history = []) {
  const res = await fetch('http://localhost:5000/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message: userMsg, language, workerContext, history }),
=======
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
>>>>>>> 15f3ade9e2046cf646d9396209f0c7587aa68134
  })
  const data = await res.json()
  return data.content?.[0]?.text || 'Sorry, could not get a response.'
}

// ── TIER HELPERS ──────────────────────────────────────────────────────────────
function getTierMeta(tier = '') {
  const t = tier.toLowerCase()
  if (t.includes('excellent') || t.includes('very good')) return { color: '#16A34A', bg: 'rgba(22,163,74,0.15)', border: 'rgba(22,163,74,0.3)' }
  if (t.includes('good'))  return { color: '#F97316', bg: 'rgba(249,115,22,0.15)', border: 'rgba(249,115,22,0.3)' }
  if (t.includes('fair'))  return { color: '#D97706', bg: 'rgba(217,119,6,0.15)',  border: 'rgba(217,119,6,0.3)' }
  return { color: '#DC2626', bg: 'rgba(220,38,38,0.15)', border: 'rgba(220,38,38,0.3)' }
}

function getLoanDisplay(loanEligibility = {}) {
  return {
    range:   loanEligibility.range   || 'Not eligible yet',
    rate:    loanEligibility.rate    || '—',
    type:    loanEligibility.type    || '—',
    tenure:  loanEligibility.tenure  || '—',
    lenders: loanEligibility.lenders || [],
  }
}

// ── APP ────────────────────────────────────────────────────────────────────────
export default function App() {
<<<<<<< HEAD
  const [activePersona, setActivePersona] = useState('ravi')
  const [lang,          setLang]          = useState('en')
  const [chatInput,     setChatInput]     = useState('')
  const [chatLog,       setChatLog]       = useState([])
  const [chatLoading,   setChatLoading]   = useState(false)
  const [whyLoading,    setWhyLoading]    = useState(false)
  const [listening,     setListening]     = useState(false)
  const [user,          setUser]          = useState(null)

  // ── API data state ──
  const [scoreData,   setScoreData]   = useState(null)   // from /api/score
  const [parsedData,  setParsedData]  = useState(null)   // from /api/parse
  const [apiLoading,  setApiLoading]  = useState(false)
  const [apiError,    setApiError]    = useState(null)

  const chatEndRef = useRef(null)

  const base      = personaBase[activePersona]
  const L         = UI[lang]
  const langName  = LANGS.find(l => l.value === lang)?.api || 'English'
  const firstName = base.name.split(' ')[0]

  // Derived display values — fall back to placeholder while loading
  const score       = scoreData?.finalScore  ?? '—'
  const tier        = scoreData?.tier        ?? '—'
  const beforeScore = scoreData?.beforeScore ?? '—'
  const beforeDelta = (scoreData && scoreData.finalScore && scoreData.beforeScore)
    ? scoreData.finalScore - scoreData.beforeScore : 0
  const tierMeta    = getTierMeta(tier)
  const loan        = getLoanDisplay(scoreData?.loanEligibility)
  const factors     = scoreData?.breakdown ?? [
    { label: 'Income Consistency', value: 0, weight: 30 },
    { label: 'Earning Trend',       value: 0, weight: 25 },
    { label: 'Transaction Volume',  value: 0, weight: 25 },
    { label: 'Expense Control',     value: 0, weight: 20 },
  ]

  // Monthly chart data from parsedData
  const months  = parsedData?.months  ?? ['Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr']
  const incomes = parsedData?.incomes ?? [0, 0, 0, 0, 0, 0]

  const avgIncome       = parsedData?.avgMonthlyIncome   ?? null
  const txPerMonth      = parsedData?.avgTransactionsPerMonth ?? null
  const incomeVariance  = parsedData?.incomeVariance     ?? null

  const stats = [
    {
      label: L.l1, tone: 'up',
      value: avgIncome ? `₹${Number(avgIncome).toLocaleString('en-IN')}` : '—',
      delta: avgIncome ? '↑ From transaction analysis' : 'Loading...',
    },
    {
      label: L.l2, tone: 'up',
      value: txPerMonth ? String(Math.round(txPerMonth)) : '—',
      delta: txPerMonth ? '↑ Consistent activity' : 'Loading...',
    },
    {
      label: L.l3, tone: 'neutral',
      value: base.topPayer,
      delta: 'Primary income source',
    },
    {
      label: L.l4, tone: incomeVariance === 'High' ? 'down' : 'up',
      value: incomeVariance ?? '—',
      delta: incomeVariance === 'High' ? '↓ Score risk factor' : '↑ Positive signal',
    },
  ]

  const chartData = useMemo(() =>
    months.map((month, i) => ({
      month, value: incomes[i] ?? 0, isLatest: i === months.length - 1,
    })), [months, incomes])
=======
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
>>>>>>> 15f3ade9e2046cf646d9396209f0c7587aa68134

  // ── Firebase auth listener ──
  useEffect(() => {
<<<<<<< HEAD
    if (!auth) return // Skip if Firebase not initialized
    const unsub = onAuthStateChanged(auth, u => setUser(u))
    return () => unsub()
  }, [auth])

  // ── Load CSV + call parse + score whenever persona changes ──
  useEffect(() => {
    setChatLog([{ role: 'bot', text: GREETINGS[lang]?.[activePersona] ?? GREETINGS.en[activePersona] }])
    setChatInput('')
    setScoreData(null)
    setParsedData(null)
    setApiError(null)
    loadAndScore(activePersona)
  }, [activePersona])

  // ── Re-greet when language changes ──
  useEffect(() => {
    if (scoreData) {
      setChatLog([{
        role: 'bot',
        text: `${base.name} · Score ${scoreData.finalScore}/850 — ${scoreData.tier}. How can I help?`
      }])
    }
  }, [lang])
=======
    setChatLog([{ role: 'bot', text: p.welcome[lang] || p.welcome.en }])
    setChatInput('')
  }, [activePersona, lang, p.welcome])
>>>>>>> 15f3ade9e2046cf646d9396209f0c7587aa68134

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [chatLog])

<<<<<<< HEAD
  // ── STEP 1–3: Load CSV → Parse → Score ──
  async function loadAndScore(personaKey) {
    setApiLoading(true)
    try {
      // STEP 1: Fetch CSV file from /src/data/
      const csvRes = await fetch(`/data/${personaBase[personaKey].csvFile}`)
      if (!csvRes.ok) throw new Error('CSV not found')
      const csvData = await csvRes.text()

      // STEP 2: Send to /api/parse
      const parseRes = await fetch('http://localhost:5000/api/parse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ csvData }),
      })
      if (!parseRes.ok) throw new Error('Parse failed')
      const parseResult = await parseRes.json()
      const parsedData = parseResult.data // Extract the data object
      setParsedData(parsedData)

      // STEP 3: Send parsed data to /api/score
      const scoreRes = await fetch('http://localhost:5000/api/score', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ parsedData }),
      })
      if (!scoreRes.ok) throw new Error('Score failed')
      const scored = await scoreRes.json()
      setScoreData(scored)

      // Update chat with real score
      setChatLog([{
        role: 'bot',
        text: `${personaBase[personaKey].name} · Score ${scored.finalScore}/850 — ${scored.tier}. How can I help?`
      }])

      // STEP 6: Save to Firebase if user is logged in
      if (user) {
        await saveScoreToFirebase(scored, user)
      }
    } catch (err) {
      console.error('Load/score error:', err)
      setApiError(err.message)
    } finally {
      setApiLoading(false)
    }
  }

  // ── STEP 6: Save score to Firebase ──
  async function saveScoreToFirebase(scored, firebaseUser) {
    try {
      const token = await firebaseUser.getIdToken()
      await fetch('http://localhost:5000/api/auth/save-score', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ scoreData: scored }),
      })
    } catch (err) {
      console.error('Firebase save error:', err)
      // Non-blocking — don't surface this to user
    }
  }

  // ── STEP 5: Download PDF ──
  const handleDownload = async () => {
    if (!scoreData || !parsedData) {
      const msg = !scoreData ? 'Score data not loaded' : 'Parsed transaction data not loaded'
      console.warn('Download blocked:', msg, { scoreData, parsedData })
      return alert(msg)
    }
    try {
      console.log('Starting PDF download...')
      const workerData = {
        name:           base.name,
        platform:       base.platform,
        avgIncome:      avgIncome ? String(Math.round(avgIncome)) : '0',
        transactions:   txPerMonth ? String(Math.round(txPerMonth)) : '0',
        incomeVariance: incomeVariance ?? 'Unknown',
        topPayer:       base.topPayer,
        tips:           base.tips,
        months,
        incomes,
      }
      console.log('Sending to backend:', { workerData, scoreData })
      const response = await fetch('http://localhost:5000/api/pdf/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ workerData, scoreData }),
      })
      console.log('Response status:', response.status, response.statusText)
      if (!response.ok) {
        const errText = await response.text()
        throw new Error(`HTTP ${response.status}: ${errText}`)
      }
      const result = await response.json()
      console.log('PDF generated:', result)
      if (result.success) {
        const link = document.createElement('a')
        link.href = `http://localhost:5000${result.downloadUrl}`
        link.download = result.filename
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        alert('PDF downloaded successfully!')
      } else {
        alert(`PDF generation failed: ${result.error || 'Unknown error'}`)
      }
    } catch (err) {
      console.error('PDF error:', err)
      alert(`Failed to download PDF:\n${err.message}\n\nMake sure backend is running on port 5000`)
    }
  }

  // ── Chat handlers ──
  const workerContext = {
    name: base.name,
    score, tier,
    avgIncome, incomeVariance,
    loan: loan.range,
=======
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
>>>>>>> 15f3ade9e2046cf646d9396209f0c7587aa68134
  }

  const handleSend = async () => {
    const msg = chatInput.trim()
    if (!msg || chatLoading) return
    setChatLog(prev => [...prev, { role: 'user', text: msg }])
    setChatInput('')
    setChatLoading(true)
    setChatLog(prev => [...prev, { role: 'bot', text: '...', loading: true }])
    try {
<<<<<<< HEAD
      const reply = await askClaude(msg, langName, workerContext, chatLog)
=======
      const system = `${CHAT_PROMPTS[lang] || CHAT_PROMPTS.en} Worker context: ${p.context}`
      const reply = await askClaude(system, msg)
>>>>>>> 15f3ade9e2046cf646d9396209f0c7587aa68134
      setChatLog(prev => prev.map((m, i) => i === prev.length - 1 ? { role: 'bot', text: reply } : m))
    } catch {
      setChatLog(prev => prev.map((m, i) => i === prev.length - 1 ? { role: 'bot', text: 'Network error — please try again.', error: true } : m))
    }
    setChatLoading(false)
  }

  const handleWhyScore = async () => {
<<<<<<< HEAD
    if (whyLoading || !scoreData) return
=======
    if (whyLoading || chatLoading) return
>>>>>>> 15f3ade9e2046cf646d9396209f0c7587aa68134
    setWhyLoading(true)
    setChatLog(prev => [...prev,
      { role: 'user', text: L.why.replace(' →', '') },
      { role: 'bot', text: '...', loading: true },
    ])
    const msg = `Name: ${base.name}. Score: ${score}/850. Factors: ${factors.map(f => `${f.label} ${f.value}%`).join(', ')}. Explain simply in 3 sentences.`
    try {
<<<<<<< HEAD
      const reply = await askClaude(msg, langName, workerContext, chatLog)
=======
      const reply = await askClaude(sys, msg)
>>>>>>> 15f3ade9e2046cf646d9396209f0c7587aa68134
      setChatLog(prev => prev.map((m, i) => i === prev.length - 1 ? { role: 'bot', text: reply } : m))
    } catch {
      setChatLog(prev => prev.map((m, i) => i === prev.length - 1 ? { role: 'bot', text: 'Network error — please try again.', error: true } : m))
    }
    setWhyLoading(false)
  }

<<<<<<< HEAD
  const handleWhatsApp = () => {
    const t = encodeURIComponent(`My Kharcha Financial Health Report 📊\nScore: ${score}/850 — ${tier}\nLoan Eligible: ${loan.range}\nGenerated by Kharcha · Vibe-a-thon 2026`)
    window.open(`https://wa.me/?text=${t}`, '_blank')
  }

  const handleVoice = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognition) { alert('Use Chrome for voice input'); return }
    const recognition = new SpeechRecognition()
    const langMap = { en: 'en-IN', kn: 'kn-IN', hi: 'hi-IN', ta: 'ta-IN' }
    recognition.lang = langMap[lang] || 'en-IN'
    recognition.interimResults = false
    recognition.onstart = () => setListening(true)
    recognition.onend = () => setListening(false)
    recognition.onresult = (e) => setChatInput(e.results[0][0].transcript)
    recognition.start()
  }

  const handleLogin = async () => {
    if (!auth || !googleProvider) { console.warn('Firebase not initialized'); return }
    try { await signInWithPopup(auth, googleProvider) }
    catch (err) { console.error('Login error:', err) }
  }

  const handleLogout = async () => {
    if (!auth) { console.warn('Firebase not initialized'); return }
    try { await signOut(auth) }
    catch (err) { console.error('Logout error:', err) }
  }

  const card = { background: 'white', border: '1px solid rgba(249,115,22,0.15)', borderRadius: 16 }
=======
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
>>>>>>> 15f3ade9e2046cf646d9396209f0c7587aa68134

  // ── LOADING OVERLAY ──
  const LoadingOverlay = () => (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(255,251,247,0.88)',
      zIndex: 100, display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', gap: 14,
    }}>
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
        style={{ width: 40, height: 40, border: '3px solid #FEF0E0', borderTop: '3px solid #F97316', borderRadius: '50%' }}
      />
      <div style={{ fontSize: 14, fontWeight: 600, color: '#8C7B6B' }}>{L.loading}</div>
    </div>
  )

  return (
<<<<<<< HEAD
    <div style={{ minHeight: '100vh', background: '#FFFBF7', color: '#1A1410', fontFamily: 'Sora, system-ui, sans-serif' }}>
      {apiLoading && <LoadingOverlay />}
=======
    <div>
      <div className="glow-orb glow-orb-1" />
      <div className="glow-orb glow-orb-2" />
      <div className="glow-orb glow-orb-3" />
>>>>>>> 15f3ade9e2046cf646d9396209f0c7587aa68134

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
<<<<<<< HEAD
          <div style={{ display: 'flex', gap: 6, background: 'rgba(255,255,255,0.07)', borderRadius: 99, padding: 4 }}>
            {Object.keys(personaBase).map(key => (
              <button key={key} onClick={() => setActivePersona(key)} style={{
                background: key === activePersona ? '#F97316' : 'transparent',
                color: key === activePersona ? 'white' : 'rgba(255,255,255,0.55)',
                border: 'none', borderRadius: 99, padding: '5px 13px',
                fontSize: 11, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
              }}>
                {key === 'ravi' ? 'Ravi · Swiggy' : key === 'meena' ? 'Meena · Ola' : 'Suresh · UrbanCo'}
              </button>
            ))}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <select value={lang} onChange={e => setLang(e.target.value)} style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.18)', color: 'white', fontSize: 11, fontFamily: 'inherit', padding: '5px 10px', borderRadius: 99, cursor: 'pointer' }}>
              {LANGS.map(l => <option key={l.value} value={l.value} style={{ color: '#1A1410', background: 'white' }}>{l.label}</option>)}
            </select>
            {user ? (
              <button onClick={handleLogout} style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.7)', fontFamily: 'inherit', fontSize: 11, padding: '5px 12px', borderRadius: 99, cursor: 'pointer' }}>
                {L.logout}
              </button>
            ) : (
              <button onClick={handleLogin} style={{ background: '#F97316', border: 'none', color: 'white', fontFamily: 'inherit', fontSize: 11, fontWeight: 700, padding: '5px 12px', borderRadius: 99, cursor: 'pointer' }}>
                {L.login}
              </button>
            )}
          </div>
        </div>
      </header>

      {/* API ERROR BANNER */}
      {apiError && (
        <div style={{ background: '#FEE2E2', color: '#DC2626', textAlign: 'center', padding: '8px 20px', fontSize: 12, fontWeight: 600 }}>
          ⚠️ Could not load score: {apiError}. Is the backend running on port 5000?
        </div>
      )}

      <main style={{ maxWidth: 960, margin: '0 auto', padding: '28px 20px 48px', display: 'flex', flexDirection: 'column', gap: 14 }}>

        {/* HERO */}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
          <div style={{ width: 50, height: 50, borderRadius: '50%', background: 'linear-gradient(135deg,#F97316,#FBB040)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, fontWeight: 800, color: 'white', flexShrink: 0 }}>
            {base.initial}
          </div>
          <div>
            <h1 style={{ fontSize: 17, fontWeight: 700, margin: 0 }}>{base.name}</h1>
            <p style={{ fontSize: 11, color: '#8C7B6B', margin: '2px 0 0' }}>{base.sub}</p>
            <p style={{ fontSize: 11, fontStyle: 'italic', color: '#8C7B6B', margin: '5px 0 0', paddingLeft: 9, borderLeft: '2px solid #F97316' }}>{base.quote}</p>
          </div>
        </div>

        {/* SCORE + FACTORS */}
        <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: 14 }}>
          <div style={{ background: '#1A1410', borderRadius: 16, padding: '22px 18px 18px', display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative', overflow: 'hidden', boxShadow: '0 10px 30px rgba(249,115,22,0.15)' }}>
            <div style={{ position: 'absolute', top: -36, right: -36, width: 110, height: 110, background: 'rgba(249,115,22,0.1)', borderRadius: '50%' }} />
            <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '1.8px', textTransform: 'uppercase', color: 'rgba(255,255,255,0.38)', marginBottom: 8, textAlign: 'center' }}>{L.score}</div>
            <ScoreGauge score={scoreData?.finalScore ?? 300} color={tierMeta.color} animKey={activePersona + (scoreData?.finalScore ?? 0)} />
            <div style={{ fontSize: 46, fontWeight: 800, color: 'white', letterSpacing: '-3px', lineHeight: 1, marginTop: 6, textAlign: 'center' }}>
              {apiLoading ? '—' : score}<span style={{ fontSize: 17, fontWeight: 400, color: 'rgba(255,255,255,0.35)', letterSpacing: 0 }}>/850</span>
            </div>
            <div style={{ marginTop: 10, fontSize: 11, fontWeight: 700, padding: '4px 14px', borderRadius: 99, border: `1px solid ${tierMeta.border}`, background: tierMeta.bg, color: tierMeta.color }}>
              {apiLoading ? 'Analysing...' : tier}
            </div>
            <button onClick={handleWhyScore} disabled={whyLoading || !scoreData} style={{ marginTop: 11, width: '100%', background: 'transparent', border: '1px solid rgba(255,255,255,0.14)', color: 'rgba(255,255,255,0.5)', fontSize: 11, fontFamily: 'inherit', padding: '6px 12px', borderRadius: 8, cursor: scoreData ? 'pointer' : 'not-allowed' }}>
              {whyLoading ? '...' : L.why}
            </button>
          </div>

          <div style={{ ...card, padding: 20 }}>
            <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '1.6px', textTransform: 'uppercase', color: '#8C7B6B', marginBottom: 16 }}>{L.breakdown}</div>
            {factors.map((f, i) => (
              <div key={f.label} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: i < factors.length - 1 ? 11 : 0 }}>
                <div style={{ fontSize: 12, color: '#3D2E22', width: 128, flexShrink: 0 }}>{f.label}</div>
                <div style={{ flex: 1, height: 5, background: '#F5EDE4', borderRadius: 3, overflow: 'hidden' }}>
                  <motion.div key={activePersona + i + f.value} initial={{ width: 0 }} animate={{ width: `${f.value}%` }} transition={{ duration: 0.9, delay: i * 0.08, ease: [0.4, 0, 0.2, 1] }} style={{ height: '100%', borderRadius: 3, background: tierMeta.color }} />
=======

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
>>>>>>> 15f3ade9e2046cf646d9396209f0c7587aa68134
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
<<<<<<< HEAD
            <div style={{ marginTop: 14, paddingTop: 12, borderTop: '1px solid #FEF0E0', fontSize: 10, color: '#8C7B6B', lineHeight: 1.6 }}>
              <div>{L.source}</div>
            </div>
          </div>
        </div>

        {/* 4 STAT CARDS */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12 }}>
          {stats.map((s, i) => (
            <div key={i} style={{ ...card, borderRadius: 12, padding: '14px 15px' }}>
              <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '1.3px', textTransform: 'uppercase', color: '#8C7B6B', marginBottom: 5 }}>{s.label}</div>
              <div style={{ fontSize: i === 2 ? 15 : 21, fontWeight: 800, color: '#1A1410', letterSpacing: '-0.5px', lineHeight: 1.1, paddingTop: i === 2 ? 3 : 0 }}>{s.value}</div>
              <div style={{ fontSize: 10, fontWeight: 600, marginTop: 4, color: deltaTone[s.tone] }}>{s.delta}</div>
            </div>
          ))}
        </div>

        {/* LOAN BANNER */}
        <div style={{ background: '#1A1410', borderRadius: 16, padding: '18px 22px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
          <div>
            <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '1.6px', textTransform: 'uppercase', color: 'rgba(255,255,255,0.38)', marginBottom: 5 }}>{L.loan}</div>
            <div style={{ fontSize: 26, fontWeight: 800, color: 'white', letterSpacing: '-1px' }}>{loan.range}</div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.42)', marginTop: 2 }}>{loan.rate} · {loan.type} · {loan.tenure}</div>
          </div>
          <div style={{ display: 'flex', gap: 8, flexShrink: 0, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
            {loan.lenders.map(name => (
              <span key={name} style={{ background: 'rgba(249,115,22,0.13)', border: '1px solid rgba(249,115,22,0.32)', color: '#F97316', fontSize: 11, fontWeight: 700, padding: '5px 13px', borderRadius: 99 }}>{name}</span>
            ))}
          </div>
        </div>

        {/* CHART + TIPS */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          <div style={{ ...card, padding: 20 }}>
            <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '1.6px', textTransform: 'uppercase', color: '#8C7B6B', marginBottom: 4 }}>{L.chart}</div>
            <div style={{ height: 170, marginTop: 4 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} barSize={20}>
                  <CartesianGrid vertical={false} stroke="rgba(249,115,22,0.07)" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#8C7B6B', fontSize: 11 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#8C7B6B', fontSize: 10 }} tickFormatter={v => `₹${Math.round(v / 1000)}k`} width={38} />
                  <Tooltip cursor={{ fill: 'rgba(249,115,22,0.07)' }} formatter={v => [formatRupee(v), 'Income']} contentStyle={{ backgroundColor: '#1A1410', border: '1px solid rgba(249,115,22,0.2)', borderRadius: 10, fontSize: 12 }} labelStyle={{ color: 'rgba(255,255,255,0.5)', fontSize: 11 }} itemStyle={{ color: '#fff' }} />
                  <Bar dataKey="value" radius={[5, 5, 0, 0]}>
                    {chartData.map(e => <Cell key={e.month} fill={e.isLatest ? tierMeta.color : tierMeta.color + '38'} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div style={{ ...card, padding: 20 }}>
            <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '1.6px', textTransform: 'uppercase', color: '#8C7B6B', marginBottom: 4 }}>{L.tips}</div>
            {base.tips.map((tip, i) => (
              <div key={i} style={{ display: 'flex', gap: 10, padding: '10px 0', borderBottom: i < base.tips.length - 1 ? '1px solid #FEF0E0' : 'none' }}>
                <div style={{ width: 28, height: 28, borderRadius: 7, background: '#FEF3E2', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, flexShrink: 0 }}>{tip.icon}</div>
=======
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
>>>>>>> 15f3ade9e2046cf646d9396209f0c7587aa68134
                <div>
                  <div className="chat-agent-name">{L.chatTitle}</div>
                  <div className="chat-agent-sub">{L.chatSub}</div>
                </div>
              </div>
<<<<<<< HEAD
            ))}
          </div>
        </div>

        {/* BEFORE / AFTER */}
        <div style={{ ...card, padding: 20 }}>
          <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '1.6px', textTransform: 'uppercase', color: '#8C7B6B' }}>{L.journey}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginTop: 14 }}>
            <div style={{ flex: 1, background: '#F9F5F2', borderRadius: 10, padding: '14px 16px', textAlign: 'center' }}>
              <div style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.2px', color: '#8C7B6B', marginBottom: 5 }}>{L.ago}</div>
              <div style={{ fontSize: 30, fontWeight: 800, letterSpacing: '-1px', color: '#8C7B6B' }}>{apiLoading ? '—' : beforeScore}</div>
            </div>
            <div style={{ fontSize: 22, color: '#16A34A', flexShrink: 0, fontWeight: 700 }}>→</div>
            <div style={{ flex: 1, background: '#FEF3E2', borderRadius: 10, padding: '14px 16px', textAlign: 'center' }}>
              <div style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.2px', color: '#8C7B6B', marginBottom: 5 }}>{L.today}</div>
              <div style={{ fontSize: 30, fontWeight: 800, letterSpacing: '-1px', color: tierMeta.color }}>{apiLoading ? '—' : score}</div>
            </div>
          </div>
          {scoreData && (
            <div style={{ textAlign: 'center', marginTop: 12 }}>
              <span style={{ display: 'inline-block', background: '#DCFCE7', color: '#16A34A', fontSize: 11, fontWeight: 700, padding: '4px 14px', borderRadius: 99 }}>
                ↑ {firstName} improved {beforeDelta} points in 6 months
              </span>
            </div>
          )}
        </div>

        {/* CHAT */}
        <div style={{ ...card, padding: 18 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
              <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#F97316', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15 }}>💬</div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700 }}>{L.chatTitle}</div>
                <div style={{ fontSize: 10, color: '#8C7B6B' }}>{L.chatSub}</div>
              </div>
            </div>
            <select value={lang} onChange={e => setLang(e.target.value)} style={{ background: '#FEF8F2', border: '1px solid rgba(249,115,22,0.15)', color: '#1A1410', fontFamily: 'inherit', fontSize: 11, padding: '4px 9px', borderRadius: 99, cursor: 'pointer' }}>
              {LANGS.map(l => <option key={l.value} value={l.value}>{l.label}</option>)}
            </select>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 9, maxHeight: 180, overflowY: 'auto', marginBottom: 12 }}>
            {chatLog.map((msg, i) => (
              <div key={i} style={{
                background: msg.role === 'user' ? '#1A1410' : '#FEF3E2',
                color: msg.role === 'user' ? 'white' : '#3D2E22',
                borderRadius: msg.role === 'user' ? '12px 0 12px 12px' : '0 12px 12px 12px',
                padding: '9px 13px', fontSize: 12, lineHeight: 1.6,
                maxWidth: '84%', alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                opacity: msg.loading ? 0.5 : 1,
              }}>{msg.text}</div>
            ))}
            <div ref={chatEndRef} />
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <input value={chatInput} onChange={e => setChatInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSend()} placeholder={L.placeholder} style={{ flex: 1, background: '#FEF8F2', border: '1px solid rgba(249,115,22,0.15)', borderRadius: 8, padding: '8px 12px', fontFamily: 'inherit', fontSize: 12, color: '#1A1410', outline: 'none' }} />
            <button onClick={handleSend} disabled={chatLoading} style={{ width: 34, height: 34, borderRadius: 8, background: chatLoading ? '#ccc' : '#F97316', border: 'none', color: 'white', fontSize: 16, cursor: chatLoading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>→</button>
            <button onClick={handleVoice} style={{ width: 34, height: 34, borderRadius: 8, background: listening ? '#DC2626' : '#FEF3E2', border: '1px solid rgba(249,115,22,0.2)', fontSize: 16, cursor: 'pointer', flexShrink: 0 }}>
              {listening ? '⏹' : '🎤'}
            </button>
          </div>
        </div>

        {/* ACTIONS */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: 10 }}>
          <button onClick={handleDownload} disabled={!scoreData} style={{ background: scoreData ? '#F97316' : '#ccc', color: 'white', border: 'none', fontFamily: 'inherit', fontSize: 13, fontWeight: 700, padding: '13px 20px', borderRadius: 10, cursor: scoreData ? 'pointer' : 'not-allowed', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>{L.download}</button>
          <button onClick={handleWhatsApp} style={{ background: '#25D366', color: 'white', border: 'none', fontFamily: 'inherit', fontSize: 13, fontWeight: 700, padding: '13px 20px', borderRadius: 10, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="white" style={{ flexShrink: 0 }}><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
            {L.whatsapp}
          </button>
          <button onClick={() => window.open('/lender', '_blank')} style={{ background: 'transparent', color: '#1A1410', border: '1px solid rgba(249,115,22,0.15)', fontFamily: 'inherit', fontSize: 13, fontWeight: 600, padding: '13px 18px', borderRadius: 10, cursor: 'pointer', whiteSpace: 'nowrap' }}>{L.lender}</button>
        </div>

      </main>
    </div>
  )
}
=======
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
>>>>>>> 15f3ade9e2046cf646d9396209f0c7587aa68134
