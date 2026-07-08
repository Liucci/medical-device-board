from hospitals.fetch_hospital import fetch_hospitals
from users.fetch_users import fetch_users
from devices.fetch_devices import fetch_devices


def fetch_hospital_management_transaction():

    print("fetch_hospital_management_transaction")

    hospitals = fetch_hospitals()
    users = fetch_users()
    devices = fetch_devices()

    response = []

    for hospital in hospitals:

        user_count = sum(
            1
            for user in users
            if user["hospital_id"] == hospital["id"]
        )

        device_count = sum(
            1
            for device in devices
            if device["hospital_id"] == hospital["id"]
        )

        response.append(
            {
                **hospital,
                "user_count": user_count,
                "device_count": device_count
            }
        )

    return response