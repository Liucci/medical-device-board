from common.supabase_admin_client import supabase
from supabase import Client
from schemas.inspection_schemas.inspection_item_type_schemas import (
    DeleteInspectionItemTypesRequest
)


def delete_inspection_item_types(
    client: Client,
    inspection_item_type: DeleteInspectionItemTypesRequest
):
    print("delete_inspection_item_types")

    (
        client
        .table("inspection_item_types")
        .delete()
        .in_("id", inspection_item_type.ids)
        .execute()
    )