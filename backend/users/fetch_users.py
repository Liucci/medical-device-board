from supabase import Client

#すべてのuser情報を一括取得用
def fetch_users(client:Client,):
    print("fetch_users")
    response = (
        client
        .table("users")
        .select("*")
        .execute()
    )

    return response.data