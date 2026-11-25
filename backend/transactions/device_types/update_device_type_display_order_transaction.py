from schemas.device_type_schemas import UpdateDeviceTypeOrdersRequest
from device_types.update_device_type import update_device_type_display_order
from supabase import Client


def update_device_type_display_order_transaction(
                                                client: Client,
                                                device_types: UpdateDeviceTypeOrdersRequest,
                                                hospital_id: str
):
    print("update_device_type_display_order_transaction")

    for device_type in device_types.device_types:
        update_device_type_display_order(
                                            client=client,
                                            device_type=device_type,
                                            hospital_id=hospital_id
        )