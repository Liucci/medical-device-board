"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Boxes, Building2, Settings2, Wrench, LayoutGrid, Warehouse, Biohazard, Shield, ClipboardPlus, ClipboardPenLine, ListChecks, Tags } from "lucide-react"
import { Device } from "../../types/deviceTypes"
import { StockAreaType } from "../../types/stockTypes"
import { DeviceTypeType } from "../../types/deviceTypeTypes"
import { DeviceModelType } from "../../types/deviceModelTypes"
import { WardType } from "../../types/wardTypes"
import { CurrentUser } from "../../types/userTypes"
import { RoomType } from "../../types/roomTypes"
import { MaintenanceType } from "../../types/maintenanceTypeTypes"
import { InfectionTypeType } from "../../types/infectionTypeTypes"
import { HospitalSettingsType } from "../../types/hospitalSettingTypes"
import { InspectionType } from "../../types/inspectionTypes/inspectionTypeTypes"
import { InspectionItemCategoryType } from "../../types/inspectionTypes/inspectionItemCategoryTypes"
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
import useInputModal from "../../components/common/useInputModal"

type Props = {
  currentUser: CurrentUser
  onClose: () => void
  stockAreas: StockAreaType[]
  setStockAreas: React.Dispatch<React.SetStateAction<any[]>>
  deviceTypes: DeviceTypeType[]
  setDeviceTypes: React.Dispatch<React.SetStateAction<any[]>>
  deviceModels: DeviceModelType[]
  setDeviceModels: React.Dispatch<React.SetStateAction<any[]>>
  wards: WardType[]
  setWards: React.Dispatch<React.SetStateAction<any[]>>
  rooms: RoomType[]
  setRooms: React.Dispatch<React.SetStateAction<any[]>>
  maintenanceTypes: MaintenanceType[]
  setMaintenanceTypes: React.Dispatch<React.SetStateAction<any[]>>
  infectionTypes: InfectionTypeType[]
  setInfectionTypes: React.Dispatch<React.SetStateAction<any[]>>
  hospitalSettings: HospitalSettingsType | null
  setHospitalSettings: React.Dispatch<React.SetStateAction<HospitalSettingsType | null>>
  inspectionTypes: InspectionType[]
  setInspectionTypes: React.Dispatch<React.SetStateAction<any[]>>
  inspectionItemCategories: InspectionItemCategoryType[]
  setInspectionItemCategories: React.Dispatch<React.SetStateAction<InspectionItemCategoryType[]>>
}

