"use client"
import { Device } from "../types/deviceTypes"
import DeviceModal from "./modals/DeviceModal"
import SettingsModal from "./modals/SettingsModal"
import HistoryModal from "./modals/HistoryModal"
import DeviceListModal from "./modals/DeviceListModal"
import InviteCreateModal from "./modals/InviteCreateModal"
import ButtonGrid from "./ButtonGrid"
import { useState } from "react"
import {
  Plus,
  History,
  Settings,
  FileText,
  LogOut,
  UserPlus,
  TestTube
} from "lucide-react"
//テストボタン用
import { addDeviceFromApi } from "../api/devices/addDevices"


//supabase
import { supabase } from "../lib/supabase"

//page.tsxからaddDevice関数をpropsで受け取る
type Props = {
  deviceList: any[]
  addDevice: (device: any) => void
  deviceTypes: { id: number; name: string }[]
  deviceModels: { id: number; device_type_id: number; name: string }[]
  stockAreas: { id: number; name: string }[]
  wards: { wardId: number; wardName: string }[]
  rooms: { roomId: number; wardId: number; roomName: string ;patientName:string}[]
  addStockArea: (name: string) => Promise<void>
  renameStockArea: (id: number, newName: string) => Promise<boolean>
  deleteStockAreas: (ids: number[]) => Promise<boolean>
  addWard: (name: string) => Promise<void>
  renameWard: (id: number, newName: string) => Promise<boolean>
  deleteWards: (ids: number[]) => Promise<boolean>
  addRoom: (wardId: number, name: string) => Promise<void>
  renameRoom: (id: number, newName: string) => Promise<boolean>
  deleteRooms: (ids: number[]) => Promise<boolean>
  addDeviceType: (name: string) => Promise<void>
  renameDeviceType: (id: number, newName: string) => Promise<boolean>
  deleteDeviceTypes: (ids: number[]) => Promise<boolean>
  addDeviceModel: (deviceTypeId: number, name: string) => Promise<void>
  renameDeviceModel: (id: number, newName: string) => Promise<boolean>
  deleteDeviceModels: (ids: number[]) => Promise<boolean>
  maintenanceTypes: { id: number; name: string; device_type_id: number; device_model_id: number | null; interval_days: number }[]
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
                        ) => Promise<boolean>
  deleteMaintenanceTypes: (ids: number[]) => Promise<boolean>
  histories: any[]
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
}

export default function ButtonPanel({
  addDevice,
  deviceList,
  deviceTypes,
  deviceModels,
  stockAreas,
  wards,
  rooms,
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
  maintenanceTypes,
  addMaintenanceType,
  renameMaintenanceType,
  deleteMaintenanceTypes,
  histories,
  getWardDeviceList,
  getLatestMaintenanceTask,
  handleLogout,
  hospitalId,
  userId,
  userName,
  role
}: Props) {
  const [openDeviceModal, setOpenDeviceModal] = useState(false)
  const [openSettingsModal, setOpenSettingsModal] = useState(false)
  const [openHistoryModal, setOpenHistoryModal] = useState(false)
  const [openDeviceListModal, setOpenDeviceListModal] = useState(false)
  const [openInviteModal,setOpenInviteModal] = useState(false)

  const OpenModal = () => {
    setOpenDeviceModal(true)
  }
  const openSettings = () => {
    setOpenSettingsModal(true)
  }
  const openHistory = () => {
    setOpenHistoryModal(true)
  }
  const openDeviceList = () => {
    //機器一覧表のモーダルを開く処理
    setOpenDeviceListModal(true)
  }
  const openInvite = () => {
    setOpenInviteModal(true)
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
  const testAddDevice = async () => {

    const device: Omit<
                              Device,
                              "id"
                              > = {
                                  hospitalId: hospitalId,
                                  type: 1,
                                  model: 1,
                                  assetType: "資産",
                                  status: "stock"
                                  }

    const response = await addDeviceFromApi(device)

    console.log(`response exists: ${!!response}`)

    if (!response) {
      console.error("add device failed")
      return
    }

    console.log("response")

    for (const [key, value] of Object.entries(response)) {
      console.log(`・${key}: ${value}`)
    }
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
    {/* test用 */}
    <ButtonGrid
      onAdd={testAddDevice}
      title={"TEST"}
      titleSize="text-xs"
      icon={<TestTube size={38} />}
    />
    </div>

    {/* 下部固定エリア */}
    <div className="mt-auto pt-4 text-xs text-gray-600 border-t">
      <div>{userName}</div>
      <div>{role}</div>
    </div>

      {openDeviceModal &&
        <DeviceModal
          onCreate={addDevice}
          onClose={() => setOpenDeviceModal(false)}
          deviceTypes={deviceTypes}
          deviceModels={deviceModels}
          hospitalId={hospitalId}
        />
      }

      {openSettingsModal &&
        <SettingsModal
          onClose={() => setOpenSettingsModal(false)}
          stockAreas={stockAreas}
          deviceTypes={deviceTypes}
          deviceModels={deviceModels}
          wards={wards}
          rooms={rooms}
          addStockArea={addStockArea}
          renameStockArea={renameStockArea}
          deleteStockAreas={deleteStockAreas}
          addWard={addWard}
          renameWard={renameWard}
          deleteWards={deleteWards}
          addRoom={addRoom}
          renameRoom={renameRoom}
          deleteRooms={deleteRooms}
          addDeviceType={addDeviceType}
          renameDeviceType={renameDeviceType}
          deleteDeviceTypes={deleteDeviceTypes}
          addDeviceModel={addDeviceModel}
          renameDeviceModel={renameDeviceModel}
          deleteDeviceModels={deleteDeviceModels}
          addMaintenanceType={addMaintenanceType}
          renameMaintenanceType={renameMaintenanceType}
          deleteMaintenanceTypes={deleteMaintenanceTypes}
          maintenanceTypes={maintenanceTypes}
        />
      }
      {openHistoryModal &&
        <HistoryModal
          isOpen={openHistoryModal}
          onClose={() => setOpenHistoryModal(false)}
          histories={histories}
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
        />
      }

      {openInviteModal &&
        <InviteCreateModal
          currentUser={{
                        id: userId,
                        hospital_id: hospitalId
                      }}
          onClose={() => setOpenInviteModal(false)}
        />
      }

  </div>
  )
}