import { API_BASE_URL } from "../../../client/apiClient"
import { CreateInspectionItemCategoryFrontType } from "../../../../types/inspectionTypes/inspectionItemCategoryTypes"
import { getInspectionItemCategoriesFromApi } from "../../../inspection/inspectionItemCategoies/fetchInspectionItemCategories"
import {
    normalizeInspectionItemCategory,
    toCreateInspectionItemCategoryRequest
} from "../../../../utils/inspectionMapper/inspectionItemCategoryMapper"


type CreateInspectionItemCategoryTransactionParams = {
    inspectionItemCategory: CreateInspectionItemCategoryFrontType
    setInspectionItemCategories: any
    onClose?: () => void
}


export async function createInspectionItemCategoryTransaction({
    inspectionItemCategory,
    setInspectionItemCategories,
    onClose
}: CreateInspectionItemCategoryTransactionParams)
{
    console.log("createInspectionItemCategoryTransaction")

    await fetch(
        `${API_BASE_URL}/create-inspection-item-categories`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include",
            body: JSON.stringify(
                toCreateInspectionItemCategoryRequest(
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

    if (onClose) {
        onClose()
    }
}