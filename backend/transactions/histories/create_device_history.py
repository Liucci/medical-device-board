from common.supabase_client import supabase

from devices.fetch_devices import fetch_device

from device_types.fetch_device_type import fetch_device_type
from device_models.fetch_device_models import fetch_device_model

from rooms.fetch_rooms import fetch_room
from stock_areas.fetch_stock_areas import fetch_stock_area


def create_device_history(
                            device_id: int,
                            hospital_id: str,
                            action_by: str,
                            action_type: str,
                            message: str | None = None
                         ):

    device = fetch_device(
                            device_id=device_id,
                            hospital_id=hospital_id
                         )
    device_type = fetch_device_type(
                                        device_type_id=device["type"],
                                        hospital_id=hospital_id
                                    )
    device_model = fetch_device_model(
                                        device_model_id=device["model"],
                                        hospital_id=hospital_id
                                        )
    #stock area機器、room機器どちらにも対応できるようにする
    #None状態の入れ物を先ず作る
    room_name = None
    stock_area_name = None
    patient_name = None
    #room idあれば抽出、なければNoneまま
    if device["room_id"]:
        room = fetch_room(
                            room_id=device["room_id"],
                            hospital_id=hospital_id
                        )
        room_name = room["name"]
        patient_name = room["patient_name"]
    #stock area idあれば抽出、なければNoneのまま
    if device["stock_area_id"]:
        stock_area = fetch_stock_area(
                                        stock_area_id=device["stock_area_id"],
                                        hospital_id=hospital_id
                                    )
        stock_area_name = stock_area["name"]    

    history = {
        "hospital_id": hospital_id,
        "device_id": device_id,
        "action_by": action_by,
        "action_type": action_type,
        "message": message,
        "device_type_name": device_type["name"],
        "device_model_name": device_model["name"],
        "room_name": room_name,
        "stock_area_name": stock_area_name,
        "patient_name": patient_name,
        "management_number": device["management_number"],
        "serial_number": device["serial_number"],
        "note": device["note"],
        "maintenance_started_at":device["maintenance_started_at"],
        "maintenance_finished_at":device["maintenance_finished_at"],
        "standby_started_at":device["standby_started_at"],
        "standby_finished_at":device["standby_finished_at"]
    }

    history = {
                k: v
                for k, v in history.items()
                if v is not None
              }

    supabase.table(
                    "device_histories"
                  ).insert(
                            history
                          ).execute()