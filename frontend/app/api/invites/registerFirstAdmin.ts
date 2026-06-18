import { API_BASE_URL } from "../client"
import { RegisterUserRequestDB } from "../../types/registerTypes"

export const registerFirstAdmin = async (
                                          registerUserRequest: RegisterUserRequestDB
                                        ) => {

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