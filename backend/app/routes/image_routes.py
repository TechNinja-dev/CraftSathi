from fastapi import APIRouter, HTTPException
from bson import ObjectId
from app.db.mongodb import user_col, images_col
from app.models.ai_models import MyStuffResponse

router = APIRouter(prefix="/api", tags=["Images"])


@router.get("/mystuff", response_model=MyStuffResponse)
async def get_my_stuff(userId: str):
    try:
        user_doc = user_col.find_one({"u_Id": userId})
        if not user_doc:
            return {"images": []}

        cursor = images_col.find(
            {"user_id": user_doc["_id"]}
        ).sort("created_at", -1)

        images = []
        for doc in cursor:
            images.append({
                "id": str(doc["_id"]),
                "prompt": doc["prompt"],
                "image_url": doc["image_url"],
                "created_at": doc["created_at"].isoformat()
            })

        return {"images": images}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.delete("/delete-image")
async def delete_image(imageId: str, userId: str):
    try:
        user_doc = user_col.find_one({"u_Id": userId})
        if not user_doc:
            raise HTTPException(status_code=404, detail="User not found")

        result = images_col.delete_one({
            "_id": ObjectId(imageId),
            "user_id": user_doc["_id"]
        })

        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Image not found")

        return {"message": "Image deleted successfully"}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))