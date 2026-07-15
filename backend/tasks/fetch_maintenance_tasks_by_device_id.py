from common.supabase_admin_client import supabase

def fetch_maintenance_tasks_by_device_id(
    device_id: int,
    hospital_id: str
):
    print("fetch_maintenance_tasks_by_device_id")

    response = (
        supabase
        .table("device_maintenance_tasks")
        .select("*")
        .eq(
            "device_id",
            device_id
        )
        .eq(
            "hospital_id",
            hospital_id
        )
        .execute()
    )

    return response.data