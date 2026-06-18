import { API_BASE_URL } from "../client"
import { InviteFirstAdminRequestDB } from "../../types/inviteTypes"

export const inviteFirstAdmin = async (
                                        invite: InviteFirstAdminRequestDB
                                      ) => {

  const token = localStorage.getItem("access_token")

  const response =
    await fetch(
                  `${API_BASE_URL}/invite-first-admin`,
                  {
                    method:"POST",
                    headers:{
                              "Content-Type":"application/json",
                              "Authorization":`Bearer ${token}`
                            },
                    body: JSON.stringify(invite)
                  }
                )

  return await response.json()
}