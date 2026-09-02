"use client"
import { useRouter } from "next/navigation"
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

import { fetchHospitalSettingsTransaction }from "../api/transactions/hospitalSettings/fetchHospitalSettingsTransaction"
//test用
import { testAddInspectionChecklistItemOptions } from "../api/inspection/inspectionChecklistItemOptions/testAddInspectionChecklistItemOptions"
import DeviceModal from "./modals/DeviceModal"
import SettingsModal from "./modals/SettingsModal"
import HistoryModal from "./modals/HistoryModal"
import DeviceListModal from "./modals/DeviceListModal"
import InviteCreateModal from "./modals/InviteCreateModal"
import AccountInfoModal from "./modals/AccountInfoModal"

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

  const OpenModal = () => {
    setOpenDeviceModal(true)
  }
  const openSettings = () => {
    setOpenSettingsModal(true)
  }
  const openHistory = async () => {
    setOpenHistoryModal(true)
    await fetchHistories()
  }
  const openDeviceList = () => {
    //機器一覧表のモーダルを開く処理
    setOpenDeviceListModal(true)
  }
  const openInvite = () => {
    setOpenInviteModal(true)
  }
 const openHospitalSettings = () => {
    setOpenHospitalSettingsModal(true)
}

  // inspection_checklist_item_options INSERTテスト
  const testInspectionChecklistItemOptions = async () => {
    try {
      const result = await testAddInspectionChecklistItemOptions()

      console.log("TEST OPTIONS INSERT:", result)
    } catch (error) {
      console.error("TEST OPTIONS INSERT ERROR:", error)
    }
  }


  //supabaseのsend-email関数呼び出しテスト
  const testEmail = async () => {
     const { data, error } =
      await supabase.functions.invoke(
        "resend-email",
        {
          body: {
            to: "naoyochism@icloud.com",
            subject: "テスト",
            html: "<h1>送信成功</h1>"
          }
        }
      )
    console.log(data)
    console.log(error)
  }


  return (
  <div className="flex flex-col h-full">
    <div>
      <ButtonGrid
        onAdd={OpenModal}
        title={"新規"}
        titleSize="text-xs"
        icon={<Plus size={38} />}
      />

      <div className="h-4" />

      <ButtonGrid
        onAdd={openHistory}
        title={"履歴"}
        titleSize="text-xs"
        icon={<History size={38} />}
      />

      <div className="h-4" />

      <ButtonGrid
        onAdd={openSettings}
        title={"設定"}
        titleSize="text-xs"
        icon={<Settings size={38} />}
      />

      <div className="h-4" />

      <ButtonGrid
        onAdd={openDeviceList}
        title={"一覧"}
        titleSize="text-xs"
        icon={<FileText size={38} />}
      />
       <div className="h-4" />

      <ButtonGrid
        onAdd={openInvite}
        title={"招待"}
        titleSize="text-xs"
        icon={<UserPlus size={38} />}
      />
      
    <div className="h-4" />
      <ButtonGrid
        onAdd={handleLogout}
        title={"終了"}
        titleSize="text-xs"
        icon={<LogOut size={38} />}
      />
      <div className="h-4" />

      <ButtonGrid
        onAdd={testInspectionChecklistItemOptions}
        title={"TEST"}
        titleSize="text-xs"
        icon={<TestTube size={38} />}
      />
  
  </div>

    {/* 下部固定エリア */}
    <div 
        onClick={() => setOpenAccountInfoModal(true)}
        className="mt-auto pt-4 text-xs text-gray-600 border-t"
    >
      <div>{userName}</div>
      <div>{role}</div>
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
  )
}