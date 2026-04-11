from fastapi import APIRouter, HTTPException
from app.services.stats_service import get_app_stats

router = APIRouter(prefix="/api/home", tags=["Home"])

@router.get("/stats")
async def fetch_home_stats():
    try:
        stats = await get_app_stats()
        return {
            "success": True,
            "data": stats
        }
    except Exception as e:
        print(f"Error fetching stats: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch stats")
