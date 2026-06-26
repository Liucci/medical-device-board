from pydantic import BaseModel

class AddWardRequest(BaseModel):
    name: str

class WardResponse(BaseModel):
    id: int
    hospital_id: str
    name: str
    display_order: int
class DeleteWardRequest(BaseModel):
    id: int

class UpdateWardRequest(BaseModel):
    id:int
    name: str

class UpdateWardOrderRequest(BaseModel):
    id: int
    display_order: int

class UpdateWardOrdersRequest(BaseModel):
    wards: list[UpdateWardOrderRequest]