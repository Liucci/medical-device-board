"use client"
import { memo, useState } from "react"
import { useRouter } from "next/navigation"
import { Plus, History, Settings, FileText, LogOut, UserPlus, UserCircle, ClipboardCheck, ChevronLeft, ChevronRight, Menu, X } from "lucide-react"
import { StockAreaType } from "../types/stockTypes"
import { DeviceTypeType } from "../types/deviceTypeTypes"
import { DeviceModelType } from "../types/deviceModelTypes"
import { WardType } from "../types/wardTypes"
import { CurrentUser } from "../types/userTypes"
import { RoomType } from "../types/roomTypes"
import { MaintenanceType } from "../types/maintenanceTypeTypes"
import { InfectionTypeType } from "../types/infectionTypeTypes"
import { Device, StockLastUpdatedResponse, WardLastUpdatedResponse } from "../types/deviceTypes"
import { HospitalSettingsType } from "../types/hospitalSettingTypes"
import { InspectionType } from "../types/inspectionTypes/inspectionTypeTypes"
import { InspectionItemCategoryType } from "../types/inspectionTypes/inspectionItemCategoryTypes"
import { LoadingOverlay } from "../components/common/LoadingOverlay"
import { executeWithErrorAndLoading } from "../components/common/executeWithErrorAndLoading"
import DeviceModal from "./modals/DeviceModal"
import SettingsModal from "./modals/SettingsModal"
import HistoryModal from "./modals/HistoryModal"
import DeviceListModal from "./modals/DeviceListModal"
import InviteCreateModal from "./modals/InviteCreateModal"
import AccountInfoModal from "./modals/AccountInfoModal"
import InspectionResultModal from "../components/modals/inspection/InspectionResultListModal"
import type { Inspection } from "../types/inspectionTypes/inspectionTypes"
import { getInspectionsFromApi } from "../api/inspection/inspections/fetchInspections"
import { normalizeInspection } from "../mapper/inspectionMapper/inspectionMapper"
import ButtonGrid from "./ButtonGrid"

type Props = {
  currentUser: CurrentUser
  deviceList: Device[]
  setDeviceList: React.Dispatch<React.SetStateAction<any[]>>
  deviceTypes: DeviceTypeType[]
  setDeviceTypes: React.Dispatch<React.SetStateAction<any[]>>
  deviceModels: DeviceModelType[]
  setDeviceModels: React.Dispatch<React.SetStateAction<any[]>>
  stockAreas: StockAreaType[]
  setStockAreas: React.Dispatch<React.SetStateAction<any[]>>
  wards: WardType[]
  setWards: React.Dispatch<React.SetStateAction<any[]>>
  rooms: RoomType[]
  setRooms: React.Dispatch<React.SetStateAction<any[]>>
  maintenanceTypes: MaintenanceType[]
  setMaintenanceTypes: React.Dispatch<React.SetStateAction<any[]>>
  histories: any[]
  fetchHistories: () => Promise<void>
  getWardDeviceList: () => any[]
  getLatestMaintenanceTask: (deviceId?: number) => { name: string; due_at: string } | null
  handleLogout: () => Promise<void>
  hospitalId: string
  userId: string
  userName: string
  role: string
  email: string
  hospitalName: string
  infectionTypes: InfectionTypeType[]
  setInfectionTypes: React.Dispatch<React.SetStateAction<any[]>>
  setStockLastUpdated: React.Dispatch<React.SetStateAction<StockLastUpdatedResponse>>
  setWardLastUpdated: React.Dispatch<React.SetStateAction<WardLastUpdatedResponse>>
  hospitalSettings: HospitalSettingsType | null
  setHospitalSettings: React.Dispatch<React.SetStateAction<HospitalSettingsType | null>>
  inspectionTypes: InspectionType[]
  setInspectionTypes: React.Dispatch<React.SetStateAction<InspectionType[]>>
  inspectionItemCategories: InspectionItemCategoryType[]
  setInspectionItemCategories: React.Dispatch<React.SetStateAction<InspectionItemCategoryType[]>>
}

