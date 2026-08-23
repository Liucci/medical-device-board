from supabase import Client

from schemas.hospital_settings_schemas import AddHospitalSettingsRequest


def add_hospital_settings(
    client: Client,
    hospital_settings: AddHospitalSettingsRequest,
):
    print("add_hospital_settings")

    response = (
        client
        .table("hospital_settings")
        .insert(
            {
                "hospital_id": hospital_settings.hospital_id,
                "show_patient_name": hospital_settings.show_patient_name,
                "auto_logout_enabled": hospital_settings.auto_logout_enabled,
                "auto_logout_time": hospital_settings.auto_logout_time,
            }
        )
        .execute()
    )

    return response.data[0]