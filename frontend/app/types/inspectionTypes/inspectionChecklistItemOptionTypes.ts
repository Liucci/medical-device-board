// inspectionChecklistItemOptionTypes.ts

// =========================
// Response
// =========================
//fetch用
export type InspectionChecklistItemOptionFrontType = {
    id: number
    checklistItemId: number
    value: string
    displayOrder: number
}

//checklist itemのnest用type定義
export type InspectionChecklistItemOption = {
    value: string
    displayOrder: number
}

export type InspectionChecklistItemOptionBackType = {
    id: number
    checklist_item_id: number
    value: string
    display_order: number
}