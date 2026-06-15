import { createInviteCode } from "../../../api/invites/createInviteCode"

export const createInviteCodeTransaction = async (
                                                    email: string,
                                                    role: string
                                                  ) => {

  return await createInviteCode(
                                  email,
                                  role
                                )
}