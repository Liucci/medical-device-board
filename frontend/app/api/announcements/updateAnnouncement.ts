import { API_BASE_URL,  } from "../client/apiClient"

import { UpdateAnnouncementBackType } from "../../types/announcementTypes"


export const updateAnnouncement = async (
                                            request: UpdateAnnouncementBackType
                                        ) => {
    console.log("updateAnnouncement")

    const response =
        await fetch(
                            `${API_BASE_URL}/update-announcement`,
                            {
                                method: "POST",
                                headers: {
                                            "Content-Type":
                                            "application/json"
                                         },
                                credentials: "include",
                                body: JSON.stringify(request)
                            }
                        )

    return await response.json()
}