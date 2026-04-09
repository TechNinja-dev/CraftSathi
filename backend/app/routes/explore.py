# app/routes/explore.py
from fastapi import APIRouter, HTTPException, Query, Body
from app.services.explore_service import (
    get_explore_posts, 
    get_explore_profile,
    update_explore_avatar, 
    delete_explore_avatar, 
    edit_explore_profile,
    create_explore_post,
    save_post,
    unsave_post,
    get_saved_posts
)
from app.models.user_models import AvatarUpdateRequest, ProfileEditRequest, CreatePostRequest, SavePostRequest
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
    - Flattens array-based user schema natively via MongoDB Aggregation
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

@router.get("/users_explore")
async def get_user_explore_profile(
    userId: str = Query(..., description="User ID")
):
    """
    Fetch a user's explore profile: name, avatar, total_posts, total_followers.
    """
    profile = get_explore_profile(userId)
    if not profile:
        raise HTTPException(status_code=404, detail="Explore profile not found")
    return {"status": "success", "data": profile}

@router.put("/profile/avatar")
async def update_avatar(req: AvatarUpdateRequest):
    success, msg = update_explore_avatar(req.user_id, req.avatar)
    if not success:
        raise HTTPException(status_code=500, detail=msg)
    return {"status": "success", "message": msg}

@router.delete("/profile/avatar")
async def delete_avatar(user_id: str = Query(..., description="User ID to delete avatar for")):
    success, msg = delete_explore_avatar(user_id)
    if not success:
        raise HTTPException(status_code=500, detail=msg)
    return {"status": "success", "message": msg}

@router.put("/profile/edit")
async def edit_profile(req: ProfileEditRequest):
    success, msg = edit_explore_profile(req.user_id, req.explore_name)
    if not success:
        raise HTTPException(status_code=500, detail=msg)
    return {"status": "success", "message": msg}

@router.post("/posts/create")
async def create_post(req: CreatePostRequest):
    success, result = create_explore_post(req.user_id, req.user_name, req.explore_name, req.image_url, req.caption)
    if not success:
        raise HTTPException(status_code=500, detail=result)
    return {"status": "success", "data": result}

@router.get("/posts/saved")
async def fetch_saved_posts(
    userId: str = Query(..., description="Logged in user ID"),
    limit: int = Query(20, ge=1, le=100, description="Number of posts per page"),
    page: int = Query(1, ge=1, description="Page number")
):
    try:
        result = get_saved_posts(user_id=userId, limit=limit, page=page)
        return {
            "status": "success",
            "data": result
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/posts/save")
async def save_user_post(req: SavePostRequest):
    success, msg = save_post(req.user_id, req.post_id)
    if not success:
        raise HTTPException(status_code=500, detail=msg)
    return {"status": "success", "message": msg}

@router.delete("/posts/save")
async def unsave_user_post(user_id: str = Query(...), post_id: str = Query(...)):
    success, msg = unsave_post(user_id, post_id)
    if not success:
        raise HTTPException(status_code=500, detail=msg)
    return {"status": "success", "message": msg}