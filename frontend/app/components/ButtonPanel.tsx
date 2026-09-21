"use client"

import { useRouter } from "next/navigation"
//type
import { StockAreaType } from "../types/stockTypes"
import { DeviceTypeType } from "../types/deviceTypeTypes"
import { DeviceModelType } from "../types/deviceModelTypes"
import { WardType } from "../types/wardTypes"
import {CurrentUser  } from "../types/userTypes"
import { RoomType } from "../types/roomTypes"
import {MaintenanceType } from "../types/maintenanceTypeTypes"
import { InfectionTypeType } from "../types/infectionTypeTypes"
import { Device,  StockLastUpdatedResponse,WardLastUpdatedResponse,} from "../types/deviceTypes"
import { HospitalSettingsType } from "../types/hospitalSettingTypes"
import { InspectionType } from "../types/inspectionTypes/inspectionTypeTypes"
import {InspectionItemCategoryType} from "../types/inspectionTypes/inspectionItemCategoryTypes"
//処理中表示
import { LoadingOverlay } from "../components/common/LoadingOverlay"
import { executeWithErrorAndLoading } from "../components/common/executeWithErrorAndLoading"

//test用
import { testAddInspectionChecklistItemOptions } from "../api/inspection/inspectionChecklistItemOptions/testAddInspectionChecklistItemOptions"
//modal
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
import { useState } from "react"
import {
  Plus,
  History,
  Settings,
  FileText,
  LogOut,
  UserPlus,
  ClipboardCheck,
  TestTube,
  Shield,
  ChevronLeft,
  ChevronRight,

} from "lucide-react"
//テストボタン用


//supabase
import { supabase } from "../lib/supabase"

//page.tsxからaddDevice関数をpropsで受け取る
type Props = {
  currentUser:CurrentUser
  deviceList:  Device[]
  setDeviceList: React.Dispatch<
                  React.SetStateAction<any[]>
                >  
  deviceTypes: DeviceTypeType[]
  setDeviceTypes: React.Dispatch<React.SetStateAction<any[]>>
  deviceModels: DeviceModelType[]
  setDeviceModels: React.Dispatch<React.SetStateAction<any[]>>
  stockAreas: StockAreaType[]
  setStockAreas: React.Dispatch<React.SetStateAction<any[]>>
  wards:WardType[]
  setWards:React.Dispatch<React.SetStateAction<any[]>>
  rooms: RoomType[]
  setRooms:React.Dispatch<React.SetStateAction<any[]>>
  maintenanceTypes: MaintenanceType[]
  setMaintenanceTypes:React.Dispatch<React.SetStateAction<any[]>>
  histories: any[]
  fetchHistories: () => Promise<void>
  getWardDeviceList: () => any[]
  getLatestMaintenanceTask:(deviceId?: number) => {
                                                    name: string
                                                    due_at: string
                                                  } | null
  handleLogout: () => Promise<void>
  hospitalId:string
  userId:string
  userName: string
  role: string
  email: string
  hospitalName: string
  infectionTypes:InfectionTypeType[]
  setInfectionTypes:React.Dispatch<React.SetStateAction<any[]>>
  setStockLastUpdated: React.Dispatch<React.SetStateAction<StockLastUpdatedResponse>>
  setWardLastUpdated: React.Dispatch<React.SetStateAction<WardLastUpdatedResponse>>
  hospitalSettings: HospitalSettingsType | null
  setHospitalSettings: React.Dispatch<React.SetStateAction<HospitalSettingsType | null>>
  inspectionTypes: InspectionType[]
  setInspectionTypes: React.Dispatch<React.SetStateAction<InspectionType[]>>
  inspectionItemCategories:InspectionItemCategoryType[]
  setInspectionItemCategories : React.Dispatch<React.SetStateAction<InspectionItemCategoryType[]>>   

}


