from fastapi import HTTPException, Security, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from supabase import create_client
from app.config import settings

_bearer = HTTPBearer(auto_error=False)


def get_supabase():
    """Admin client for server-side operations."""
    if not settings.supabase_url or not settings.supabase_service_key:
        return None
    return create_client(settings.supabase_url, settings.supabase_service_key)


async def get_current_user(
    creds: HTTPAuthorizationCredentials | None = Security(_bearer),
):
    """
    Validates the Supabase JWT from the Authorization: Bearer header.
    Returns the user dict on success.
    Raises 401 if invalid or missing.

    If Supabase is not configured (local dev), returns a mock user so
    the app still works without auth.
    """
    if not settings.supabase_url:
        # Auth not configured — dev mode, return stub user
        return {"id": "local-dev-user", "email": "dev@local"}

    if not creds:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated",
        )

    supabase = get_supabase()
    try:
        response = supabase.auth.get_user(creds.credentials)
        if not response.user:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")
        return response.user
    except Exception:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")