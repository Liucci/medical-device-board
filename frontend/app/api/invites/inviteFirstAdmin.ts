import { API_BASE_URL,authFetch } from "../client/apiClient"
import { InviteFirstAdminRequestDB } from "../../types/inviteTypes"

export const inviteFirstAdmin = async (
                                        invite: InviteFirstAdminRequestDB
                                      ) => {


  const response =
    await fetch(
                  `${API_BASE_URL}/invite-first-admin`,
                  {
                    method:"POST",
                    headers:{
                                    "Content-Type":
                                    "application/json"
                            },
                    credentials: "include",
                    body: JSON.stringify(invite)
                  }
                )

  return await response.json()
}