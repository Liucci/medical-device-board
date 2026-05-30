from pydantic import BaseModel

class AddStockAreaRequest(BaseModel):
    name: str
