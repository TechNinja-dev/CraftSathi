from app.db.mongodb import app_stats_col

async def get_app_stats():
    stats = app_stats_col.find_one({})
    if not stats:
        # Create default if not exists
        default_stats = {
            "total_users": 12,
            "total_craft": 20,
            "total_country": 1
        }
        app_stats_col.insert_one(default_stats)
        return default_stats
        
    return {
        "total_users": stats.get("total_users", 50),
        "total_craft": stats.get("total_craft", 150),
        "total_country": stats.get("total_country", 10)
    }

async def increment_users(count: int = 1):
    try:
        app_stats_col.update_one({}, {"$inc": {"total_users": count}}, upsert=True)
    except Exception as e:
        print(f"Error updating user stats: {e}")

async def increment_crafts(count: int = 1):
    try:
        app_stats_col.update_one({}, {"$inc": {"total_craft": count}}, upsert=True)
    except Exception as e:
        print(f"Error updating craft stats: {e}")
