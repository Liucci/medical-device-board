import { API_BASE_URL } from "../../../client/apiClient"
import { UpdateInspectionItemCategoryFrontType } from "../../../../types/inspectionTypes/inspectionItemCategoryTypes"
import { getInspectionItemCategoriesFromApi } from "../../../inspection/inspectionItemCategoies/fetchInspectionItemCategories"
import {
    normalizeInspectionItemCategory,
    toUpdateInspectionItemCategoryRequest
} from "../../../../utils/inspectionMapper/inspectionItemCategoryMapper"


type UpdateInspectionItemCategoryTransactionParams = {
    inspectionItemCategory: UpdateInspectionItemCategoryFrontType
    setInspectionItemCategories: any
}


export async function updateInspectionItemCategoryTransaction({
    inspectionItemCategory,
    setInspectionItemCategories
}: UpdateInspectionItemCategoryTransactionParams)
{
    console.log("updateInspectionItemCategoryTransaction")

    await fetch(
        `${API_BASE_URL}/update-inspection-item-category`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include",
            body: JSON.stringify(
                toUpdateInspectionItemCategoryRequest(
                    inspectionItemCategory
                )
            )
        }
    )

    const inspectionItemCategories =
        await getInspectionItemCategoriesFromApi()

    setInspectionItemCategories(
        inspectionItemCategories.map(
            normalizeInspectionItemCategory
        )
    )
}