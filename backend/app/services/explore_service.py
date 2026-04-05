# app/services/explore_service.py
from app.db.mongodb import explore_cols, users_explore_col, dummy_cols
from datetime import datetime
import uuid

def generate_craft_id():
    return f"craft_{uuid.uuid4()}"

def get_explore_profile(user_id: str):
    """
    Fetch user explore profile from users_explore collection.
    Always guarantees u_explore_name is present — defaults to u_name from
    users collection if the explore profile hasn't set a custom one yet.
    """
    try:
        from app.db.mongodb import user_col
        profile = users_explore_col.find_one({"u_Id": user_id}, {"_id": 0})

        if not profile:
            # No explore profile yet — build one from base user record
            base_user = user_col.find_one({"u_Id": user_id}, {"_id": 0, "u_name": 1, "u_email": 1})
            if not base_user:
                return None
            # Auto-create explore profile with defaults
            new_profile = {
                "u_Id": user_id,
                "u_name": base_user.get("u_name", ""),
                "u_explore_name": base_user.get("u_name", ""),
                "u_email": base_user.get("u_email", ""),
                "avatar": None,
                "total_posts": 0,
                "total_followers": 0
            }
            users_explore_col.insert_one({**new_profile})
            return new_profile

        # Profile exists — if u_explore_name is missing, fill from u_name
        if not profile.get("u_explore_name"):
            fallback_name = profile.get("u_name", "")
            users_explore_col.update_one(
                {"u_Id": user_id},
                {"$set": {"u_explore_name": fallback_name}}
            )
            profile["u_explore_name"] = fallback_name

        return profile
    except Exception as e:
        print(f"Error fetching explore profile: {e}")
        return None

def get_explore_posts(userId=None, limit=20, page=1):
    """
    Fetch posts for explore page using MongoDB Aggregation
    - Flattens the array of posts stored per user.
    - Joins with users_explore to fetch their distinct explore avatar.
    """
    try:
        skip = (page - 1) * limit
        
        match_stage = {"$match": {"u_Id": {"$ne": userId}}} if userId else {"$match": {}}
        
        pipeline = [
            match_stage,
            {"$unwind": "$posts"},
            {"$lookup": {
                "from": "users_explore",
                "localField": "u_Id",
                "foreignField": "u_Id",
                "as": "explore_user_info"
            }},
            {"$unwind": {"path": "$explore_user_info", "preserveNullAndEmptyArrays": True}},
            {"$sort": {"posts.created_at": -1}},
            {"$skip": skip},
            {"$limit": limit},
            {"$project": {
                "_id": 0,
                "id": "$posts.post_id",
                "user_id": "$u_Id",
                "user_name": {"$ifNull": ["$u_explore_name", "$u_name"]},
                "user_avatar": "$explore_user_info.avatar",
                "prompt": "$posts.caption",
                "image_url": "$posts.image_url",
                "likes": {"$ifNull": ["$posts.total_likes", 0]},
                "comments": {"$ifNull": ["$posts.total_comments", 0]},
                "created_at": "$posts.created_at"
            }}
        ]
        
        posts_cursor = list(explore_cols.aggregate(pipeline))
        
        # Approximate total pipeline count
        count_pipeline = [
            match_stage,
            {"$unwind": "$posts"},
            {"$count": "total"}
        ]
        total_res = list(explore_cols.aggregate(count_pipeline))
        total_posts = total_res[0]["total"] if total_res else 0
            
        return {
            "posts": posts_cursor,
            "total": total_posts,
            "page": page,
            "limit": limit,
            "has_more": (skip + limit) < total_posts
        }
            
    except Exception as e:
        import traceback
        print(f"Error fetching explore posts: {traceback.format_exc()}")
        return {"posts": [], "total": 0, "page": page, "limit": limit, "has_more": False}

def create_explore_post(user_id, user_name, explore_name, image_url, caption):
    """
    Pushes a new post securely into the user's explore_page array.
    """
    try:
        new_post = {
            "post_id": generate_craft_id(),
            "image_url": image_url,
            "created_at": datetime.utcnow().isoformat(),
            "total_likes": 0,
            "total_comments": 0,
            "caption": caption
        }
        
        explore_cols.update_one(
            {"u_Id": user_id},
            {
                "$set": {
                    "u_name": user_name,
                    "u_explore_name": explore_name
                },
                "$push": {"posts": new_post}
            },
            upsert=True
        )
        return True, new_post
    except Exception as e:
        print(e)
        return False, str(e)

