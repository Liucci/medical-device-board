import { registerFirstAdmin } from "../../invites/registerFirstAdmin"
import { RegisterUserRequest } from "../../../types/registerTypes"
import { normalizeRegisteredUser,toRegisterUserRequest } from "../../../utils/registerMapper"

type RegisterFirstAdminTransactionParams = {
                                             registerUser: RegisterUserRequest
                                             setRegisteredUser: any
                                           }

export async function registerFirstAdminTransaction({
                                                      registerUser,
                                                      setRegisteredUser
                                                    }: RegisterFirstAdminTransactionParams)
{
  console.log("registerFirstAdminTransaction")
//snake caseにしてregisterFirstAdminに渡し、返し値もsnake case
  const registeredUser =
    await registerFirstAdmin(
                              toRegisterUserRequest(registerUser)
                            )

  // registeredUserはsnake caseなのでnormalizeしてsetする                         
  setRegisteredUser(
                      normalizeRegisteredUser(
                                                registeredUser
                                              )
                   )
}