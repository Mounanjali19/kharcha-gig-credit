import { useEffect, useMemo, useRef, useState } from 'react'
import { motion } from 'framer-motion'
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
  suresh: {
    name: 'Suresh Babu', initial: 'S', csvFile: 'suresh.csv',
    sub: 'UrbanCo Plumber · Bengaluru · Member since Oct 2023',
    quote: '"Stable work, stable score. Kharcha finally reflects that."',
    platform: 'UrbanCo', topPayer: 'UrbanCo',
    tips: [
      { icon: '⭐', title: 'Tier 1 eligible — act now',   body: "Your score qualifies for KreditBee's lowest interest rate. Apply this month before rates change." },
      { icon: '📊', title: 'Build an emergency buffer',   body: "You're strong — route ₹3,000/month to a liquid fund. This further improves Expense Control." },
      { icon: '🤝', title: 'Refer and earn credit bonus', body: "UrbanCo's partner program can add verified work certificates that strengthen your profile." },
    ],
  },
}

// ── LANGUAGES ─────────────────────────────────────────────────────────────────
const LANGS = [
  { value: 'en', label: 'English', api: 'English' },
  { value: 'kn', label: 'ಕನ್ನಡ',   api: 'Kannada' },
  { value: 'hi', label: 'हिंदी',   api: 'Hindi' },
  { value: 'ta', label: 'தமிழ்',  api: 'Tamil' },
]

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
      <motion.path
        key={animKey}
        d="M18,78 A62,62,0,0,1,142,78"
        fill="none" stroke={color} strokeWidth="9" strokeLinecap="round"
        strokeDasharray={DASH}
        initial={{ strokeDashoffset: DASH }}
        animate={{ strokeDashoffset: offset }}
        transition={{ duration: 1.4, ease: [0.4, 0, 0.2, 1] }}
      />
      <text x="18"  y="88" fill="rgba(255,255,255,0.3)" fontSize="9" fontFamily="Sora" textAnchor="middle">300</text>
      <text x="142" y="88" fill="rgba(255,255,255,0.3)" fontSize="9" fontFamily="Sora" textAnchor="middle">850</text>
    </svg>
  )
}

// ── CHAT API ──────────────────────────────────────────────────────────────────
async function askClaude(userMsg, language, workerContext, history = []) {
  const res = await fetch('http://localhost:5000/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message: userMsg, language, workerContext, history }),
  })
  const data = await res.json()
  return data.reply || 'Could not connect. Please try again.'
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

  // ── Firebase auth listener ──
  useEffect(() => {
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

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [chatLog])

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
  }

  const handleSend = async () => {
    const msg = chatInput.trim()
    if (!msg || chatLoading) return
    setChatLog(prev => [...prev, { role: 'user', text: msg }])
    setChatInput('')
    setChatLoading(true)
    setChatLog(prev => [...prev, { role: 'bot', text: '...', loading: true }])
    try {
      const reply = await askClaude(msg, langName, workerContext, chatLog)
      setChatLog(prev => prev.map((m, i) => i === prev.length - 1 ? { role: 'bot', text: reply } : m))
    } catch {
      setChatLog(prev => prev.map((m, i) => i === prev.length - 1 ? { role: 'bot', text: 'Network error — please try again.' } : m))
    }
    setChatLoading(false)
  }

  const handleWhyScore = async () => {
    if (whyLoading || !scoreData) return
    setWhyLoading(true)
    setChatLog(prev => [...prev,
      { role: 'user', text: L.why },
      { role: 'bot', text: '...', loading: true },
    ])
    const msg = `Name: ${base.name}. Score: ${score}/850. Factors: ${factors.map(f => `${f.label} ${f.value}%`).join(', ')}. Explain simply in 3 sentences.`
    try {
      const reply = await askClaude(msg, langName, workerContext, chatLog)
      setChatLog(prev => prev.map((m, i) => i === prev.length - 1 ? { role: 'bot', text: reply } : m))
    } catch {
      setChatLog(prev => prev.map((m, i) => i === prev.length - 1 ? { role: 'bot', text: 'Network error.' } : m))
    }
    setWhyLoading(false)
  }

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
    <div style={{ minHeight: '100vh', background: '#FFFBF7', color: '#1A1410', fontFamily: 'Sora, system-ui, sans-serif' }}>
      {apiLoading && <LoadingOverlay />}

      {/* TOP BAR */}
      <header style={{ background: '#1A1410', position: 'sticky', top: 0, zIndex: 50 }}>
        <div style={{ maxWidth: 960, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 20px', height: 52 }}>
          <div style={{ fontSize: 18, fontWeight: 800, color: '#F97316', letterSpacing: '-0.5px' }}>
            Kharcha<span style={{ color: 'white' }}>.</span>
          </div>
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
                </div>
                <div style={{ fontSize: 11, fontWeight: 700, width: 33, textAlign: 'right' }}>{f.value}%</div>
                <div style={{ fontSize: 10, color: '#8C7B6B', width: 26, textAlign: 'right' }}>{f.weight}%</div>
              </div>
            ))}
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
                <div>
                  <strong style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#1A1410' }}>{tip.title}</strong>
                  <span style={{ fontSize: 11, color: '#3D2E22', lineHeight: 1.55 }}>{tip.body}</span>
                </div>
              </div>
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
