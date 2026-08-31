import { API_BASE_URL } from "../../client/apiClient"


export async function getInspectionItemCategoriesFromApi()
{
    console.log("fetchInspectionItemCategories")

    const response = await fetch(
        `${API_BASE_URL}/inspection-item-categories`,
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