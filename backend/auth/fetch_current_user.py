from common.supabase_admin_client import (
    supabase
)
#auth user idと紐づいたuser情報をDBから取得
#auth user idはsupabaseが作るuuid
#指定のuuidに紐づくuser情報を取得する関数
def fetch_current_user(auth_user_id: str):
    print("fetch_current_user")

    print("headers =", supabase.postgrest.headers)
    print(supabase.postgrest.session.headers)
    print("client id =", id(supabase))
    response = (
                supabase
                        .table("users")
                        .select("*")
                        .eq("id",auth_user_id)
                        .single()
                        .execute()
    )
    
    return response.data