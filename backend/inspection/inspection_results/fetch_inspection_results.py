from common.supabase_admin_client import supabase
from supabase import Client


def fetch_inspection_results(
    client: Client,
    inspection_id: int
):
    print("fetch_inspection_results")

    response = (
        client
        .table("inspection_results")
        .select("*")
        .eq("inspection_id", inspection_id)
        .execute()
    )

    return response.data


def fetch_inspection_result(
    client: Client,
    inspection_result_id: int
):
    print("fetch_inspection_result")

    response = (
        client
        .table("inspection_results")
        .select("*")
        .eq("id", inspection_result_id)
        .single()
        .execute()
    )

    return response.data