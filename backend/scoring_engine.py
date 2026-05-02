"""
scoring_engine.py
Core brain of Kharcha.
Takes a parsed DataFrame → returns a complete score object.

Exports:
    score_from_df(df)  →  dict (the full Kharcha score object)
"""

import numpy as np
import pandas as pd
from datetime import timedelta

# ── Constants ─────────────────────────────────────────────────────────────────
BASE_SCORE = 300
MAX_SCORE  = 850

WEIGHTS = {
    "income_consistency": 0.30,   # max +165
    "earning_trend":      0.25,   # max +137
    "transaction_volume": 0.25,   # max +138
    "expense_control":    0.20,   # max +110
}
MAX_POINTS = {k: round((MAX_SCORE - BASE_SCORE) * v) for k, v in WEIGHTS.items()}


# ── Helpers ───────────────────────────────────────────────────────────────────
def _safe_cv(arr):
    """Coefficient of variation, clamped."""
    arr = np.array(arr, dtype=float)
    mean = arr.mean()
    if mean == 0:
        return 1.0
    return float(np.std(arr) / mean)


def _normalize(value, min_val, max_val, invert=False):
    """Map value from [min_val, max_val] → [0, 1]. Clamp edges."""
    if max_val == min_val:
        return 0.0
    ratio = (value - min_val) / (max_val - min_val)
    ratio = float(np.clip(ratio, 0, 1))
    return 1 - ratio if invert else ratio


# ── Step 1: Parse & aggregate CSV ────────────────────────────────────────────
def parse_dataframe(df: pd.DataFrame) -> dict:
    """
    Input df columns: date, description, amount, type (credit/debit)
    Returns structured dict of aggregations.
    """
    df = df.copy()
    df["date"]   = pd.to_datetime(df["date"])
    df["amount"] = pd.to_numeric(df["amount"], errors="coerce").fillna(0)
    df["type"]   = df["type"].str.lower().str.strip()

    credits = df[df["type"] == "credit"].copy()
    debits  = df[df["type"] == "debit"].copy()

    # Monthly income totals
    credits["month"] = credits["date"].dt.to_period("M")
    monthly_income = (
        credits.groupby("month")["amount"]
        .sum()
        .sort_index()
    )

    # Daily income (for stability sub-scores)
    credits["day_str"] = credits["date"].dt.date
    daily_income = credits.groupby("day_str")["amount"].sum()

    # Total income / expense
    total_income  = float(credits["amount"].sum())
    total_expense = float(debits["amount"].sum())

    return {
        "credits":       credits,
        "debits":        debits,
        "monthly_income": monthly_income,
        "daily_income":   daily_income,
        "total_income":   total_income,
        "total_expense":  total_expense,
        "total_txn_count": len(df),
    }


# ── Step 2: Four core score factors ──────────────────────────────────────────
def factor_income_consistency(monthly_income: pd.Series) -> dict:
    """
    Lower coefficient of variation = more consistent = higher score.
    """
    values = monthly_income.values
    if len(values) < 2:
        return {"raw": 0.0, "points": 0, "detail": "Not enough data"}
    cv = _safe_cv(values)
    # cv=0 → perfect consistency, cv=1+ → very volatile
    # map cv from [0, 1] → score [MAX, 0]
    ratio = _normalize(cv, 0, 1.0, invert=True)
    points = round(ratio * MAX_POINTS["income_consistency"])
    return {
        "raw":    round(cv, 3),
        "points": points,
        "max":    MAX_POINTS["income_consistency"],
        "detail": f"Monthly income variance (CV): {cv:.2%}",
    }


def factor_earning_trend(monthly_income: pd.Series) -> dict:
    """
    Positive linear regression slope over months = upward trend = higher score.
    """
    values = monthly_income.values
    if len(values) < 2:
        return {"raw": 0.0, "points": 0, "detail": "Not enough data"}
    x = np.arange(len(values))
    slope = float(np.polyfit(x, values, 1)[0])
    # Normalize: slope in range [-500, +500] → [0, 1]
    ratio = _normalize(slope, -500, 500)
    points = round(ratio * MAX_POINTS["earning_trend"])
    return {
        "raw":    round(slope, 2),
        "points": points,
        "max":    MAX_POINTS["earning_trend"],
        "detail": f"Monthly income slope: ₹{slope:+.0f}/month",
    }


def factor_transaction_volume(total_txn_count: int) -> dict:
    """
    More transactions = more data = more trust. Log-normalized.
    """
    # Reference: 500 txns over 6 months = good
    ratio = _normalize(np.log1p(total_txn_count), 0, np.log1p(600))
    points = round(ratio * MAX_POINTS["transaction_volume"])
    return {
        "raw":    total_txn_count,
        "points": points,
        "max":    MAX_POINTS["transaction_volume"],
        "detail": f"Total transactions: {total_txn_count}",
    }


