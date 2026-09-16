from pydantic import BaseModel


class InspectionChecklistItemResponse(BaseModel):
    id: int
    checklist_id: int
    display_order: int
    item_name: str
    category_id:int
    item_type_id: int
    required: bool
    default_value: str | None = None
    options: list[str] | None = None
    unit: str | None = None


class AddInspectionChecklistItemRequest(BaseModel):
    #新規作成用なのでfrontからはchecklist idは送ってこない
    
    #checklist_id: int | None = None
    display_order: int
    item_name: str
    category_id:int
    item_type_id: int
    required: bool
    default_value: str | None = None
    #options: list[str] | None = None
    unit: str | None = None
    


class UpdateInspectionChecklistItemRequest(BaseModel):
    id: int
    display_order: int
    item_name: str | None = None
    category_id:int | None = None
    item_type_id: int | None = None
    required: bool | None = None
    default_value: str | None = None
    options: list[str] | None = None
    unit: str | None = None


class DeleteInspectionChecklistItemsRequest(BaseModel):
    ids: list[int]


