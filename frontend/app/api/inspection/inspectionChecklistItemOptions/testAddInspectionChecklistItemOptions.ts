import { API_BASE_URL } from "../../client/apiClient"

export async function testAddInspectionChecklistItemOptions() {
    console.log("testAddInspectionChecklistItemOptions")

    await fetch(
        `${API_BASE_URL}/test-add-inspection-checklist-item-options`,
        {
            method: "POST",
            credentials: "include",
        }
    )
}