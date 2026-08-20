import secrets
from schemas.session_schemas import BackendSession
from session.session import sessions

def create_session(session: BackendSession) -> str:
    """
    Backend Sessionを作成し、
    Session IDを返す。
    """
    session_id = secrets.token_urlsafe(32)
    sessions[session_id] = session

    return session_id