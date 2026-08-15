from pydantic import BaseModel


class InspectionItemTypeResponse(BaseModel):
    id: int
    name: str
    description: str | None = None
    is_active: bool


class AddInspectionItemTypeRequest(BaseModel):
    name: str
    description: str | None = None


class UpdateInspectionItemTypeRequest(BaseModel):
    id: int
    name: str | None = None
    description: str | None = None
    is_active: bool | None = None


class DeleteInspectionItemTypesRequest(BaseModel):
    ids: list[int]