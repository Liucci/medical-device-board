from pydantic import BaseModel

class AddWardRequest(BaseModel):
    name: str

class WardResponse(BaseModel):
    id: int
    hospital_id: str
    name: str
    display_order: int
    status: str | None
    note: str | None

class DeleteWardRequest(BaseModel):
    id: int

class UpdateWardRequest(BaseModel):
    id:int
    name: str
    status: str | None = None
    note: str | None = None
class UpdateWardOrderRequest(BaseModel):
    id: int
    display_order: int
    

class UpdateWardOrdersRequest(BaseModel):
    wards: list[UpdateWardOrderRequest]

#ward info modal専用
class UpdateWardInfoRequest(BaseModel):
    id: int
    status: str | None
    note: str | None
    infection_type_ids: list[int]