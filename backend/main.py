from fastapi import FastAPI
from pydantic import BaseModel
import uvicorn

# --- Data Model (Pydantic ensures data quality) ---
# This is our "McKinsey-oriented" data structure.
class StrategicInsight(BaseModel):
    id: int
    title: str
    insight: str
    source: str
    theme: str

# --- Initialize the App ---
app = FastAPI(
    title="MAX X Strategy API",
    description="Strategic Execution Engine Backend",
    version="1.0.0"
)

# --- API Endpoints ---

@app.get("/")
def get_root():
    """
    Root endpoint to confirm the API is running.
    """
    return {"status": "MAX X Strategy API is running..."}


@app.get("/api/v1/insight", response_model=StrategicInsight)
def get_strategic_insight():
    """
    Returns the current Strategic Insight of the Day.
    This is the "McKinsey-oriented" content.
    """
    # Later, this data will come from a database or AI model.
    mock_insight = StrategicInsight(
        id=20251104,
        title="The Imperative of Adaptability",
        insight="Organizations that build adaptive capacity into their core operating models outperform their peers by 25% in volatile markets.",
        source="MAX X Analysis (Mckinsey Inspired)",
        theme="Business Transformation"
    )
    return mock_insight

# --- Main execution (for local testing if needed) ---
if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
