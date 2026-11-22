
from common.get_auth_client_for_login import get_auth_client_for_login
from session.fetch_session import fetch_session
from session.update_session import update_session
from session.session_locks import get_session_lock
from session.check_access_token_expired import check_access_token_expired


def refresh_token(session_id: str):
    print("refresh_token")

    # SessionごとのLockを取得
    lock = get_session_lock(session_id)

    with lock:
        # Lock取得後に最新のSessionを再取得
        session = fetch_session(session_id)

        if session is None:
            raise ValueError("Session not found")

        # 最新のAccess Tokenの期限を再確認
        if not check_access_token_expired(session.access_token):
            return

        # Refresh Tokenで更新
        response = (
                    get_auth_client_for_login()
                    .auth
                    .refresh_session(session.refresh_token)
        )

        access_token = response.session.access_token
        new_refresh_token = response.session.refresh_token

        # SessionのToken情報を更新
        session.access_token = access_token
        session.refresh_token = new_refresh_token

        session.client.postgrest.auth(access_token)

        update_session(
            session_id=session_id,
            session=session,
        )
