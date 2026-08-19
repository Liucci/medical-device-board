from schemas.maintenance_type_schemas import (
    DeleteMaintenanceTypesRequest
)

from maintenance_types.delete_maintenance_types import (
    delete_maintenance_types
)
from supabase import Client

def delete_maintenance_type_transaction(
                                            client:Client,
                                            maintenance_types: DeleteMaintenanceTypesRequest,
                                            hospital_id: str
                                        ):

    print("delete_maintenance_type_transaction")

    return delete_maintenance_types(
                                        client,
                                        maintenance_types,
                                        hospital_id
                                   )