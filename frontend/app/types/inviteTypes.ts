// Create専用
export type InviteFirstAdminType = {
                                     hospitalName: string
                                     email: string
                                   }

// Create Request(DB)
export type InviteFirstAdminRequestDB = {
                                          hospital_name: string
                                          email: string
                                        }

// Backend Response型
export type InviteCodeDB = {
                             code: string
                             expires_at: string
                           }

// Frontend標準型
export type InviteCode = {
                           code: string
                           expiresAt: string
                         }