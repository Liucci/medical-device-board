from pydantic import BaseModel

class AddWardRequest(BaseModel):
    hospital_id: str
    name: str
