from pydantic import BaseModel
class CreateHospitalRequest(BaseModel):
    hospital_name: str
    display_name: str
    email: str


class HospitalResponse(BaseModel):
    id: str
    hospital_name: str