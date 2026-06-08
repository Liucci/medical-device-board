import { API_BASE_URL } from "../../client"

type Params = {
    id: number
    managementNumber: string
}

export async function updateManagementNumber({
    id,
    managementNumber
}: Params) {

    const token = localStorage.getItem("access_token")

    if (!token) {
        return
    }

    await fetch(
        `${API_BASE_URL}/update-management-number`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
                id,
                management_number: managementNumber
            })
        }
    )
}