def update_explore_avatar(user_id, avatar_url):
    """
    Updates the distinct explore avatar in users_explore.
    """
    try:
        users_explore_col.update_one(
            {"u_Id": user_id},
            {"$set": {"avatar": avatar_url}}
        )
        return True, "Avatar updated successfully"
    except Exception as e:
        return False, str(e)

def delete_explore_avatar(user_id):
    """
    Deletes (nullifies) the explore avatar.
    """
    try:
        users_explore_col.update_one(
            {"u_Id": user_id},
            {"$set": {"avatar": None}}
        )
        return True, "Avatar deleted successfully"
    except Exception as e:
        return False, str(e)

def edit_explore_profile(user_id, explore_name):
    """
    Updates u_explore_name across both users_explore and explore_page (denormalized).
    """
    try:
        # Update centralized user store
        users_explore_col.update_one(
            {"u_Id": user_id},
            {"$set": {"u_explore_name": explore_name}}
        )
        # Cascade to posts wrapper
        explore_cols.update_one(
            {"u_Id": user_id},
            {"$set": {"u_explore_name": explore_name}}
        )
        return True, "Profile updated successfully"
    except Exception as e:
        return False, str(e)


def save_post(user_id: str, post_id: str):
    """
    Saves a post for the user by adding its ID to the `saved` array.
    """
    try:
        users_explore_col.update_one(
            {"u_Id": user_id},
            {"$addToSet": {"saved": post_id}},
            upsert=True
        )
        return True, "Post saved successfully"
    except Exception as e:
        return False, str(e)


def unsave_post(user_id: str, post_id: str):
    """
    Unsaves a post for the user by removing its ID from the `saved` array.
    """
    try:
        users_explore_col.update_one(
            {"u_Id": user_id},
            {"$pull": {"saved": post_id}}
        )
        return True, "Post unsaved successfully"
    except Exception as e:
        return False, str(e)


def get_saved_posts(user_id: str, limit: int = 20, page: int = 1):
    """
    Fetch the user's saved posts.
    """
    try:
        skip = (page - 1) * limit
        
        # 1. Get the list of saved post UUIDs
        profile = users_explore_col.find_one({"u_Id": user_id}, {"saved": 1, "_id": 0})
        saved_post_ids = profile.get("saved", []) if profile else []
        
        if not saved_post_ids:
            return {"posts": [], "total": 0, "page": page, "limit": limit, "has_more": False}
        
        # 2. Aggregation pipeline to fetch those exact posts
        pipeline = [
            {"$unwind": "$posts"},
            {"$match": {"posts.post_id": {"$in": saved_post_ids}}},
            {"$lookup": {
                "from": "users_explore",
                "localField": "u_Id",
                "foreignField": "u_Id",
                "as": "explore_user_info"
            }},
            {"$unwind": {"path": "$explore_user_info", "preserveNullAndEmptyArrays": True}},
            {"$sort": {"posts.created_at": -1}},
            {"$skip": skip},
            {"$limit": limit},
            {"$project": {
                "_id": 0,
                "id": "$posts.post_id",
                "user_id": "$u_Id",
                "user_name": {"$ifNull": ["$u_explore_name", "$u_name"]},
                "user_avatar": "$explore_user_info.avatar",
                "prompt": "$posts.caption",
                "image_url": "$posts.image_url",
                "likes": {"$ifNull": ["$posts.total_likes", 0]},
                "comments": {"$ifNull": ["$posts.total_comments", 0]},
                "created_at": "$posts.created_at"
            }}
        ]
        
        posts_cursor = list(explore_cols.aggregate(pipeline))
        total_posts = len(saved_post_ids)
            
        return {
            "posts": posts_cursor,
            "total": total_posts,
            "page": page,
            "limit": limit,
            "has_more": (skip + limit) < total_posts
        }
            
    except Exception as e:
        import traceback
        print(f"Error fetching saved posts: {traceback.format_exc()}")
        return {"posts": [], "total": 0, "page": page, "limit": limit, "has_more": False}