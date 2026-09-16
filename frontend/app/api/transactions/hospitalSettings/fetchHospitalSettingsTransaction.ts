import { fetchHospitalSettings } from "../../../api/hospitalSettings/fetchHospitalSettings"
import { normalizeHospitalSettings } from "../../../mapper/hospitalSettingMapper"

type FetchHospitalSettingsTransactionParams = {
    setHospitalSettings: (hospitalSettings: any) => void
}

export async function fetchHospitalSettingsTransaction()
{
    console.log("fetchHospitalSettingsTransaction")

    const hospitalSettings = await fetchHospitalSettings()
    if (!hospitalSettings)
        {return null}
    return normalizeHospitalSettings(hospitalSettings)
}