from supabase import Client

def update_invite_code(
                            client:Client,
                            invite_code_id:str,
                            used:bool
                        ):
    print("update_invite_code")
    response = (
                client
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