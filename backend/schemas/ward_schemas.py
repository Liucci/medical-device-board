from pydantic import BaseModel

class AddWardRequest(BaseModel):
    name: str

class WardResponse(BaseModel):
    id: int
    hospital_id: str
    name: str

class DeleteWardRequest(BaseModel):
    id: int

class UpdateWardRequest(BaseModel):
    id:int
    name: str