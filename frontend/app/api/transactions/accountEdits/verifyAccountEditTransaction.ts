import { verifyAccountEditCode } from "../../accountEdits/verifyAccountEdit"
import { VerifyAccountEditFrontType } from "../../../types/accountEditTypes"

import {
         toVerifyAccountEditCodeRequest,
         normalizeAccountInfo
       } from "../../../utils/accountEditMapper"

export const verifyAccountEditCodeTransaction = async (
                                                         request: VerifyAccountEditFrontType
                                                       ) => {
  console.log("verifyAccountEditCodeTransaction")

  const accountInfo =
    await verifyAccountEditCode(
                                  toVerifyAccountEditCodeRequest(request)
                                )

  return normalizeAccountInfo(accountInfo)
}