import { registerUser } from "../../invites/registerUser"

import { normalizeRegisteredUser } from "../../../mapper/registerMapper"

import {
          RegisterUserRequest
       } from "../../../types/registerTypes"

type RegisterUserTransactionParams = {
                                        registerUserRequest:RegisterUserRequest
                                        setRegisteredUser:any
                                      }

export const registerUserTransaction = async ({
                                                 registerUserRequest,
                                                 setRegisteredUser
                                               }: RegisterUserTransactionParams) => {

  const registeredUserDB =await registerUser(registerUserRequest)

  const registeredUser =normalizeRegisteredUser(registeredUserDB)

  setRegisteredUser(registeredUser)

  return registeredUser
}