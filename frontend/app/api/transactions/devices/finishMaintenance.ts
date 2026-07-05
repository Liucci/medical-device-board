import { API_BASE_URL } from "../../client/apiClient"
import { authFetch } from "../../client/apiClient"

export async function finishMaintenance(
    id: number
) {

    await authFetch(
        `${API_BASE_URL}/finish-maintenance`,
        {
            method: "POST",
            headers: {
            
                "Content-Type":
                "application/json"
            
            },
            body: JSON.stringify({
                id
            })
        }
    )
}