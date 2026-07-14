import { API_BASE_URL } from "../client/apiClient"

import { UpdateMyAccountBackType } from "../../types/accountEditCodeTypes"

export const updateMyAccount = async (
                                        request: UpdateMyAccountBackType
                                      ) => {
  console.log("updateMyAccount")

  const response =
    await fetch(
                  `${API_BASE_URL}/update-my-account`,
                  {
                    method: "POST",
                    headers: {
                                "Content-Type": "application/json"
                             },
                    body: JSON.stringify(request)
                  }
                )

  return await response.json()
}