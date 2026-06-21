import { API_BASE_URL } from "../../client"
import { authFetch } from "../../client"

export async function startMaintenance(
    id: number
) {

    await authFetch(
        `${API_BASE_URL}/start-maintenance`,
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