from common.supabase_client import (
    supabase
)

from schemas.maintenance_type_schemas import (
    AddMaintenanceTypeRequest
)

def add_maintenance_type(maintenance_type: AddMaintenanceTypeRequest):
    print("insert maintenance_type")
    try:
        response = (
            supabase
            .table("maintenance_types")
            .insert({
                "hospital_id":
                    maintenance_type.hospital_id,

                "device_type_id":
                    maintenance_type.device_type_id,

                "name":
                    maintenance_type.name,

                "interval_days":
                    maintenance_type.interval_days,

                "created_by":
                    maintenance_type.created_by,

                "updated_by":
                    maintenance_type.updated_by
            })
            .execute()
        )
        print("insert response")
        for row in response.data:
            print(f"・{row}")
        return response.data[0]
    
    except Exception as e:
        print(
            f"add_maintenance_types error: "
            f"{e}"
        )
        return []