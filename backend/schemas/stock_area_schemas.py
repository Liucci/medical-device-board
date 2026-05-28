from pydantic import BaseModel

class AddStockAreaRequest(BaseModel):
    hospital_id: str
    name: str
