from common.supabase_admin_client import (
    supabase
)
from schemas.maintenance_type_schemas import (DeleteMaintenanceTypesRequest)

def delete_maintenance_types(
                                maintenance_types: DeleteMaintenanceTypesRequest,
                                hospital_id: str
                            ):

    response = (
        supabase
        .table("maintenance_types")
        .delete()
        .eq("hospital_id", hospital_id)
        .in_("id", maintenance_types.ids)
        .execute()
    )

    return response.data