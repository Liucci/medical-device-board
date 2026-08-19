import secrets

from schemas.session_schemas import BackendSession
from session.session_store import SessionStore


# Session Store
session_store = SessionStore()


def create_session(
    session: BackendSession,
) -> str:
    """
    Sessionを作成し、Session IDを返す。
    """

    session_id = secrets.token_urlsafe(32)

    session_store.create_session(
        session_id=session_id,
        session=session,
    )

    return session_id


def get_session(
    session_id: str,
) -> BackendSession | None:
    """
    Session IDからSessionを取得する。
    """

    return session_store.get_session(session_id)


def update_session(
    session_id: str,
    session: BackendSession,
) -> None:
    """
    Sessionを更新する。
    """

    session_store.update_session(
        session_id=session_id,
        session=session,
    )


def delete_session(
    session_id: str,
) -> None:
    """
    Sessionを削除する。
    """

    session_store.delete_session(session_id)