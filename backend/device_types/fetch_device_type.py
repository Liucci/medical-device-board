from supabase import Client



def fetch_device_types(
                        client:Client,
                        hospital_id: str
                        ):
    print("fetch_device_types")
    response = (
            client
            .table("device_types")
            .select("*")
            .eq(
                "hospital_id",
                hospital_id
            )
            .execute()
        )
    return response.data
    

def fetch_device_type(
                        client:Client,
                        device_type_id: int,
                        hospital_id: str
                     ):

    print("fetch_device_type")

    response = (
                    client
                    .table("device_types")
                    .select("*")
                    .eq("id", device_type_id)
                    .eq("hospital_id", hospital_id)
                    .single()
                    .execute()
               )

    return response.data