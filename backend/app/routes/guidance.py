from fastapi import APIRouter, HTTPException
from app.models.ai_models import CraftAnalysisRequest, CraftAnalysisResponse

# Import the service function
from app.services.guidance_service import craft_analysis

router = APIRouter(tags=["Guidance"])

@router.post("/analyzecraft", response_model=CraftAnalysisResponse)
async def analyze_craft(request: CraftAnalysisRequest):
    """
    Analyzes an uploaded craft image to provide global market intelligence, 
    quality assessment, pricing, and profit forecasts.
    """
    try:
        # Call the craft_analysis service function
        result = await craft_analysis(request.image_url)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
