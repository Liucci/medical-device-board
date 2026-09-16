import { updateMyAccount } from "../../accountEdits/updateMyAccount"
import { UpdateMyAccountFrontType } from "../../../types/accountEditTypes"
import { toUpdateMyAccountRequest } from "../../../mapper/accountEditMapper"

export const updateMyAccountTransaction = async (
                                                   request: UpdateMyAccountFrontType
                                                 ) => {
  console.log("updateMyAccountTransaction")

  return await updateMyAccount(
                                toUpdateMyAccountRequest(request)
                              )
}