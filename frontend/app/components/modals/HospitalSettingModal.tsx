"use client"

import { useEffect, useState } from "react"

import { HospitalSettingsType } from "../../types/hospitalSettingTypes"

import { updateHospitalSettingsTransaction } from "../../api/transactions/hospitalSettings/updateHospitalSettingsTransaction"
import CommonModal from "../common/CommonModal"

import { executeWithErrorAndLoading } from "../common/executeWithErrorAndLoading"
import { LoadingOverlay } from "../common/LoadingOverlay"

type Props = {
  hospitalSettings: HospitalSettingsType | null
  setHospitalSettings: React.Dispatch<
    React.SetStateAction<HospitalSettingsType | null>
  >
  onClose: () => void
}

export default function HospitalSettingsModal({
  hospitalSettings,
  setHospitalSettings,
  onClose
}: Props) {

  const [settings, setSettings] =
    useState<HospitalSettingsType | null>(hospitalSettings)

  const [loading, setLoading] = useState(false)
  useEffect(() => {

    if (!hospitalSettings) {
      setSettings(null)
      return
    }

    setSettings({
      ...hospitalSettings,
      autoLogoutTime:
        hospitalSettings.autoLogoutTime ?? "08:00"
    })

}, [hospitalSettings])
  if (!settings) {
    return null
  }

  const handleSave = async () => {
    if (
        settings.autoLogoutEnabled &&
        !settings.autoLogoutTime
    ) {
        alert("Logout時刻を設定してください")
        return
    }

    await executeWithErrorAndLoading({
      setLoading,
      action: async () => {

        await updateHospitalSettingsTransaction({
          hospitalSettings: settings,
          setHospitalSettings
        })
        onClose()
      }
    })

  }

return (
  <>
    <div className="h-full rounded-xl w-full bg-gray-200 p-5">
      <div className="rounded-xl bg-white p-6 shadow-sm">
        <div className="space-y-6">

          {/* ===================================================== */}
          {/* 患者情報 */}
          {/* ===================================================== */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800">
              患者情報
            </h3>

            <p className="mt-1 text-sm text-gray-500">
              病棟画面などで患者名を表示するか設定します。
            </p>

            <div className="mt-4 rounded-xl border border-gray-200 bg-white p-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <div className="text-sm font-semibold text-gray-800">
                    患者名表示
                  </div>

                  <div className="mt-1 text-xs text-gray-500">
                    患者名を機器情報などに表示します。
                  </div>
                </div>

                <label className="relative inline-flex shrink-0 cursor-pointer items-center">
                  <input
                    type="checkbox"
                    className="peer sr-only"
                    checked={settings.showPatientName}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        showPatientName: e.target.checked,
                      })
                    }
                  />

                  <div
                    className="
                      h-6
                      w-11
                      rounded-full
                      bg-gray-300
                      transition-colors
                      peer-checked:bg-blue-600
                      after:absolute
                      after:left-0.5
                      after:top-0.5
                      after:h-5
                      after:w-5
                      after:rounded-full
                      after:bg-white
                      after:transition-transform
                      peer-checked:after:translate-x-5
                      after:content-['']
                    "
                  />
                </label>
              </div>
            </div>
          </div>

          {/* ===================================================== */}
          {/* ログイン・Logout */}
          {/* ===================================================== */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800">
              ログイン設定
            </h3>

            <p className="mt-1 text-sm text-gray-500">
              自動Logoutに関する設定を行います。
            </p>

            <div className="mt-4 space-y-3">

              {/* 定時Logout */}
              <div className="rounded-xl border border-gray-200 bg-white p-4">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <div className="text-sm font-semibold text-gray-800">
                      定時Logout
                    </div>

                    <div className="mt-1 text-xs text-gray-500">
                      指定した時刻に自動的にLogoutします。
                    </div>
                  </div>

                  <label className="relative inline-flex shrink-0 cursor-pointer items-center">
                    <input
                      type="checkbox"
                      className="peer sr-only"
                      checked={settings.autoLogoutEnabled}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          autoLogoutEnabled: e.target.checked,
                          autoLogoutTime: e.target.checked
                            ? (settings.autoLogoutTime ?? "08:00")
                            : settings.autoLogoutTime,
                        })
                      }
                    />

                    <div
                      className="
                        h-6
                        w-11
                        rounded-full
                        bg-gray-300
                        transition-colors
                        peer-checked:bg-blue-600
                        after:absolute
                        after:left-0.5
                        after:top-0.5
                        after:h-5
                        after:w-5
                        after:rounded-full
                        after:bg-white
                        after:transition-transform
                        peer-checked:after:translate-x-5
                        after:content-['']
                      "
                    />
                  </label>
                </div>
              </div>

              {/* Logout時刻 */}
              <div className="rounded-xl border border-gray-200 bg-white p-4">
                <div className="flex items-center justify-between gap-4">

                  <div>
                    <div className="text-sm font-semibold text-gray-800">
                      Logout時刻
                    </div>

                    <div className="mt-1 text-xs text-gray-500">
                      自動Logoutを実行する時刻を設定します。
                    </div>
                  </div>

                  <div className="flex shrink-0 items-center gap-2">
                    <input
                      type="number"
                      min={0}
                      max={23}
                      value={
                        settings.autoLogoutTime?.slice(0, 2) ?? "8"
                      }
                      disabled={!settings.autoLogoutEnabled}
                      onChange={(e) => {
                        const hour = Math.max(
                          0,
                          Math.min(23, Number(e.target.value))
                        )

                        setSettings({
                          ...settings,
                          autoLogoutTime:
                            `${hour
                              .toString()
                              .padStart(2, "0")}:00`,
                        })
                      }}
                      className="
                        w-20
                        rounded-lg
                        border
                        border-gray-300
                        bg-white
                        px-3
                        py-2
                        text-sm
                        text-gray-700
                        outline-none
                        transition
                        focus:border-blue-500
                        focus:ring-2
                        focus:ring-blue-100
                        disabled:bg-gray-100
                        disabled:text-gray-400
                      "
                    />

                    <span className="text-sm text-gray-600">
                      時
                    </span>
                  </div>

                </div>
              </div>

            </div>
          </div>

          {/* ===================================================== */}
          {/* 保存 */}
          {/* ===================================================== */}
          <div className="flex justify-end border-t border-gray-200 pt-5">
            <button
              onClick={handleSave}
              disabled={loading}
              className="
                rounded-lg
                bg-blue-600
                px-5
                py-2.5
                text-sm
                font-medium
                text-white
                shadow-sm
                transition
                hover:bg-blue-700
                disabled:cursor-not-allowed
                disabled:bg-gray-300
              "
            >
              {loading ? "保存中..." : "保存"}
            </button>
          </div>

        </div>
      </div>
    </div>

    <LoadingOverlay loading={loading} />
  </>
)  
}