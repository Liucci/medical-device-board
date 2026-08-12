import { API_BASE_URL,  } from "../client/apiClient"

export const createAccountEditCode = async () => {
  console.log("createAccountEditCode")

  const response =
    await fetch(
                    `${API_BASE_URL}/create-account-edit-code`,
                    {
                      method: "POST",
                      credentials: "include",
                    }
                  )

  return await response.json()
}