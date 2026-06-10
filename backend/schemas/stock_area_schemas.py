from pydantic import BaseModel

class AddStockAreaRequest(BaseModel):
    name: str
class DeleteStockAreasRequest(BaseModel):
    ids: list[int]

class UpdateStockAreaRequest(BaseModel):
    id:int
    name: str