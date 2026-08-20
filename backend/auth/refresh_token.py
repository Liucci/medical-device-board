from common.get_auth_client_for_login import get_auth_client_for_login
from common.get_auth_client_for_login import get_auth_client_for_login
from session.fetch_session import fetch_session
from session.update_session import update_session

def refresh_token(session_id: str,):
    print("refresh_token")
    #print("session_id:", session_id)
    try:
        # Backend Session取得
        session = fetch_session(session_id)
        #print("session:", session)

        if session is None:
            raise ValueError("Session not found")

        # Sessionに保存されているRefresh Tokenを使用
        response = (
                    get_auth_client_for_login()
                    .auth
                    .refresh_session(session.refresh_token)
        )

        access_token = response.session.access_token
        new_refresh_token = response.session.refresh_token

        # Sessionのtoken情報を更新
        session.access_token = access_token
        session.refresh_token = new_refresh_token

        session.client.postgrest.auth(access_token)

        update_session(
            session_id=session_id,
            session=session,
        )
        return response

    except Exception:
        raise

"""
def refresh_token(refresh_token: str):
    print("refresh_token")
    #print("received refresh token", refresh_token[:12])

    try:
        #print("before refresh", get_auth_client_for_login.postgrest.headers)
        response = get_auth_client_for_login().auth.refresh_session(refresh_token)
        
        #print("after refresh", get_auth_client_for_login.postgrest.headers)
        #print("refresh_session success")
        return response

    except Exception as e:
        #print("refresh_session exception")
        #print(type(e))
        #print(repr(e))
        raise
"""