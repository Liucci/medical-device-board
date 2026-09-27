from supabase import Client


def delete_tasks_by_ids(
                         client:Client,
                         task_ids: list[int],
                         hospital_id: str
                     ):

    print("delete_tasks_by_ids")

    response = (
                  client
                  .table("device_maintenance_tasks")
                  .delete()
                  .in_("id", task_ids)
                  .eq("hospital_id", hospital_id)
                  .execute()
                )

    return response.data