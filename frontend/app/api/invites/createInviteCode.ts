import { API_BASE_URL} from "../client"

export const createInviteCode = async (
                                        email: string,
                                        role: string
                                      ) => {

  const token =
    localStorage.getItem("access_token")
  const response =
    await fetch(
                `${API_BASE_URL}/create-invite-code`,
                {
                  method: "POST",
                  headers: {
                              "Content-Type":"application/json",
                              "Authorization":`Bearer ${token}`
                            },
                  body: JSON.stringify({
                                          email,
                                          role
                                        })
                }
              )

  return await response.json()
}