def factor_expense_control(total_income: float, total_expense: float) -> dict:
    """
    Higher income-to-expense ratio = better control.
    """
    if total_income == 0:
        return {"raw": 0.0, "points": 0, "detail": "No income data"}
    ratio = total_income / max(total_expense, 1)
    # ratio > 2 = excellent, ratio < 0.8 = spending more than earning
    norm = _normalize(ratio, 0.5, 2.5)
    points = round(norm * MAX_POINTS["expense_control"])
    return {
        "raw":    round(ratio, 3),
        "points": points,
        "max":    MAX_POINTS["expense_control"],
        "detail": f"Income/Expense ratio: {ratio:.2f}x",
    }


# ── Step 3: Income Stability Engine (3 sub-scores) ────────────────────────────
def income_stability_engine(credits: pd.DataFrame, daily_income: pd.Series) -> dict:
    """
    Returns a stability score 0–100 with 3 sub-scores.
    """

    # --- Sub-score A: Daily income variance ---
    daily_vals = daily_income.values
    if len(daily_vals) < 3:
        daily_cv_score = 0
    else:
        cv = _safe_cv(daily_vals)
        daily_cv_score = round(_normalize(cv, 0, 1.2, invert=True) * 100)

    # --- Sub-score B: Earning gap analysis ---
    # What % of days had ZERO income?
    if credits.empty:
        gap_score = 0
    else:
        date_min = credits["date"].min().date()
        date_max = credits["date"].max().date()
        total_days = (date_max - date_min).days + 1
        earning_days = len(daily_income)
        zero_days = total_days - earning_days
        gap_ratio = zero_days / max(total_days, 1)
        gap_score = round(_normalize(gap_ratio, 0, 0.6, invert=True) * 100)

    # --- Sub-score C: Cash-flow pattern (weekday consistency) ---
    if credits.empty:
        pattern_score = 0
    else:
        credits["weekday"] = credits["date"].dt.dayofweek
        weekday_counts = credits["weekday"].value_counts()
        # How many weekdays have at least some activity? (max 7)
        active_weekdays = (weekday_counts >= 2).sum()
        pattern_score = round(_normalize(active_weekdays, 1, 6) * 100)

    overall = round((daily_cv_score + gap_score + pattern_score) / 3)

    return {
        "overall":             overall,
        "daily_variance_score":  daily_cv_score,
        "gap_score":             gap_score,
        "pattern_score":         pattern_score,
        "labels": {
            "daily_variance":  "Daily Income Variance",
            "gap":             "Earning Gaps",
            "pattern":         "Cash Flow Pattern",
        }
    }


# ── Step 4: Behavior Profile ──────────────────────────────────────────────────
def classify_behavior(gig_score: int, stability: dict, trend_slope: float) -> dict:
    """
    Returns one of 4 archetypes based on score + stability + trend.
    """
    overall_stab = stability["overall"]

    # Seasonal: high gap score variance — gaps are clustered
    gap_s   = stability["gap_score"]
    cv_s    = stability["daily_variance_score"]

    if gig_score >= 650 and overall_stab >= 70:
        profile = "Stable Earner"
        emoji   = "🟢"
        color   = "green"
        desc    = "Consistent income, low variance. Best candidate for loans."
        lender  = "Fast-track approval. Offer Tier 1 loan."

    elif trend_slope > 50 and gig_score >= 520:
        profile = "Growing Hustler"
        emoji   = "🟡"
        color   = "yellow"
        desc    = "Income trending upward. Occasional dips but clear growth trajectory."
        lender  = "Approve Tier 2. Monitor 2 months, upgrade to Tier 1."

    elif gap_s < 40 and cv_s < 40:
        profile = "Seasonal Worker"
        emoji   = "🔵"
        color   = "blue"
        desc    = "Earns in clusters — strong peaks, quiet troughs. Predictable seasonality."
        lender  = "Structure EMIs around high-income months. Not inherently risky."

    else:
        profile = "High-Risk Spender"
        emoji   = "🔴"
        color   = "red"
        desc    = "Irregular income and high expense ratio. Needs financial coaching first."
        lender  = "Micro-loan only. Pair with financial health tips."

    return {
        "type":    profile,
        "emoji":   emoji,
        "color":   color,
        "desc":    desc,
        "lender":  lender,
    }


# ── Step 5: Trust Score (B2B lender layer) ────────────────────────────────────
def compute_trust_score(gig_score: int) -> dict:
    if gig_score >= 700:
        return {
            "tier":   "LOW RISK",
            "color":  "green",
            "action": "Safe to lend — full amount",
            "loan_range": "₹40,000 – ₹75,000",
            "rate":   "12–14%",
            "nbfcs":  ["KreditBee", "PaySense"],
        }
    elif gig_score >= 600:
        return {
            "tier":   "MEDIUM RISK",
            "color":  "orange",
            "action": "Small loan — verified income",
            "loan_range": "₹15,000 – ₹40,000",
            "rate":   "16–18%",
            "nbfcs":  ["MoneyTap", "EarlySalary"],
        }
    else:
        return {
            "tier":   "HIGH RISK",
            "color":  "red",
            "action": "Decline or require guarantor",
            "loan_range": "₹5,000 – ₹15,000",
            "rate":   "22–24%",
            "nbfcs":  ["StashFin"],
        }


