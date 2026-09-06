import {
          RegisteredUser,
          RegisteredUserDB,
          RegisterUserRequest,
         RegisterUserRequestDB
       } from "../types/registerTypes"

export const normalizeRegisteredUser = (
                                          user: RegisteredUserDB
                                        ): RegisteredUser => ({
                                                                  displayName: user.display_name,
                                                                  email: user.email,
                                                                  role: user.role,
                                                                  hospitalName: user.hospital_name
                                                                })



export const toRegisterUserRequest = (
                                        register: RegisterUserRequest
                                      ): RegisterUserRequestDB => ({
                                                                      code: register.code,
                                                                      password: register.password,
                                                                      display_name: register.displayName
                                                                    })

