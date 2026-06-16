from common.supabase_client import supabase

def fetch_invite_code(
    code:str
):

    response = (
        supabase
        .table("invite_codes")
        .select("*")
        .eq(
            "code",
            code
        )
        .single()
        .execute()
    )

    return response.data