from supabase import Client

def fetch_maintenance_types(client:Client,
                            hospital_id: str):
    print("fetch_maintenance_types")
    response = (
                client
                .table("maintenance_types")
                .select("*")
                .eq(
                    "hospital_id",
                    hospital_id
                )
                .execute()
)

    return response.data


def fetch_maintenance_type(
                             client:Client,
                             maintenance_type_id: int,
                             hospital_id: str
                          ):

    print("fetch_maintenance_type")

    response = (
                    client
                    .table("maintenance_types")
                    .select("*")
                    .eq("id", maintenance_type_id)
                    .eq("hospital_id", hospital_id)
                    .single()
                    .execute()
               )

    return response.data