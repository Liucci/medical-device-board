from common.supabase_client import (
    supabase
)

from schemas.device_schemas import (
    AddDeviceRequest
)

def add_device(
               device: AddDeviceRequest
               ):

    print("insert device")

    for key, value in device.dict().items():
        print(f"・{key}: {value}")

    response = (
        supabase
        .table("devices")
        .insert({
            "hospital_id":
                device.hospital_id,

            "type":
                device.type,

            "model":
                device.model,

            "asset_type":
                device.asset_type,

            "status":
                device.status,

            "stock_area_id":
                device.stock_area_id,

            "room_id":
                device.room_id,

            "management_number":
                device.management_number,

            "serial_number":
                device.serial_number,

            "note":
                device.note,

            "rental_start_date":
                device.rental_start_date,

            "rental_end_date":
                device.rental_end_date,

            "is_under_maintenance":
                device.is_under_maintenance,

            "maintenance_started_at":
                device.maintenance_started_at,

            "maintenance_finished_at":
                device.maintenance_finished_at,

            "standby":
                device.standby,

            "standby_started_at":
                device.standby_started_at,

            "standby_finished_at":
                device.standby_finished_at,

            "created_by":
                device.created_by,

            "updated_by":
                device.updated_by
        })
        .execute()
    )

    print("insert response")

    for row in response.data:
        print(f"・{row}")

    return {
            "success": True,
            "device": response.data[0]
            }