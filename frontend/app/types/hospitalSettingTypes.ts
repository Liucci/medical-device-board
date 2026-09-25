export type HospitalSettingsType = {
    hospitalId: string
    showPatientName: boolean
    autoLogoutEnabled: boolean
    autoLogoutTime: string | null
    clearDeviceInfoOnStock: boolean
}

export type HospitalSettingsDBType = {
    hospital_id: string
    show_patient_name: boolean
    auto_logout_enabled: boolean
    auto_logout_time: string | null
    clear_device_info_on_stock: boolean
}


export type UpdateHospitalSettingsFrontType = {
    showPatientName: boolean
    autoLogoutEnabled: boolean
    autoLogoutTime: string | null
    clearDeviceInfoOnStock: boolean
}

export type UpdateHospitalSettingsBackType = {
    show_patient_name: boolean
    auto_logout_enabled: boolean
    auto_logout_time: string | null
    clear_device_info_on_stock: boolean
}