from session.session import sessions


def delete_session(
    session_id: str,
) -> None:
    """
    Backend Sessionを削除する。
    """

    sessions.pop(session_id, None)