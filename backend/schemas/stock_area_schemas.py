from pydantic import BaseModel

class AddStockAreaRequest(BaseModel):
    name: str
class StockAreaResponse(BaseModel):
    id: int
    hospital_id: str
    name: str
    display_order: int
class DeleteStockAreasRequest(BaseModel):
    ids: list[int]

class UpdateStockAreaRequest(BaseModel):
    id:int
    name: str

class UpdateStockAreaOrderRequest(BaseModel):
    id: int
    display_order: int

class UpdateStockAreaOrdersRequest(BaseModel):
    stock_areas: list[UpdateStockAreaOrderRequest]