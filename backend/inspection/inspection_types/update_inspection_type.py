from supabase import Client
from schemas.inspection_schemas.inspection_type_schemas import UpdateInspectionTypeRequest


def update_inspection_type(
    client: Client,
    inspection_type: UpdateInspectionTypeRequest
):
    print("update_inspection_type")
    response = (
        client
        .table("inspection_types")
        .update({
            "name": inspection_type.name,
            "is_active": inspection_type.is_active
        })
        .eq("id", inspection_type.id)
        .execute()
    )
    return response.data[0]