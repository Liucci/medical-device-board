from common.supabase_admin_client import supabase
from schemas.infection_type_schemas import UpdateInfectionTypeRequest

def update_infection_type(
                            infection_type: UpdateInfectionTypeRequest,
                            hospital_id: str
                         ):

    print("update_infection_type")

    response = (
        supabase
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