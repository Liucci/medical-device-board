<<<<<<< HEAD
import { API_BASE_URL } from "../../client/apiClient"
=======
import { API_BASE_URL } from "../../../client/apiClient"
>>>>>>> d488112f89233e7453e5aaae1fea0d82b3528897
import { UpdateInfectionTypeType } from "../../../types/infectionTypeTypes"
import { getInfectionTypesFromApi } from "../../infectionTypes/fetchInfectionTypes"
import {
         normalizeInfectionType,
         toUpdateInfectionTypeRequest
       } from "../../../utils/infectionTypeMapper"
<<<<<<< HEAD
import { authFetch } from "../../client/apiClient"
=======
import { authFetch } from "../../../client/apiClient"
>>>>>>> d488112f89233e7453e5aaae1fea0d82b3528897

type UpdateInfectionTypeTransactionParams = {
                                               infectionType: UpdateInfectionTypeType
                                               setInfectionTypes: any
                                            }

export async function updateInfectionTypeTransaction({
                                                       infectionType,
                                                       setInfectionTypes
                                                     }: UpdateInfectionTypeTransactionParams
                                                   )
{
  console.log("updateInfectionTypeTransaction")

  await authFetch(
                    `${API_BASE_URL}/update-infection-type`,
                    {
                      method: "POST",
                      headers: {
                                  "Content-Type":
                                  "application/json"
                                },
                      body: JSON.stringify(
                                              toUpdateInfectionTypeRequest(
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
}