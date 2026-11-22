"""
Session Lock管理
Lockは、複数の処理が同じデータを同時に操作することを防ぐ仕組み。
本アプリでは、同一Sessionに対する複数のRefresh処理が競合しないよう、
Session IDごとにLockを設け、処理を直列化する。
異なるSessionは、それぞれ独立して処理できる。
"""

from threading import Lock

# SessionごとのLockを管理
session_locks: dict[str, Lock] = {}

# Lock管理用のLock
session_locks_guard = Lock()


def get_session_lock(session_id: str) -> Lock:
    """
    Session IDに対応するLockを取得する。
    同じSession IDには常に同じLockを返す。
    """
    with session_locks_guard:
        if session_id not in session_locks:
            session_locks[session_id] = Lock()

        return session_locks[session_id]
