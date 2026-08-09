from supabase import Client

from schemas.maintenance_type_schemas import (DeleteMaintenanceTypesRequest)

def delete_maintenance_types(
                                client:Client,
                                maintenance_types: DeleteMaintenanceTypesRequest,
                                hospital_id: str
                            ):

    response = (
        client
        .table("maintenance_types")
        .delete()
        .eq("hospital_id", hospital_id)
        .in_("id", maintenance_types.ids)
        .execute()
    )

    return response.data