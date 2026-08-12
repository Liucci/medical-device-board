from fastapi import Cookie, HTTPException, status

from session.session_provider import get_session
from schemas.session_schemas import BackendSession


def get_current_session(
    session_id: str | None = Cookie(default=None),
) -> BackendSession:
    print("get_current_session")    
    #print("session_id from cookie =", session_id)

    if not session_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Session not found",
        )

    session = get_session(session_id)
    print("session from store =", session)
    if session is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid session",
        )

    return session