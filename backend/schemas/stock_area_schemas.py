from pydantic import BaseModel

class AddStockAreaRequest(BaseModel):
    name: str
class DeleteStockAreasRequest(BaseModel):
    stock_area_ids: list[int]

class UpdateStockAreaRequest(BaseModel):
    id:int
    name: str