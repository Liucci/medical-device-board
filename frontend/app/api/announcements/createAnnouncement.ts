import { API_BASE_URL, authFetch } from "../client/apiClient"

import { CreateAnnouncementBackType } from "../../types/announcementType"


export const createAnnouncement = async (
                                            request: CreateAnnouncementBackType
                                        ) => {
    console.log("createAnnouncement")

    const response =
        await authFetch(
                            `${API_BASE_URL}/create-announcement`,
                            {
                                method: "POST",
                                headers: {
                                            "Content-Type":
                                            "application/json"
                                         },
                                body: JSON.stringify(request)
                            }
                        )

    return await response.json()
}