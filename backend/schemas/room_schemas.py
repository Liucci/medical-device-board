from pydantic import BaseModel
# APIで使用するschema定義
# Requestにはfrontが送る値のみ定義する
# DB側で補完する値(hospital_id等)は含めない


class RoomResponse(BaseModel):
    id: int
    hospital_id:str
    ward_id:int
    name:str
    patient_name:str | None = None

class AddRoomRequest(BaseModel):
    #idはDB自動付与
    ward_id:int
    name:str #room nameを指す
    #patient_name: str | None = None

class DeleteRoomsRequest(BaseModel):
    ids:list[int]

class UpdateRoomRequest(BaseModel):
    id:int
    name:str

class UpdateRoomPatientRequest(BaseModel):
    id:int
    patient_name:str | None = None

class ClearRoomPatientRequest(BaseModel):
    id:int
