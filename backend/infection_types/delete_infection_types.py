from supabase import Client
from schemas.infection_type_schemas import DeleteInfectionTypesRequest

def delete_infection_types(
                            client:Client,
                            infection_type: DeleteInfectionTypesRequest,
                            hospital_id: str
                          ):

    print("delete infection_types")

    (
        client
        .table("infection_types")
        .delete()
        .in_("id", infection_type.ids)
        .eq("hospital_id", hospital_id)
        .execute()
    )