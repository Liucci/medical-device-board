from pydantic import BaseModel


class InspectionItemCategoryResponse(BaseModel):
    id: int
    hospital_id: str
    name: str
    display_order: int
    is_active: bool



class InspectionItemCategorySaveItem(BaseModel):
    id: int | None
    name: str
    display_order: int
    is_active: bool


class SaveInspectionItemCategoriesRequest(BaseModel):
    categories: list[InspectionItemCategorySaveItem]