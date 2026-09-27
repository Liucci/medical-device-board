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
      <div className="space-y-5">
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            メンテナンスタイプ
          </label>

          {availableMaintenanceTypes.length === 0 ? (
            <p className="text-sm text-gray-500">
              この機種・型式に追加できるメンテナンスタイプがありません。
            </p>
          ) : (
            <select
              value={maintenanceTypeId ?? ""}
              onChange={e => setMaintenanceTypeId(e.target.value ? Number(e.target.value) : null)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
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

        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={handleClose}
            className="rounded-md border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
          >
            キャンセル
          </button>

          <button
            type="button"
            onClick={handleAdd}
            disabled={maintenanceTypeId === null}
            className="rounded-md bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            決定
          </button>
        </div>
      </div>
    </CommonModal>
  )
}