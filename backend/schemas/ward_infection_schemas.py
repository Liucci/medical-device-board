from pydantic import BaseModel


# Ward Infection Response
# DB → Backend
class WardInfectionResponse(BaseModel):
    id: int
    hospital_id: str
    ward_id: int
    infection_type_id: int


# Backend → DB

# Create
class AddWardInfectionRequest(BaseModel):
    ward_id: int
    infection_type_id: int


# Delete
class DeleteWardInfectionsRequest(BaseModel):
    ids: list[int]


# Update
class UpdateWardInfectionsRequest(BaseModel):
    ward_id: int
    infection_type_ids: list[int]