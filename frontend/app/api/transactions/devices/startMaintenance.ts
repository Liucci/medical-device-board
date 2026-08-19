import { API_BASE_URL } from "../../client/apiClient"
import {  } from "../../client/apiClient"

export async function startMaintenance(
    id: number
) {

    await fetch(
        `${API_BASE_URL}/start-maintenance`,
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