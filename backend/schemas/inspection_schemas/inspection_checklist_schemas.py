from datetime import datetime
from pydantic import BaseModel
from schemas.inspection_schemas.inspection_checklist_item_schemas import AddInspectionChecklistItemRequest


class InspectionChecklistResponse(BaseModel):
    id: int
    hospital_id: str
    inspection_type_id: int
    device_type_id: int
    device_model_id: int | None = None
    name: str
    version: int
    is_active: bool
    created_at: datetime
    updated_at: datetime


class AddInspectionChecklistRequest(BaseModel):
    inspection_type_id: int
    device_type_id: int
    device_model_id: int | None = None
    name: str
    version: int | None = None


class UpdateInspectionChecklistRequest(BaseModel):
    id: int
    inspection_type_id: int | None = None
    device_type_id: int | None = None
    device_model_id: int | None = None
    name: str | None = None
    version: int | None = None
    is_active: bool | None = None


class DeleteInspectionChecklistsRequest(BaseModel):
    ids: list[int]


