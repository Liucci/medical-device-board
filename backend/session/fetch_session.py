from schemas.session_schemas import BackendSession
from session.session import sessions


def fetch_session(
    session_id: str,
) -> BackendSession | None:
    return sessions.get(session_id)