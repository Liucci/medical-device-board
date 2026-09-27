from supabase import Client
from schemas.maintenance_type_schemas import (UpdateMaintenanceTypeRequest)

def update_maintenance_type(
                                client:Client,
                                maintenance_type: UpdateMaintenanceTypeRequest,
                                hospital_id
                            ):

    print("update_maintenance_type")

    response = (
        client
        .table("maintenance_types")
        .update({
            "name": maintenance_type.name,
            "interval_days": maintenance_type.interval_days,
            "depend_device_status": maintenance_type.depend_device_status
        })
        .eq("id", maintenance_type.id)
        .eq("hospital_id", hospital_id)
        .execute()
    )

    return response.data[0]