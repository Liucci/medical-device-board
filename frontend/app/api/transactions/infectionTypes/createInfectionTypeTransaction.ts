import { API_BASE_URL } from "../../client/apiClient"
import { CreateInfectionTypeType } from "../../../types/infectionTypeTypes"
import { getInfectionTypesFromApi } from "../../infectionTypes/fetchInfectionTypes"
import {
         normalizeInfectionType,
         toCreateInfectionTypeRequest
       } from "../../../utils/infectionTypeMapper"
import {  } from "../../client/apiClient"

type CreateInfectionTypeTransactionParams = {
                                               infectionType: CreateInfectionTypeType
                                               setInfectionTypes: any
                                               onClose?: () => void
                                            }

export async function createInfectionTypeTransaction({
                                                       infectionType,
                                                       setInfectionTypes,
                                                       onClose
                                                     }: CreateInfectionTypeTransactionParams
                                                   )
{
  console.log("createInfectionTypeTransaction")

  await fetch(
                    `${API_BASE_URL}/infection-types`,
                    {
                      method: "POST",
                      headers: {
                                  "Content-Type":
                                  "application/json"
                                },
                      credentials: "include",
                      body: JSON.stringify(
                                              toCreateInfectionTypeRequest(
                                                                            infectionType
                                                                          )
                                            )
                    }
                  )

  const infectionTypes =
    await getInfectionTypesFromApi()

  setInfectionTypes(
                      infectionTypes.map(
                                          normalizeInfectionType
                                        )
                    )

  if (onClose) {onClose()}
}