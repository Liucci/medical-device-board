from common.supabase_admin_client import supabase
from schemas.hospital_settings_schemas import UpdateHospitalSettingsRequest


def fetch_hospital_settings(hospital_id: str):

    print("fetch_hospital_settings")

    response = (
                    supabase
                    .table("hospital_settings")
                    .select("*")
                    .eq("hospital_id", hospital_id)
                    .single()
                    .execute()
               )

    return response.data