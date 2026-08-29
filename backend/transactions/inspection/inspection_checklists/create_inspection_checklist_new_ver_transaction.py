from supabase import Client
from schemas.inspection_schemas.transaction_schemas.inspection_checklist_transaction_schemas import (CreateInspectionChecklistNewVerTransactionRequest)
from inspection.inspection_checklists.add_inspection_checklist import (add_inspection_checklist)
from inspection.inspection_checklist_items.add_inspection_checklist_item import (add_inspection_checklist_item)
from schemas.inspection_schemas.inspection_checklist_schemas import (AddInspectionChecklistRequest)
from schemas.inspection_schemas.inspection_checklist_item_schemas import (AddInspectionChecklistItemRequest)


def create_inspection_checklist_new_ver_transaction(
    client: Client,
    request: CreateInspectionChecklistNewVerTransactionRequest,
    hospital_id: str,
):
    print("create_inspection_checklist_new_ver_transaction")

    # Checklistを新規作成
    checklist = add_inspection_checklist(
        client,
        AddInspectionChecklistRequest(
            inspection_type_id=request.inspection_type_id,
            device_type_id=request.device_type_id,
            device_model_id=request.device_model_id,
            name=request.name,
            version=request.version,
        ),
        hospital_id,
    )
    checklist_id = checklist["id"]

    # Itemsを新規作成
    for item in request.items:

        add_inspection_checklist_item(
            client,
            AddInspectionChecklistItemRequest(
                display_order=item["display_order"],
                item_name=item["item_name"],
                item_type_id=item["item_type_id"],
                required=item["required"],
                default_value=item["default_value"],
                options=item["options"],
                unit=item["unit"],
            ),
            checklist_id,
        )

    return checklist