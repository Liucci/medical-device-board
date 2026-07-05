<<<<<<< HEAD
import { API_BASE_URL } from "../../client/apiClient"
=======
import { API_BASE_URL } from "../../../client/apiClient"
>>>>>>> d488112f89233e7453e5aaae1fea0d82b3528897
import { CreateInfectionTypeType } from "../../../types/infectionTypeTypes"
import { getInfectionTypesFromApi } from "../../infectionTypes/fetchInfectionTypes"
import {
         normalizeInfectionType,
         toCreateInfectionTypeRequest
       } from "../../../utils/infectionTypeMapper"
<<<<<<< HEAD
import { authFetch } from "../../client/apiClient"
=======
import { authFetch } from "../../../client/apiClient"
>>>>>>> d488112f89233e7453e5aaae1fea0d82b3528897

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