"use client"
import DeviceModal from "./DeviceModal"
import SettingsModal from "./SettingsModal"
import HistoryModal from "./HistoryModal"
import ButtonGrid from "./ButtonGrid"
import { useState } from "react"
//import { Device } from "../types/deviceTypes"

//page.tsxからaddDevice関数をpropsで受け取る
type Props = {
  addDevice: (device: any) => void
  deviceTypes: { id: number; name: string }[]
  deviceModels: { id: number; device_type_id: number; name: string }[]
  stockAreas: { id: number; name: string }[]
  wards: { id: number; name: string }[]
  rooms: { id: number; ward_id: number; name: string }[]
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
  ) => Promise<void>
  deleteMaintenanceTypes: (ids: number[]) => Promise<void>
  histories: any[]
}

export default function ButtonPanel({
  addDevice,
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
  histories

}: Props) {
  const [openDeviceModal, setOpenDeviceModal] = useState(false)
  const [openSettingsModal, setOpenSettingsModal] = useState(false)
  const [openHistoryModal, setOpenHistoryModal] = useState(false)



  const OpenModal = () => {
    setOpenDeviceModal(true)
  }
  const openSettings = () => {
    setOpenSettingsModal(true)
  }
  const openHistory = () => {
    setOpenHistoryModal(true)
  }

  return (
    <>
      <ButtonGrid onAdd={OpenModal} title={"新規登録"} />
      <div className="h-4" />
      <ButtonGrid onAdd={openHistory} title={"履歴"} />
      {/* 隙間を空ける */}
      <div className="h-4" />
      {openDeviceModal &&
        <DeviceModal
          onCreate={addDevice}
          onClose={() => setOpenDeviceModal(false)}
          deviceTypes={deviceTypes}
          deviceModels={deviceModels}
        />
      }
      <ButtonGrid onAdd={openSettings} title={"設定"} />
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
    </>
  )
}