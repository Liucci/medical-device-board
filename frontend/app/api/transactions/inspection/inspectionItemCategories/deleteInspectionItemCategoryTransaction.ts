import { API_BASE_URL } from "../../../client/apiClient"
import {
    DeleteInspectionItemCategoryFrontType,
    DeleteInspectionItemCategoryBackType,
    InspectionItemCategoryDBType,
} from "../../../../types/inspectionTypes/inspectionItemCategoryTypes"
import { toDeleteInspectionItemCategoryRequest } from "../../../../mapper/inspectionMapper/inspectionItemCategoryMapper"
import { normalizeInspectionItemCategory } from "../../../../mapper/inspectionMapper/inspectionItemCategoryMapper"


export async function deleteInspectionItemCategoryTransaction(
    data: DeleteInspectionItemCategoryFrontType
): Promise<InspectionItemCategoryDBType[]> {

    console.log("deleteInspectionItemCategoryTransaction")

    const request: DeleteInspectionItemCategoryBackType =
        toDeleteInspectionItemCategoryRequest(data)

    const response = await fetch(
        `${API_BASE_URL}/delete-inspection-item-category?category_id=${request.category_id}`,
        {
            method: "DELETE",
            credentials: "include",
        }
    )

    if (!response.ok) {
        throw new Error(
            `Failed to delete inspection item category: ${response.status}`
        )
    }

    const responseData = await response.json()

    return responseData.map(normalizeInspectionItemCategory)
}