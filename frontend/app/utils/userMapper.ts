import {
         CurrentUser,
         CurrentUserDB
       } from "../types/userTypes"

// DB → UI
export const normalizeUser = (
                                user: CurrentUserDB
                              ): CurrentUser => ({
                                                    id: user.id,
                                                    email: user.email,
                                                    hospitalId: user.hospital_id,
                                                    hospitalName: user.hospital_name,
                                                    displayName: user.display_name,
                                                    role: user.role,
                                                    isActive: user.is_active
                                                  })