from supabase import Client

from schemas.inspection_schemas.inspection_schemas import (
    AddInspectionRequest
)
from schemas.inspection_schemas.transaction_schemas.inspection_transaction_schemas import (
    AddInspectionSnapshotRequest,
    AddInspectionResultSnapshotRequest
)

from inspection.inspections.add_inspection import (
    add_inspection
)
from inspection.inspection_results.add_inspection_result import (
    add_inspection_result
)

from devices.fetch_devices import fetch_device
from device_models.fetch_device_models import fetch_device_model
from device_types.fetch_device_type import fetch_device_type
from wards.fetch_wards import fetch_ward
from rooms.fetch_rooms import fetch_room

from inspection.inspection_types.fetch_inspection_types import (
    fetch_inspection_type
)
from inspection.inspection_checklists.fetch_inspection_checklists import (
    fetch_inspection_checklist
)
from inspection.inspection_checklist_items.fetch_inspection_checklist_items import (
    fetch_inspection_checklist_items
)
from inspection.inspection_item_categories.fetch_inspection_item_categories import (
    fetch_inspection_item_categories
)


def create_inspection_transaction(
    client: Client,
    inspection: AddInspectionRequest,
    results: list,
    hospital_id: str,
    user_id: str,
):
    print("create_inspection_transaction")

    try:
        device = fetch_device(
            client,
            inspection.device_id,
            hospital_id
        )

        device_model = fetch_device_model(
            client,
            device["model"],
            hospital_id
        )

        device_type = fetch_device_type(
            client,
            device["type"],
            hospital_id
        )

        room = fetch_room(
            client,
            inspection.room_id,
            hospital_id
        ) if inspection.room_id else None

        ward = fetch_ward(
            client,
            room["ward_id"],
            hospital_id
        ) if room and room.get("ward_id") else None

        inspection_type = fetch_inspection_type(
            client,
            inspection.inspection_type_id
        )

        checklist = fetch_inspection_checklist(
            client,
            inspection.checklist_id,
            hospital_id
        )

        inspection_snapshot = AddInspectionSnapshotRequest(
            device_type_name=device_type["name"],
            device_model_name=device_model["name"],
            management_number=device.get("management_number"),
            serial_number=device.get("serial_number"),
            ward_name=ward["name"] if ward else None,
            room_name=room["name"] if room else None,
            patient_name=room.get("patient_name") if room else None,
            inspection_type_name=inspection_type["name"],
            checklist_name=checklist["name"],
            overall_result=inspection.overall_result,
            comment=inspection.comment
        )

        inspection_response = add_inspection(
            client=client,
            inspection=inspection_snapshot,
            hospital_id=hospital_id,
            performed_by_name=user_id
        )

        inspection_id = inspection_response["id"]

        checklist_items = fetch_inspection_checklist_items(
            client,
            inspection.checklist_id
        )

        categories = fetch_inspection_item_categories(
            client,
            hospital_id
        )

        category_map = {
            category["id"]: category
            for category in categories
        }

        result_map = {
            result.checklist_item_id: result.value
            for result in results
        }

        for item in checklist_items:
            category = category_map.get(item["category_id"])

            result_snapshot = AddInspectionResultSnapshotRequest(
                inspection_id=inspection_id,
                category_name=category["name"] if category else "",
                category_display_order=category["display_order"] if category else 0,
                item_name=item["item_name"],
                item_display_order=item["display_order"],
                unit=item.get("unit"),
                value=result_map.get(item["id"])
            )

            add_inspection_result(
                client=client,
                result=result_snapshot
            )

        return inspection_response

    except Exception as e:
        print("failed to create inspection:", e)
        return None