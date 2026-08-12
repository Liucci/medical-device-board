import { API_BASE_URL, authFetch } from "../client/apiClient"
import { WardLastUpdatedResponse } from "@/app/types/deviceTypes"
import { normalizeWardLastUpdated } from "../../utils/deviceMapper"

export async function fetchWardLastUpdated(): Promise<WardLastUpdatedResponse> {

    console.log("fetchWardLastUpdated")

    const response = await fetch(
                            `${API_BASE_URL}/ward-last-updated`,
                            {
                                method: "GET",
                                headers: {
                                        "Content-Type":
                                        "application/json"
                                },
                                  credentials: "include",
                            }
                        )

    const data = await response.json()
    console.log(data)
    return normalizeWardLastUpdated(data.updated_at)
}