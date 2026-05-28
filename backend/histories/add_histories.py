from common.supabase_client import (
    supabase
)

from schemas.history_schemas import (
    AddHistoryRequest
)

def add_history(history: AddHistoryRequest):
    print("insert history")
    try:
        response = (
            supabase
            .table("device_histories")
            .insert({

                "hospital_id":
                    history.hospital_id,

                "device_id":
                    history.device_id,

                "user_id":
                    history.user_id,

                "action_type":
                    history.action_type,

                "message":
                    history.message,

                "status":
                    history.status,

                "stock_area_id":
                    history.stock_area_id,

                "room_id":
                    history.room_id,

                "management_number":
                    history.management_number,

                "serial_number":
                    history.serial_number,

                "note":
                    history.note,

                "error_code":
                    history.error_code,

                "error_level":
                    history.error_level,

                "error_detail":
                    history.error_detail,

                "patient_name":
                    history.patient_name,

                "device_type_name":
                    history.device_type_name,

                "device_model_name":
                    history.device_model_name,

                "room_name":
                    history.room_name,

                "stock_area_name":
                    history.stock_area_name,

                "maintenance_started_at":
                    history.maintenance_started_at,

                "maintenance_finished_at":
                    history.maintenance_finished_at,

                "standby_started_at":
                    history.standby_started_at,

                "standby_finished_at":
                    history.standby_finished_at,

                "action_by":
                    history.action_by
            })
            .execute()
        )

        return response.data[0]
    
    except Exception as e:
        print(
            f"add_history error: "
            f"{e}"
        )
        return []