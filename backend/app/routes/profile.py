from fastapi import APIRouter, HTTPException
from datetime import datetime
from app.db.mongodb import user_col, images_col,users_dash_col,caption_col

router = APIRouter()

@router.get("/api/profile")
async def get_profile(userId: str):
    """
    Fetch user profile data including posts, stats, and member info
    """
    try:
        # Find user by u_Id
        user_doc = user_col.find_one({"u_Id": userId})
        if not user_doc:
            raise HTTPException(status_code=404, detail="User not found")
        
        # Get stats from users_dash_col (no need to iterate through images_col)
        dash_stats = users_dash_col.find_one({"u_Id": userId})
        # print(dash_stats)
        total_images = int(dash_stats.get("total_images_generated", 0) if dash_stats else 0)
        total_captions = int(dash_stats.get("total_captions_generated", 0) if dash_stats else 0)
        total_videos = int(dash_stats.get("total_videos_generated", 0) if dash_stats else 0)
        total_posts = total_images + total_captions + total_videos
        print("images ",total_images," Total captions ",total_captions)
        print(total_posts)
        
        # Fetch recent posts for display (limit to last 6 for dashboard)
        cursor = images_col.find(
            {"user_id": user_doc["_id"]}
        ).sort("created_at", -1).limit(6)
        
        posts = []
        for doc in cursor:
            posts.append({
                "id": str(doc["_id"]),
                "type": "image",
                "prompt": doc.get("prompt", ""),
                "image_url": doc.get("image_url", ""),
                "created_at": doc.get("created_at", datetime.utcnow()).isoformat()
            })
        
        # Get member since date
        member_since = user_doc.get("created_at", datetime.utcnow())
        
        # Build profile data with fallbacks
        profile_data = {
            "name": dash_stats.get("u_name") if dash_stats else user_doc.get("u_name"),
            "avatar": dash_stats.get("avatar") if dash_stats else None,
            "country": dash_stats.get("country") if dash_stats else "",
            "bio": dash_stats.get("bio") if dash_stats else "",
            "specialties": dash_stats.get("specialties") if dash_stats else [],
            "instagram": dash_stats.get("instagram") if dash_stats else "",
            "youtube": dash_stats.get("youtube") if dash_stats else "",
            "website": dash_stats.get("website") if dash_stats else "",
            "experience": dash_stats.get("experience") if dash_stats else "",
            "favoriteMaterials": dash_stats.get("favoriteMaterials") if dash_stats else []
        }
        
        return {
            "user": {
                "name": user_doc.get("u_name"),
                "email": user_doc.get("u_mail"),
                "u_Id": user_doc.get("u_Id")
            },
            "profile": profile_data,
            "posts": total_posts,
            "totalCaptions": total_captions,
            "totalImages": total_images,
            "totalVideos": total_videos,
            "memberSince": member_since.isoformat() if isinstance(member_since, datetime) else member_since
        }
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"Profile fetch error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@router.put("/api/profile/update")
async def update_profile(data: dict):
    try:
        userId = data.get("userId")
        profile = data.get("profile")
        
        if not userId:
            raise HTTPException(status_code=400, detail="User ID required")
        
        # Update user's dashboard collection
        result = users_dash_col.update_one(
            {"u_Id": userId},
            {"$set": {
                "u_name":profile.get("name"),
                "avatar": profile.get("avatar"),
                "country": profile.get("country"),
                "bio": profile.get("bio"),
                "specialties": profile.get("specialties", []),
                "instagram": profile.get("instagram"),
                "youtube": profile.get("youtube"),
                "website": profile.get("website"),
                "experience": profile.get("experience"),
                "favoriteMaterials": profile.get("favoriteMaterials", [])
            }},
            upsert=True
        )
        user_col.update_one(
            {"u_Id": userId},
            {"$set": {"u_name": profile.get("name")}}
        )
        
        return {
            "success": True,
            "profile": profile
        }
        
    except Exception as e:
        print(f"Profile update error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))
    

@router.put("/api/profile/update-avatar")
async def update_avatar(data: dict):
    try:
        userId = data.get("userId")
        avatar = data.get("avatar")
        
        if not userId:
            raise HTTPException(status_code=400, detail="User ID required")
        
        result = users_dash_col.update_one(
            {"u_Id": userId},
            {"$set": {"avatar": avatar}},
            upsert=True
        )
        
        return {"success": True, "avatar": avatar}
        
    except Exception as e:
        print(f"Avatar update error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@router.put("/api/profile/remove-avatar")
async def remove_avatar(data: dict):
    try:
        userId = data.get("userId")
        
        if not userId:
            raise HTTPException(status_code=400, detail="User ID required")
        
        result = users_dash_col.update_one(
            {"u_Id": userId},
            {"$set": {"avatar": None}},
            upsert=True
        )
        
        return {"success": True}
        
    except Exception as e:
        print(f"Avatar removal error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))