export default function ButtonPanel({
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
  const [openInviteModal,setOpenInviteModal] = useState(false)
  const [openAccountInfoModal, setOpenAccountInfoModal] = useState(false)
  const [openHospitalSettingsModal, setOpenHospitalSettingsModal] = useState(false)
  const [openInspectionResultModal, setOpenInspectionResultModal]= useState(false)
  const [inspectionResultsLoading, setInspectionResultsLoading] =useState(false)
  const [inspections, setInspections] =useState<Inspection[]>([])
  //button panel
  const [isPanelOpen, setIsPanelOpen] = useState(false)

  const checkAdminPermission = () => {
                      if (currentUser.role !== "admin") {
                          alert("権限がありません")
                          return false
                      }
                      return true
  }


  const OpenModal = () => {
                            if (!checkAdminPermission()) return
                            setOpenDeviceModal(true)}
  const openSettings = () => {
                            if (!checkAdminPermission()) return
                             setOpenSettingsModal(true)}
  const openHistory = async () => {
                            setOpenHistoryModal(true)
                            await fetchHistories()}
  const openDeviceList = () => {setOpenDeviceListModal(true)}

  const openInvite = () => {
                            if (!checkAdminPermission()) return
                            setOpenInviteModal(true)}  
  const openHospitalSettings = () => {
                            if (!checkAdminPermission()) return
                            setOpenHospitalSettingsModal(true)}

      //処理中表示用
  const [loading, setLoading] = useState(false)

//点検結果ボタン処理内容
  const openInspectionResult = async () => {
      setOpenInspectionResultModal(true)

      try {
          await executeWithErrorAndLoading({
            setLoading,
            action: async () => {
              const data =await getInspectionsFromApi()
              const normalizedInspections =data.map(normalizeInspection)
              setInspections(normalizedInspections)
              }
          })
      } catch (error) {
          console.error("failed to fetch inspections:",error)
          alert("点検結果の取得に失敗しました")
          setOpenInspectionResultModal(false)
      } 
  }


  return (
    <>
<div
  className="relative h-full"
  onMouseEnter={() => setIsPanelOpen(true)}
  onMouseLeave={() => setIsPanelOpen(false)}
>
  {/* 右端の開閉ボタン */}
  <button
    type="button"
    onClick={() => setIsPanelOpen(prev => !prev)}
    className="
      absolute
      right-0
      top-1/2
      -translate-y-1/2

      w-7
      h-20

      flex
      items-center
      justify-center

      rounded-l-xl

      bg-white
      border
      border-r-0
      border-gray-300

      shadow-md

      text-gray-500

      hover:bg-gray-50
      hover:text-gray-700

      transition-all
      duration-200

      z-30
    "
    aria-label="メニューを開閉"
  >
    {isPanelOpen ? (
      <ChevronRight size={20} />
    ) : (
      <ChevronLeft size={20} />
    )}
  </button>


  {/* メニューパネル */}
  <div
    className={`
      absolute
      top-0
      right-0

      h-full
      w-[110px]

      bg-gray-50
      border-l
      border-gray-300
      shadow-2xl

      px-2
      py-4

      overflow-y-auto

      transition-transform
      duration-300
      ease-out

      ${
        isPanelOpen
          ? "translate-x-0"
          : "translate-x-full"
      }
    `}
  >

    <div className="flex flex-col">

      <ButtonGrid
        onAdd={() => {
          setIsPanelOpen(false)
          OpenModal()
        }}
        title="新規"
        titleSize="text-xs"
        icon={<Plus size={38} />}
      />

      <div className="h-4" />

      <ButtonGrid
        onAdd={() => {
          setIsPanelOpen(false)
          openHistory()
        }}
        title="履歴"
        titleSize="text-xs"
        icon={<History size={38} />}
      />

      <div className="h-4" />

      <ButtonGrid
        onAdd={() => {
          setIsPanelOpen(false)
          openSettings()
        }}
        title="設定"
        titleSize="text-xs"
        icon={<Settings size={38} />}
      />

      <div className="h-4" />

      <ButtonGrid
        onAdd={() => {
          setIsPanelOpen(false)
          openDeviceList()
        }}
        title="一覧"
        titleSize="text-xs"
        icon={<FileText size={38} />}
      />

      <div className="h-4" />

      <ButtonGrid
        onAdd={() => {
          setIsPanelOpen(false)
          openInspectionResult()
        }}
        title="点検結果"
        titleSize="text-xs"
        icon={<ClipboardCheck size={38} />}
      />

      <div className="h-4" />

      <ButtonGrid
        onAdd={() => {
          setIsPanelOpen(false)
          openInvite()
        }}
        title="招待"
        titleSize="text-xs"
        icon={<UserPlus size={38} />}
      />

      <div className="h-4" />

      <ButtonGrid
        onAdd={() => {
          setIsPanelOpen(false)
          handleLogout()
        }}
        title="終了"
        titleSize="text-xs"
        icon={<LogOut size={38} />}
      />

    </div>


    {/* アカウント情報 */}
    <div
      onClick={() => {
        setIsPanelOpen(false)
        setOpenAccountInfoModal(true)
      }}
      className="
        mt-4
        pt-4
        text-xs
        text-gray-600
        border-t
        cursor-pointer
      "
    >
      <div>{userName}</div>
      <div>{role}</div>
    </div>

  </div>




      {openDeviceModal &&
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
      }

      {openSettingsModal &&
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
      }
      {openHistoryModal &&
        <HistoryModal
          isOpen={openHistoryModal}
          onClose={() => setOpenHistoryModal(false)}
          histories={histories}
          hospitalSettings={hospitalSettings}
        />
      }
      {openDeviceListModal &&
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
      }

      {openInspectionResultModal && (
          <InspectionResultModal
              isOpen={openInspectionResultModal}
              onClose={() =>setOpenInspectionResultModal(false)}
              hospitalSettings={hospitalSettings}
          />
      )}

      {openInviteModal &&
        <InviteCreateModal

          onClose={() => setOpenInviteModal(false)}
        />
      }

<AccountInfoModal
    isOpen={openAccountInfoModal}
    onClose={() => setOpenAccountInfoModal(false)}
    userName={userName}
    role={role}
    hospitalName={hospitalName}
    email={email}
    userId={userId}
/>
  </div>
{/* 処理中表示 */}
<LoadingOverlay loading={loading} />

</>


  )
}