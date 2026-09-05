from datetime import datetime
from pydantic import BaseModel
from schemas.inspection_schemas.inspection_result_schemas import AddInspectionResultRequest


class InspectionResponse(BaseModel):
    id: int
    hospital_id: str
    device_id: int
    room_id: int | None = None
    inspection_type_id: int
    checklist_id: int
    performed_by: str | None = None
    overall_result: str | None = None
    comment: str | None = None
    created_at: datetime


#performed_byはfrontから受け取らない
#sessionよりuser情報は取得する
class AddInspectionRequest(BaseModel):
    device_id: int
    room_id: int | None = None
    inspection_type_id: int
    checklist_id: int
    overall_result: str | None = None
    comment: str | None = None


class UpdateInspectionRequest(BaseModel):
    id: int
    room_id: int | None = None
    inspection_type_id: int | None = None
    checklist_id: int | None = None
    overall_result: str | None = None
    comment: str | None = None


class DeleteInspectionsRequest(BaseModel):
    ids: list[int]

