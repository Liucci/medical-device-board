import { API_BASE_URL } from "../../../client/apiClient"
import type {
    SaveInspectionItemCategoriesBackType,
} from "../../../../types/inspectionTypes/inspectionItemCategoryTypes"


export async function saveInspectionItemCategories(
    data: SaveInspectionItemCategoriesBackType
) {
    console.log("saveInspectionItemCategories")

    const response = await fetch(
        `${API_BASE_URL}/save-inspection-item-categories`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify(data),
        }
    )

    if (!response.ok) {
        throw new Error("Failed to save inspection item categories")
    }

    return await response.json()
}