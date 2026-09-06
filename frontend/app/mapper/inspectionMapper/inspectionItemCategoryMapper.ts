import type {
    InspectionItemCategoryDBType,
    InspectionItemCategoryType,
    CreateInspectionItemCategoryBackType,
    CreateInspectionItemCategoryFrontType,
    UpdateInspectionItemCategoryBackType,
    UpdateInspectionItemCategoryFrontType,
} from "../../types/inspectionTypes/inspectionItemCategoryTypes"


export const normalizeInspectionItemCategory = (
    data: InspectionItemCategoryDBType
): InspectionItemCategoryType => ({
    id: data.id,
    hospitalId: data.hospital_id,
    name: data.name,
    displayOrder: data.display_order,
    isActive: data.is_active,
})


export const toCreateInspectionItemCategoryRequest = (
    data: CreateInspectionItemCategoryFrontType
): CreateInspectionItemCategoryBackType => ({
    name: data.name,
})


export const toUpdateInspectionItemCategoryRequest = (
    data: UpdateInspectionItemCategoryFrontType
): UpdateInspectionItemCategoryBackType => ({
    id: data.id,
    name: data.name,
    display_order: data.displayOrder,
    is_active: data.isActive,
})