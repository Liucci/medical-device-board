from common.supabase_client import (supabase)
from schemas.device_schemas import (AddDeviceRequest)

def add_device(
                device: AddDeviceRequest,
                hospital_id
              ):

    print("add_device")

    (
    supabase
    .table("devices")
    .insert({
                "hospital_id": hospital_id,
                "type": device.type,
                "model": device.model,
                "asset_type": device.asset_type,
                
                "rental_start_date": device.rental_start_date,
                "rental_end_date": device.rental_end_date
                })
    .execute()
    )

