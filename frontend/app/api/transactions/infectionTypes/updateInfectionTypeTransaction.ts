import { API_BASE_URL } from "../../client"
import { UpdateInfectionTypeType } from "../../../types/infectionTypeTypes"
import { getInfectionTypesFromApi } from "../../infectionTypes/fetchInfectionTypes"
import {
         normalizeInfectionType,
         toUpdateInfectionTypeRequest
       } from "../../../utils/infectionTypeMapper"
import { authFetch } from "../../client"

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