from pydantic import BaseModel


class InspectionResultResponse(BaseModel):
    id: int
    inspection_id: int
    checklist_item_id: int
    value: str | None = None


class AddInspectionResultRequest(BaseModel):
    inspection_id: int
    checklist_item_id: int
    value: str | None = None


class UpdateInspectionResultRequest(BaseModel):
    id: int
    value: str | None = None


class DeleteInspectionResultsRequest(BaseModel):
    ids: list[int]