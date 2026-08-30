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


//create,updateではfrontでhospital idを持たせる必要なし
//back sessionでhospital id取得する
//delete操作は不要
export type CreateInspectionItemCategoryFrontType = {
    name: string
}

export type CreateInspectionItemCategoryBackType = {
    name: string
}

export type UpdateInspectionItemCategoryFrontType = {
    id: number
    name: string
    displayOrder: number
    isActive: boolean
}

export type UpdateInspectionItemCategoryBackType = {
    id: number
    name: string
    display_order: number
    is_active: boolean
}