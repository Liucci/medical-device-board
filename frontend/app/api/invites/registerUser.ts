import { API_BASE_URL } from "../client/apiClient"

import { RegisterUserRequest } from "../../types/registerTypes"

export const registerUser = async (
                                      registerUserRequest:RegisterUserRequest
                                    ) => {
//登録前なのでtoken存在しない
  const response =
    await fetch(
                  `${API_BASE_URL}/register`,
                  {
                    method:"POST",
                    headers:{
                              "Content-Type":"application/json"
                            },
                    body:JSON.stringify({
                                            code: registerUserRequest.code,
                                            password: registerUserRequest.password,
                                            display_name: registerUserRequest.displayName
                                          })
                  }
                )

  return await response.json()
}