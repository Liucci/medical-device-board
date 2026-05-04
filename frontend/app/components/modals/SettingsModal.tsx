"use client"

import { useState } from "react"
import { createPortal } from "react-dom"
import {
  Boxes,
  Building2,
  Settings2,
  Wrench
} from "lucide-react"
import StockAreaSettingsModal from "./StockAreaSettingsModal"
import WardAreaSettingsModal from "./WardAreaSettingsModal"
import DeviceTypeSettingsModal from "./DeviceTypeSettingsModal"
import MaintenanceSettingsModal from "./MaintenanceTypeSettingsModal"

type Props = {
  onClose: () => void
  stockAreas: { id: number; name: string }[]
  deviceTypes: { id: number; name: string }[]
  deviceModels: { id: number; device_type_id: number; name: string }[]
  wards: { wardId: number; wardName: string }[]
  rooms: { id: number; wardId: number; roomName: string; patientName: string }[]
  addStockArea: (name: string) => Promise<void>
  renameStockArea: (id: number, newName: string) => Promise<void>
  deleteStockAreas: (ids: number[]) => Promise<void>
  addWard: (name: string) => Promise<void>
  renameWard: (id: number, newName: string) => Promise<void>
  deleteWards: (ids: number[]) => Promise<void>
  addRoom: (wardId: number, name: string) => Promise<void>
  renameRoom: (id: number, newName: string) => Promise<void>
  deleteRooms: (ids: number[]) => Promise<void>
  addDeviceType: (name: string) => Promise<void>
  renameDeviceType: (id: number, newName: string) => Promise<void>
  deleteDeviceTypes: (ids: number[]) => Promise<void>
  addDeviceModel: (deviceTypeId: number, name: string) => Promise<void>
  renameDeviceModel: (id: number, newName: string) => Promise<void>
  deleteDeviceModels: (ids: number[]) => Promise<void>
  maintenanceTypes: {
    id: number
    name: string
    device_type_id: number
    device_model_id: number | null
    interval_days: number
  }[]
  addMaintenanceType: (data: {
    name: string
    deviceTypeId: number
    deviceModelId: number | null
    intervalDays: number
  }) => Promise<void>
  renameMaintenanceType: (
    id: number,
    data: {
      name: string
      intervalDays: number
    }
  ) => Promise<void>
  deleteMaintenanceTypes: (ids: number[]) => Promise<void>
}

type Mode = "menu" | "stock" | "ward" | "deviceType" | "maintenance"

export default function SettingsModal({
  onClose,
  stockAreas,
  deviceTypes,
  deviceModels,
  wards,
  rooms,
  maintenanceTypes,
  addStockArea,
  renameStockArea,
  deleteStockAreas,
  addWard,
  renameWard,
  deleteWards,
  addRoom,
  renameRoom,
  deleteRooms,
  addDeviceType,
  renameDeviceType,
  deleteDeviceTypes,
  addDeviceModel,
  renameDeviceModel,
  deleteDeviceModels,
  addMaintenanceType,
  renameMaintenanceType,
  deleteMaintenanceTypes
}: Props) {
  const [mode, setMode] = useState<Mode>("menu")

  const menuButtons = [
    {
      label: "ストックエリア",
      mode: "stock" as const,
      icon: Boxes
    },
    {
      label: "病棟エリア",
      mode: "ward" as const,
      icon: Building2
    },
    {
      label: "機種編集",
      mode: "deviceType" as const,
      icon: Settings2
    },
    {
      label: "メンテナンス編集",
      mode: "maintenance" as const,
      icon: Wrench
    }
  ]

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-xl bg-white p-8 shadow-xl">
        <div className="sticky top-0 z-10 bg-white pb-2">
          <button onClick={onClose}>
            閉じる
          </button>
        </div>

        {mode === "menu" && (
          <>
            <h2 className="mb-6 text-center text-2xl font-bold">
              設定
            </h2>

            <div className="grid grid-cols-2 gap-3">
              {menuButtons.map(({ label, mode, icon: Icon }) => (
                <button
                  key={mode}
                  className={`
                    flex h-24 flex-col items-center justify-center gap-2
                    rounded-2xl bg-white text-black
                    border border-gray-300 shadow-sm
                    transition hover:bg-gray-100 hover:shadow-md
                  `}
                  onClick={() => setMode(mode)}
                  aria-label={label}
                >
                  <span className="text-xs">
                    {label}
                  </span>
                  <Icon size={38} strokeWidth={2} />
                </button>
              ))}
            </div>
          </>
        )}

        {mode === "stock" && (
          <>
            <button onClick={() => setMode("menu")} className="mb-4">
              戻る
            </button>
            <StockAreaSettingsModal
              stockAreas={stockAreas}
              addStockArea={addStockArea}
              renameStockArea={renameStockArea}
              deleteStockAreas={deleteStockAreas}
            />
          </>
        )}

        {mode === "ward" && (
          <>
            <button onClick={() => setMode("menu")} className="mb-4">
              戻る
            </button>
            <WardAreaSettingsModal
              wards={wards}
              rooms={rooms}
              addWard={addWard}
              renameWard={renameWard}
              deleteWards={deleteWards}
              addRoom={addRoom}
              renameRoom={renameRoom}
              deleteRooms={deleteRooms}
            />
          </>
        )}

        {mode === "deviceType" && (
          <>
            <button onClick={() => setMode("menu")} className="mb-4">
              戻る
            </button>
            <DeviceTypeSettingsModal
              deviceTypes={deviceTypes}
              deviceModels={deviceModels}
              addDeviceType={addDeviceType}
              renameDeviceType={renameDeviceType}
              deleteDeviceTypes={deleteDeviceTypes}
              addDeviceModel={addDeviceModel}
              renameDeviceModel={renameDeviceModel}
              deleteDeviceModels={deleteDeviceModels}
            />
          </>
        )}

        {mode === "maintenance" && (
          <>
            <button onClick={() => setMode("menu")} className="mb-4">
              戻る
            </button>
            <MaintenanceSettingsModal
              maintenanceTypes={maintenanceTypes}
              deviceTypes={deviceTypes}
              deviceModels={deviceModels}
              addMaintenanceType={addMaintenanceType}
              renameMaintenanceType={renameMaintenanceType}
              deleteMaintenanceTypes={deleteMaintenanceTypes}
            />
          </>
        )}
      </div>
    </div>,
    document.body
  )
}
