from pydantic import BaseModel


class AddHospitalRequest(BaseModel):
    hospital_name: str
    price_plan: str
    note: str | None = None


class UpdateHospitalRequest(BaseModel):
    hospital_id: str
    hospital_name: str
    price_plan: str
    is_active: bool
    note: str | None = None


class HospitalResponse(BaseModel):
    id: str
    hospital_name: str
    price_plan: str
    is_active: bool
    note: str | None
    created_at: str
    updated_at: str | None