import { API_BASE_URL } from "../../client/apiClient"
import {  } from "../../client/apiClient"

export async function finishMaintenance(
    id: number
) {

    await fetch(
        `${API_BASE_URL}/finish-maintenance`,
        {
            method: "POST",
            headers: {
            
                "Content-Type":
                "application/json"
            
            },
            credentials: "include",
            body: JSON.stringify({
                id
            })
        }
    )
}