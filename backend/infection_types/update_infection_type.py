from common.supabase_admin_client import supabase
from supabase import Client
from schemas.infection_type_schemas import UpdateInfectionTypeRequest

def update_infection_type(
                            client:Client,
                            infection_type: UpdateInfectionTypeRequest,
                            hospital_id: str
                         ):

    print("update_infection_type")

    response = (
        client
        .table("infection_types")
        .update({
                    "name": infection_type.name,
                    "color": infection_type.color
                })
        .eq("id", infection_type.id)
        .eq("hospital_id", hospital_id)
        .execute()
    )

    return response.data[0]