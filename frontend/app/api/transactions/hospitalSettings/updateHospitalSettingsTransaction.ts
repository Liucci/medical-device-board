import { updateHospitalSettings } from "../../../api/hospitalSettings/updateHospitalSettings"
import { toUpdateHospitalSettingsRequest } from "../../../utils/hospitalSettingMapper"
import { UpdateHospitalSettingsFrontType } from "../../../types/hospitalSettingTypes"

export async function updateHospitalSettingsTransaction(
    hospitalSettings: UpdateHospitalSettingsFrontType
)
{
    console.log("updateHospitalSettingsTransaction")

    await updateHospitalSettings(
        toUpdateHospitalSettingsRequest(hospitalSettings)
    )
}