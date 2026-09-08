from supabase import Client

from schemas.inspection_schemas.transaction_schemas.inspection_transaction_schemas import InspectionListResponse

from inspection.inspections.fetch_inspections import fetch_inspections
from users.fetch_users_by_hospital import fetch_users_by_hospital

from devices.fetch_devices import fetch_devices
from device_types.fetch_device_type import fetch_device_types
from device_models.fetch_device_models import fetch_device_models
from rooms.fetch_rooms import fetch_rooms
from wards.fetch_wards import fetch_wards
from inspection.inspection_types.fetch_inspection_types import fetch_inspection_types


def fetch_inspection_list_transaction(
    client: Client,
    hospital_id: str
):
    print("fetch_inspection_list_transaction")

    inspections = fetch_inspections(
        client,
        hospital_id
    )

    users = fetch_users_by_hospital(
        client,
        hospital_id
    )

    devices = fetch_devices(
        client,
        hospital_id
    )

    device_types = fetch_device_types(
        client,
        hospital_id
    )

    device_models = fetch_device_models(
        client,
        hospital_id
    )

    rooms = fetch_rooms(
        client,
        hospital_id
    )

    wards = fetch_wards(
        client,
        hospital_id
    )

    inspection_types = fetch_inspection_types(
        client,
        hospital_id
    )

    results = []

    for inspection in inspections:

        device = next(
            (
                item
                for item in devices
                if item["id"] == inspection["device_id"]
            ),
            None
        )

        device_type = next(
            (
                item
                for item in device_types
                if device
                and item["id"] == device["type"]
            ),
            None
        )

        device_model = next(
            (
                item
                for item in device_models
                if device
                and item["id"] == device["model"]
            ),
            None
        )

        room = next(
            (
                item
                for item in rooms
                if item["id"] == inspection["room_id"]
            ),
            None
        )

        ward = next(
            (
                item
                for item in wards
                if room
                and item["id"] == room["ward_id"]
            ),
            None
        )

        inspection_type = next(
            (
                item
                for item in inspection_types
                if item["id"] == inspection["inspection_type_id"]
            ),
            None
        )

        user = next(
            (
                item
                for item in users
                if item["id"] == inspection["performed_by"]
            ),
            None
        )

        results.append(
            InspectionListResponse(
                id=inspection["id"],
                checklist_id=inspection["checklist_id"],
                created_at=inspection["created_at"],
                inspection_type_name=(
                    inspection_type["name"]
                    if inspection_type
                    else None
                ),

                device_type_name=(
                    device_type["name"]
                    if device_type
                    else None
                ),
                device_model_name=(
                    device_model["name"]
                    if device_model
                    else None
                ),
                management_number=(
                    device["management_number"]
                    if device
                    else None
                ),
                serial_number=(
                    device["serial_number"]
                    if device
                    else None
                ),
                ward_name=(
                    ward["name"]
                    if ward
                    else None
                ),
                room_name=(
                    room["name"]
                    if room
                    else None
                ),
                performed_by_name=(
                    user["display_name"]
                    if user
                    else None
                ),
                comment=inspection["comment"],
                overall_result=inspection["overall_result"],
            )
        )

    return results