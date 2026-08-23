from pydantic import BaseModel
from datetime import time

class HospitalSettingsResponse(BaseModel):
    hospital_id: str
    show_patient_name: bool
    auto_logout_enabled: bool
    auto_logout_time: time | None

class UpdateHospitalSettingsRequest(BaseModel):
    show_patient_name: bool
    auto_logout_enabled: bool
    auto_logout_time: time | None

class AddHospitalSettingsRequest(BaseModel):
    hospital_id: str
    show_patient_name: bool
    auto_logout_enabled: bool
    auto_logout_time: time | None