from hospital_settings.fetch_hospital_settings import fetch_hospital_settings

def fetch_hospital_settings_transaction(hospital_id: str):
    print("fetch_hospital_settings_transaction")

    hospital_settings = fetch_hospital_settings(hospital_id)

    return hospital_settings