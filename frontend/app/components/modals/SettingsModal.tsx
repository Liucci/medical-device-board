"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createPortal } from "react-dom"

import {
  Boxes,
  Building2,
  Settings2,
  Wrench,
  GripVertical,
  Biohazard,
  Shield,
  ClipboardCheck,
  ListChecks,
  Tags
} from "lucide-react"

import { Device } from "../../types/deviceTypes"
import { StockAreaType } from "../../types/stockTypes"
import { DeviceTypeType } from "../../types/deviceTypeTypes"
import { DeviceModelType } from "../../types/deviceModelTypes"
import { WardType } from "../../types/wardTypes"
import {CurrentUser  } from "../../types/userTypes"
import { RoomType } from "../../types/roomTypes"
import {MaintenanceType } from "../../types/maintenanceTypeTypes"
import { InfectionTypeType } from "../../types/infectionTypeTypes"
import { HospitalSettingsType } from "../../types/hospitalSettingTypes"
import { InspectionType } from "../../types/inspectionTypes/inspectionTypeTypes"

import CommonModal from "../common/CommonModal"
import StockAreaSettingsModal from "./StockAreaSettingsModal"
import WardAreaSettingsModal from "./WardAreaSettingsModal"
import DeviceTypeSettingsModal from "./DeviceTypeSettingsModal"
import MaintenanceSettingsModal from "./MaintenanceTypeSettingsModal"
import WardOrderModal from "./WardOrderModal"
import StockAreaOrderModal from "./StockAreaOrderModal"
import InfectionSettingModal from "./InfectionSettingModal"
import HospitalSettingModal from "./HospitalSettingModal"
import EditChecklistTypeModal from "./inspection/EditChecklistTypeModal"
import EditChecklistItemCategoryModal from "./inspection/EditChecklistItemCategoryModal"

type Props = {
  currentUser: CurrentUser
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
  infectionTypes:InfectionTypeType[]
  setInfectionTypes:React.Dispatch<React.SetStateAction<any[]>>
  hospitalSettings: HospitalSettingsType | null
  setHospitalSettings: React.Dispatch<React.SetStateAction<HospitalSettingsType | null>>
  inspectionTypes: InspectionType[]
  setInspectionTypes: React.Dispatch<React.SetStateAction<any[]>>

}

type Mode =
            "menu" 
            | "stock"
            | "ward"
            | "deviceType"
            | "maintenance"
            | "infection"
            | "hospitalSetting"
            | "wardOrder"
            | "stockAreaOrder"
            | "checklistType"
            | "checklistCategory"
export default function SettingsModal({
  currentUser,
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
  infectionTypes,
  setInfectionTypes,
  hospitalSettings,
  setHospitalSettings,
  inspectionTypes,
  setInspectionTypes,

}: Props) 
{
  const router = useRouter()
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
      label: "感染症編集",
      mode: "infection" as const,
      icon: Biohazard
    },
    {
      label: "管理",
      mode: "hospitalSetting" as const,
      icon: Shield
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
    },
    {
        label: "点検表作成",
        icon: ClipboardCheck,
        onClick: () => {
            if (currentUser.role !== "admin") {
                alert("権限がありません")
                return
            }

            router.push("/inspection-editor")
        },
    },
    {
      label: "点検表編集",
      icon: ClipboardCheck,
      onClick: () => {
          if (currentUser.role !== "admin") {
              alert("権限がありません")
              return
          }
          router.push("/inspection-editor/edit")
      },
    },
        {
        label: "点検表種類",
        mode: "checklistType" as const,
        icon: ListChecks,
    },
    {
        label: "点検項目大項目",
        mode: "checklistCategory" as const,
        icon: Tags,
    },

  ]

  return (
    <>
      <CommonModal
          open={true}
          onClose={onClose}
          title="設定"
          maxWidth="max-w-[500px]"
      > 
        {mode === "menu" && (
          <>

            <div className="grid grid-cols-2 gap-3">
              
              {menuButtons.map(({ label, mode, icon: Icon, onClick }) => (
                  <button
                      key={label}
                      className={`
                          flex h-24 flex-col items-center justify-center gap-2
                          rounded-2xl bg-white text-black
                          border border-gray-300 shadow-sm
                          transition hover:bg-gray-100 hover:shadow-md
                      `}
                      onClick={() => {
                          if (onClick) {
                              onClick()
                          } else if (mode) {
                              setMode(mode)
                          }
                      }}
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
          <div className="flex justify-start mb-4">
            <button onClick={() => setMode("menu")}>
              ← 戻る
            </button>
          </div>
            <StockAreaSettingsModal
              stockAreas={stockAreas}
              setStockAreas={setStockAreas}
            />
          </>
        )}

        {mode === "ward" && (
          <>
          <div className="flex justify-start mb-4">
            <button onClick={() => setMode("menu")}>
              ← 戻る
            </button>
          </div>

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
          <div className="flex justify-start mb-4">
            <button onClick={() => setMode("menu")}>
              ← 戻る
            </button>
          </div>
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
          <div className="flex justify-start mb-4">
            <button onClick={() => setMode("menu")}>
              ← 戻る
            </button>
          </div>
            <MaintenanceSettingsModal
              maintenanceTypes={maintenanceTypes}
              setMaintenanceTypes={setMaintenanceTypes}
              deviceTypes={deviceTypes}
              deviceModels={deviceModels}
            />
          </>
        )}

        {mode === "infection" && (
          <>
          <div className="flex justify-start mb-4">
            <button onClick={() => setMode("menu")}>
              ← 戻る
            </button>
          </div>

            <InfectionSettingModal
              infectionTypes={infectionTypes}
              setInfectionTypes={setInfectionTypes}
            />
          </>
        )}
        {mode === "hospitalSetting" && (
          <>
            <div className="flex justify-start mb-4">
              <button onClick={() => setMode("menu")}>
                ← 戻る
              </button>
            </div>

            <HospitalSettingModal
              hospitalSettings={hospitalSettings}
              setHospitalSettings={setHospitalSettings}
              onClose={() => setMode("menu")}
            />
          </>
        )}
        {mode === "wardOrder" && (
          <>
          <div className="flex justify-start mb-4">
            <button onClick={() => setMode("menu")}>
              ← 戻る
            </button>
          </div>

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
          <div className="flex justify-start mb-4">
            <button onClick={() => setMode("menu")}>
              ← 戻る
            </button>
          </div>

            <StockAreaOrderModal
              isOpen={true}
              onClose={() => setMode("menu")}
              stockAreas={stockAreas}
              setStockAreas={setStockAreas}
            />
          </>
        )}
        {mode === "checklistType" && (
    <>
        <div className="flex justify-start mb-4">
            <button onClick={() => setMode("menu")}>
                ← 戻る
            </button>
        </div>

        <EditChecklistTypeModal 
            inspectionTypes={inspectionTypes}
            setInspectionTypes={setInspectionTypes}

        />
      </>
      )}
      {mode === "checklistCategory" && (
          <>
              <div className="flex justify-start mb-4">
                  <button onClick={() => setMode("menu")}>
                      ← 戻る
                  </button>
              </div>

              <EditChecklistItemCategoryModal />
          </>
      )}

  </CommonModal>

  </>
  )
}
