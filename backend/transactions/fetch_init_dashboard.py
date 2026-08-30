from supabase import Client

from devices.fetch_devices import fetch_devices
from stock_areas.fetch_stock_areas import fetch_stock_areas
from wards.fetch_wards import fetch_wards
from rooms.fetch_rooms import fetch_rooms
from device_types.fetch_device_type import fetch_device_types
from device_models.fetch_device_models import fetch_device_models
from tasks.fetch_maintenance_tasks import fetch_maintenance_tasks
from maintenance_types.fetch_maintenance_types import fetch_maintenance_types
from histories.fetch_histories import fetch_device_histories
from infection_types.fetch_infection_types import fetch_infection_types
from room_infections.fetch_room_infections import fetch_room_infections
from ward_infections.fetch_ward_infections import fetch_ward_infections
from announcements.fetch_active_announcements import fetch_active_announcements
from inspection.inspection_types.fetch_inspection_types import fetch_inspection_types
#transactionではclientの種類の情報は持たない
def fetch_init_dashboard(
                            client: Client,
                            hospital_id: str,
                            ):
    
    print("fetch_init_dashboard")

    devices = fetch_devices(client,hospital_id,)
    stock_areas = fetch_stock_areas( client,hospital_id)
    wards = fetch_wards(client,hospital_id)
    rooms = fetch_rooms( client,hospital_id)
    device_types = fetch_device_types( client,hospital_id)
    device_models = fetch_device_models(client,hospital_id)
    tasks = fetch_maintenance_tasks( client,hospital_id)
    maintenance_types = fetch_maintenance_types(client,hospital_id)
    histories = fetch_device_histories(client, hospital_id)
    infection_types=fetch_infection_types(client,hospital_id)
    room_infections=fetch_room_infections(client,hospital_id)
    ward_infections=fetch_ward_infections(client,hospital_id)
    active_announcements=fetch_active_announcements(client,hospital_id)
    inspection_types = fetch_inspection_types(client, hospital_id)


    return {
        "devices": devices,
        "stock_areas": stock_areas,
        "wards": wards,
        "rooms": rooms,
        "device_types": device_types,
        "device_models": device_models,
        "tasks": tasks,
        "maintenance_types": maintenance_types,
        "histories": histories,
        "infection_types": infection_types,
        "room_infections": room_infections,
        "ward_infections": ward_infections,
        "active_announcements":active_announcements,
        "inspection_types": inspection_types, 

    }