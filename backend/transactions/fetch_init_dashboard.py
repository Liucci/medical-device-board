from devices.fetch_devices import (
    fetch_devices
)

from stock_areas.fetch_stock_areas import (
    fetch_stock_areas
)

from wards.fetch_wards import (
    fetch_wards
)

from rooms.fetch_rooms import (
    fetch_rooms
)

from master.fetch_master import (
    fetch_master
)

from tasks.fetch_maintenance_tasks import (
    fetch_tasks
)

from maintenance_types.fetch_maintenance_types import (
    fetch_maintenance_types
)

from histories.fetch_histories import (
    fetch_histories
)


def fetch_init_dashboard(
                         hospital_id: str
                         ):

    print(
        "fetch_init_dashboard"
    )

    print(
        f"hospital_id: {hospital_id}"
    )

    # devices
    devices_response = fetch_devices(
        hospital_id
    )

    # stock areas
    stock_areas_response = fetch_stock_areas(
        hospital_id
    )

    # wards
    wards_response = fetch_wards(
        hospital_id
    )

    # rooms
    rooms_response = fetch_rooms(
        hospital_id
    )

    # master
    master_response = fetch_master(
        hospital_id
    )

    # tasks
    tasks_response = fetch_tasks(
        hospital_id
    )

    # maintenance types
    maintenance_types_response = (
        fetch_maintenance_types(
            hospital_id
        )
    )

    # histories
    histories_response = fetch_histories(
        hospital_id
    )

    return {

        "success": True,

        "devices":
            devices_response[
                "devices"
            ],

        "stock_areas":
            stock_areas_response[
                "stock_areas"
            ],

        "wards":
            wards_response[
                "wards"
            ],

        "rooms":
            rooms_response[
                "rooms"
            ],

        "device_types":
            master_response[
                "device_types"
            ],

        "device_models":
            master_response[
                "device_models"
            ],

        "tasks":
            tasks_response[
                "tasks"
            ],

        "maintenance_types":
            maintenance_types_response[
                "maintenance_types"
            ],

        "histories":
            histories_response[
                "histories"
            ]
    }
