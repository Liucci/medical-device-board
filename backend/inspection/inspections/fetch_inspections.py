from common.supabase_admin_client import supabase
from supabase import Client


def fetch_inspections(
    client: Client,
    hospital_id: str
):
    print("fetch_inspections")

    response = (
        client
        .table("inspections")
        .select("*")
        .eq("hospital_id", hospital_id)
        .execute()
    )

    return response.data


def fetch_inspection(
    client: Client,
    inspection_id: int,
    hospital_id: str
):
    print("fetch_inspection")

    response = (
        client
        .table("inspections")
        .select("*")
        .eq("id", inspection_id)
        .eq("hospital_id", hospital_id)
        .single()
        .execute()
    )

    return response.data