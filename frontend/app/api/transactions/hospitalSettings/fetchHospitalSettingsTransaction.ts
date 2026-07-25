import { fetchHospitalSettings } from "../../../api/hospitalSettings/fetchHospitalSettings"
import { normalizeHospitalSettings } from "../../../utils/hospitalSettingMapper"

type FetchHospitalSettingsTransactionParams = {
    setHospitalSettings: (hospitalSettings: any) => void
}

export async function fetchHospitalSettingsTransaction({
    setHospitalSettings
}: FetchHospitalSettingsTransactionParams)
{
    console.log("fetchHospitalSettingsTransaction")

    const hospitalSettings = await fetchHospitalSettings()

    setHospitalSettings(
        normalizeHospitalSettings(hospitalSettings)
    )
}