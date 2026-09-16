from supabase import Client

#自病院のユーザー情報取得
def fetch_users_by_hospital(
    client: Client,
    hospital_id: str
):
    print("fetch_users_by_hospital")

    response = (
        client
        .table("users")
        .select("id, display_name")
        .eq("hospital_id", hospital_id)
        .execute()
    )

    return response.data