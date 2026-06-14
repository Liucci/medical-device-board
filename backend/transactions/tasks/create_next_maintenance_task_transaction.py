from datetime import datetime, timedelta

from common.supabase_client import supabase

from tasks.add_maintenance_task import add_maintenance_task

from schemas.maintenance_task_schemas import AddMaintenanceTaskRequest


def create_next_maintenance_task_transaction(
                                                device_id: int,
                                                maintenance_type_id: int,
                                                hospital_id: str
                                             ):

    print("create_next_maintenance_task_transaction")

    maintenance_type = (
                            supabase
                            .table("maintenance_types")
                            .select("*")
                            .eq("id", maintenance_type_id)
                            .eq("hospital_id", hospital_id)
                            .single()
                            .execute()
                        ).data

    due_at = (
                datetime.utcnow()
                + timedelta(days=maintenance_type["interval_days"])
             )

    return add_maintenance_task(
                                  task=AddMaintenanceTaskRequest(
                                                                  device_id=device_id,
                                                                  maintenance_type_id=maintenance_type_id,
                                                                  due_at=due_at
                                                                ),
                                  hospital_id=hospital_id
                                )