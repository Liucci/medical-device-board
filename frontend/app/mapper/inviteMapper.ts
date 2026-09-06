import {
         InviteFirstAdminType,
         InviteFirstAdminRequestDB,
         InviteCode,
         InviteCodeDB
       } from "../types/inviteTypes"

// Create
export const toInviteFirstAdminRequest = (
                                            invite: InviteFirstAdminType
                                          ): InviteFirstAdminRequestDB => ({
                                                                              hospital_name: invite.hospitalName,
                                                                              email: invite.email
                                                                            })

// DB → UI
export const normalizeInviteCode = (
                                      inviteCode: InviteCodeDB
                                    ): InviteCode => ({
                                                          code: inviteCode.code,
                                                          expiresAt: inviteCode.expires_at
                                                        })