# ── Step 6: Future Income Prediction ─────────────────────────────────────────
def predict_future_income(monthly_income: pd.Series) -> dict:
    """
    Two methods: weighted 3-month avg + linear trend extrapolation.
    Returns a range and display string.
    """
    values = list(monthly_income.values)

    # Method A: weighted 3-month average (50 / 30 / 20)
    if len(values) >= 3:
        w_avg = values[-1]*0.50 + values[-2]*0.30 + values[-3]*0.20
    elif len(values) == 2:
        w_avg = values[-1]*0.65 + values[-2]*0.35
    else:
        w_avg = values[-1] if values else 0

    # Method B: linear trend extrapolation
    if len(values) >= 2:
        x = np.arange(len(values))
        coeffs = np.polyfit(x, values, 1)
        trend_pred = float(np.polyval(coeffs, len(values)))
    else:
        trend_pred = w_avg

    # Blend both methods
    predicted = round((w_avg * 0.6 + trend_pred * 0.4))
    low       = round(predicted * 0.85)
    high      = round(predicted * 1.15)

    return {
        "predicted":  predicted,
        "low":        low,
        "high":       high,
        "weighted_avg_method": round(w_avg),
        "trend_method":        round(trend_pred),
        "display": f"₹{predicted:,}  (Range: ₹{low:,} – ₹{high:,})",
    }


# ── Step 7: Monthly score history (for explainability) ───────────────────────
def monthly_score_history(monthly_income: pd.Series) -> list:
    """
    For each month of available data, compute what the score would have been
    using only data up to that month.
    """
    history = []
    months = list(monthly_income.index)
    for i, month in enumerate(months):
        subset = monthly_income.iloc[:i+1]
        if len(subset) < 1:
            continue

        # Simplified scoring on subset
        cv   = _safe_cv(subset.values)
        cons = round(_normalize(cv, 0, 1.0, invert=True) * MAX_POINTS["income_consistency"])

        if len(subset) >= 2:
            x = np.arange(len(subset))
            slope = float(np.polyfit(x, subset.values, 1)[0])
        else:
            slope = 0
        trend = round(_normalize(slope, -500, 500) * MAX_POINTS["earning_trend"])

        # Use last known total txn as placeholder for volume
        vol_pts = round(0.5 * MAX_POINTS["transaction_volume"])  # approximate

        month_score = BASE_SCORE + cons + trend + vol_pts
        month_score = int(np.clip(month_score, BASE_SCORE, MAX_SCORE))
        history.append({
            "month":  str(month),
            "score":  month_score,
            "income": round(float(subset.iloc[-1])),
        })
    return history


# ── Main entry point ──────────────────────────────────────────────────────────
def score_from_df(df: pd.DataFrame, worker_name: str = "Worker") -> dict:
    """
    Full pipeline: raw CSV DataFrame → complete Kharcha score object.
    """
    parsed = parse_dataframe(df)

    monthly = parsed["monthly_income"]
    credits = parsed["credits"]
    daily   = parsed["daily_income"]

    # Core 4 factors
    f_consistency = factor_income_consistency(monthly)
    f_trend       = factor_earning_trend(monthly)
    f_volume      = factor_transaction_volume(parsed["total_txn_count"])
    f_expense     = factor_expense_control(parsed["total_income"], parsed["total_expense"])

    # Gig Credit Score
    raw_score = (
        BASE_SCORE
        + f_consistency["points"]
        + f_trend["points"]
        + f_volume["points"]
        + f_expense["points"]
    )
    gig_score = int(np.clip(raw_score, BASE_SCORE, MAX_SCORE))

    # Stability, behavior, trust, prediction
    stability   = income_stability_engine(credits, daily)
    behavior    = classify_behavior(gig_score, stability, f_trend["raw"])
    trust       = compute_trust_score(gig_score)
    prediction  = predict_future_income(monthly)
    history     = monthly_score_history(monthly)

    # Monthly income for chart
    monthly_chart = [
        {"month": str(m), "income": round(float(v))}
        for m, v in monthly.items()
    ]

    return {
        "worker_name": worker_name,

        # Core score
        "gig_score": gig_score,
        "score_tier": (
            "Excellent" if gig_score >= 750 else
            "Good"      if gig_score >= 650 else
            "Medium"    if gig_score >= 500 else
            "High Risk"
        ),

        # Factor breakdown
        "factors": {
            "income_consistency": f_consistency,
            "earning_trend":      f_trend,
            "transaction_volume": f_volume,
            "expense_control":    f_expense,
        },

        # New intelligence layers
        "stability":   stability,
        "behavior":    behavior,
        "trust_score": trust,
        "prediction":  prediction,

        # Charts & history
        "monthly_chart": monthly_chart,
        "score_history": history,

        # Raw summary
        "summary": {
            "total_income":   round(parsed["total_income"]),
            "total_expense":  round(parsed["total_expense"]),
            "total_txn_count": parsed["total_txn_count"],
            "months_of_data": len(monthly),
            "avg_monthly_income": round(float(monthly.mean())) if len(monthly) else 0,
        }
    }
