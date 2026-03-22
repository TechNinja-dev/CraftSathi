from fastapi import APIRouter, HTTPException
from datetime import datetime
from app.db.mongodb import user_col, images_col

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
        
        # Fetch all user's images/posts
        cursor = images_col.find(
            {"user_id": user_doc["_id"]}
        ).sort("created_at", -1)
        
        posts = []
        total_captions = 0
        total_images = 0
        
        for doc in cursor:
            # Determine post type
            if doc.get("image_url"):
                post_type = "image"
                total_images += 1
            else:
                post_type = "caption"
                total_captions += 1
            
            posts.append({
                "id": str(doc["_id"]),
                "type": post_type,
                "prompt": doc.get("prompt", ""),
                "caption": doc.get("caption", ""),
                "image_url": doc.get("image_url", ""),
                "created_at": doc.get("created_at", datetime.utcnow()).isoformat()
            })
        
        # Get member since date (when user first registered)
        member_since = user_doc.get("created_at", datetime.utcnow())
        
        return {
            "user": {
                "name": user_doc.get("u_name"),
                "email": user_doc.get("u_mail"),
                "u_Id": user_doc.get("u_Id")
            },
            "posts": posts,
            "totalCaptions": total_captions,
            "totalImages": total_images,
            "memberSince": member_since.isoformat() if isinstance(member_since, datetime) else member_since
        }
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"Profile fetch error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))