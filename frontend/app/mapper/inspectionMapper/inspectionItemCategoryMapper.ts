import type {
    InspectionItemCategoryDBType,
    InspectionItemCategoryType,
    InspectionItemCategoryEditType,
    SaveInspectionItemCategoriesFrontType,
    SaveInspectionItemCategoriesBackType,
} from "../../types/inspectionTypes/inspectionItemCategoryTypes"


// DB → Front
export const normalizeInspectionItemCategory = (
    data: InspectionItemCategoryDBType
): InspectionItemCategoryType => ({
    id: data.id,
    hospitalId: data.hospital_id,
    name: data.name,
    displayOrder: data.display_order,
    isActive: data.is_active,
})


// Front → Backend
export const toSaveInspectionItemCategoriesRequest = (
    data: SaveInspectionItemCategoriesFrontType
): SaveInspectionItemCategoriesBackType => ({
    categories: data.categories.map(
        (category: InspectionItemCategoryEditType) => ({
            id: category.id,
            name: category.name,
            display_order: category.displayOrder,
            is_active: category.isActive,
        })
    ),
})