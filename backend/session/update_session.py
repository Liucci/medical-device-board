from schemas.session_schemas import BackendSession
from session.session import sessions


def update_session(
    session_id: str,
    session: BackendSession,
) -> None:
    """
    Backend Sessionを更新する。
    """

    sessions[session_id] = session