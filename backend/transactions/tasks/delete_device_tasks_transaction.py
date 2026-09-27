from supabase import Client

from maintenance_types.fetch_maintenance_types import fetch_maintenance_type
from tasks.fetch_maintenance_tasks_by_device_id import fetch_maintenance_tasks_by_device_id
from tasks.delete_tasks_by_ids import delete_tasks_by_ids

#移動先とdeviceが所有するtaskのstatusによって何を削除するかを判定し削除実行する関数
#new statusは移動先を表す
def delete_device_tasks_transaction(
                                             client:Client,
                                             device_id: int,
                                             new_status: str,
                                             hospital_id: str
                                         ):

    print("delete_device_tasks_transaction")

    tasks = fetch_maintenance_tasks_by_device_id(
                                                    client=client,
                                                    device_id=device_id,
                                                    hospital_id=hospital_id
                                                )

    delete_task_ids = []

    for task in tasks:

        maintenance_type = fetch_maintenance_type(
                                                    client=client,
                                                    maintenance_type_id=task["maintenance_type_id"],
                                                    hospital_id=hospital_id
                                                )

        if maintenance_type["depend_device_status"] == "both":
            continue

        if maintenance_type["depend_device_status"] == new_status:
            continue

        delete_task_ids.append(task["id"])

    if not delete_task_ids:
        return []

    return delete_tasks_by_ids(
                                client=client,
                                task_ids=delete_task_ids,
                                hospital_id=hospital_id
                              )