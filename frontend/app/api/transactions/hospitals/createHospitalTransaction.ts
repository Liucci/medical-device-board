import { API_BASE_URL } from "../../client/apiClient"
import { CreateHospitalType } from "../../../types/hospitalTypes"
import { Dispatch, SetStateAction } from "react"
import { HospitalManagementType } from "../../../types/hospitalTypes"

import { getHospitalManagementFromApi } from "../../hospitals/fetchHospitalManagement"
import {
  normalizeHospitalManagement,
  toAddHospitalRequest
} from "../../../utils/hospitalMapper"
import { authFetch } from "../../client/apiClient"

type CreateHospitalTransactionParams = {
                                        hospital: CreateHospitalType
                                        setHospitals: Dispatch<SetStateAction<HospitalManagementType[]>>
                                        onClose?: () => void
                                        }

export async function createHospitalTransaction({
                                                hospital,
                                                setHospitals,
                                                onClose
                                                }: CreateHospitalTransactionParams) 
{

  console.log("createHospitalTransaction")

  await authFetch(
                    `${API_BASE_URL}/create-hospital`,
                    {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(
                        toAddHospitalRequest(hospital)
                    )
                    }
  )

  const hospitals = await getHospitalManagementFromApi()
  setHospitals( hospitals.map(normalizeHospitalManagement))
  if (onClose) {onClose()}
}