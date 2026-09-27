from datetime import datetime, timedelta

from supabase import Client

from devices.fetch_devices import fetch_device
from maintenance_types.fetch_maintenance_types import fetch_maintenance_types_by_device
from tasks.add_maintenance_task import add_maintenance_task
from schemas.maintenance_task_schemas import AddMaintenanceTaskRequest


def create_both_maintenance_task_transaction(
                                                client: Client,
                                                device_id: int,
                                                maintenance_type_id: int,
                                                hospital_id: str
                                            ):
    print("create_both_maintenance_task_transaction")

    device = fetch_device(
                            client=client,
                            device_id=device_id,
                            hospital_id=hospital_id
                        )

    maintenance_types = fetch_maintenance_types_by_device(
                                                            client=client,
                                                            device_type_id=device["type"],
                                                            device_model_id=device["model"],
                                                            hospital_id=hospital_id
                                                        )

    maintenance_type = next(
        (
            maintenance_type
            for maintenance_type in maintenance_types
            if maintenance_type["id"] == maintenance_type_id
            and maintenance_type["depend_device_status"] == "both"
        ),
        None
    )

    if maintenance_type is None:
        raise ValueError("指定されたメンテナンスタイプは追加対象ではありません。")

    due_at = (
        datetime.utcnow()
        + timedelta(days=maintenance_type["interval_days"])
    )

    return add_maintenance_task(
                                client=client,
                                task=AddMaintenanceTaskRequest(
                                    device_id=device_id,
                                    maintenance_type_id=maintenance_type_id,
                                    due_at=due_at
                                ),
                                hospital_id=hospital_id
                            )