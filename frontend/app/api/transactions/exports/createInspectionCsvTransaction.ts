import { API_BASE_URL } from "../../client/apiClient"

export async function createInspectionCsvTransaction(
    inspectionIds: number[]
) {

    console.log(
        "createInspectionCsvTransaction"
    )

    const response = await fetch(
        `${API_BASE_URL}/create-inspection-csv`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify(
                inspectionIds
            ),
        }
    )

    if (!response.ok) {
        const errorText =
            await response.text()

        console.error(
            "createInspectionCsvTransaction error:",
            response.status,
            errorText
        )

        throw new Error(
            `CSV creation failed: ${response.status}`
        )
    }

    const blob = await response.blob()

    console.log(
        "Backendから受信:",
        blob
    )

    return blob
}