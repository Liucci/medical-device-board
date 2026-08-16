import { API_BASE_URL } from "../../client/apiClient"
import type { CreateInspectionType } from "../../../types/inspectionTypes/inspectionTypeTypes"

export async function addInspectionTypeToApi(
    inspectionType: CreateInspectionType
)
{
    console.log("CreateInspectionType")

    const response = await fetch(
        `${API_BASE_URL}/inspection-types`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include",
            body: JSON.stringify(inspectionType),
        }
    )

    return await response.json()
}