from datetime import datetime, timezone
from common.supabase_admin_client import supabase
from schemas.device_schemas import UpdateDeviceUpdateAtRequest


#device tableのupdate atを更新する用
def update_device_updated_at(
                            device: UpdateDeviceUpdateAtRequest,
                            hospital_id: str,
                            user_id: str
):

    print("update_device_updated_at")

    response = (
                supabase
                .table("devices")
                .update({
                        "updated_by": user_id,
                        "updated_at": datetime.now(timezone.utc).isoformat()
                })
                .eq("id", device.id)
                .eq("hospital_id", hospital_id)
                .execute()
    )

    return response.data[0]