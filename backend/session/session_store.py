from schemas.session_schemas import BackendSession


class SessionStore:
    def __init__(self):
        self._sessions: dict[str, BackendSession] = {}

    def create_session(
        self,
        session_id: str,
        session: BackendSession,
    ) -> None:
        self._sessions[session_id] = session

    def get_session(
        self,
        session_id: str,
    ) -> BackendSession | None:
        return self._sessions.get(session_id)

    def update_session(
        self,
        session_id: str,
        session: BackendSession,
    ) -> None:
        self._sessions[session_id] = session

    def delete_session(
        self,
        session_id: str,
    ) -> None:
        self._sessions.pop(session_id, None)