from datetime import datetime, timedelta

from supabase import Client

from maintenance_types.fetch_maintenance_types import fetch_maintenance_types
from tasks.add_maintenance_task import add_maintenance_task

from schemas.maintenance_task_schemas import AddMaintenanceTaskRequest


def create_device_tasks_transaction(
                                      client:Client,
                                      device_id: int,
                                      hospital_id: str
                                   ):

    print("create_device_tasks_transaction")

    device_response = (
                          client
                          .table("devices")
                          .select("*")
                          .eq("id", device_id)
                          .eq("hospital_id", hospital_id)
                          .single()
                          .execute()
                      )

    device = device_response.data

    maintenance_types = fetch_maintenance_types(
                                                  client=client, 
                                                  hospital_id=hospital_id
                                               )

    for maintenance_type in maintenance_types:

        if maintenance_type["device_type_id"] != device["type"]:
            continue

        if (
             maintenance_type["device_model_id"] is not None
             and
             maintenance_type["device_model_id"] != device["model"]
           ):
            continue

        due_at = (
                    datetime.utcnow()
                    + timedelta(days=maintenance_type["interval_days"])
                 )

        add_maintenance_task(
                              client=client, 
                              task=AddMaintenanceTaskRequest(
                                                              device_id=device_id,
                                                              maintenance_type_id=maintenance_type["id"],
                                                              due_at=due_at
                                                            ),
                              hospital_id=hospital_id
                            )