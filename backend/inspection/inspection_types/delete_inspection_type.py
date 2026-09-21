from supabase import Client

from schemas.inspection_schemas.inspection_type_schemas import (
    DeleteInspectionTypesRequest,
)


def delete_inspection_type(
    client: Client,
    inspection_type: DeleteInspectionTypesRequest,
    hospital_id: str,
):
    print("delete_inspection_type")

    (
        client
        .table("inspection_types")
        .delete()
        .eq("id", inspection_type.id)
        .eq("hospital_id", hospital_id)
        .execute()
    )