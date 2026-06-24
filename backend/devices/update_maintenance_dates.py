from common.supabase_client import supabase
from schemas.device_schemas import UpdateMaintenanceDatesRequest

def update_maintenance_dates(
                                device: UpdateMaintenanceDatesRequest,
                                hospital_id: str
                            ):

    print("update_maintenance_dates")

    updated_device = (
                        supabase
                        .table("devices")
                        .update(
                            {
                                "maintenance_started_at":
                                    device.maintenance_started_at or None,
                            }
                        )
                        .eq("id",device.id)
                        .eq("hospital_id",hospital_id)
                        .execute()
                     )
    return updated_device