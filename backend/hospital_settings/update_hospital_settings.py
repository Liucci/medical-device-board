from common.supabase_admin_client import supabase
from schemas.hospital_settings_schemas import UpdateHospitalSettingsRequest

def update_hospital_settings(
                                hospital_settings: UpdateHospitalSettingsRequest,
                                hospital_id: str,
                                updated_at
                            ):

    print("update_hospital_settings")

    response = (
                    supabase
                    .table("hospital_settings")
                    .update({
                                "show_patient_name": hospital_settings.show_patient_name,
                                "auto_logout_enabled": hospital_settings.auto_logout_enabled,
                                "auto_logout_time": hospital_settings.auto_logout_time,
                                "updated_at": updated_at
                            })
                    .eq("hospital_id", hospital_id)
                    .execute()
               )

    return response.data[0]