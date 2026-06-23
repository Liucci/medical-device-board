from common.supabase_client import supabase
from schemas.device_schemas import UpdateDeviceRentalDatesRequest

def update_device_rental_dates(
                                device:  UpdateDeviceRentalDatesRequest,
                                hospital_id: str
                              ):

    response=(
                supabase
                .table("devices")
                .update(
                    {
                        "rental_start_date": device.rental_start_date,
                        "rental_end_date": device.rental_end_date
                    }
                )
                .eq("id", device.id)
                .eq("hospital_id", hospital_id)
                .execute()
            )
    
    return response.data[0]