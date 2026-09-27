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

def fetch_maintenance_types_by_device(client:Client, 
                                      device_type_id: int, 
                                      device_model_id: int, 
                                      hospital_id: str):

    print("fetch_maintenance_types_by_device")

    response = (
                client
                .table("maintenance_types")
                .select("*")
                .eq("hospital_id", hospital_id)
                .eq("device_type_id", device_type_id)
                .or_(
                    f"device_model_id.is.null,device_model_id.eq.{device_model_id}"
                )
                .execute()
               )

    return response.data