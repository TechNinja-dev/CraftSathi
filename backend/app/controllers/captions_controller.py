from fastapi import HTTPException
from app.db.mongodb import caption_col, user_col
from app.models.user_models import SaveCaptionRequest
from datetime import datetime

def encode_key(url: str) -> str:
    """Sanitizes periods to prevent MongoDB dot-notation nested object crashes."""
    return url.replace(".", "_dot_")

def decode_key(key: str) -> str:
    """Restores periods so the React frontend can load the valid image URL."""
    return key.replace("_dot_", ".")

async def save_caption(request: SaveCaptionRequest):
    user_doc = user_col.find_one({"u_Id": request.userId})
    if not user_doc:
        raise HTTPException(status_code=404, detail="User not found")
    
    encoded_url = encode_key(request.image_url)
    
    # Update or create user's caption document
    result = caption_col.update_one(
        {"u_Id": request.userId},
        {
            "$set": {
                "u_name": user_doc.get("u_name"),
                "updated_at": datetime.utcnow()
            },
            "$push": {f"saved_captions.{encoded_url}": request.caption}
        },
        upsert=True
    )
    
    return {"success": True, "message": "Caption saved"}


async def get_captions(userId: str):
    doc = caption_col.find_one({"u_Id": userId})
    
    if not doc:
        return {"success": True, "caption_groups": [], "total": 0}
    
    saved_captions = doc.get("saved_captions", {})
    
    # Convert to list format for frontend
    caption_groups = []
    total = 0
    for safe_key, captions_list in saved_captions.items():
        original_url = decode_key(safe_key)
        
        caption_groups.append({
            "image_url": original_url,
            "captions": captions_list,
            "caption_count": len(captions_list)
        })
        total += len(captions_list)
    
    return {
        "success": True,
        "caption_groups": caption_groups,
        "total": total
    }


async def delete_caption(userId: str, image_url: str, captionIndex: int):
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
        
        encoded_url = encode_key(image_url)
        
        if encoded_url not in saved_captions:
            raise HTTPException(status_code=404, detail="Image URL not found")
        
        captions_list = saved_captions[encoded_url]
        
        if captionIndex < 0 or captionIndex >= len(captions_list):
            raise HTTPException(status_code=400, detail="Invalid caption index")
        
        # Remove the caption
        removed_caption = captions_list.pop(captionIndex)
        
        if len(captions_list) == 0:
            # Remove the encoded_url key if no captions left
            caption_col.update_one(
                {"u_Id": userId},
                {"$unset": {f"saved_captions.{encoded_url}": ""}}
            )
            message = "Caption removed and empty group deleted"
        else:
            # Update the captions list
            caption_col.update_one(
                {"u_Id": userId},
                {"$set": {f"saved_captions.{encoded_url}": captions_list}}
            )
            message = "Caption deleted successfully"
        
        return {
            "success": True,
            "message": message
        }
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"Delete caption error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


async def delete_caption_group(userId: str, image_url: str):
    """
    Delete an entire caption group (all captions for an image)
    """
    try:
        # Find user's caption document
        doc = caption_col.find_one({"u_Id": userId})
        if not doc:
            raise HTTPException(status_code=404, detail="User not found")
        
        saved_captions = doc.get("saved_captions", {})
        
        encoded_url = encode_key(image_url)
        
        if encoded_url not in saved_captions:
            raise HTTPException(status_code=404, detail="Image URL not found")
        
        caption_count = len(saved_captions[encoded_url])
        
        # Remove the encoded_url key
        result = caption_col.update_one(
            {"u_Id": userId},
            {"$unset": {f"saved_captions.{encoded_url}": ""}}
        )
        
        if result.modified_count == 0:
            raise HTTPException(status_code=404, detail="Failed to delete caption group")
        
        return {
            "success": True,
            "message": f"Caption group deleted successfully ({caption_count} captions removed)"
        }
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"Delete caption group error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))
