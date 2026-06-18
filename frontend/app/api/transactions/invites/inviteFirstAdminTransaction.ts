import { inviteFirstAdmin } from "../../invites/inviteFirstAdmin"
import { InviteFirstAdminType } from "../../../types/inviteTypes"
import { toInviteFirstAdminRequest } from "../../../utils/inviteMapper"

type InviteFirstAdminTransactionParams = {
                                           invite: InviteFirstAdminType
                                         }

export async function inviteFirstAdminTransaction({
                                                    invite
                                                  }: InviteFirstAdminTransactionParams)
{
  console.log("inviteFirstAdminTransaction")
//snake caseにしてinviteFirstAdminに渡す
  return await inviteFirstAdmin(
                                 toInviteFirstAdminRequest(invite)
                               )
}