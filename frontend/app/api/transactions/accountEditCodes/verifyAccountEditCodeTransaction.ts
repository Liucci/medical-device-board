import { verifyAccountEditCode } from "../../accountEditCodes/verifyAccountEditCode"
import { VerifyAccountEditCodeFrontType } from "../../../types/accountEditCodeTypes"
import { toVerifyAccountEditCodeRequest } from "../../../utils/accountEditCodeMapper"
export const verifyAccountEditCodeTransaction = async (
                                                         request: VerifyAccountEditCodeFrontType
                                                       ) => {
  console.log("verifyAccountEditCodeTransaction")

  return await verifyAccountEditCode(
                                      toVerifyAccountEditCodeRequest(request)
                                    )
}