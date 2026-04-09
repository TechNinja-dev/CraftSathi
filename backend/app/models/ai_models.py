from pydantic import BaseModel
from typing import Optional

# --- AI Image Generation Models ---

class PhotoRequest(BaseModel):
    prompt: str
    userId: str | None = None

class VideoRequest(BaseModel):
    prompt: str
    userId: str | None = None

class VideoResponse(BaseModel):
    video_url: Optional[str] = None
    message: Optional[str] = None

class PhotoResponse(BaseModel):
    image_url: Optional[str] = None
    message: Optional[str] = None

# ---  MyStuff Page Content Model ---

class MyStuffResponse(BaseModel):
    images: list

# --- Craft Analysis Models for Guidance Page ---

class CraftAnalysisRequest(BaseModel):
    image_url: str

class QualityScore(BaseModel):
    metric: str
    score: int

class QualityData(BaseModel):
    scores: list[QualityScore]
    strengths: list[str]
    improvements: list[str]

class ForecastDataPoint(BaseModel):
    month: str
    profit: int

class ScenarioData(BaseModel):
    label: str
    range: str
    risk: str
    riskColor: str

class ForecastData(BaseModel):
    forecast: list[ForecastDataPoint]
    scenarios: list[ScenarioData]

class RecommendationData(BaseModel):
    platform: str
    confidence: str
    profitScore: int
    trend: list[int]

class PriceDataPoint(BaseModel):
    country: str
    flag: str
    price: int
    confidence: int
    color: str

class ReportItem(BaseModel):
    label: str
    value: str

class CraftAnalysisResponse(BaseModel):
    quality: QualityData
    forecast: ForecastData
    recommendations: list[RecommendationData]
    pricing: list[PriceDataPoint]
    report: list[ReportItem]