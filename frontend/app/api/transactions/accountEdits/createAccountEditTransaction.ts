import { createAccountEditCode } from "../../accountEdits/createAccountEdit"

export const createAccountEditCodeTransaction = async () => {
  console.log("createAccountEditCodeTransaction")

  return await createAccountEditCode()
}