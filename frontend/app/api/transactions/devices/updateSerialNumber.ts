import { API_BASE_URL } from "../../client"

type Params = {
    id: number
    serialNumber: string
}

export async function updateSerialNumber({
    id,
    serialNumber
}: Params) {

    const token = localStorage.getItem("access_token")

    if (!token) {
        return
    }

    await fetch(
        `${API_BASE_URL}/update-serial-number`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
                id,
                serial_number: serialNumber
            })
        }
    )
}