from pydantic import BaseModel

# Response
class InfectionTypeResponse(BaseModel):
    id: int
    hospital_id: str
    name: str
    color: str

# Create
class AddInfectionTypeRequest(BaseModel):
    name: str
    color: str

# Update
class UpdateInfectionTypeRequest(BaseModel):
    id: int
    name: str
    color: str

# Delete
class DeleteInfectionTypesRequest(BaseModel):
    ids: list[int]


