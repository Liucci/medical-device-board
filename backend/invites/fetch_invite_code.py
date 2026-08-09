from common.supabase_admin_client import supabase
from supabase import Client

def fetch_invite_code(
                        client:Client,
                        code:str
                    ):
    print("fetch_invite_code")
    response = (
                    client
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