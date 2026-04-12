from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import auth_routes, ai_routes, my_stuff, profile, explore, captions, video_routes, guidance, home_routes
from app.core.firebase import initialize_firebase

# Include the profile router
app = FastAPI(title="CraftSathi API")

initialize_firebase()

origins = [
    "http://localhost:3000",
    "http://localhost:5173",
    "https://craftsathi.pages.dev",   # Cloudflare Pages (update with your actual domain)
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_routes.router)
app.include_router(ai_routes.router)
app.include_router(my_stuff.router)
app.include_router(profile.router)
app.include_router(explore.router)
app.include_router(captions.router)
app.include_router(video_routes.router)
app.include_router(guidance.router)
app.include_router(home_routes.router)
# print("Registered routes:")
# for route in app.routes:
#     print(f"  {route.path}")

@app.get("/")
def read_root():
    print("Hello")
    return {"message": "Welcome to CraftSathi API"}