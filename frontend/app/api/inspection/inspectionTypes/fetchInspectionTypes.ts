import { API_BASE_URL } from "../../client/apiClient"

export async function getInspectionTypes()
{
    console.log("fetchInspectionTypes")

    const response = await fetch(
        `${API_BASE_URL}/inspection-types`,
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