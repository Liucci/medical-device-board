from common.supabase_admin_client import supabase
from supabase import Client
from schemas.inspection_schemas.inspection_schemas import (
    DeleteInspectionsRequest
)


def delete_inspections(
    client: Client,
    inspections: DeleteInspectionsRequest,
    hospital_id: str
):
    print("delete_inspections")

    (
        client
        .table("inspections")
        .delete()
        .in_("id", inspections.ids)
        .eq("hospital_id", hospital_id)
        .execute()
    )