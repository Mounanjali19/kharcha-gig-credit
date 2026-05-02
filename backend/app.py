"""
app.py  — Kharcha Backend API
Run:  python app.py
Port: 5000

Endpoints:
  POST /api/score          → upload CSV, get full score object
  GET  /api/persona/:name  → load pre-built persona (ravi / meena / suresh)
  GET  /api/health         → sanity check
"""

import os, json
import pandas as pd
from flask import Flask, request, jsonify
from flask_cors import CORS
from scoring_engine import score_from_df

app = Flask(__name__)
CORS(app)   # Allow React frontend (localhost:5173 or Vercel) to call this

BASE_DIR    = os.path.dirname(__file__)
PERSONA_DIR = os.path.join(BASE_DIR, "personas")

# ── Health check ──────────────────────────────────────────────────────────────
@app.route("/api/health")
def health():
    return jsonify({"status": "ok", "service": "Kharcha Backend"})


# ── Score from uploaded CSV ───────────────────────────────────────────────────
@app.route("/api/score", methods=["POST"])
def score_csv():
    """
    Accepts:  multipart/form-data  with field 'file' (CSV) and optional 'name'
    Returns:  full Kharcha score JSON
    """
    if "file" not in request.files:
        return jsonify({"error": "No file uploaded. Send a CSV with field name 'file'."}), 400

    file        = request.files["file"]
    worker_name = request.form.get("name", "Worker")

    if file.filename == "":
        return jsonify({"error": "Empty filename."}), 400

    try:
        df = pd.read_csv(file)
        result = score_from_df(df, worker_name)
        return jsonify(result)
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# ── Load pre-built persona ─────────────────────────────────────────────────────
@app.route("/api/persona/<name>")
def load_persona(name: str):
    """
    name: ravi | meena | suresh
    Loads the pre-generated CSV and returns the score object.
    """
    name = name.lower().strip()
    csv_path = os.path.join(PERSONA_DIR, f"{name}.csv")

    if not os.path.exists(csv_path):
        return jsonify({"error": f"Persona '{name}' not found. Options: ravi, meena, suresh"}), 404

    display_names = {"ravi": "Ravi", "meena": "Meena", "suresh": "Suresh"}

    try:
        df     = pd.read_csv(csv_path)
        result = score_from_df(df, display_names.get(name, name.title()))
        return jsonify(result)
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# ── List available personas ────────────────────────────────────────────────────
@app.route("/api/personas")
def list_personas():
    personas = [
        {
            "id":       "ravi",
            "name":     "Ravi",
            "job":      "Swiggy Driver",
            "city":     "Bengaluru",
            "quote":    "I have been delivering for 3 years. Banks kept saying no. Kharcha showed them who I really am.",
        },
        {
            "id":       "meena",
            "name":     "Meena",
            "job":      "Ola Driver",
            "city":     "Mysuru",
            "quote":    "My income goes up and down. No bank understood that. Kharcha does.",
        },
        {
            "id":       "suresh",
            "name":     "Suresh",
            "job":      "Urban Co Plumber",
            "city":     "Bengaluru",
            "quote":    "Steady work, steady income. Finally a score that proves it.",
        },
    ]
    return jsonify(personas)


if __name__ == "__main__":
    # Generate persona CSVs if they don't exist yet
    if not os.path.exists(PERSONA_DIR) or not os.listdir(PERSONA_DIR):
        print("⚙️  Generating persona CSVs...")
        import generate_personas  # runs on import
        print("✅  Personas ready.")

    print("\n🚀  Kharcha backend running at http://localhost:5000\n")
    app.run(debug=True, port=5000)
