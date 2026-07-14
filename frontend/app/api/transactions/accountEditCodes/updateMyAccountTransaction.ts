import { updateMyAccount } from "../../accountEditCodes/updateMyAccount"
import { UpdateMyAccountFrontType } from "../../../types/accountEditCodeTypes"
import { toUpdateMyAccountRequest } from "../../../utils/accountEditCodeMapper"

export const updateMyAccountTransaction = async (
                                                   request: UpdateMyAccountFrontType
                                                 ) => {
  console.log("updateMyAccountTransaction")

  return await updateMyAccount(
                                toUpdateMyAccountRequest(request)
                              )
}