import { API_BASE_URL } from "../../client"
import { authFetch } from "../../client"

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