export type InspectionItemCategoryDBType = {
    id: number
    hospital_id: string
    name: string
    display_order: number
    is_active: boolean
}


export type InspectionItemCategoryType = {
    id: number
    hospitalId: string
    name: string
    displayOrder: number
    isActive: boolean
}


// UIで編集するカテゴリー
// 新規追加の場合はid = null
export type InspectionItemCategoryEditType = {
    id: number | null
    name: string
    displayOrder: number
    isActive: boolean
}


// 一括保存用
export type SaveInspectionItemCategoriesFrontType = {
    categories: InspectionItemCategoryEditType[]
}


export type SaveInspectionItemCategoriesBackType = {
    categories: InspectionItemCategorySaveBackType[]
}


export type InspectionItemCategorySaveBackType = {
    id: number | null
    name: string
    display_order: number
    is_active: boolean
}

