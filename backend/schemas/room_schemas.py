from pydantic import BaseModel

class AddRoomRequest(BaseModel):
    ward_id: int
    name: str
    #patient_name: str | None = None

class RoomResponse(BaseModel):
    id: int
    hospital_id: str
    ward_id:int
    name: str
    patient_name: str | None = None


class DeleteRoomsRequest(BaseModel):
    ids: list[int]

class UpdateRoomRequest(BaseModel):
    id:int
    name: str

class UpdateRoomPatientRequest(BaseModel):
    id:int
    patient_name: str | None = None