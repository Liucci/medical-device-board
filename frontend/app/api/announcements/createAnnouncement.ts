import { API_BASE_URL,  } from "../client/apiClient"

import { CreateAnnouncementBackType } from "../../types/announcementTypes"


export const createAnnouncement = async (
                                            request: CreateAnnouncementBackType
                                        ) => {
    console.log("createAnnouncement")

    const response =
        await fetch(
                            `${API_BASE_URL}/create-announcement`,
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