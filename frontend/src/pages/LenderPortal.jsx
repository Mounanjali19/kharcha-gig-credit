import React, { useState } from 'react';
const PERSONAS = [
  { id: "ravi",   name: "Ravi Kumar",  avatar: "🛵", tier: "Good",      score: 684, beforeScore: 601, years: 3, platform: "Swiggy",        city: "Bengaluru",  platformRating: 4.8, avgMonthlyIncome: 21900, totalIncome: 131400, totalExpenses: 77200, monthlyIncomes: [18200,20100,19800,22400,24100,26800], dataMonths: ["Nov","Dec","Jan","Feb","Mar","Apr"], breakdown: { consistency:{score:75}, trend:{score:71}, volume:{score:80}, expense:{score:68} }, loanEligibility: { min:25000, max:50000, rate:"14%", lenders:["KreditBee"] } },
  { id: "meena",  name: "Meena Devi",  avatar: "🚗", tier: "Fair",      score: 521, beforeScore: 498, years: 2, platform: "Ola",           city: "Bengaluru",  platformRating: 4.5, avgMonthlyIncome: 21667, totalIncome: 130000, totalExpenses: 103000, monthlyIncomes: [28000,14000,31000,12000,29000,16000], dataMonths: ["Nov","Dec","Jan","Feb","Mar","Apr"], breakdown: { consistency:{score:38}, trend:{score:55}, volume:{score:74}, expense:{score:21} }, loanEligibility: { min:10000, max:25000, rate:"18%", lenders:["MoneyTap"] } },
  { id: "suresh", name: "Suresh Babu", avatar: "🔧", tier: "Excellent", score: 742, beforeScore: 698, years: 5, platform: "Urban Company", city: "Hyderabad", platformRating: 4.9, avgMonthlyIncome: 35500, totalIncome: 213000, totalExpenses: 111000, monthlyIncomes: [34000,36000,33000,37000,35000,38000], dataMonths: ["Nov","Dec","Jan","Feb","Mar","Apr"], breakdown: { consistency:{score:91}, trend:{score:78}, volume:{score:58}, expense:{score:88} }, loanEligibility: { min:50000, max:100000, rate:"12%", lenders:["PaySense","KreditBee"] } },
];

const tierConfig = {
  Excellent:    { color: '#0d9e75', bg: '#e0f5ed', risk: 'Low Risk' },
  Good:         { color: '#5b4fcf', bg: '#eeedfe', risk: 'Moderate Risk' },
  Fair:         { color: '#f0a500', bg: '#fef3cd', risk: 'Medium Risk' },
  'Needs Work': { color: '#e85d3a', bg: '#fdeee9', risk: 'Higher Risk' },
};

