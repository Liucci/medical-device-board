from common.supabase_client import supabase


def fetch_hospital(
                    hospital_id:str
                  ):

    response = (
                    supabase
                    .table("hospitals")
                    .select("*")
                    .eq(
                        "id",
                        hospital_id
                    )
                    .single()
                    .execute()
               )

    return response.data