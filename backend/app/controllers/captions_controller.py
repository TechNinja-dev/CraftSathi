from fastapi import HTTPException
from app.db.mongodb import caption_col, user_col, caption_images_col, users_dash_col
import uuid
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
    
    if request.image_data:
        # Check if the exact image already exists for this user
        existing_img = caption_images_col.find_one({
            "image_data": request.image_data,
            "u_Id": request.userId
        })
        
        if existing_img:
            # Image already exists, append to the same entry
            encoded_url = existing_img["_id"]
        else:
            # Generate a unique ID for this new image
            encoded_url = uuid.uuid4().hex
            
            # Store the image data with this unique ID
            caption_images_col.insert_one({
                "_id": encoded_url,
                "u_Id": request.userId,
                "image_data": request.image_data,
                "created_at": datetime.utcnow()
            })
    else:
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
    
    # Increment total_captions_generated counter in users_dash
    users_dash_col.update_one(
        {"u_Id": request.userId},
        {"$inc": {"total_captions_generated": 1}},
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
        # Check if safe_key is a UUID in caption_images_col
        img_doc = caption_images_col.find_one({"_id": safe_key})
        if img_doc:
            original_url = img_doc.get("image_data")
        else:
            original_url = decode_key(safe_key)
        
        caption_groups.append({
            "id": safe_key,
            "image_url": original_url,
            "captions": captions_list,
            "caption_count": len(captions_list),
            "created_at": img_doc.get("created_at").isoformat() if img_doc and img_doc.get("created_at") else None
        })
        total += len(captions_list)
    
    return {
        "success": True,
        "caption_groups": caption_groups,
        "total": total
    }


async def delete_caption(userId: str, image_id: str, captionIndex: int):
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
        
        encoded_url = image_id
        
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
            caption_images_col.delete_one({"_id": encoded_url})
            message = "Caption removed and empty group deleted"
        else:
            # Update the captions list
            caption_col.update_one(
                {"u_Id": userId},
                {"$set": {f"saved_captions.{encoded_url}": captions_list}}
            )
            message = "Caption deleted successfully"
        
        # Decrement counter
        users_dash_col.update_one(
            {"u_Id": userId},
            {"$inc": {"total_captions_generated": -1}}
        )
        
        return {
            "success": True,
            "message": message
        }
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"Delete caption error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


async def delete_caption_group(userId: str, image_id: str):
    """
    Delete an entire caption group (all captions for an image)
    """
    try:
        # Find user's caption document
        doc = caption_col.find_one({"u_Id": userId})
        if not doc:
            raise HTTPException(status_code=404, detail="User not found")
        
        saved_captions = doc.get("saved_captions", {})
        
        encoded_url = image_id
        
        if encoded_url not in saved_captions:
            raise HTTPException(status_code=404, detail="Image URL not found")
        
        caption_count = len(saved_captions[encoded_url])
        
        # Remove the encoded_url key
        result = caption_col.update_one(
            {"u_Id": userId},
            {"$unset": {f"saved_captions.{encoded_url}": ""}}
        )
        caption_images_col.delete_one({"_id": encoded_url})
        
        if result.modified_count == 0:
            raise HTTPException(status_code=404, detail="Failed to delete caption group")
        
        # Decrement counter by the number of deleted captions
        users_dash_col.update_one(
            {"u_Id": userId},
            {"$inc": {"total_captions_generated": -caption_count}}
        )
        
        return {
            "success": True,
            "message": f"Caption group deleted successfully ({caption_count} captions removed)"
        }
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"Delete caption group error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))
