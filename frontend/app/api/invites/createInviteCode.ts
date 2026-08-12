import { API_BASE_URL, authFetch} from "../client/apiClient"

export const createInviteCode = async (
                                        email: string,
                                        role: string
                                      ) => {

  const response =
    await fetch(
                `${API_BASE_URL}/create-invite-code`,
                {
                  method: "POST",
                  headers: {
                                    "Content-Type":
                                    "application/json"
                            },
                  credentials: "include",
                  body: JSON.stringify({
                                          email,
                                          role
                                        })
                }
              )

  return await response.json()
}