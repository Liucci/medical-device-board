from devices.fetch_devices import fetch_devices
from stock_areas.fetch_stock_areas import fetch_stock_areas
from wards.fetch_wards import fetch_wards
from rooms.fetch_rooms import fetch_rooms
from device_types.fetch_device_type import fetch_device_types
from device_models.fetch_device_models import fetch_device_models
from tasks.fetch_maintenance_tasks import fetch_maintenance_tasks
from maintenance_types.fetch_maintenance_types import fetch_maintenance_types
from histories.fetch_histories import fetch_device_histories

def fetch_init_dashboard(hospital_id: str,):
    print("fetch_init_dashboard")
    devices = fetch_devices(hospital_id)
    stock_areas = fetch_stock_areas( hospital_id)
    wards = fetch_wards(hospital_id)
    rooms = fetch_rooms( hospital_id)
    device_types = fetch_device_types( hospital_id)
    device_models = fetch_device_models(hospital_id)
    tasks = fetch_maintenance_tasks( hospital_id)
    maintenance_types = ( fetch_maintenance_types(hospital_id) )
    histories = fetch_device_histories( hospital_id)

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
    }