# app/routes/explore.py
from fastapi import APIRouter, HTTPException, Query
from app.services.explore_service import get_explore_posts
from typing import Optional

router = APIRouter()

@router.get("/explore_posts")
async def explore_posts(
    userId: Optional[str] = Query(None, description="Logged in user ID (optional)"),
    limit: int = Query(20, ge=1, le=100, description="Number of posts per page"),
    page: int = Query(1, ge=1, description="Page number")
):
    """
    Get posts for explore page
    - If userId provided: returns posts from all other users
    - If no userId: returns dummy posts
    """
    try:
        result = get_explore_posts(userId=userId, limit=limit, page=page)
        
        return {
            "status": "success",
            "data": result
        }
        
    except Exception as e:
        print(f"Explore posts endpoint error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))