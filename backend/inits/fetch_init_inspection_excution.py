from supabase import Client

from devices.fetch_devices import fetch_devices
from wards.fetch_wards import fetch_wards
from rooms.fetch_rooms import fetch_rooms
from room_infections.fetch_room_infections import fetch_room_infections
from infection_types.fetch_infection_types import fetch_infection_types
from device_types.fetch_device_type import fetch_device_types
from device_models.fetch_device_models import fetch_device_models

from inspection.inspection_types.fetch_inspection_types import (fetch_inspection_types)
from inspection.inspection_checklists.fetch_inspection_checklists import (fetch_inspection_checklists)
from inspection.inspection_item_categories.fetch_inspection_item_categories import (fetch_inspection_item_categories)
from inspection.inspection_item_types.fetch_inspection_item_types import (fetch_inspection_item_types)
from transactions.hospital_settings.fetch_hospital_settings_transaction import (fetch_hospital_settings_transaction)


def fetch_init_inspection_execution(
    client: Client,
    hospital_id: str,
    display_name:str,
    role:str
):

    print("fetch_init_inspection_execution")

    devices = fetch_devices(client,hospital_id,)
    wards = fetch_wards(client,hospital_id,)
    rooms = fetch_rooms(client,hospital_id)
    room_infections = fetch_room_infections(client,hospital_id,)
    infection_types = fetch_infection_types(client,hospital_id,)
    device_types = fetch_device_types(client,hospital_id,)
    device_models = fetch_device_models(client,hospital_id)
    inspection_types = fetch_inspection_types(client,hospital_id,)
    inspection_checklists = fetch_inspection_checklists(client,hospital_id,)
    inspection_item_categories = fetch_inspection_item_categories(client,hospital_id,)
    inspection_item_types = fetch_inspection_item_types(client)
    hospital_settings = fetch_hospital_settings_transaction(client,hospital_id,)

    return {
        "devices": devices,
        "wards": wards,
        "rooms": rooms,
        "room_infections": room_infections,
        "infection_types": infection_types,
        "device_types": device_types,
        "device_models": device_models,
        "inspection_types": inspection_types,
        "inspection_checklists": inspection_checklists,
        "inspection_item_categories": inspection_item_categories,
        "inspection_item_types": inspection_item_types,
        "hospital_settings": hospital_settings,
        "current_user": {
                        "display_name": display_name,
                        "role": role,    
                        }
    }