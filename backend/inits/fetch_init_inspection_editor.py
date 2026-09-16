from supabase import Client

from inspection.inspection_types.fetch_inspection_types import fetch_inspection_types
from inspection.inspection_item_types.fetch_inspection_item_types import fetch_inspection_item_types
from inspection.inspection_checklists.fetch_inspection_checklists import fetch_inspection_checklists
from device_types.fetch_device_type import fetch_device_types
from device_models.fetch_device_models import fetch_device_models
from inspection.inspection_item_categories.fetch_inspection_item_categories import fetch_inspection_item_categories


def fetch_init_inspection_editor(
    client: Client,
    hospital_id: str,
):
    
    print("fetch_init_inspection_editor")

    inspection_types = fetch_inspection_types(client, hospital_id)
    inspection_item_types = fetch_inspection_item_types(client)
    inspection_checklists = fetch_inspection_checklists(client, hospital_id)
    device_types = fetch_device_types(client, hospital_id)
    device_models = fetch_device_models(client, hospital_id)
    inspection_item_categories = fetch_inspection_item_categories(client, hospital_id)

    return {
        "inspection_types": inspection_types,
        "inspection_item_types": inspection_item_types,
        "inspection_checklists": inspection_checklists,
        "device_types": device_types,
        "device_models": device_models,
        "inspection_item_categories": inspection_item_categories,
    }