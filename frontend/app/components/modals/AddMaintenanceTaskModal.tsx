"use client"

import { useState } from "react"
import CommonModal from "../../components/common/CommonModal"
import { MaintenanceType } from "../../types/maintenanceTypeTypes"

type AddMaintenanceTaskModalProps = {
  isOpen: boolean
  deviceId: number
  deviceTypeId: number
  deviceModelId: number
  maintenanceTypes: MaintenanceType[]
  onClose: () => void
  onAdd: (maintenanceTypeId: number) => void
}

export default function AddMaintenanceTaskModal({
                                                  isOpen,
                                                  deviceId,
                                                  deviceTypeId,
                                                  deviceModelId,
                                                  maintenanceTypes,
                                                  onClose,
                                                  onAdd
                                                }: AddMaintenanceTaskModalProps) {
  const [maintenanceTypeId, setMaintenanceTypeId] = useState<number | null>(null)

  const availableMaintenanceTypes = maintenanceTypes.filter(
    maintenanceType =>
      maintenanceType.dependDeviceStatus === "both" &&
      Number(maintenanceType.deviceTypeId) === Number(deviceTypeId) &&
      (
        maintenanceType.deviceModelId === null ||
        maintenanceType.deviceModelId === undefined ||
        Number(maintenanceType.deviceModelId) === Number(deviceModelId)
      )
  )

  const handleAdd = () => {
    if (maintenanceTypeId === null) return

    onAdd(maintenanceTypeId)
    setMaintenanceTypeId(null)
    onClose()
  }

  const handleClose = () => {
    setMaintenanceTypeId(null)
    onClose()
  }

return (
  <CommonModal
    open={isOpen}
    onClose={handleClose}
    title="メンテナンスタスク追加"
  >
    <div className="bg-slate-50 p-4 sm:p-5">
      <div className="space-y-5">
        <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 px-4 py-3 sm:px-5">
            <div className="text-xs font-bold tracking-wide text-slate-700">
              メンテナンスタイプ
            </div>
            <div className="mt-0.5 text-[11px] text-slate-400">
              追加するメンテナンスを選択してください
            </div>
          </div>

          <div className="p-4 sm:p-5">
            {availableMaintenanceTypes.length === 0 ? (
              <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
                <p className="text-sm font-medium text-slate-500">
                  この機種・型式に追加できるメンテナンスタイプがありません。
                </p>
              </div>
            ) : (
              <select
                value={maintenanceTypeId ?? ""}
                onChange={e =>
                  setMaintenanceTypeId(
                    e.target.value ? Number(e.target.value) : null
                  )
                }
                className="
                  h-11 w-full rounded-lg
                  border border-slate-300
                  bg-white px-3
                  text-sm font-medium text-slate-900
                  outline-none
                  transition-colors
                  focus:border-teal-600
                  focus:ring-2
                  focus:ring-teal-600/15
                "
              >
                <option value="">選択してください</option>

                {availableMaintenanceTypes.map(maintenanceType => (
                  <option
                    key={maintenanceType.id}
                    value={maintenanceType.id}
                  >
                    {maintenanceType.name}
                  </option>
                ))}
              </select>
            )}
          </div>
        </section>

        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={handleClose}
            className="
              h-10 rounded-lg
              border border-slate-200
              bg-slate-50 px-4
              text-xs font-bold text-slate-700
              transition-colors
              hover:bg-slate-100
            "
          >
            キャンセル
          </button>

          <button
            type="button"
            onClick={handleAdd}
            disabled={maintenanceTypeId === null}
            className="
              h-10 rounded-lg
              bg-teal-700 px-4
              text-xs font-bold text-white
              transition-colors
              hover:bg-teal-800
              disabled:cursor-not-allowed
              disabled:bg-slate-300
              disabled:text-slate-500
            "
          >
            決定
          </button>
        </div>
      </div>
    </div>
  </CommonModal>
)  
}