import { API_BASE_URL } from "../../client/apiClient"
import type { TodayInspectionBackType } from "../../../types/inspectionTypes/inspectionTypes"
export const getTodayInspectionsFromApi = async (): Promise<TodayInspectionBackType[]> => {
    console.log("fetchTodayInspections")

    const response = await fetch(
        `${API_BASE_URL}/inspections/today`,
        {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include",
        }
    )

    return await response.json()
}