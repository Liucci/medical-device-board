from schemas.session_schemas import BackendSession


# Backend全体で共有するSession
#session系CRUDから共通のsessionを参照するためのファイル
sessions: dict[str, BackendSession] = {}