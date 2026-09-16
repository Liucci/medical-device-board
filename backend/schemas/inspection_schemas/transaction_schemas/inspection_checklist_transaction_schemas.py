from pydantic import BaseModel
from typing import TypedDict
#複数のtableにまたぐschema
#schemaの中にschemaを内包した形を定義
#optionの型定義
class ChecklistItemOptionSchema(TypedDict):
    value: str
    display_order: int

#checklist+item+optionの型定義
class ChecklistItemSchema(TypedDict):
    display_order: int
    item_name: str
    category_id: int
    item_type_id: int
    required: bool
    default_value: str | None
    options: list[ChecklistItemOptionSchema] | None
    unit: str | None

#checklist_item+optionの型定義
class CreateInspectionChecklistTransactionRequest(BaseModel):
    inspection_type_id: int
    device_type_id: int
    device_model_id: int | None
    name: str
    version: int

    items: list[ChecklistItemSchema]
