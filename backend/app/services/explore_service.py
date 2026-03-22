# app/services/explore_service.py
from app.db.mongodb import explore_cols, dummy_cols
from datetime import datetime
import random

def get_explore_posts(userId=None, limit=20, page=1):
    """
    Fetch posts for explore page
    - If userId provided: fetch posts from all other users (excluding logged-in user) from explore_cols
    - If no userId: fetch dummy posts from dummy_cols
    """
    try:
        skip = (page - 1) * limit
        
        if userId:
            # Logged in user - fetch posts from all other users (excluding current user)
            # Find posts where user_id is not the current user
            query = {"user_id": {"$ne": userId}}
            
            total_posts = explore_cols.count_documents(query)
            
            posts_cursor = explore_cols.find(query).sort("created_at", -1).skip(skip).limit(limit)
            
            posts = []
            for post in posts_cursor:
                posts.append({
                    "id": str(post["_id"]),
                    "user_id": post.get("user_id", ""),
                    "user_name": post.get("user_name", "Artisan"),
                    "user_avatar": post.get("user_avatar", ""),
                    "prompt": post.get("prompt", ""),
                    "image_url": post.get("image_url", ""),
                    "likes": post.get("likes", 0),
                    "comments": post.get("comments", 0),
                    "created_at": post.get("created_at", datetime.utcnow()).isoformat() if post.get("created_at") else datetime.utcnow().isoformat()
                })
            
            return {
                "posts": posts,
                "total": total_posts,
                "page": page,
                "limit": limit,
                "has_more": (skip + limit) < total_posts
            }
            
        else:
            # Not logged in - fetch dummy posts from dummy_cols
            total_posts = dummy_cols.count_documents({})
            
            posts_cursor = dummy_cols.find({}).skip(skip).limit(limit)
            
            posts = []
            for post in posts_cursor:
                posts.append({
                    "id": str(post["_id"]),
                    "user_id": post.get("user_id", "dummy_user"),
                    "user_name": post.get("user_name", "Artisan"),
                    "user_avatar": post.get("user_avatar", ""),
                    "prompt": post.get("prompt", ""),
                    "image_url": post.get("image_url", ""),
                    "likes": post.get("likes", random.randint(10, 500)),
                    "comments": post.get("comments", random.randint(0, 50)),
                    "created_at": post.get("created_at", datetime.utcnow().isoformat())
                })
            
            return {
                "posts": posts,
                "total": total_posts,
                "page": page,
                "limit": limit,
                "has_more": (skip + limit) < total_posts
            }
            
    except Exception as e:
        print(f"Error fetching explore posts: {str(e)}")
        return {"posts": [], "total": 0, "page": page, "limit": limit, "has_more": False}