function ButtonPanel({
  currentUser,
  deviceList,
  setDeviceList,
  deviceTypes,
  setDeviceTypes,
  deviceModels,
  setDeviceModels,
  stockAreas,
  setStockAreas,
  wards,
  setWards,
  rooms,
  setRooms,
  maintenanceTypes,
  setMaintenanceTypes,
  histories,
  fetchHistories,
  getWardDeviceList,
  getLatestMaintenanceTask,
  handleLogout,
  hospitalId,
  userId,
  userName,
  role,
  email,
  hospitalName,
  infectionTypes,
  setInfectionTypes,
  setStockLastUpdated,
  setWardLastUpdated,
  hospitalSettings,
  setHospitalSettings,
  inspectionTypes,
  setInspectionTypes,
  inspectionItemCategories,
  setInspectionItemCategories,
}: Props) {
  const router = useRouter()
  const [openDeviceModal, setOpenDeviceModal] = useState(false)
  const [openSettingsModal, setOpenSettingsModal] = useState(false)
  const [openHistoryModal, setOpenHistoryModal] = useState(false)
  const [openDeviceListModal, setOpenDeviceListModal] = useState(false)
  const [openInviteModal, setOpenInviteModal] = useState(false)
  const [openAccountInfoModal, setOpenAccountInfoModal] = useState(false)
  const [openHospitalSettingsModal, setOpenHospitalSettingsModal] = useState(false)
  const [openInspectionResultModal, setOpenInspectionResultModal] = useState(false)
  const [inspections, setInspections] = useState<Inspection[]>([])
  const [isPanelOpen, setIsPanelOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const checkAdminPermission = () => {
    if (currentUser.role !== "admin") {
      alert("権限がありません")
      return false
    }
    return true
  }

  const OpenModal = () => {
    if (!checkAdminPermission()) return
    setOpenDeviceModal(true)
  }

  const openSettings = () => {
    if (!checkAdminPermission()) return
    setOpenSettingsModal(true)
  }

  const openHistory = async () => {
    setOpenHistoryModal(true)
    await fetchHistories()
  }

  const openDeviceList = () => {
    setOpenDeviceListModal(true)
  }

  const openInvite = () => {
    if (!checkAdminPermission()) return
    setOpenInviteModal(true)
  }

  const openInspectionResult = async () => {
    setOpenInspectionResultModal(true)
    try {
      await executeWithErrorAndLoading({
        setLoading,
        action: async () => {
          const data = await getInspectionsFromApi()
          setInspections(data.map(normalizeInspection))
        },
      })
    } catch (error) {
      console.error("failed to fetch inspections:", error)
      alert("点検結果の取得に失敗しました")
      setOpenInspectionResultModal(false)
    }
  }

  return (
    <>
      {/* ========================================================= */}
      {/* 1. デスクトップ用スリムパネル (md以上でのみ表示・幅80px) */}
      {/* ⭕ onMouseEnter / onMouseLeave の振動ループを削除し、クリック開閉に一本化 */}
      {/* ========================================================= */}
      <div className="hidden md:block relative h-full">
        {/* 開閉トグルツマミボタン */}
        <button
          type="button"
          onClick={() => setIsPanelOpen(prev => !prev)}
          className={`group absolute top-1/2 -translate-y-1/2 flex h-11 w-5 cursor-pointer items-center justify-center rounded-l-md border border-r-0 border-slate-200 bg-white text-slate-500 shadow-md transition-all duration-300 hover:border-teal-400 hover:bg-teal-50 hover:text-teal-700 z-30 ${
            isPanelOpen ? "right-[80px]" : "right-0"
          }`}
          aria-label="メニューを開閉"
          title={isPanelOpen ? "メニューを閉じる" : "メニューを開く"}
        >
          {isPanelOpen ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>

        {/* スライドメニュー本体 */}
        <div
          className={`absolute right-0 top-0 h-full w-[80px] overflow-y-auto border-l border-slate-200 bg-slate-50 px-1.5 py-2.5 shadow-xl transition-transform duration-300 ease-out z-20 ${
            isPanelOpen ? "translate-x-0" : "translate-x-full pointer-events-none"
          }`}
        >
          <div className="flex flex-col gap-1">
            <ButtonGrid onAdd={() => { setIsPanelOpen(false); OpenModal() }} title="新規" icon={<Plus size={13} />} />
            <ButtonGrid onAdd={() => { setIsPanelOpen(false); openHistory() }} title="履歴" icon={<History size={13} />} />
            <ButtonGrid onAdd={() => { setIsPanelOpen(false); openSettings() }} title="設定" icon={<Settings size={13} />} />
            <ButtonGrid onAdd={() => { setIsPanelOpen(false); openDeviceList() }} title="一覧" icon={<FileText size={13} />} />
            <ButtonGrid onAdd={() => { setIsPanelOpen(false); openInspectionResult() }} title="点検結果" icon={<ClipboardCheck size={13} />} />
            <ButtonGrid onAdd={() => { setIsPanelOpen(false); openInvite() }} title="招待" icon={<UserPlus size={13} />} />
            <ButtonGrid onAdd={() => { setIsPanelOpen(false); handleLogout() }} title="終了" icon={<LogOut size={13} />} />
          </div>

          <div className="mt-2 border-t border-slate-200 pt-2">
            <ButtonGrid onAdd={() => { setIsPanelOpen(false); setOpenAccountInfoModal(true) }} title="アカウント" icon={<UserCircle size={13} />} />
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 2. モバイル用フローティング・ハンバーガーボタン (md未満) */}
      {/* ========================================================= */}
      <button
        type="button"
        onClick={() => setIsMobileMenuOpen(true)}
        className="fixed bottom-4 right-4 z-40 flex h-11 w-11 md:hidden cursor-pointer items-center justify-center rounded-full bg-teal-700 text-white shadow-lg active:scale-95 transition-all hover:bg-teal-800"
        aria-label="メニューを開く"
      >
        <Menu size={20} />
      </button>

      {/* ========================================================= */}
      {/* 3. モバイル用ボトムシート型メニューモーダル (md未満) */}
      {/* ========================================================= */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/60 backdrop-blur-2xs p-0 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <div
            className="w-full rounded-t-2xl border-t border-slate-200 bg-white p-4 shadow-2xl animate-in slide-in-from-bottom duration-200 pb-[max(1.25rem,env(safe-area-inset-bottom))]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-slate-300" />
            <div className="mb-3 flex items-center justify-between border-b border-slate-100 pb-2">
              <span className="text-xs font-bold text-slate-700">メニュー</span>
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(false)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              >
                <X size={18} />
              </button>
            </div>

            <div className="grid grid-cols-4 gap-1.5">
              <ButtonGrid onAdd={() => { setIsMobileMenuOpen(false); OpenModal() }} title="新規" icon={<Plus size={14} />} />
              <ButtonGrid onAdd={() => { setIsMobileMenuOpen(false); openHistory() }} title="履歴" icon={<History size={14} />} />
              <ButtonGrid onAdd={() => { setIsMobileMenuOpen(false); openSettings() }} title="設定" icon={<Settings size={14} />} />
              <ButtonGrid onAdd={() => { setIsMobileMenuOpen(false); openDeviceList() }} title="一覧" icon={<FileText size={14} />} />
              <ButtonGrid onAdd={() => { setIsMobileMenuOpen(false); openInspectionResult() }} title="点検結果" icon={<ClipboardCheck size={14} />} />
              <ButtonGrid onAdd={() => { setIsMobileMenuOpen(false); openInvite() }} title="招待" icon={<UserPlus size={14} />} />
              <ButtonGrid onAdd={() => { setIsMobileMenuOpen(false); handleLogout() }} title="終了" icon={<LogOut size={14} />} />
              <ButtonGrid onAdd={() => { setIsMobileMenuOpen(false); setOpenAccountInfoModal(true) }} title="アカウント" icon={<UserCircle size={14} />} />
            </div>
          </div>
        </div>
      )}

      {/* 各種モーダル */}
      {openDeviceModal && (
        <DeviceModal
          deviceList={deviceList}
          setDeviceList={setDeviceList}
          onClose={() => setOpenDeviceModal(false)}
          deviceTypes={deviceTypes}
          deviceModels={deviceModels}
          stockAreas={stockAreas}
          hospitalId={hospitalId}
          setStockLastUpdated={setStockLastUpdated}
          setWardLastUpdated={setWardLastUpdated}
        />
      )}

      {openSettingsModal && (
        <SettingsModal
          currentUser={currentUser}
          onClose={() => setOpenSettingsModal(false)}
          stockAreas={stockAreas}
          setStockAreas={setStockAreas}
          deviceTypes={deviceTypes}
          setDeviceTypes={setDeviceTypes}
          deviceModels={deviceModels}
          setDeviceModels={setDeviceModels}
          wards={wards}
          setWards={setWards}
          rooms={rooms}
          setRooms={setRooms}
          maintenanceTypes={maintenanceTypes}
          setMaintenanceTypes={setMaintenanceTypes}
          infectionTypes={infectionTypes}
          setInfectionTypes={setInfectionTypes}
          hospitalSettings={hospitalSettings}
          setHospitalSettings={setHospitalSettings}
          inspectionTypes={inspectionTypes}
          setInspectionTypes={setInspectionTypes}
          inspectionItemCategories={inspectionItemCategories}
          setInspectionItemCategories={setInspectionItemCategories}
        />
      )}

      {openHistoryModal && (
        <HistoryModal
          isOpen={openHistoryModal}
          onClose={() => setOpenHistoryModal(false)}
          histories={histories}
          hospitalSettings={hospitalSettings}
        />
      )}

      {openDeviceListModal && (
        <DeviceListModal
          isOpen={openDeviceListModal}
          onClose={() => setOpenDeviceListModal(false)}
          rooms={rooms}
          wards={wards}
          stockAreas={stockAreas}
          deviceTypes={deviceTypes}
          deviceModels={deviceModels}
          deviceList={deviceList}
          getLatestMaintenanceTask={getLatestMaintenanceTask}
          hospitalSettings={hospitalSettings}
        />
      )}

      {openInspectionResultModal && (
        <InspectionResultModal
          isOpen={openInspectionResultModal}
          onClose={() => setOpenInspectionResultModal(false)}
          hospitalSettings={hospitalSettings}
        />
      )}

      {openInviteModal && <InviteCreateModal onClose={() => setOpenInviteModal(false)} />}

      <AccountInfoModal
        isOpen={openAccountInfoModal}
        onClose={() => setOpenAccountInfoModal(false)}
        userName={userName}
        role={role}
        hospitalName={hospitalName}
        email={email}
      />

      <LoadingOverlay loading={loading} />
    </>
  )
}

export default memo(ButtonPanel, (prev, next) => {
  return (
    prev.deviceList === next.deviceList &&
    prev.wards === next.wards &&
    prev.rooms === next.rooms &&
    prev.stockAreas === next.stockAreas &&
    prev.deviceTypes === next.deviceTypes &&
    prev.deviceModels === next.deviceModels &&
    prev.maintenanceTypes === next.maintenanceTypes &&
    prev.histories === next.histories &&
    prev.infectionTypes === next.infectionTypes &&
    prev.hospitalSettings === next.hospitalSettings &&
    prev.inspectionTypes === next.inspectionTypes &&
    prev.inspectionItemCategories === next.inspectionItemCategories
  )
})