export default function LenderPortal({ onBack }) {
  const [reportId, setReportId] = useState('');
  const [worker, setWorker] = useState(null);
  const [error, setError] = useState('');
  const [approved, setApproved] = useState(false);

  const lookup = () => {
    const found = PERSONAS.find(
      p => p.id === reportId.toLowerCase() ||
           p.name.toLowerCase().includes(reportId.toLowerCase())
    );
    if (found) {
      setWorker(found);
      setError('');
      setApproved(false);
    } else {
      setError('Report not found. Try: ravi, meena, or suresh');
      setWorker(null);
    }
  };

  const cfg = worker ? tierConfig[worker.tier] || tierConfig['Good'] : null;

  return (
    <div style={{
      minHeight: '100vh',
      background: '#f7f5f0',
      fontFamily: 'DM Sans, sans-serif',
    }}>

      {/* Header */}
      <div style={{
        background: '#0f0f0f',
        padding: '16px 24px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button onClick={onBack} style={{
            background: '#1a1a1a', border: 'none', borderRadius: '8px',
            color: '#888', padding: '6px 12px', cursor: 'pointer', fontSize: '12px',
          }}>← Back</button>
          <div>
            <div style={{
              fontFamily: 'Syne, sans-serif', fontSize: '16px',
              fontWeight: 700, color: 'white',
            }}>🏦 Kharcha Lender Portal</div>
            <div style={{ fontSize: '11px', color: '#888' }}>
              For NBFC & microfinance partners only
            </div>
          </div>
        </div>
        <div style={{
          background: '#0d9e7522', border: '1px solid #0d9e75',
          borderRadius: '6px', padding: '4px 10px',
          fontSize: '11px', color: '#0d9e75', fontWeight: 600,
        }}>
          ● Live
        </div>
      </div>

      <div style={{ maxWidth: '600px', margin: '0 auto', padding: '32px 24px' }}>

        {/* Search box */}
        <div style={{
          background: 'white', borderRadius: '16px',
          border: '1px solid #ddd9d0', padding: '20px',
          marginBottom: '20px',
        }}>
          <h2 style={{
            fontFamily: 'Syne, sans-serif', fontSize: '18px',
            fontWeight: 800, marginBottom: '6px',
          }}>Look up a worker report</h2>
          <p style={{ fontSize: '12px', color: '#6b6660', marginBottom: '16px' }}>
            Enter the worker's Report ID or name to view their Financial Health Report
          </p>
          <div style={{ display: 'flex', gap: '8px' }}>
            <input
              value={reportId}
              onChange={e => setReportId(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && lookup()}
              placeholder="Enter Report ID (e.g. ravi, meena, suresh)"
              style={{
                flex: 1, padding: '10px 14px',
                border: '1.5px solid #ddd9d0', borderRadius: '10px',
                fontSize: '13px', outline: 'none',
              }}
            />
            <button onClick={lookup} style={{
              padding: '10px 20px', borderRadius: '10px',
              background: '#0f0f0f', border: 'none',
              color: 'white', fontFamily: 'Syne, sans-serif',
              fontSize: '13px', fontWeight: 700, cursor: 'pointer',
            }}>
              Search
            </button>
          </div>
          {error && (
            <div style={{
              marginTop: '10px', padding: '8px 12px',
              background: '#fdeee9', borderRadius: '8px',
              fontSize: '12px', color: '#e85d3a',
            }}>{error}</div>
          )}
          <div style={{ marginTop: '10px', fontSize: '11px', color: '#aaa' }}>
            Demo IDs: <b>ravi</b> · <b>meena</b> · <b>suresh</b>
          </div>
        </div>

        {/* Worker report */}
        {worker && (
          <div style={{ animation: 'fadeSlideUp 0.4s ease' }}>

            {/* Profile card */}
            <div style={{
              background: '#0f0f0f', borderRadius: '16px',
              padding: '20px', marginBottom: '12px',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <div style={{
                  width: '52px', height: '52px', borderRadius: '12px',
                  background: '#1a1a1a', fontSize: '26px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  {worker.avatar}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{
                    fontFamily: 'Syne, sans-serif', fontSize: '18px',
                    fontWeight: 800, color: 'white',
                  }}>{worker.name}</div>
                  <div style={{ fontSize: '12px', color: '#888' }}>
                    {worker.platform} · {worker.city} · {worker.years} years · ⭐ {worker.platformRating}
                  </div>
                </div>
                <div style={{
                  padding: '4px 10px', borderRadius: '6px',
                  background: cfg.bg, color: cfg.color,
                  fontSize: '11px', fontWeight: 700,
                }}>
                  {cfg.risk}
                </div>
              </div>

              {/* Score highlight */}
              <div style={{
                background: '#1a1a1a', borderRadius: '12px',
                padding: '16px', display: 'flex', alignItems: 'center',
                justifyContent: 'space-between',
              }}>
                <div>
                  <div style={{ fontSize: '11px', color: '#888', marginBottom: '2px' }}>
                    Gig Credit Score
                  </div>
                  <div style={{
                    fontFamily: 'Syne, sans-serif', fontSize: '40px',
                    fontWeight: 800, color: cfg.color, lineHeight: 1,
                  }}>
                    {worker.score}
                    <span style={{ fontSize: '16px', color: '#888', fontWeight: 400 }}>/850</span>
                  </div>
                  <div style={{ fontSize: '12px', color: cfg.color, marginTop: '2px' }}>
                    {worker.tier} · {worker.trend === 'improving' ? '↗ Improving' : worker.trend === 'stable' ? '→ Stable' : '↕ Volatile'}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '11px', color: '#888', marginBottom: '4px' }}>Score Growth</div>
                  <div style={{
                    fontFamily: 'Syne, sans-serif', fontSize: '22px',
                    fontWeight: 700, color: '#0d9e75',
                  }}>
                    +{worker.score - worker.beforeScore}
                  </div>
                  <div style={{ fontSize: '10px', color: '#888' }}>in 6 months</div>
                </div>
              </div>
            </div>

            {/* Income summary */}
            <div style={{
              background: 'white', borderRadius: '16px',
              border: '1px solid #ddd9d0', padding: '16px',
              marginBottom: '12px',
            }}>
              <h3 style={{
                fontFamily: 'Syne, sans-serif', fontSize: '14px',
                fontWeight: 700, marginBottom: '12px',
              }}>Income Analysis</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
                {[
                  { label: 'Avg Monthly', value: `₹${worker.avgMonthlyIncome.toLocaleString('en-IN')}` },
                  { label: '6M Total Income', value: `₹${worker.totalIncome.toLocaleString('en-IN')}` },
                  { label: 'Savings Rate', value: `${Math.round((1 - worker.totalExpenses / worker.totalIncome) * 100)}%` },
                ].map(({ label, value }) => (
                  <div key={label} style={{
                    background: '#f7f5f0', borderRadius: '10px',
                    padding: '10px', textAlign: 'center',
                  }}>
                    <div style={{ fontSize: '10px', color: '#6b6660', marginBottom: '2px' }}>{label}</div>
                    <div style={{ fontFamily: 'Syne, sans-serif', fontSize: '14px', fontWeight: 700 }}>{value}</div>
                  </div>
                ))}
              </div>

              {/* Monthly income bars */}
              <div style={{ marginTop: '14px' }}>
                <div style={{ fontSize: '11px', color: '#6b6660', marginBottom: '6px' }}>Monthly income pattern</div>
                <div style={{ display: 'flex', gap: '4px', alignItems: 'flex-end', height: '48px' }}>
                  {worker.monthlyIncomes.map((inc, i) => {
                    const max = Math.max(...worker.monthlyIncomes);
                    const pct = (inc / max) * 100;
                    return (
                      <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px', height: '100%', justifyContent: 'flex-end' }}>
                        <div style={{
                          width: '100%', borderRadius: '3px 3px 0 0',
                          background: cfg.color,
                          height: `${pct}%`,
                          transition: 'height 0.6s ease',
                          opacity: 0.7 + (i / worker.monthlyIncomes.length) * 0.3,
                        }} />
                      </div>
                    );
                  })}
                </div>
                <div style={{ display: 'flex', gap: '4px', marginTop: '3px' }}>
                  {worker.dataMonths.map((m, i) => (
                    <div key={i} style={{ flex: 1, textAlign: 'center', fontSize: '9px', color: '#aaa' }}>
                      {m.split(' ')[0].slice(0, 3)}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Score breakdown */}
            <div style={{
              background: 'white', borderRadius: '16px',
              border: '1px solid #ddd9d0', padding: '16px',
              marginBottom: '12px',
            }}>
              <h3 style={{ fontFamily: 'Syne, sans-serif', fontSize: '14px', fontWeight: 700, marginBottom: '12px' }}>
                Score Breakdown
              </h3>
              {[
                { key: 'consistency', label: 'Income Consistency', weight: '30%' },
                { key: 'trend',       label: 'Earning Trend',      weight: '25%' },
                { key: 'volume',      label: 'Transaction Volume', weight: '25%' },
                { key: 'expense',     label: 'Expense Control',    weight: '20%' },
              ].map(({ key, label, weight }) => {
                const val = worker.breakdown[key]?.score || 0;
                return (
                  <div key={key} style={{ marginBottom: '10px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <span style={{ fontSize: '12px', color: '#0f0f0f' }}>{label} <span style={{ color: '#aaa' }}>({weight})</span></span>
                      <span style={{ fontSize: '12px', fontWeight: 700, color: cfg.color }}>{val}/100</span>
                    </div>
                    <div style={{ height: '5px', background: '#f0ece4', borderRadius: '3px', overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${val}%`, background: cfg.color, borderRadius: '3px' }} />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Loan recommendation */}
            <div style={{
              background: worker.loanEligibility.min > 0 ? '#0f0f0f' : '#f7f5f0',
              borderRadius: '16px', padding: '16px',
              marginBottom: '12px',
            }}>
              <h3 style={{
                fontFamily: 'Syne, sans-serif', fontSize: '14px',
                fontWeight: 700, color: worker.loanEligibility.min > 0 ? 'white' : '#0f0f0f',
                marginBottom: '8px',
              }}>
                Loan Recommendation
              </h3>
              {worker.loanEligibility.min > 0 ? (
                <>
                  <div style={{ fontSize: '24px', fontWeight: 800, color: cfg.color, fontFamily: 'Syne, sans-serif', marginBottom: '4px' }}>
                    ₹{worker.loanEligibility.min.toLocaleString('en-IN')} – ₹{worker.loanEligibility.max.toLocaleString('en-IN')}
                  </div>
                  <div style={{ fontSize: '12px', color: '#888', marginBottom: '12px' }}>
                    Suggested interest: {worker.loanEligibility.rate}
                  </div>
                  <div style={{ fontSize: '11px', color: '#aaa', lineHeight: 1.5 }}>
                    Based on {worker.years} years of platform activity, ⭐{worker.platformRating} rating, and consistent UPI transaction history over 6 months.
                  </div>
                </>
              ) : (
                <div style={{ fontSize: '13px', color: '#6b6660' }}>
                  Score below eligibility threshold. Recommend 3-month improvement plan before re-evaluation.
                </div>
              )}
            </div>

            {/* Approve button */}
            {!approved ? (
              <button
                onClick={() => setApproved(true)}
                style={{
                  width: '100%', padding: '16px',
                  background: '#0d9e75', border: 'none',
                  borderRadius: '12px', cursor: 'pointer',
                  fontFamily: 'Syne, sans-serif',
                  fontSize: '16px', fontWeight: 700, color: 'white',
                }}
              >
                ✓ Approve Microloan Application
              </button>
            ) : (
              <div style={{
                padding: '16px', background: '#e0f5ed',
                borderRadius: '12px', textAlign: 'center',
                border: '1.5px solid #0d9e75',
              }}>
                <div style={{ fontSize: '24px', marginBottom: '6px' }}>🎉</div>
                <div style={{ fontFamily: 'Syne, sans-serif', fontSize: '16px', fontWeight: 700, color: '#0d9e75' }}>
                  Loan Approved!
                </div>
                <div style={{ fontSize: '12px', color: '#0f6e56', marginTop: '4px' }}>
                  ₹{worker.loanEligibility.max.toLocaleString('en-IN')} approved for {worker.name}. Disbursement in 24 hours.
                </div>
              </div>
            )}

            {/* Disclaimer */}
            <div style={{ marginTop: '16px', fontSize: '10px', color: '#aaa', lineHeight: 1.5, textAlign: 'center' }}>
              This report is generated by Kharcha AI using UPI transaction analysis. For demonstration purposes only.
              Lenders should use this alongside standard due diligence.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
