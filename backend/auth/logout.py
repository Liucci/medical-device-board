from fastapi import Cookie, Response

from session.delete_session import delete_session


def logout(
    response: Response,
    session_id: str | None = Cookie(default=None),
):
    """
    Backend Sessionを削除し、Session Cookieを削除する。
    """

    if session_id:
        delete_session(session_id)

    response.delete_cookie("session_id")

    return {
        "message": "Logout successful",
    }