from supabase import Client

def fetch_maintenance_tasks(
                              client:Client,
                              hospital_id: str
                           ):
    print("fetch_maintenance_tasks")
    response = (
                  client
                  .table("device_maintenance_tasks")
                  .select("*")
                  .eq("hospital_id", hospital_id)
                  .execute()
               )

    return response.data