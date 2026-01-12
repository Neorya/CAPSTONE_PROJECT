from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.sessions import SessionMiddleware
import os
from match_settings_api import router   as match_settings_router
from match_api          import router   as match_router
from game_session_api   import router   as game_session_router
from join_game_session  import router   as student_join_router
from game_session_management_api import router as game_session_management_router
from student_results_api import router as student_results_router
from authentication.routes.auth_routes import router as auth_router
from authentication.config import validate_required_env_vars

app = FastAPI()

# Validate required environment variables at startup
@app.on_event("startup")
def validate_config():
    """Validate that all required authentication environment variables are set."""
    validate_required_env_vars()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Frontend URL
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods
    allow_headers=["*"],  # Allow all headers
)

# Add SessionMiddleware for Authlib
# In production, use a secure secret key from environment variables
app.add_middleware(SessionMiddleware, secret_key=os.getenv("SECRET_KEY", "your-secret-key"))

app.include_router(match_settings_router)
app.include_router(match_router)
app.include_router(game_session_router)
app.include_router(student_join_router)
app.include_router(game_session_management_router)
app.include_router(student_results_router)
app.include_router(auth_router)


@app.get("/")
def read_root():
    # Reads the database URL from the environment variable
    db_url = os.getenv("DATABASE_URL", "DATABASE_URL not set")
    return {
        "message": "FastAPI server is running",
        "database_url_check": db_url
    }

@app.get("/health")
def health_check():
    return {"status": "ok"}
