"""
generate_personas.py
Generates synthetic UPI CSVs for Ravi, Meena, and Suresh.
Each CSV has columns: date, description, amount, type (credit/debit)
Run: python generate_personas.py
"""

import pandas as pd
import numpy as np
from datetime import date, timedelta
import random, os

random.seed(42)
np.random.seed(42)

OUT = os.path.join(os.path.dirname(__file__), "personas")
os.makedirs(OUT, exist_ok=True)

START = date(2024, 11, 1)   # 6 months back from May 2025
END   = date(2025, 4, 30)

def date_range(start=START, end=END):
    d = start
    while d <= end:
        yield d
        d += timedelta(days=1)

ALL_DAYS = list(date_range())

CREDIT_DESC = [
    "Swiggy payment received", "Ola driver payout", "Urban Company booking",
    "PhonePe credit", "BHIM UPI credit", "Paytm credit", "Google Pay received",
    "Customer payment", "Trip earning", "Job completed payout"
]
DEBIT_DESC = [
    "Fuel recharge", "Food order", "Mobile recharge", "Rent payment",
    "Grocery", "Electricity bill", "Insurance premium", "EMI debit",
    "Online shopping", "Medicine"
]

def build_rows(credit_schedule, debit_schedule):
    """
    credit_schedule: list of (date, amount) tuples
    debit_schedule: same for debits
    """
    rows = []
    for d, amt in credit_schedule:
        rows.append({
            "date": d.strftime("%Y-%m-%d"),
            "description": random.choice(CREDIT_DESC),
            "amount": round(amt, 2),
            "type": "credit"
        })
    for d, amt in debit_schedule:
        rows.append({
            "date": d.strftime("%Y-%m-%d"),
            "description": random.choice(DEBIT_DESC),
            "amount": round(amt, 2),
            "type": "debit"
        })
    return sorted(rows, key=lambda r: r["date"])


# ── RAVI — Swiggy Driver, Growing Hustler, score ~684 ─────────────────────────
# Earns almost every day, income trending upward, moderate expenses
def ravi_schedule():
    credits, debits = [], []
    base = 550          # daily base income, grows over 6 months
    for i, d in enumerate(ALL_DAYS):
        month_idx = (d.year - START.year) * 12 + (d.month - START.month)
        daily_base = base + month_idx * 60   # grows ~60/day each month
        # Skip ~4 random days per month (rest days)
        if random.random() < 0.13:
            continue
        amt = daily_base + random.gauss(0, 80)
        credits.append((d, max(300, amt)))
    # Debits: fuel every 3 days, food daily-ish, rent monthly
    for d in ALL_DAYS:
        if d.day == 1:
            debits.append((d, random.uniform(6000, 7500)))   # rent
        if d.weekday() in (0, 3, 6):
            debits.append((d, random.uniform(200, 400)))     # fuel
        if random.random() < 0.5:
            debits.append((d, random.uniform(80, 250)))      # food/misc
    return credits, debits

rc, rd = ravi_schedule()
pd.DataFrame(build_rows(rc, rd)).to_csv(f"{OUT}/ravi.csv", index=False)
print(f"Ravi: {len(rc)} credit txns, {len(rd)} debit txns")


# ── MEENA — Ola Driver, High-Risk Spender, score ~521 ─────────────────────────
# Earns in bursts, 5–8 day zero-income gaps, income does NOT trend up
def meena_schedule():
    credits, debits = [], []
    # Work in clusters: 3–5 days on, 4–7 days gap
    d = START
    while d <= END:
        # On period
        on_days = random.randint(3, 6)
        for _ in range(on_days):
            if d > END: break
            amt = random.gauss(900, 350)
            credits.append((d, max(200, amt)))
            d += timedelta(days=1)
        # Gap (no income)
        gap_days = random.randint(4, 8)
        d += timedelta(days=gap_days)
    # Heavy debits — high expense ratio
    for day in ALL_DAYS:
        if day.day == 1:
            debits.append((day, random.uniform(7000, 9000)))  # rent (higher)
        if random.random() < 0.6:
            debits.append((day, random.uniform(150, 500)))    # daily spending
        if random.random() < 0.2:
            debits.append((day, random.uniform(500, 1200)))   # entertainment
    return credits, debits

mc, md = meena_schedule()
pd.DataFrame(build_rows(mc, md)).to_csv(f"{OUT}/meena.csv", index=False)
print(f"Meena: {len(mc)} credit txns, {len(md)} debit txns")


# ── SURESH — Urban Co Plumber, Stable Earner, score ~742 ──────────────────────
# Earns Mon–Sat consistently, high-value jobs, very low variance
def suresh_schedule():
    credits, debits = [], []
    for d in ALL_DAYS:
        if d.weekday() == 6:   # Sunday off
            continue
        if random.random() < 0.06:   # rare skip
            continue
        # Stable high income with low variance
        amt = random.gauss(1100, 90)
        credits.append((d, max(800, amt)))
    # Low expense ratio
    for d in ALL_DAYS:
        if d.day == 1:
            debits.append((d, random.uniform(5000, 6000)))   # rent
        if d.weekday() in (1, 4):
            debits.append((d, random.uniform(150, 300)))     # fuel
        if random.random() < 0.3:
            debits.append((d, random.uniform(50, 200)))      # food
    return credits, debits

sc, sd = suresh_schedule()
pd.DataFrame(build_rows(sc, sd)).to_csv(f"{OUT}/suresh.csv", index=False)
print(f"Suresh: {len(sc)} credit txns, {len(sd)} debit txns")

print(f"\n✅ Persona CSVs saved to: {OUT}/")
