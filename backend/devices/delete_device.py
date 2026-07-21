from common.supabase_admin_client import supabase
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

#deleteでdeviceが消えるので、LastUpdate系はfront側で作成
