import { API_BASE_URL } from "../../client/apiClient"
import { UpdateHospitalType } from "../../../types/hospitalTypes"
import { getHospitalManagementFromApi } from "../../hospitals/fetchHospitalManagement"
import {
  normalizeHospitalManagement,
  toUpdateHospitalRequest
} from "../../../utils/hospitalMapper"
import { authFetch } from "../../client/apiClient"

type UpdateHospitalTransactionParams = {
                                        hospital: UpdateHospitalType
                                        setHospitals: any
                                        onClose?: () => void
}

export async function updateHospitalTransaction({
                                            hospital,
                                            setHospitals,
                                            onClose
                                            }: UpdateHospitalTransactionParams) 
{
  console.log("updateHospitalTransaction")
  await authFetch(
            `${API_BASE_URL}/update-hospital`,
                {
                method: "POST",
                headers: { "Content-Type": "application/json"},
                body: JSON.stringify(toUpdateHospitalRequest(hospital))
                }
  )
  const hospitals = await getHospitalManagementFromApi()
  setHospitals(hospitals.map(normalizeHospitalManagement))
  if (onClose) {onClose()}
}