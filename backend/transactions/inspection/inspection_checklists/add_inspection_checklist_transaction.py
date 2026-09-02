from supabase import Client
from schemas.inspection_schemas.inspection_checklist_schemas import (AddInspectionChecklistRequest)
from schemas.inspection_schemas.inspection_checklist_item_schemas import (AddInspectionChecklistItemRequest)
from schemas.inspection_schemas.transaction_schemas.inspection_checklist_transaction_schemas import CreateInspectionChecklistTransactionRequest
from inspection.inspection_checklists.add_inspection_checklist import (add_inspection_checklist)
from inspection.inspection_checklist_items.add_inspection_checklist_item import (add_inspection_checklist_item)
from inspection.inspection_checklist_item_options.add_inspection_checklist_item_options import (add_inspection_checklist_item_options)

def add_inspection_checklist_transaction(
    client: Client,
    request: CreateInspectionChecklistTransactionRequest,
    hospital_id: str
):
    print("add_inspection_checklist_transaction")
    print("client",client)
    # 点検表作成
    inspection_checklist = AddInspectionChecklistRequest(
                            inspection_type_id=request.inspection_type_id,
                            device_type_id=request.device_type_id,
                            device_model_id=request.device_model_id,
                            name=request.name,
                            version=request.version,
    )

    checklist = add_inspection_checklist(
                                        client,
                                        inspection_checklist,
                                        hospital_id
    )

    checklist_id = checklist["id"]

    # 点検項目作成
    for request_item in request.items:

        item = AddInspectionChecklistItemRequest(
                            display_order=request_item["display_order"],
                            item_name=request_item["item_name"],
                            item_type_id=request_item["item_type_id"],
                            required=request_item["required"],
                            default_value=request_item["default_value"],
                            unit=request_item["unit"],
        )

        checklist_item = add_inspection_checklist_item(
                                        client,
                                        item,
                                        checklist_id
        )
    # 任意の選択肢作成
        if request_item["options"]:
            
            add_inspection_checklist_item_options(
                client,
                checklist_item["id"],
                request_item["options"]
            )
    print("checklist",checklist)
    return checklist