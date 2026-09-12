import { API_BASE_URL } from "../../client/apiClient"

export async function createInspectionPdfTransaction(
    inspectionIds: number[]
) {

    console.log(
        "createInspectionPdfTransaction"
    )

    const response = await fetch(
        `${API_BASE_URL}/create-inspection-pdf`,
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
            "createInspectionPdfTransaction error:",
            response.status,
            errorText
        )

        throw new Error(
            `PDF creation failed: ${response.status}`
        )
    }

    const blob = await response.blob()
    console.log("Backendから受信:",blob)

    return blob
}