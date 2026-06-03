from common.supabase_client import supabase
from schemas.device_schemas import DeleteDeviceRequest


def delete_device(device: DeleteDeviceRequest,
                  hospital_id:str
                  ):

    print("delete device")

    (
        supabase
        .table("devices")
        .delete()
        .eq("id",device.id)
        .eq("hospital_id",hospital_id)
        .execute()
    )

