from supabase import Client
from schemas.inspection_schemas.inspection_type_schemas import DeleteInspectionTypesRequest


def delete_inspection_types(
    client: Client,
    inspection_type: DeleteInspectionTypesRequest
):
    print("delete_inspection_types")
    (
        client
        .table("inspection_types")
        .delete()
        .in_("id", inspection_type.ids)
        .execute()
    )