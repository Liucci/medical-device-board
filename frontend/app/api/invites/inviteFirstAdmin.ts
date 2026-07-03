import { API_BASE_URL,authFetch } from "../../client/apiClient"
import { InviteFirstAdminRequestDB } from "../../types/inviteTypes"

export const inviteFirstAdmin = async (
                                        invite: InviteFirstAdminRequestDB
                                      ) => {


  const response =
    await authFetch(
                  `${API_BASE_URL}/invite-first-admin`,
                  {
                    method:"POST",
                    headers:{
                                    "Content-Type":
                                    "application/json"
                            },
                    body: JSON.stringify(invite)
                  }
                )

  return await response.json()
}