import { Dispatch, SetStateAction } from "react"

import {
  HospitalSettingsType,
  UpdateHospitalSettingsFrontType
} from "../../../types/hospitalSettingTypes"

import {
  normalizeHospitalSettings,
  toUpdateHospitalSettingsRequest
} from "../../../utils/hospitalSettingMapper"

import { fetchHospitalSettings } from "../../hospitalSettings/fetchHospitalSettings"
import { updateHospitalSettings } from "../../hospitalSettings/updateHospitalSettings"

type UpdateHospitalSettingsTransactionParams = {
                                        hospitalSettings: UpdateHospitalSettingsFrontType
                                        setHospitalSettings: Dispatch<SetStateAction<HospitalSettingsType | null>>
                                        onClose?: () => void
}

export async function updateHospitalSettingsTransaction({
                                            hospitalSettings,
                                            setHospitalSettings,
                                            onClose
                                            }: UpdateHospitalSettingsTransactionParams)
{
  console.log("updateHospitalSettingsTransaction")

  await updateHospitalSettings(
            toUpdateHospitalSettingsRequest(hospitalSettings)
        )

  const settings = await fetchHospitalSettings()

  setHospitalSettings(
        normalizeHospitalSettings(settings)
  )

  if (onClose) {onClose()}
}