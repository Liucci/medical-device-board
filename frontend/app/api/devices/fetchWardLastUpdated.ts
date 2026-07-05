<<<<<<< HEAD
import { API_BASE_URL, authFetch } from "../client/apiClient"
=======
import { API_BASE_URL, authFetch } from "../../client/apiClient"
>>>>>>> d488112f89233e7453e5aaae1fea0d82b3528897
import { WardLastUpdatedResponse } from "@/app/types/deviceTypes"
import { normalizeWardLastUpdated } from "../../utils/deviceMapper"

export async function fetchWardLastUpdated(): Promise<WardLastUpdatedResponse> {

    console.log("fetchWardLastUpdated")

    const response = await authFetch(
                            `${API_BASE_URL}/ward-last-updated`,
                            {
                                method: "GET",
                                headers: {
                                        "Content-Type":
                                        "application/json"
                                }
                            }
                        )

    const data = await response.json()
    console.log(data)
    return normalizeWardLastUpdated(data.updated_at)
}