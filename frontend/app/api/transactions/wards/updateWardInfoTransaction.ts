import { API_BASE_URL } from "../../client/apiClient"
import {  } from "../../client/apiClient"
import { UpdateWardInfoType } from "../../../types/wardTypes"
import { getWardsFromApi } from "../../wards/fetchWards"
import { getWardInfectionsFromApi } from "../../wardInfections/fetchWardInfections"
import {normalizeWard, toUpdateWardInfoRequest,} from "../../../utils/wardsMapper"
import {normalizeWardInfection,} from "../../../utils/wardInfectionMapper"

type UpdateWardInfoTransactionParams = {
                                        ward: UpdateWardInfoType
                                        infectionTypeIds: number[]
                                        setWards: any
                                        setWardInfections: any
                                      }


//ward info modal専用transaction
//status,note,ward infectionsをまとめて更新
export async function updateWardInfoTransaction({
                                                ward,
                                                infectionTypeIds,
                                                setWards,
                                                setWardInfections,
                                              }: UpdateWardInfoTransactionParams) 
{
  console.log("updateWardInfoTransaction")
  await fetch(
                `${API_BASE_URL}/update-ward-info`,
                            {
                              method: "POST",
                              headers: {"Content-Type": "application/json",},
                              credentials: "include",
                              body: JSON.stringify({
                                                    ...toUpdateWardInfoRequest(ward),
                                                    infection_type_ids: infectionTypeIds,
                                                  }),
                            }
  )
  const wards = await getWardsFromApi()
  setWards(wards.map(normalizeWard))
  const wardInfections =await getWardInfectionsFromApi()
  setWardInfections(wardInfections.map(normalizeWardInfection))

}