import os
import joblib
import numpy as np
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pydantic import BaseModel
from typing import List

# ---------------------------------------------------------------------------
# Load model once at startup
# ---------------------------------------------------------------------------
MODEL_PATH = os.path.join(os.path.dirname(__file__), "model.pkl")
model = joblib.load(MODEL_PATH)

# ---------------------------------------------------------------------------
# FastAPI app
# ---------------------------------------------------------------------------
app = FastAPI(title="Breast Cancer Predictor API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------------------------------------------------------------------
# Request / Response schemas
# ---------------------------------------------------------------------------
class PredictionRequest(BaseModel):
    features: List[float]  # exactly 9 values expected

class PredictionResponse(BaseModel):
    prediction: str        # "Benign" or "Malignant"
    cancer_risk: float     # probability of the malignant class (cancer risk)

# ---------------------------------------------------------------------------
# Prediction endpoint
# ---------------------------------------------------------------------------
@app.post("/predict", response_model=PredictionResponse)
async def predict(req: PredictionRequest):
    arr = np.array([req.features])
    pred = model.predict(arr)[0]
    proba = model.predict_proba(arr)[0]

    label = "Malignant" if pred == 4 else "Benign"
    
    # Get the index for class 4 (Malignant), fallback to index 1 just in case
    malignant_idx = list(model.classes_).index(4) if 4 in model.classes_ else 1
    cancer_risk = float(proba[malignant_idx])

    return PredictionResponse(prediction=label, cancer_risk=cancer_risk)

# ---------------------------------------------------------------------------
# Serve static frontend
# ---------------------------------------------------------------------------
STATIC_DIR = os.path.join(os.path.dirname(__file__), "static")
app.mount("/static", StaticFiles(directory=STATIC_DIR), name="static")

@app.get("/")
async def root():
    return FileResponse(os.path.join(STATIC_DIR, "index.html"))

# ---------------------------------------------------------------------------
# Run with: python app.py
# ---------------------------------------------------------------------------
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
