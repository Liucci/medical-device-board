import type { AddInspectionChecklist } from "../inspectionChecklistTypes"
import type { AddInspectionChecklistItem } from "../inspectionChecklistItemTypes"

export type CreateInspectionChecklistTransactionRequest =
    AddInspectionChecklist &
    AddInspectionChecklistItem