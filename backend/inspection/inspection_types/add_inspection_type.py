from supabase import Client
from schemas.inspection_schemas.inspection_type_schemas import AddInspectionTypeRequest


def add_inspection_type(
    client: Client,
    inspection_type: AddInspectionTypeRequest
):
    print("add_inspection_type")
    response = (
        client
        .table("inspection_types")
        .insert({
            "name": inspection_type.name
        })
        .execute()
    )
    return response.data[0]