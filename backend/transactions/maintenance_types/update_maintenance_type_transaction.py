from schemas.maintenance_type_schemas import (UpdateMaintenanceTypeRequest)
from maintenance_types.update_maintenance_type import (update_maintenance_type)
from supabase import Client

def update_maintenance_type_transaction(
                                            client:Client,
                                            maintenance_type: UpdateMaintenanceTypeRequest,
                                            hospital_id: str
                                        ):

    print("update_maintenance_type_transaction")

    return update_maintenance_type(
                                        client,
                                        maintenance_type,
                                        hospital_id
                                  )