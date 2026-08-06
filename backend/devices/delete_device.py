from common.supabase_admin_client import supabase
from supabase import Client
from schemas.device_schemas import DeleteDeviceRequest


def delete_device(
                    client:Client,
                    device: DeleteDeviceRequest,
                    hospital_id:str
                  ):

    print("delete device")

    (
        client
        .table("devices")
        .delete()
        .eq("id",device.id)
        .eq("hospital_id",hospital_id)
        .execute()
    )

#deleteでdeviceが消えるので、LastUpdate系はfront側で作成
