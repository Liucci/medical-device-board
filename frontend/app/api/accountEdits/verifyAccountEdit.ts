import { API_BASE_URL } from "../client/apiClient"

import { VerifyAccountEditCodeBackType } from "../../types/accountEditTypes"

export const verifyAccountEditCode = async (
                                              request: VerifyAccountEditCodeBackType
                                            ) => {
  console.log("verifyAccountEditCode")

  const response =
    await fetch(
                  `${API_BASE_URL}/verify-account-edit-code`,
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