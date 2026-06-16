from common.supabase_client import supabase

def update_invite_code(
    invite_code_id:str,
    used:bool
):

    response = (
        supabase
        .table("invite_codes")
        .update({
                    "used": used
                })
        .eq(
            "id",
            invite_code_id
        )
        .execute()
    )

    return response.data