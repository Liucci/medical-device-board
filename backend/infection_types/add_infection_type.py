from supabase import Client
from schemas.infection_type_schemas import AddInfectionTypeRequest

def add_infection_type(
                        client:Client,
                        infection_type: AddInfectionTypeRequest,
                        hospital_id: str
                      ):

    print("insert infection_type")

    response = (
        client
        .table("infection_types")
        .insert({
            "hospital_id": hospital_id,
            "name": infection_type.name,
            "color": infection_type.color
        })
        .execute()
    )

    return response.data[0]