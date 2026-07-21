from common.supabase_admin_client import (
    supabase
)
#すべてのuser情報を一括取得用
def fetch_users():
    print("fetch_users")
    response = (
        supabase
        .table("users")
        .select("*")
        .execute()
    )

    return response.data