from common.supabase_client import supabase

def delete_device_maintenance_tasks(
    device_id: int,
    hospital_id: str
):

    response = (
        supabase
        .table("device_maintenance_tasks")
        .delete()
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