from fastapi import HTTPException
from bson import ObjectId
from app.db.mongodb import user_col, videos_col, users_dash_col

async def get_videos(userId: str):
    try:
        user_doc = user_col.find_one({"u_Id": userId})
        if not user_doc:
            return {"videos": []}

        cursor = videos_col.find(
            {"user_id": user_doc["_id"]}
        ).sort("created_at", -1)

        videos = []
        for doc in cursor:
            videos.append({
                "id": str(doc["_id"]),
                "prompt": doc["prompt"],
                "enhanced_prompt": doc.get("enhanced_prompt", ""),
                "video_url": doc["video_url"],
                "created_at": doc["created_at"].isoformat() if doc.get("created_at") else None
            })

        return {"videos": videos}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

async def delete_video(videoId: str, userId: str):
    try:
        user_doc = user_col.find_one({"u_Id": userId})
        if not user_doc:
            raise HTTPException(status_code=404, detail="User not found")

        result = videos_col.delete_one({
            "_id": ObjectId(videoId),
            "user_id": user_doc["_id"]
        })

        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Video not found")
        
        users_dash_col.update_one(
            {"u_Id": userId},
            {"$inc": {"total_videos_generated": -1}},
            upsert=True
        )

        return {"message": "Video deleted successfully"}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
