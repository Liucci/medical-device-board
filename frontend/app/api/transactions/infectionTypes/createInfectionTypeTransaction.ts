import { API_BASE_URL } from "../../client"
import { CreateInfectionTypeType } from "../../../types/infectionTypeTypes"
import { getInfectionTypesFromApi } from "../../infectionTypes/fetchInfectionTypes"
import {
         normalizeInfectionType,
         toCreateInfectionTypeRequest
       } from "../../../utils/infectionTypeMapper"
import { authFetch } from "../../client"

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

  await authFetch(
                    `${API_BASE_URL}/infection-types`,
                    {
                      method: "POST",
                      headers: {
                                  "Content-Type":
                                  "application/json"
                                },
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