type Mode = "menu" | "stock" | "ward" | "deviceType" | "maintenance" | "infection" | "hospitalSetting" | "wardOrder" | "stockAreaOrder" | "checklistType" | "checklistCategory"

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
}: Props) {
  console.log("SettingsModal")
  const router = useRouter()
  const [mode, setMode] = useState<Mode>("menu")
  const inputModal = useInputModal()

  const checkAdminPermission = () => {
    if (currentUser.role !== "admin") {
      inputModal.openInputModal({
        title: "権限エラー",
        message: "この操作を行う権限がありません",
        type: "confirm",
        buttonPattern: "ok_only",
        icon: "warning",
      })
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
      },
    },
    {
      label: "病棟エリア",
      mode: "ward" as const,
      icon: Building2,
      onClick: () => {
        if (!checkAdminPermission()) return
        setMode("ward")
      },
    },
    {
      label: "機種編集",
      mode: "deviceType" as const,
      icon: Settings2,
      onClick: () => {
        if (!checkAdminPermission()) return
        setMode("deviceType")
      },
    },
    {
      label: "メンテナンス編集",
      mode: "maintenance" as const,
      icon: Wrench,
      onClick: () => {
        if (!checkAdminPermission()) return
        setMode("maintenance")
      },
    },
    {
      label: "感染症編集",
      mode: "infection" as const,
      icon: Biohazard,
      onClick: () => {
        if (!checkAdminPermission()) return
        setMode("infection")
      },
    },
    {
      label: "管理",
      mode: "hospitalSetting" as const,
      icon: Shield,
      onClick: () => {
        if (!checkAdminPermission()) return
        setMode("hospitalSetting")
      },
    },
    {
      label: "病棟レイアウト",
      mode: "wardOrder" as const,
      icon: LayoutGrid,
      onClick: () => {
        if (!checkAdminPermission()) return
        setMode("wardOrder")
      },
    },
    {
      label: "ストックエリアレイアウト",
      mode: "stockAreaOrder" as const,
      icon: Warehouse,
      onClick: () => {
        if (!checkAdminPermission()) return
        setMode("stockAreaOrder")
      },
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
      },
    },
    {
      label: "点検項目大項目",
      mode: "checklistCategory" as const,
      icon: Tags,
      onClick: () => {
        if (!checkAdminPermission()) return
        setMode("checklistCategory")
      },
    },
  ]

  return (
    <>
      <CommonModal
        open={true}
        onClose={onClose}
        title="設定"
        // ★ メニューの時だけ bottom、詳細に入ったら full！
        mobilePosition={mode === "menu" ? "bottom" : "full"}        
        maxWidth={
          mode === "maintenance" || mode === "deviceType" || mode === "ward"
            ? "max-w-[1000px]"
            : mode === "stock" || mode === "checklistCategory"
            ? "max-w-[600px]"
            : "max-w-[500px]"
        }

      >
        <div className="bg-slate-50 p-3 sm:p-5">
          {mode === "menu" && (
            <div className="space-y-3">
              <div>
                <div className="text-xs font-bold tracking-wide text-slate-700">設定項目</div>
                <p className="mt-0.5 text-[11px] text-slate-500">管理する項目を選択してください。</p>
              </div>

              {/* 明確なホバーアニメーション & アイコン反転 */}
              <div className="grid grid-cols-2 gap-2 sm:gap-2.5">
                {menuButtons.map(({ label, mode, icon: Icon, onClick }) => (
                  <button
                    key={label}
                    className="group flex h-12 sm:h-13 cursor-pointer items-center gap-2 rounded-lg border border-slate-200 bg-white px-2.5 sm:px-3 text-left shadow-2xs transition-all duration-150 hover:border-teal-400 hover:bg-teal-50/50 hover:shadow-sm active:scale-[0.98]"
                    onClick={() => {
                      if (onClick) onClick()
                      else if (mode) setMode(mode)
                    }}
                    aria-label={label}
                  >
                    <div className="flex h-7 w-7 sm:h-8 sm:w-8 shrink-0 items-center justify-center rounded-md bg-slate-100 text-slate-600 transition-colors duration-150 group-hover:bg-teal-600 group-hover:text-white">
                      <Icon className="h-3.5 w-3.5 sm:h-4 sm:w-4" strokeWidth={2} />
                    </div>
                    <span className="min-w-0 flex-1 truncate text-xs sm:text-[13px] font-bold text-slate-800 transition-colors duration-150 group-hover:text-teal-950">
                      {label}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {mode === "stock" && (
            <>
              <div className="mb-3">
                <button
                  onClick={() => setMode("menu")}
                  className="h-8 rounded-lg border border-slate-200 bg-slate-50 px-3 text-xs font-bold text-slate-700 transition-colors hover:bg-slate-100"
                >
                  ← 戻る
                </button>
              </div>
              <StockAreaSettingsModal stockAreas={stockAreas} setStockAreas={setStockAreas} />
            </>
          )}

          {mode === "ward" && (
            <>
              <div className="mb-3">
                <button
                  onClick={() => setMode("menu")}
                  className="h-8 rounded-lg border border-slate-200 bg-slate-50 px-3 text-xs font-bold text-slate-700 transition-colors hover:bg-slate-100"
                >
                  ← 戻る
                </button>
              </div>
              <WardAreaSettingsModal wards={wards} setWards={setWards} rooms={rooms} setRooms={setRooms} />
            </>
          )}

          {mode === "deviceType" && (
            <>
              <div className="mb-3">
                <button
                  onClick={() => setMode("menu")}
                  className="h-8 rounded-lg border border-slate-200 bg-slate-50 px-3 text-xs font-bold text-slate-700 transition-colors hover:bg-slate-100"
                >
                  ← 戻る
                </button>
              </div>
              <DeviceTypeSettingsModal deviceTypes={deviceTypes} setDeviceTypes={setDeviceTypes} deviceModels={deviceModels} setDeviceModels={setDeviceModels} />
            </>
          )}

          {mode === "maintenance" && (
            <>
              <div className="mb-3">
                <button
                  onClick={() => setMode("menu")}
                  className="h-8 rounded-lg border border-slate-200 bg-slate-50 px-3 text-xs font-bold text-slate-700 transition-colors hover:bg-slate-100"
                >
                  ← 戻る
                </button>
              </div>
              <MaintenanceSettingsModal maintenanceTypes={maintenanceTypes} setMaintenanceTypes={setMaintenanceTypes} deviceTypes={deviceTypes} deviceModels={deviceModels} />
            </>
          )}

          {mode === "infection" && (
            <>
              <div className="mb-3">
                <button
                  onClick={() => setMode("menu")}
                  className="h-8 rounded-lg border border-slate-200 bg-slate-50 px-3 text-xs font-bold text-slate-700 transition-colors hover:bg-slate-100"
                >
                  ← 戻る
                </button>
              </div>
              <InfectionSettingModal infectionTypes={infectionTypes} setInfectionTypes={setInfectionTypes} />
            </>
          )}

          {mode === "hospitalSetting" && (
            <>
              <div className="mb-3">
                <button
                  onClick={() => setMode("menu")}
                  className="h-8 rounded-lg border border-slate-200 bg-slate-50 px-3 text-xs font-bold text-slate-700 transition-colors hover:bg-slate-100"
                >
                  ← 戻る
                </button>
              </div>
              <HospitalSettingModal hospitalSettings={hospitalSettings} setHospitalSettings={setHospitalSettings} onClose={() => setMode("menu")} />
            </>
          )}

          {mode === "wardOrder" && (
            <>
              <div className="mb-3">
                <button
                  onClick={() => setMode("menu")}
                  className="h-8 rounded-lg border border-slate-200 bg-slate-50 px-3 text-xs font-bold text-slate-700 transition-colors hover:bg-slate-100"
                >
                  ← 戻る
                </button>
              </div>
              <WardOrderModal isOpen={true} onClose={() => setMode("menu")} wards={wards} setWards={setWards} />
            </>
          )}

          {mode === "stockAreaOrder" && (
            <>
              <div className="mb-3">
                <button
                  onClick={() => setMode("menu")}
                  className="h-8 rounded-lg border border-slate-200 bg-slate-50 px-3 text-xs font-bold text-slate-700 transition-colors hover:bg-slate-100"
                >
                  ← 戻る
                </button>
              </div>
              <StockAreaOrderModal isOpen={true} onClose={() => setMode("menu")} stockAreas={stockAreas} setStockAreas={setStockAreas} />
            </>
          )}

          {mode === "checklistType" && (
            <>
              <div className="mb-3">
                <button
                  onClick={() => setMode("menu")}
                  className="h-8 rounded-lg border border-slate-200 bg-slate-50 px-3 text-xs font-bold text-slate-700 transition-colors hover:bg-slate-100"
                >
                  ← 戻る
                </button>
              </div>
              <EditChecklistTypeModal inspectionTypes={inspectionTypes} setInspectionTypes={setInspectionTypes} />
            </>
          )}

          {mode === "checklistCategory" && (
            <>
              <div className="mb-3">
                <button
                  onClick={() => setMode("menu")}
                  className="h-8 rounded-lg border border-slate-200 bg-slate-50 px-3 text-xs font-bold text-slate-700 transition-colors hover:bg-slate-100"
                >
                  ← 戻る
                </button>
              </div>
              <EditChecklistItemCategoryModal inspectionItemCategories={inspectionItemCategories} setInspectionItemCategories={setInspectionItemCategories} onclose={() => setMode("menu")} />
            </>
          )}
        </div>
      </CommonModal>
      {inputModal.ModalElement}
    </>
  )
}