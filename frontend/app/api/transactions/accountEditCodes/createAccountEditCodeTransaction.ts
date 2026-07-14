import { createAccountEditCode } from "../../accountEditCodes/createAccountEditCode"

export const createAccountEditCodeTransaction = async () => {
  console.log("createAccountEditCodeTransaction")

  return await createAccountEditCode()
}