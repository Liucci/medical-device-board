from common.supabase_client import (
    supabase
)
#auth user idと紐づいたuser情報をDBから取得
#auth user idはsupabaseが作るuuid
#指定のuuidに紐づくuser情報を取得する関数
def fetch_current_user(auth_user_id: str):
    print("fetch_current_user")

    response = (
                supabase
                        .table("users")
                        .select(
                                """
                                id,
                                hospital_id,
                                display_name,
                                role,
                                is_active
                                """
                                )
                        .eq("id",auth_user_id)
                        .single()
                        .execute()
    )
    return response.data