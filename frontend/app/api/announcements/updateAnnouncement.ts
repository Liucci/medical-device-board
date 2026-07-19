import { API_BASE_URL, authFetch } from "../client/apiClient"

import { UpdateAnnouncementBackType } from "../../types/announcementType"


export const updateAnnouncement = async (
                                            request: UpdateAnnouncementBackType
                                        ) => {
    console.log("updateAnnouncement")

    const response =
        await authFetch(
                            `${API_BASE_URL}/update-announcement`,
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