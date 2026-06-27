"use client"

import { useState } from "react"
import { createPortal } from "react-dom"
import {
  Boxes,
  Building2,
  Settings2,
  Wrench,
  GripVertical
} from "lucide-react"
import { Device } from "../../types/deviceTypes"
import { StockAreaType } from "../../types/stockTypes"
import { DeviceTypeType } from "../../types/deviceTypeTypes"
import { DeviceModelType } from "../../types/deviceModelTypes"
import { WardType } from "../../types/wardTypes"
import {CurrentUser  } from "../../types/userTypes"
import { RoomType } from "../../types/roomTypes"
import {MaintenanceType } from "../../types/maintenanceTypeTypes"

import StockAreaSettingsModal from "./StockAreaSettingsModal"
import WardAreaSettingsModal from "./WardAreaSettingsModal"
import DeviceTypeSettingsModal from "./DeviceTypeSettingsModal"
import MaintenanceSettingsModal from "./MaintenanceTypeSettingsModal"
import WardOrderModal from "./WardOrderModal"
import StockAreaOrderModal from "./StockAreaOrderModal"


type Props = {
  onClose: () => void
  stockAreas: StockAreaType[]
  setStockAreas: React.Dispatch<React.SetStateAction<any[]>>
  deviceTypes: DeviceTypeType[]
  setDeviceTypes: React.Dispatch<React.SetStateAction<any[]>>
  deviceModels: DeviceModelType[]
  setDeviceModels: React.Dispatch<React.SetStateAction<any[]>>
  wards:WardType[]
  setWards:React.Dispatch<React.SetStateAction<any[]>>
  rooms: RoomType[]
  setRooms:React.Dispatch<React.SetStateAction<any[]>>
  maintenanceTypes: MaintenanceType[]
  setMaintenanceTypes: React.Dispatch<React.SetStateAction<any[]>>
}

type Mode =
            "menu" 
            | "stock"
            | "ward"
            | "deviceType"
            | "maintenance"
            | "wardOrder"
            | "stockAreaOrder"
export default function SettingsModal({
  onClose,
  stockAreas,
  setStockAreas,
  deviceTypes,
  setDeviceTypes,
  deviceModels,
  setDeviceModels,
  wards,
  setWards,
  rooms,
  setRooms,
  maintenanceTypes,
  setMaintenanceTypes,

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
    },
    {
      label: "病棟レイアウト",
      mode: "wardOrder" as const,
      icon: GripVertical,
    },
        {
      label: "ストックエリアレイアウト",
      mode: "stockAreaOrder" as const,
      icon: GripVertical,
    }
  ]

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 z-[9999]">
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
              setStockAreas={setStockAreas}
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
              setWards={setWards}
              rooms={rooms}
              setRooms={setRooms}
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
              setDeviceTypes={setDeviceTypes}
              deviceModels={deviceModels}
              setDeviceModels={setDeviceModels}
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
              setMaintenanceTypes={setMaintenanceTypes}
              deviceTypes={deviceTypes}
              deviceModels={deviceModels}
            />
          </>
        )}
        {mode === "wardOrder" && (
          <>
            <button
              onClick={() => setMode("menu")}
              className="mb-4"
            >
              戻る
            </button>

            <WardOrderModal
              isOpen={true}
              onClose={() => setMode("menu")}
              wards={wards}
              setWards={setWards}
            />
          </>
        )}

        {mode === "stockAreaOrder" && (
          <>
            <button
              onClick={() => setMode("menu")}
              className="mb-4"
            >
              戻る
            </button>

            <StockAreaOrderModal
              isOpen={true}
              onClose={() => setMode("menu")}
              stockAreas={stockAreas}
              setStockAreas={setStockAreas}
            />
          </>
        )}


      </div>
    </div>,
    document.body
  )
}
