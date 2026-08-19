from hospital_settings.fetch_hospital_settings import fetch_hospital_settings
from supabase import Client

def fetch_hospital_settings_transaction(client:Client,
                                        hospital_id: str):
    print("fetch_hospital_settings_transaction")

    hospital_settings = fetch_hospital_settings(
                                                client,
                                                hospital_id
                                                )

    return hospital_settings