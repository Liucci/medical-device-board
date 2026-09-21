from pydantic import BaseModel


class InspectionChecklistItemOptionResponse(BaseModel):
    id: int
    checklist_item_id: int
    value: str
    display_order: int


class DeleteItemOptionsRequest(BaseModel):
    ids: list[int]

    