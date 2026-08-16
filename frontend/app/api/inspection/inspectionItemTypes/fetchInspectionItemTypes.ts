import { API_BASE_URL } from "../../client/apiClient"

export async function getInspectionItemTypesFromApi()
{
    console.log("fetchInspectionItemTypes")

    const response = await fetch(
        `${API_BASE_URL}/inspection-item-types`,
        {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include",
        }
    )

    return await response.json()
}