# 🪙 Kharcha — AI Credit Co-pilot for Gig Workers

> **Vibe-a-thon 2026 · Team Game Of Codes · NMIT**

[![Live Demo](https://img.shields.io/badge/Live_Demo-Vercel-black?style=flat-square)](https://kharcha-gig-credit.vercel.app)
[![GitHub](https://img.shields.io/badge/Repo-Public-green?style=flat-square)](https://github.com/Mounanjali19/kharcha-gig-credit)

---

## 🎯 Problem Statement

India has **80 million+ gig workers** — Swiggy delivery partners, Ola drivers, Urban Company plumbers — earning ₹15,000–40,000/month with completely irregular income. Despite years of work and hundreds of UPI transactions, **banks reject them for loans because they have no salary slip**.

Every financial app assumes a fixed monthly salary. These workers are financially invisible — no credit score, no planning tools, no safety net.

**₹8.5 lakh crore in gig economy earnings. Zero credit products built for it.**

---

## 💡 Solution

**Kharcha** is an AI co-pilot that builds a credit identity for gig workers using their UPI transaction patterns.

- Analyzes 6 months of UPI transaction history
- Generates a **Gig Credit Score** (300–850) — an alternative to CIBIL, built for irregular income
- Produces a downloadable **Financial Health Report** to present to lenders
- Converses in **Kannada, Hindi, Tamil, and English** via chat or voice
- Connects workers to relevant **microloans and NBFCs** based on their score

---

## ✨ Features

| Feature | Description |
|---|---|
| 📊 Gig Credit Score | 4-factor scoring: Income Consistency, Earning Trend, Transaction Volume, Expense Control |
| 🗣️ Multilingual Chat | AI advisor (Kharcha) speaks Kannada, Hindi, Tamil, English |
| 🎙️ Voice Input | Speak in your language using Web Speech API |
| 📄 PDF Health Report | Lender-ready report with QR code — one click download |
| 👥 Demo Personas | 3 pre-built gig worker profiles for instant demo |
| 📈 Before/After | Shows score improvement over 6 months |
| 🏦 Loan Eligibility | Matches score to real NBFC loan offers |
| 💬 WhatsApp Share | Share report directly to lenders via WhatsApp |
| 🔍 Expense Breakdown | AI-categorized spending: Food, Fuel, Rent, Savings, etc. |
| ⭐ Platform Rating | Swiggy/Ola rating as bonus scoring factor |

---

## 🏗️ Architecture

```
Gig Worker
    │
    ▼
UPI CSV Upload / Demo Persona
    │
    ▼
Claude API — Data Parser (extracts income patterns from raw CSV)
    │
    ▼
Gig Credit Score Engine (4-factor weighted model)
    │
    ├──► Worker Dashboard (score, chart, tips)
    │
    ├──► Multilingual Chat Agent (Claude API few-shot)
    │
    └──► PDF Report Generator (Claude API + jsPDF)
                │
                ▼
         Partner Lender Portal (lender view)
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| AI / Core Intelligence | Claude API (Anthropic) — claude-sonnet-4 |
| Frontend | React.js + Tailwind CSS |
| Backend | Node.js + Express |
| Data Processing | Python (pandas) + CSV parser |
| Report Generation | Claude API + jsPDF |
| Multilingual Support | Claude API few-shot prompting |
| Voice Input | Web Speech API (Chrome) |
| Hosting | Vercel (frontend) + Render (backend) |
| Auth | Firebase |

> **Every intelligence layer runs on Claude API — no traditional ML, pure prompting.**

---

## 🚀 Setup

### Prerequisites
- Node.js 18+
- Python 3.9+
- Anthropic API key

### Backend
```bash
cd backend
npm install
cp ../.env.example .env
# Add your ANTHROPIC_API_KEY to .env
npm run dev
```

### Frontend
```bash
cd frontend
npm install
npm start
```

### Environment Variables
```
ANTHROPIC_API_KEY=your_key_here
FIREBASE_API_KEY=your_firebase_key_here
PORT=5000
```

---

## 🤖 AI Usage (Prompt Transparency)

All Claude API prompts are saved in `/backend/prompts/`:

| File | Purpose |
|---|---|
| `01_upi_parser_prompt.txt` | Parses raw UPI CSV → structured income JSON |
| `02_score_explainer_prompt.txt` | Explains score in plain language (multilingual) |
| `03_chat_agent_prompt.txt` | Kharcha chat agent with few-shot examples |
| `04_report_prompt.txt` | Generates lender-ready Financial Health Report |

**What Claude does:** data parsing, score explanation, multilingual financial advice, report writing  
**What we built on top:** scoring formula, UI, PDF export, voice input, lender portal  
**How we used Claude tools:** Claude.ai for architecture planning, prompt design, and code generation. All generated code was reviewed, understood, and modified by the team.

---

## 👥 Team

| Name | Role | Contact |
|---|---|---|
| Mounanjali L | AI/Backend — Claude API integration, prompts, scoring logic | 1nt23cb033.mounanjali@nmit.ac.in |
| Hansika Purva | Frontend — React dashboard, UI components, score gauge | hansikapurva@gmail.com |
| Punati Hitesh | Backend — Node/Express API, deployment, CSV parser | punati.hitesh@gmail.com |

**Institution:** NMIT (Nitte Meenakshi Institute of Technology), Bengaluru

---

## 📱 Demo

**Live:** [kharcha-gig-credit.vercel.app](https://kharcha-gig-credit.vercel.app)

**Demo flow:**
1. Click a persona (Ravi — Swiggy driver)
2. Watch score animate to 684/850
3. Switch chat to Kannada — ask a question in Kannada
4. Download Financial Health Report PDF
5. Scan QR code on PDF → opens lender portal

---

## 🗺️ Roadmap

- **v2:** NPCI Account Aggregator integration (direct bank data, no CSV upload)
- **v2:** Earned wage access — advance on income already earned this week
- **v3:** Group credit for delivery fleets
- **v3:** ₹99/month micro-insurance for bike, phone, and income loss

---

## 📋 Third-Party Libraries & APIs

- `@anthropic-ai/sdk` — Claude API
- `express`, `cors`, `multer`, `csv-parser` — Backend
- `react`, `recharts`, `tailwindcss` — Frontend
- `jspdf`, `qrcode` — PDF generation
- `firebase` — Authentication
- Web Speech API — Voice input (browser built-in)

---

## ⚖️ License

MIT License — see LICENSE file

---

*Built with ❤️ at Vibe-a-thon 2026, NMIT Bengaluru*
