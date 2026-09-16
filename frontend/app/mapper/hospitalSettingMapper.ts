import {
    HospitalSettingsDBType,
    HospitalSettingsType,
    UpdateHospitalSettingsFrontType,
    UpdateHospitalSettingsBackType
} from "../types/hospitalSettingTypes"

// Backend Response → Frontend標準型
export function normalizeHospitalSettings(hospitalSettings: HospitalSettingsDBType): HospitalSettingsType {
    return {
        hospitalId: hospitalSettings.hospital_id,
        showPatientName: hospitalSettings.show_patient_name,
        autoLogoutEnabled: hospitalSettings.auto_logout_enabled,
        autoLogoutTime: hospitalSettings.auto_logout_time
    }
}

// Frontend更新型 → Backend Request
export function toUpdateHospitalSettingsRequest(hospitalSettings: UpdateHospitalSettingsFrontType): UpdateHospitalSettingsBackType {
    return {
        show_patient_name: hospitalSettings.showPatientName,
        auto_logout_enabled: hospitalSettings.autoLogoutEnabled,
        auto_logout_time: hospitalSettings.autoLogoutTime
    }
}