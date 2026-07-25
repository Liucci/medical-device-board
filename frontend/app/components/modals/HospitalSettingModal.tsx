"use client"

import { useEffect, useState } from "react"

import { HospitalSettingsType } from "../../types/hospitalSettingTypes"

import { updateHospitalSettingsTransaction } from "../../api/transactions/hospitalSettings/updateHospitalSettingsTransaction"

import { executeWithErrorAndLoading } from "../common/executeWithErrorAndLoading"
import { LoadingOverlay } from "../common/LoadingOverlay"

type Props = {
  hospitalSettings: HospitalSettingsType | null
  setHospitalSettings: React.Dispatch<
    React.SetStateAction<HospitalSettingsType | null>
  >
}

export default function HospitalSettingsModal({
  hospitalSettings,
  setHospitalSettings,
}: Props) {

  const [settings, setSettings] =
    useState<HospitalSettingsType | null>(hospitalSettings)

  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setSettings(hospitalSettings)
  }, [hospitalSettings])

  if (!settings) {
    return null
  }

  const handleSave = async () => {

    await executeWithErrorAndLoading({
      setLoading,
      action: async () => {

        await updateHospitalSettingsTransaction({
          hospitalSettings: settings,
          setHospitalSettings
        })

      }
    })

  }

  return (
    <>
      <div className="space-y-6">

        {/* 患者名表示 */}
        <div className="flex items-center justify-between">

          <span>
            患者名表示
          </span>

          <input
            type="checkbox"
            checked={settings.showPatientName}
            onChange={(e) =>
              setSettings({
                ...settings,
                showPatientName: e.target.checked
              })
            }
            className="h-5 w-5"
          />

        </div>

        {/* 定時Logout */}
        <div className="flex items-center justify-between">

          <span>
            定時Logout
          </span>

          <input
            type="checkbox"
            checked={settings.autoLogoutEnabled}
            onChange={(e) =>
              setSettings({
                ...settings,
                autoLogoutEnabled: e.target.checked
              })
            }
            className="h-5 w-5"
          />

        </div>

        {/* Logout時刻 */}
        <div className="space-y-2">

          <div>
            Logout時刻
          </div>

          <input
            type="time"
            value={settings.autoLogoutTime ?? ""}
            disabled={!settings.autoLogoutEnabled}
            onChange={(e) =>
              setSettings({
                ...settings,
                autoLogoutTime: e.target.value
              })
            }
            className="border rounded px-2 py-1 disabled:bg-gray-100 disabled:text-gray-400"
          />

        </div>

        {/* 保存 */}
        <div className="flex justify-end">

          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            保存
          </button>

        </div>

      </div>

      <LoadingOverlay loading={loading} />

    </>
  )
}