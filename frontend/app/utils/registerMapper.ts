import {
          RegisteredUser,
          RegisteredUserDB
       } from "../types/registerTypes"

export const normalizeRegisteredUser = (
                                          user: RegisteredUserDB
                                        ): RegisteredUser => ({
                                                                  displayName: user.display_name,
                                                                  email: user.email,
                                                                  role: user.role,
                                                                  hospitalName: user.hospital_name
                                                                })