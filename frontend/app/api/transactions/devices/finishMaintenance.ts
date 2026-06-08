import { API_BASE_URL } from "../../client"

export async function finishMaintenance(
    id: number
) {

    const token = localStorage.getItem("access_token")

    if (!token) {
        return
    }

    await fetch(
        `${API_BASE_URL}/finish-maintenance`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
                id
            })
        }
    )
}