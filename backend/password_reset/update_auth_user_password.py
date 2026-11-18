from supabase import Client


# Supabase Authのパスワードを更新
def update_auth_user_password(
    client: Client,
    user_id: str,
    new_password: str
):
    print("update_auth_user_password")

    response = (
        client
        .auth.admin.update_user_by_id(
            user_id,
            {
                "password": new_password
            }
        )
    )

    return response