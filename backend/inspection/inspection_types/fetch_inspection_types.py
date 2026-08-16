from common.supabase_admin_client import supabase
from supabase import Client


def fetch_inspection_types(client: Client):
    print("fetch_inspection_types")
    response = (
        client
        .table("inspection_types")
        .select("*")
        .execute()
    )
    return response.data


def fetch_inspection_type(
    client: Client,
    inspection_type_id: int
):
    print("fetch_inspection_type")
    response = (
        client
        .table("inspection_types")
        .select("*")
        .eq("id", inspection_type_id)
        .single()
        .execute()
    )
    return response.data