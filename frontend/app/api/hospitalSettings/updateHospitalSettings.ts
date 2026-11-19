import { API_BASE_URL } from "../client/apiClient"
import { UpdateHospitalSettingsBackType } from "../../types/hospitalSettingTypes"

export async function updateHospitalSettings(
    hospitalSettings: UpdateHospitalSettingsBackType
)
{
    console.log("updateHospitalSettings")

    const response = await fetch(
                        `${API_BASE_URL}/update-hospital-settings`,
                        {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json"
                            },
                            credentials: "include",
                            body: JSON.stringify(hospitalSettings)
                        }
                      )

if (!response.ok) {
    throw new Error("病院設定の更新に失敗しました")
}
}