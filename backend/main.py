from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import auth_routes, ai_routes, image_routes
from app.core.firebase import initialize_firebase
from app.routes import profile

# Include the profile router
app = FastAPI(title="CraftSathi API")

initialize_firebase()

origins = [
    "http://localhost:3000",
    "https://craft-sathi-wbof.vercel.app"
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
app.include_router(image_routes.router)
app.include_router(profile.router)


@app.get("/")
def read_root():
    return {"message": "Welcome to CraftSathi API"}