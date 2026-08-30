from pydantic import BaseModel


class InspectionTypeResponse(BaseModel):
    id: int
    hospital_id: str | None
    name: str
    is_active: bool


class AddInspectionTypeRequest(BaseModel):
    name: str


class UpdateInspectionTypeRequest(BaseModel):
    id: int
    name: str | None = None
    is_active: bool | None = None


class DeleteInspectionTypesRequest(BaseModel):
    ids: list[int]