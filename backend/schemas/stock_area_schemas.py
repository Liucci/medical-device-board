from pydantic import BaseModel

class AddStockAreaRequest(BaseModel):
    hospital_id: str
    name: str
    color: str | None = None
    created_by: str | None = None
    updated_by: str | None = None