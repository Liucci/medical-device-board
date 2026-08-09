from schemas.maintenance_type_schemas import (AddMaintenanceTypeRequest)
from maintenance_types.add_maintenance_type import (add_maintenance_type)
from supabase import Client

def create_maintenance_type_transaction(
                                            client:Client,
                                            maintenance_type: AddMaintenanceTypeRequest,
                                            hospital_id: str,
                                            user_id: str
                                        ):

    print("create_maintenance_type_transaction")

    return add_maintenance_type(
                                   client,
                                     maintenance_type,
                                    hospital_id,
                                    user_id
                                )