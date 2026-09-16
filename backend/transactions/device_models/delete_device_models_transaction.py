from supabase import Client

from schemas.device_model_schemas import DeleteDeviceModelsRequest
from schemas.inspection_schemas.inspection_checklist_schemas import (
    DeleteInspectionChecklistsRequest
)
from schemas.inspection_schemas.inspection_checklist_item_schemas import (
    DeleteInspectionChecklistItemsRequest
)

from devices.fetch_devices import (
    fetch_devices_by_device_model_ids
)

from inspection.inspection_checklists.fetch_inspection_checklists import (
    fetch_inspection_checklists_by_device_model_ids
)
from inspection.inspection_checklist_items.fetch_inspection_checklist_items import (
    fetch_inspection_checklist_items_by_checklist_ids
)
from inspection.inspection_checklist_item_options.delete_inspection_checklist_item_options import (
    delete_inspection_checklist_item_options
)
from inspection.inspection_checklist_items.delete_inspection_checklist_items import (
    delete_inspection_checklist_items
)
from inspection.inspection_checklists.delete_inspection_checklists import (
    delete_inspection_checklists
)

from device_models.delete_device_models import (
    delete_device_models
)


def delete_device_models_transaction(
    client: Client,
    device_models: DeleteDeviceModelsRequest,
    hospital_id: str
):

    print("delete_device_models_transaction")

    # modelに紐づく医療機器を取得
    devices = fetch_devices_by_device_model_ids(
        client=client,
        device_model_ids=device_models.ids,
        hospital_id=hospital_id
    )

    if devices:
        raise ValueError(
            "登録されている医療機器があるため、型式を削除できません。"
        )

    # modelに紐づくchecklistを取得
    checklists = fetch_inspection_checklists_by_device_model_ids(
        client=client,
        device_model_ids=device_models.ids,
        hospital_id=hospital_id
    )

    checklist_ids = [
        checklist["id"]
        for checklist in checklists
    ]

    if checklist_ids:

        # checklistに紐づくitemを取得
        items = fetch_inspection_checklist_items_by_checklist_ids(
            client=client,
            checklist_ids=checklist_ids
        )

        item_ids = [
            item["id"]
            for item in items
        ]

        # itemに紐づくoptionを削除
        for item_id in item_ids:
            delete_inspection_checklist_item_options(
                client=client,
                checklist_item_id=item_id
            )

        # itemを削除
        if item_ids:
            delete_inspection_checklist_items(
                client=client,
                inspection_checklist_items=DeleteInspectionChecklistItemsRequest(
                    ids=item_ids
                )
            )

        # checklistを削除
        delete_inspection_checklists(
            client=client,
            inspection_checklist=DeleteInspectionChecklistsRequest(
                ids=checklist_ids
            ),
            hospital_id=hospital_id
        )

    # modelを削除
    delete_device_models(
        client=client,
        device_models=device_models,
        hospital_id=hospital_id
    )