# app/routes/captions.py
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
from app.db.mongodb import caption_col, user_col,users_dash_col
from firebase_admin import auth
from app.models.user_models import SaveCaptionRequest,GetCaptionsRequest
router = APIRouter()


@router.post("/api/save-caption")
async def save_caption(request: SaveCaptionRequest):
    user_doc = user_col.find_one({"u_Id": request.userId})
    if not user_doc:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Update or create user's caption document
    result = caption_col.update_one(
        {"u_Id": request.userId},
        {
            "$set": {
                "u_name": user_doc.get("u_name"),
                "updated_at": datetime.utcnow()
            },
            "$push": {f"saved_captions.{request.image_url}": request.caption}
        },
        upsert=True
    )
    
    return {"success": True, "message": "Caption saved"}


@router.get("/api/get-captions")
async def get_captions(userId: str):
    doc = caption_col.find_one({"u_Id": userId})
    
    if not doc:
        return {"success": True, "caption_groups": [], "total": 0}
    
    saved_captions = doc.get("saved_captions", {})
    
    # Convert to list format for frontend
    caption_groups = []
    total = 0
    for image_url, captions_list in saved_captions.items():
        caption_groups.append({
            "image_url": image_url,
            "captions": captions_list,
            "caption_count": len(captions_list)
        })
        total += len(captions_list)
    
    return {
        "success": True,
        "caption_groups": caption_groups,
        "total": total
    }


from fastapi import Query

@router.delete("/api/delete-caption")
async def delete_caption(
    userId: str = Query(...),
    image_url: str = Query(...),
    captionIndex: int = Query(...)
):
    """
    Delete a specific caption from a user's saved captions
    """
    try:
        # Find user's caption document
        doc = caption_col.find_one({"u_Id": userId})
        if not doc:
            raise HTTPException(status_code=404, detail="User not found")
        
        # Get the captions list for this image URL
        saved_captions = doc.get("saved_captions", {})
        
        if image_url not in saved_captions:
            raise HTTPException(status_code=404, detail="Image URL not found")
        
        captions_list = saved_captions[image_url]
        
        if captionIndex < 0 or captionIndex >= len(captions_list):
            raise HTTPException(status_code=400, detail="Invalid caption index")
        
        # Remove the caption
        removed_caption = captions_list.pop(captionIndex)
        
        if len(captions_list) == 0:
            # Remove the image_url key if no captions left
            caption_col.update_one(
                {"u_Id": userId},
                {"$unset": {f"saved_captions.{image_url}": ""}}
            )
            message = "Caption removed and empty group deleted"
        else:
            # Update the captions list
            caption_col.update_one(
                {"u_Id": userId},
                {"$set": {f"saved_captions.{image_url}": captions_list}}
            )
            message = "Caption deleted successfully"
        
        # Decrement total_captions_generated counter
        # users_dash_col.update_one(
        #     {"u_Id": userId},
        #     {"$inc": {"total_captions_generated": -1}},
        #     upsert=True
        # )
        
        return {
            "success": True,
            "message": message
        }
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"Delete caption error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@router.delete("/api/delete-caption-group")
async def delete_caption_group(
    userId: str = Query(...),
    image_url: str = Query(...)
):
    """
    Delete an entire caption group (all captions for an image)
    """
    try:
        # Find user's caption document
        doc = caption_col.find_one({"u_Id": userId})
        if not doc:
            raise HTTPException(status_code=404, detail="User not found")
        
        saved_captions = doc.get("saved_captions", {})
        
        if image_url not in saved_captions:
            raise HTTPException(status_code=404, detail="Image URL not found")
        
        caption_count = len(saved_captions[image_url])
        
        # Remove the image_url key
        result = caption_col.update_one(
            {"u_Id": userId},
            {"$unset": {f"saved_captions.{image_url}": ""}}
        )
        
        if result.modified_count == 0:
            raise HTTPException(status_code=404, detail="Failed to delete caption group")
        
        # Decrement total_captions_generated counter by the number of captions deleted
        # users_dash_col.update_one(
        #     {"u_Id": userId},
        #     {"$inc": {"total_captions_generated": -caption_count}},
        #     upsert=True
        # )
        
        return {
            "success": True,
            "message": f"Caption group deleted successfully ({caption_count} captions removed)"
        }
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"Delete caption group error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))