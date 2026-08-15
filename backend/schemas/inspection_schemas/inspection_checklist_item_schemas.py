from pydantic import BaseModel


class InspectionChecklistItemResponse(BaseModel):
    id: int
    checklist_id: int
    display_order: int
    item_name: str
    item_type_id: int
    required: bool
    default_value: str | None = None
    options: list[str] | None = None
    unit: str | None = None


class AddInspectionChecklistItemRequest(BaseModel):
    checklist_id: int
    item_name: str
    item_type_id: int
    required: bool
    default_value: str | None = None
    options: list[str] | None = None
    unit: str | None = None


class UpdateInspectionChecklistItemRequest(BaseModel):
    id: int
    item_name: str | None = None
    item_type_id: int | None = None
    required: bool | None = None
    default_value: str | None = None
    options: list[str] | None = None
    unit: str | None = None


class DeleteInspectionChecklistItemsRequest(BaseModel):
    ids: list[int]


class UpdateInspectionChecklistItemOrderRequest(BaseModel):
    id: int
    display_order: int


class UpdateInspectionChecklistItemOrdersRequest(BaseModel):
    items: list[UpdateInspectionChecklistItemOrderRequest]