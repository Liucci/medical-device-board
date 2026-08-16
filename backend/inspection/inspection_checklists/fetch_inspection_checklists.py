from common.supabase_admin_client import supabase
from supabase import Client


def fetch_inspection_checklists(
    client: Client,
    hospital_id: str
):
    print("fetch_inspection_checklists")

    response = (
        client
        .table("inspection_checklists")
        .select("*")
        .eq("hospital_id", hospital_id)
        .execute()
    )

    return response.data


def fetch_inspection_checklist(
    client: Client,
    inspection_checklist_id: int,
    hospital_id: str
):
    print("fetch_inspection_checklist")

    response = (
        client
        .table("inspection_checklists")
        .select("*")
        .eq("id", inspection_checklist_id)
        .eq("hospital_id", hospital_id)
        .single()
        .execute()
    )

    return response.data