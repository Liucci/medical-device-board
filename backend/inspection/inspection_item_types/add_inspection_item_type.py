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
            "description": inspection_item_type.description,
            "input_type": inspection_item_type.input_type,
            "is_custom_option": inspection_item_type.is_custom_option,
            "options": inspection_item_type.options,
        })
        .execute()
    )

    return response.data[0]