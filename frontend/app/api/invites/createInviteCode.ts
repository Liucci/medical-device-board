<<<<<<< HEAD
import { API_BASE_URL, authFetch} from "../client/apiClient"
=======
import { API_BASE_URL, authFetch} from "../../client/apiClient"
>>>>>>> d488112f89233e7453e5aaae1fea0d82b3528897

export const createInviteCode = async (
                                        email: string,
                                        role: string
                                      ) => {

  const response =
    await authFetch(
                `${API_BASE_URL}/create-invite-code`,
                {
                  method: "POST",
                  headers: {
                                    "Content-Type":
                                    "application/json"
                            },
                  body: JSON.stringify({
                                          email,
                                          role
                                        })
                }
              )

  return await response.json()
}