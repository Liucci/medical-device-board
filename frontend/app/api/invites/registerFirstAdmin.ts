import { API_BASE_URL } from "../../client/apiClient"
import { RegisterUserRequestDB } from "../../types/registerTypes"

export const registerFirstAdmin = async (
                                          registerUserRequest: RegisterUserRequestDB
                                        ) => {
//登録前なのでtoken存在しない
  const response =
    await fetch(
                  `${API_BASE_URL}/register-first-admin`,
                  {
                    method:"POST",
                    headers:{
                              "Content-Type":"application/json"
                            },
                    body: JSON.stringify(registerUserRequest)
                  }
                )

  return await response.json()
}