import { API_BASE_URL, authFetch } from "../client/apiClient"

export const createAccountEditCode = async () => {
  console.log("createAccountEditCode")

  const response =
    await authFetch(
                    `${API_BASE_URL}/create-account-edit-code`,
                    {
                      method: "POST"
                    }
                  )

  return await response.json()
}