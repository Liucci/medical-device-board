from common.supabase_admin_client import (supabase)
from schemas.maintenance_type_schemas import (AddMaintenanceTypeRequest)

def add_maintenance_type(
                            maintenance_type: AddMaintenanceTypeRequest,
                            hospital_id: str,
                            user_id: str
                        ):

    print("insert maintenance_type")

    response = (
        supabase
        .table("maintenance_types")
        .insert({
            "hospital_id": hospital_id,
            "device_type_id": maintenance_type.device_type_id,
            "device_model_id": maintenance_type.device_model_id,
            "name": maintenance_type.name,
            "interval_days": maintenance_type.interval_days,
        })
        .execute()
    )

    return response.data[0]
    
