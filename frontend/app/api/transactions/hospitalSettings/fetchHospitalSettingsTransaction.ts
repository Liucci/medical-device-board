import { fetchHospitalSettings } from "../../../api/hospitalSettings/fetchHospitalSettings"
import { normalizeHospitalSettings } from "../../../mapper/hospitalSettingMapper"

type FetchHospitalSettingsTransactionParams = {
    setHospitalSettings: (hospitalSettings: any) => void
}

export async function fetchHospitalSettingsTransaction({
    setHospitalSettings
}: FetchHospitalSettingsTransactionParams)
{
    console.log("fetchHospitalSettingsTransaction")

    const hospitalSettings = await fetchHospitalSettings()
    if (!hospitalSettings) {
                            setHospitalSettings(null)
                            return
    }
    setHospitalSettings(
        normalizeHospitalSettings(hospitalSettings)
    )
}