from common.supabase_admin_client import supabase
from supabase import Client
from schemas.inspection_schemas.inspection_item_type_schemas import (
    AddInspectionItemTypeRequest
)


def add_inspection_item_type(
    client: Client,
    inspection_item_type: AddInspectionItemTypeRequest
):
    print("add_inspection_item_type")

    response = (
        client
        .table("inspection_item_types")
        .insert({
            "name": inspection_item_type.name,
            "description": inspection_item_type.description
        })
        .execute()
    )

    return response.data[0]