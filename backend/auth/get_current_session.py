
from fastapi import Cookie, HTTPException, status

from schemas.session_schemas import BackendSession
from session.fetch_session import fetch_session
from session.check_access_token_expired import check_access_token_expired
from auth.refresh_token import refresh_token


def get_current_session(
    session_id: str | None = Cookie(default=None),
) -> BackendSession:
    """
    CookieのSession IDから現在のBackend Sessionを取得する。
    Access Tokenが期限切れの場合はRefreshする。
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

    # Access Tokenの期限確認
    if check_access_token_expired(session.access_token):
        try:
            refresh_token(session_id)
        except Exception:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Session expired",
            )

        # Refresh後の最新Sessionを取得
        session = fetch_session(session_id)

        if session is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid session",
            )

    return session
