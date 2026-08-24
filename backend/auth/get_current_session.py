from fastapi import Cookie, HTTPException, status

from schemas.session_schemas import BackendSession
from session.fetch_session import fetch_session


def get_current_session(
    session_id: str | None = Cookie(default=None),
) -> BackendSession:
    """
    CookieのSession IDから現在のBackend Sessionを取得する。
    """

    if not session_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Session not found",
        )

    session = fetch_session(session_id)

    if session is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid session",
        )

    return session