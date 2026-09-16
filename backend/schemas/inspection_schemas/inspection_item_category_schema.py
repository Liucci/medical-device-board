from pydantic import BaseModel


class InspectionItemCategoryResponse(BaseModel):
    id: int
    hospital_id: str
    name: str
    display_order: int
    is_active: bool


class AddInspectionItemCategoryRequest(BaseModel):
    name: str


class UpdateInspectionItemCategoryRequest(BaseModel):
    id: int
    name: str
    display_order: int
    is_active: bool