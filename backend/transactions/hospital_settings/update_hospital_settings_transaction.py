from datetime import datetime, timezone
from supabase import Client

from hospital_settings.update_hospital_settings import update_hospital_settings
from schemas.hospital_settings_schemas import UpdateHospitalSettingsRequest


def update_hospital_settings_transaction(
                                            client:Client,
                                            hospital_settings: UpdateHospitalSettingsRequest,
                                            hospital_id: str
                                        ):
    print("update_hospital_settings_transaction")

    updated_at = datetime.now(timezone.utc).isoformat()

    return update_hospital_settings(
                                        client=client, 
                                        hospital_settings=hospital_settings,
                                        hospital_id=hospital_id,
                                        updated_at=updated_at
                                    )