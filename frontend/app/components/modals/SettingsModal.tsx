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
  LayoutGrid,
  Warehouse,
  Biohazard,
  Shield,
  ClipboardCheck,
  ClipboardPlus,
  ClipboardPenLine,
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
import {InspectionItemCategoryType} from "../../types/inspectionTypes/inspectionItemCategoryTypes"

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
  inspectionItemCategories:InspectionItemCategoryType[]
  setInspectionItemCategories : React.Dispatch<React.SetStateAction<InspectionItemCategoryType[]>>   

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
    inspectionItemCategories,
  setInspectionItemCategories,


}: Props) 
{
  const router = useRouter()
  const [mode, setMode] = useState<Mode>("menu")

  //front権限チェック
  const checkAdminPermission = () => {
      if (currentUser.role !== "admin") {
          alert("権限がありません")
          return false
      }
      return true
  }

  const menuButtons = [
    {
      label: "ストックエリア",
      mode: "stock" as const,
      icon: Boxes,
      onClick: () => {
      if (!checkAdminPermission()) return
      setMode("stock")  
      }
    },
    {
      label: "病棟エリア",
      mode: "ward" as const,
      icon: Building2,
      onClick: () => {
      if (!checkAdminPermission()) return
      setMode("ward")  
      }

    },
    {
      label: "機種編集",
      mode: "deviceType" as const,
      icon: Settings2,
      onClick: () => {
      if (!checkAdminPermission()) return
      setMode("deviceType")  
      }

    },
    {
      label: "メンテナンス編集",
      mode: "maintenance" as const,
      icon: Wrench,
      onClick: () => {
      if (!checkAdminPermission()) return
      setMode("maintenance")  
      }

    },
    {
      label: "感染症編集",
      mode: "infection" as const,
      icon: Biohazard,
      onClick: () => {
      if (!checkAdminPermission()) return
      setMode("infection")  
      }

    },
    {
      label: "管理",
      mode: "hospitalSetting" as const,
      icon: Shield,
      onClick: () => {
      if (!checkAdminPermission()) return
      setMode("hospitalSetting")  
      }

    },
    {
      label: "病棟レイアウト",
      mode: "wardOrder" as const,
      icon: LayoutGrid,      
      onClick: () => {
      if (!checkAdminPermission()) return
      setMode("wardOrder")  
      }

    },
        {
      label: "ストックエリアレイアウト",
      mode: "stockAreaOrder" as const,
      icon: Warehouse,      
      onClick: () => {
      if (!checkAdminPermission()) return
      setMode("stockAreaOrder")  
      }

    },
    {
        label: "点検表作成",
        icon: ClipboardPlus,
        onClick: () => {
          if (!checkAdminPermission()) return
          router.push("/inspection-editor")
        },
    },
    {
      label: "点検表編集",
      icon: ClipboardPenLine,
      onClick: () => {
        if (!checkAdminPermission()) return
        router.push("/inspection-editor/edit")
      },
    },
        {
        label: "点検表種類",
        mode: "checklistType" as const,
        icon: ListChecks,
        onClick: () => {
        if (!checkAdminPermission()) return
        setMode("checklistType")  
        }
    },
    {
        label: "点検項目大項目",
        mode: "checklistCategory" as const,
        icon: Tags,
        onClick: () => {
        if (!checkAdminPermission()) return
        setMode("checklistCategory")  
        }
    },

  ]

return (
  <>
    <CommonModal
      open={true}
      onClose={onClose}
      title="設定"
      maxWidth={
        mode === "maintenance"
        || mode === "deviceType"
        || mode === "ward"
          ? "max-w-[1000px]"
          : mode === "stock"
          || mode === "checklistCategory"
          ? "max-w-[600px]"
          : "max-w-[500px]"
      }
    >
      <div className="bg-slate-50 p-4 sm:p-5">
        {mode === "menu" && (
          <div className="space-y-4">
            <div>
              <div className="text-xs font-bold tracking-wide text-slate-700">
                設定項目
              </div>
              <p className="mt-1 text-[11px] text-slate-500">
                管理する項目を選択してください。
              </p>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {menuButtons.map(({ label, mode, icon: Icon, onClick }) => (
                <button
                  key={label}
                  className="flex min-h-20 items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 text-left shadow-sm transition-colors hover:border-slate-300 hover:bg-slate-50"
                  onClick={() => {
                    if (onClick) {
                      onClick()
                    } else if (mode) {
                      setMode(mode)
                    }
                  }}
                  aria-label={label}
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-50 text-slate-500">
                    <Icon className="h-4 w-4" strokeWidth={2} />
                  </div>

                  <span className="text-sm font-bold text-slate-700">
                    {label}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {mode === "stock" && (
          <>
            <div className="mb-4">
              <button
                onClick={() => setMode("menu")}
                className="h-8 rounded-lg border border-slate-200 bg-slate-50 px-3 text-xs font-bold text-slate-700 transition-colors hover:bg-slate-100"
              >
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
            <div className="mb-4">
              <button
                onClick={() => setMode("menu")}
                className="h-8 rounded-lg border border-slate-200 bg-slate-50 px-3 text-xs font-bold text-slate-700 transition-colors hover:bg-slate-100"
              >
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
            <div className="mb-4">
              <button
                onClick={() => setMode("menu")}
                className="h-8 rounded-lg border border-slate-200 bg-slate-50 px-3 text-xs font-bold text-slate-700 transition-colors hover:bg-slate-100"
              >
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
            <div className="mb-4">
              <button
                onClick={() => setMode("menu")}
                className="h-8 rounded-lg border border-slate-200 bg-slate-50 px-3 text-xs font-bold text-slate-700 transition-colors hover:bg-slate-100"
              >
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
            <div className="mb-4">
              <button
                onClick={() => setMode("menu")}
                className="h-8 rounded-lg border border-slate-200 bg-slate-50 px-3 text-xs font-bold text-slate-700 transition-colors hover:bg-slate-100"
              >
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
            <div className="mb-4">
              <button
                onClick={() => setMode("menu")}
                className="h-8 rounded-lg border border-slate-200 bg-slate-50 px-3 text-xs font-bold text-slate-700 transition-colors hover:bg-slate-100"
              >
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
            <div className="mb-4">
              <button
                onClick={() => setMode("menu")}
                className="h-8 rounded-lg border border-slate-200 bg-slate-50 px-3 text-xs font-bold text-slate-700 transition-colors hover:bg-slate-100"
              >
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
            <div className="mb-4">
              <button
                onClick={() => setMode("menu")}
                className="h-8 rounded-lg border border-slate-200 bg-slate-50 px-3 text-xs font-bold text-slate-700 transition-colors hover:bg-slate-100"
              >
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
            <div className="mb-4">
              <button
                onClick={() => setMode("menu")}
                className="h-8 rounded-lg border border-slate-200 bg-slate-50 px-3 text-xs font-bold text-slate-700 transition-colors hover:bg-slate-100"
              >
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
            <div className="mb-4">
              <button
                onClick={() => setMode("menu")}
                className="h-8 rounded-lg border border-slate-200 bg-slate-50 px-3 text-xs font-bold text-slate-700 transition-colors hover:bg-slate-100"
              >
                ← 戻る
              </button>
            </div>

            <EditChecklistItemCategoryModal
              inspectionItemCategories={inspectionItemCategories}
              setInspectionItemCategories={setInspectionItemCategories}
              onclose={() => setMode("menu")}
            />
          </>
        )}
      </div>
    </CommonModal>
  </>
)  
}
