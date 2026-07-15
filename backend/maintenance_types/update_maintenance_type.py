from common.supabase_admin_client import (supabase)
from schemas.maintenance_type_schemas import (UpdateMaintenanceTypeRequest)

def update_maintenance_type(
                                maintenance_type: UpdateMaintenanceTypeRequest,
                                hospital_id
                            ):

    print("update_maintenance_type")

    response = (
        supabase
        .table("maintenance_types")
        .update({
            "name": maintenance_type.name,
            "interval_days": maintenance_type.interval_days
        })
        .eq("id", maintenance_type.id)
        .eq("hospital_id", hospital_id)
        .execute()
    )

    return response.data[0]