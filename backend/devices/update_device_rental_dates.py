from common.supabase_admin_client import supabase
from schemas.device_schemas import UpdateDeviceRentalDatesRequest
from datetime import datetime, timezone

def update_device_rental_dates(
                                device:  UpdateDeviceRentalDatesRequest,
                                hospital_id: str,
                                user_id:str
                              ):

    response=(
                supabase
                .table("devices")
                .update(
                    {
                        "rental_start_date": device.rental_start_date,
                        "rental_end_date": device.rental_end_date,
                        "updated_by": user_id,
                        "updated_at": datetime.now(timezone.utc).isoformat()
                    }
                )
                .eq("id", device.id)
                .eq("hospital_id", hospital_id)
                .execute()
            )
    
    return response.data[0]