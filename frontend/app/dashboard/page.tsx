"use client"
import { API_BASE_URL } from "../api/client"

import styles from "../page.module.css"
import StockAreas from "../components/StockArea"
import WardArea from "../components/WardArea"
import ButtonPanel from "../components/ButtonPanel"
import DragLayer from "../components/DragLayer"
import RoomModal from "../components/modals/RoomModal"
import RoomToRoomModal from "../components/modals/RoomToRoomModal"
import StockInfoModal from "../components/modals/StockInfoModal"
import RoomDeviceInfoModal from "../components/modals/RoomDeviceInfoModal"
import LowStockPanel from "../components/LowStockPanel"
import { Device,  StockLastUpdatedResponse,WardLastUpdatedResponse,} from "../types/deviceTypes"
import { useEffect, useState,useRef } from "react"
import { normalizeDevice,toDBDevice} from "../utils/deviceMapper"
import { normalizeRoom } from "../utils/roomsMapper"
import { normalizeWard } from "../utils/wardsMapper"
import { normalizeStockArea } from "../utils/stockAreaMapper"
import { normalizeDeviceType } from "../utils/deviceTypeMapper"
import { normalizeDeviceModel } from "../utils/deviceModelMapper"
import { normalizeHistory } from "../utils/historyMapper"
import { normalizeMaintenanceType } from "../utils/maintenanceTypeMapper"
import { normalizeMaintenanceTask } from "../utils/taskMapper"
import { normalizeInfectionType} from "../utils/infectionTypeMapper"
import { normalizeRoomInfection} from "../utils/roomInfectionMapper"



//login logoutのためのlogin中user情報取得
import { useRouter } from "next/navigation"
import { useAuth }from "../contexts/AuthContext"

//supabase
import { supabase } from "../lib/supabase"

//FASTAPI移行用
import {getDevicesFromApi} from "../api/devices/fetchDevices"
import {moveStockToRoomTransaction} from "../api/transactions/devices/moveStockToRoomTransaction"
import {moveStockToStockTransaction} from "../api/transactions/devices/moveStockToStockTransaction"
import {moveRoomToStockTransaction} from "../api/transactions/devices/moveRoomToStockTransaction"
import {moveRoomToRoomTransaction} from "../api/transactions/devices/moveRoomToRoomTransaction"
import {moveRoomToRoomNewPatientTransaction} from "../api/transactions/devices/moveRoomToRoomNewPatientTransaction"

import {getStockAreasFromApi} from "../api/stockAreas/fetchStockAreas"
import {getWardsFromApi} from "../api/wards/fetchWards"
import {getRoomsFromApi} from "../api/rooms/fetchRooms"
import {getDeviceTypesFromApi} from "../api/deviceTypes/fetchDeviceTypes"
import {getTasksFromApi} from "../api/tasks/fetchTasks"
import {getMaintenanceTypesFromApi} from "../api/maintenanceTypes/fetchMaintenanceTypes"
import {getHistoriesFromApi} from "../api/histories/fetchHistories"
import { fetchInitDashboard } from "../api/transactions/fetchInitDashboard"
import { fetchStockLastUpdated } from "../api/devices/fetchStockLastUpdated"
import { fetchWardLastUpdated } from "../api/devices/fetchWardLastUpdated"

import { deleteDeviceTransaction } from "../api/transactions/devices/deleteDeviceTransaction"
import { updateManagementNumber } from "../api/transactions/devices/updateManagementNumber"
import { updateSerialNumber } from "../api/transactions/devices/updateSerialNumber"
import { updateNote } from "../api/transactions/devices/updateNote"
import { updateRentalDates } from "../api/transactions/devices/updateRentalDates"
import { updateMaintenanceDatesTransaction } from "../api/transactions/devices/updateMaintenanceDatesTransaction"
import {startStandby} from "../api/transactions/devices/startStandby"
import {finishStandby} from "../api/transactions/devices/finishStandby"
import { startMaintenance } from "../api/transactions/devices/startMaintenance"
import { finishMaintenance } from "../api/transactions/devices/finishMaintenance"
import { updateRoomPatientName } from "../api/transactions/rooms/updateRoomPatientName"
import { updateWardTransaction }from "../api/transactions/wards/updateWardTransaction"
import { createDeviceTypeTransaction } from "../api/transactions/deviceTypes/createDeviceTypeTransaction"
import { completeMaintenanceTaskTransaction}from "../api/transactions/tasks/completeMaintenanceTaskTransaction"
import { updateMaintenanceTaskDueAtTransaction } from "../api/transactions/tasks/updateMaintenanceTaskDueAtTransaction"
import { cancelMaintenanceTaskTransaction } from "../api/transactions/tasks/cancelMaintenanceTaskTransaction"
import { CompleteMaintenanceTask } from "../types/taskTypes"
import {UpdateMaintenanceTaskDueAt,CancelMaintenanceTask} from "../types/taskTypes"
//infection系
import { getInfectionTypesFromApi } from "../api/infectionTypes/fetchInfectionTypes"
import { getRoomInfectionsFromApi } from "../api/roomInfections/fetchRoomInfections"

import { createInfectionTypeTransaction } from "../api/transactions/infectionTypes/createInfectionTypeTransaction"
import { updateInfectionTypeTransaction } from "../api/transactions/infectionTypes/updateInfectionTypeTransaction"
import { deleteInfectionTypesTransaction } from "../api/transactions/infectionTypes/deleteInfectionTypesTransaction"

import { createRoomInfectionTransaction } from "../api/transactions/roomInfections/createRoomInfectionTransaction"
import { deleteRoomInfectionsTransaction } from "../api/transactions/roomInfections/deleteRoomInfectionsTransaction"


//drag系
import { useDrag } from "../drag/useDrag"
import { autoScroll, isInside } from "../drag/autoScroll"
import { getDropTarget } from "../drag/drop"
import {
          createLongPressState,
          startLongPress,
          finishLongPress,
          cancelLongPress,
        } from "../drag/longPress"

export default function Page() {
  //DBのdevice tableから機器の情報を取得し、deviceListに格納するstate
  const [deviceList, setDeviceList] = useState<any[]>([])
  //DBから各tableを取得するためのstate
  const [stockAreas, setStockAreas] = useState<any[]>([])
  const [wards, setWards] = useState<any[]>([])
  const [rooms, setRooms] = useState<any[]>([])
  const [deviceTypes, setDeviceTypes] = useState<any[]>([])
  const [deviceModels, setDeviceModels] = useState<any[]>([])
  const [histories, setHistories] = useState<any[]>([])
  const [infectionTypes, setInfectionTypes] = useState<any[]>([])
  const [roomInfections, setRoomInfections] = useState<any[]>([])


  // 管理番号とシリアル番号の状態
  const [managementNumber, setManagementNumber] = useState<string | undefined>(undefined)
  const [serialNumber, setSerialNumber] = useState<string | undefined>(undefined)

  const [stockLastUpdated, setStockLastUpdated] = useState<StockLastUpdatedResponse>({
                                                                    updatedAt: null,
                                                                  })

const [wardLastUpdated, setWardLastUpdated] = useState<WardLastUpdatedResponse>({
                                                                            updatedAt: null,
                                                                          })

  // const [draggingDevice, setDraggingDevice] = useState<Device | null>(null)
  // const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  // const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  //病室の情報を管理するstate,初期値はinitialRoomsから
  //const [rooms, setRooms] = useState<Room[]>(initialRooms)  
  //roomModalを開くためのstate
  const [roomModalOpen, setRoomModalOpen] = useState(false)
  const [roomToRoomModalOpen,setRoomToRoomModalOpen] = useState(false)

  //StockInfoModal,RoomDeviceInfoModalを開くためのstate
  const [stockInfoModalOpen, setStockInfoModalOpen] = useState(false)
  const [roomDeviceInfoModalOpen, setRoomDeviceInfoModalOpen] = useState(false)
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null)
  const [selectedRoomDevice, setSelectedRoomDevice] = useState<Device | null>(null)
  //どのデバイスをどの病棟に落としたかを保存するstate
  const [pendingDevice, setPendingDevice] = useState<Device | null>(null)
  const [targetWardId, setTargetWardId] = useState<number | null>(null)

  //メンテナンス関連を管理するstate
  const [tasks, setTasks] = useState<any[]>([])
  const [maintenanceTypes, setMaintenanceTypes] = useState<any[]>([])
  //StockAreaとWardAreaの仕切りをドラッグするためのstate
  const [split, setSplit] = useState(0.65) // 上の割合
  const [isResizing, setIsResizing] = useState(false)
  const resizeLongPress = useRef(createLongPressState())

  //auto scroll用にStockArea / WardArea のDOMをrefで取得
  const wardRef = useRef<HTMLDivElement | null>(null)
  const stockRef = useRef<HTMLDivElement | null>(null)
  const wardScrollRef = useRef<HTMLDivElement | null>(null)
  const stockScrollRef = useRef<HTMLDivElement | null>(null)
  //drag開始のフラグ用
  //const isDraggingRef = useRef(false)

  //機器アイコンのサイズを管理するstate
  const [wardCellSize, setWardCellSize] =useState(80)
  const [stockCellSize, setStockCellSize] =useState(80)
  
  //user情報を格納する関数
  const router = useRouter()
  const {currentUser,setCurrentUser} = useAuth()

  const {
        draggingDevice,
        setDraggingDevice,
        isDragging,
        setIsDragging,
        mousePos,
        setMousePos,
        dragOffset,
        setDragOffset,
        startDrag,
        updateMousePos,
        endDrag,
                      } = useDrag()

    // ドラッグ中の処理
  const handleMouseMove = (e: React.PointerEvent) => {
    // ✅ リサイズ優先
    //isResizingがtrueでdraggingDeviceがnullの場合は、splitを更新する
    if (isResizing && !draggingDevice) {
      const newSplit = e.clientY / window.innerHeight
    // splitは0.2から0.8の範囲で更新する
      if (newSplit > 0.1 && newSplit < 0.9) {
        setSplit(newSplit)
      }
      return
    }    
    
    //draggingDeviceがnullの場合は何もしない
    if (!draggingDevice) return
    //DragLayerのマウス位置情報のMousePosを更新する
      updateMousePos(
                      e.clientX,
                      e.clientY
                    )    

// 👇 追加：自動スクロール
    if (wardRef.current && isInside(e, wardRef.current)) {
      autoScroll(wardRef.current,e.clientX,e.clientY)
    }
  const wardContainer = wardScrollRef.current
  if (wardContainer && isInside(e, wardContainer))
        {
        autoScroll(
                    wardContainer,
                    e.clientX,
                    e.clientY
                  )
        }

    
  const stockContainer = stockScrollRef.current
  if (stockContainer && isInside(e, stockContainer))
        {
        autoScroll(
                    stockContainer,
                    e.clientX,
                    e.clientY
                  )
        }
    }
  //dragLayerのマウス位置情報を更新するため、handleMouseMove内でsetMousePosを呼び出すように変更
  const handlePointerUp = async (
    e: React.PointerEvent
  ) => {

      finishLongPress(
    resizeLongPress.current,
    () => {},
    isResizing
  )

    const dropTarget = getDropTarget(
      e.clientX,
      e.clientY
    )

    // ← 先にドラッグ終了
    const device = draggingDevice

    endDrag()
    setIsResizing(false)

    if (!device || !dropTarget) return

    if (dropTarget.type === "stock") {
      await handleDropToStock(
        device,
        dropTarget.stockAreaId
      )
    }

    if (dropTarget.type === "ward") {
      await handleDropToWard(
        device,
        dropTarget.wardId
      )
    }
  }
  
  const handleDropToStock = async (
                                  device: Device,
                                  stockAreaId: number
                                ) => {

  if (!device?.id) {return}

  if (device.status === "room") {
    if (!device?.roomId) {return}
    await moveRoomToStockTransaction({
                                        deviceId: device.id,
                                        roomId: device.roomId,
                                        stockAreaId,
                                        setDevices: setDeviceList,
                                        setRooms,
                                        setHistories,
                                        setTasks,
                                        setRoomInfections,
                                        devices:deviceList
  })

      setStockLastUpdated(await fetchStockLastUpdated())
      setWardLastUpdated(await fetchWardLastUpdated())
      setDraggingDevice(null)
    return
  }

  await moveStockToStockTransaction({
                                      deviceId: device.id,
                                      stockAreaId,
                                      setDevices: setDeviceList,
                                      setHistories,
                                      devices:deviceList
                                    })
      setStockLastUpdated(await fetchStockLastUpdated())
      setWardLastUpdated(await fetchWardLastUpdated())                                  
      setDraggingDevice(null)
  }

  const handleDropToWard = async (
    device: Device,
    wardId: number
  ) => {

    if (!currentUser) {return}  
    //保守中はWardAreAへのdrag禁止
    if (device.isUnderMaintenance) {
      alert("保守中機器は病棟へ配置できません")
      return
    }
    // 共通
    setPendingDevice(device)
    setTargetWardId(wardId)

    console.log("機器アイコンのドラッグイベント")

    // stock → room
    if (device.status === "stock") {

      // RoomModalを開く
      setRoomModalOpen(true)
    }
    // room → room
    else if (device.status === "room") {
      setRoomToRoomModalOpen(true)
    }
    
  }
  // roomModalで病室名と患者名を入力して確定ボタンを押したときの処理
// roomModalで病室名と患者名を入力して確定ボタンを押したときの処理
  const handleRoomSubmit = async (
    roomId: number,
    patientName: string
  ) => {
    if (!pendingDevice?.id) {return}
    setPendingDevice(null)
    setRoomModalOpen(false)
    await moveStockToRoomTransaction({
                                      deviceId: pendingDevice.id,
                                      roomId,
                                      patientName,
                                      setDevices: setDeviceList,
                                      setRooms,
                                      setHistories,
                                      setTasks,
                                      devices:deviceList
                                    })

    setStockLastUpdated(await fetchStockLastUpdated())
    setWardLastUpdated(await fetchWardLastUpdated())
    setTargetWardId(null)
  }


  const handleRoomCancel = () => {
    if (!currentUser) {return}  
    setRoomModalOpen(false)
    setPendingDevice(null)
    setTargetWardId(null)
    }


  const handleRoomToRoomSubmit = async (
    roomId: number,
    patientName: string,
    samePatient: boolean
  ) => {

    if (!pendingDevice?.id) {return}
    if (!pendingDevice?.roomId) {return}
    setRoomToRoomModalOpen(false)
    setPendingDevice(null)

    if (samePatient) {
      await moveRoomToRoomTransaction({
                                        deviceId: pendingDevice.id,
                                        preRoomId: pendingDevice.roomId,
                                        postRoomId: roomId,
                                        patientName,
                                        setDevices: setDeviceList,
                                        setRooms,
                                        setHistories,
                                        setRoomInfections,
                                        devices:deviceList
                                      })
      } 
      else {
        await moveRoomToRoomNewPatientTransaction({
                                                    deviceId: pendingDevice.id,
                                                    preRoomId: pendingDevice.roomId,
                                                    postRoomId: roomId,
                                                    patientName,
                                                    setDevices: setDeviceList,
                                                    setRooms,
                                                    setHistories,
                                                    setTasks,
                                                    setRoomInfections,
                                                    devices:deviceList
                                                  })
      }
    setStockLastUpdated(await fetchStockLastUpdated())
    setWardLastUpdated(await fetchWardLastUpdated())
    setTargetWardId(null)
  }

  const handleRoomToRoomCancel = () => {
    if (!currentUser) {return}  
    setRoomToRoomModalOpen(false)
    setPendingDevice(null)
    setTargetWardId(null)
  }


  //StockInfoModal開くコンポーネント
  const openStockInfoModal = (device: Device) => {
    setSelectedDevice(device)
    setStockInfoModalOpen(true)
    }
  const handleStockInfoCancel = () => {
    if (!currentUser) {return}  
    setStockInfoModalOpen(false)
  }
  //RoomDeviceModalを開くコンポーネント
  const openRoomDeviceInfoModal = (device: Device) => {
    if (!currentUser) {return}  
    if  (device.roomId === undefined) return    
        setSelectedRoomDevice(device)
        setRoomDeviceInfoModalOpen(true)
  }

  const renamePatientName = async (
                                    roomId: number,
                                    value: string
                                  ): Promise<boolean> => {

    const room = rooms.find(r => r.id === roomId)

    if (!room) {return false}

    await updateRoomPatientName({
                                  room: {
                                          ...room,
                                          patientName: value
                                        },
                                  setRooms
                                })

    return true
  }


  // シリアル編集関数(boolean)
  const renameSerialNumber = async (
                                    id: number,
                                    value: string
                                  ): Promise<boolean> => {

    const device =
      deviceList.find(
                      d => d.id === id
                    )

    if (!device) {
      return false
    }

    await updateSerialNumber({
                              device: {
                                        ...device,
                                        serialNumber: value.trim()
                                      }
                            })

    const devices=await getDevicesFromApi()
    const normalizedDevices =devices.map(normalizeDevice)
    setDeviceList(normalizedDevices)
    const updatedDevice =normalizedDevices.find(
                   d => d.id === id
                  )
if (updatedDevice) {

  if (selectedRoomDevice?.id === id) {
    setSelectedRoomDevice(updatedDevice)
  }

  if (selectedDevice?.id === id) {
    setSelectedDevice(updatedDevice)
  }

}
    return true
  }

// 備考欄編集関数(boolean)
  const renameNote = async (
                              id: number,
                              value: string
                            ): Promise<boolean> => {

    const device =
      deviceList.find(
                      d => d.id === id
                    )

    if (!device) {
      return false
    }

    await updateNote({
                      device: {
                                ...device,
                                note: value.trim()
                              }
                    })


    const devices=await getDevicesFromApi()
    const normalizedDevices =devices.map(normalizeDevice)
    setDeviceList(normalizedDevices)
    const updatedDevice =normalizedDevices.find(
                    d => d.id === id
                  )

if (updatedDevice) {

  if (selectedRoomDevice?.id === id) {
    setSelectedRoomDevice(updatedDevice)
  }

  if (selectedDevice?.id === id) {
    setSelectedDevice(updatedDevice)
  }

}
    return true
  }


  const renameManagementNumber = async (
                                          id: number,
                                          value: string
                                        ): Promise<boolean> => {

    const device =
      deviceList.find(
                      d => d.id === id
                    )

    if (!device) {return false}

    await updateManagementNumber({
                                  device: {
                                            ...device,
                                            managementNumber: value
                                          }
                                })

    const devices=await getDevicesFromApi()

    const normalizedDevices =devices.map(normalizeDevice)
    setDeviceList(normalizedDevices)
    const updatedDevice =normalizedDevices.find(
                  d => d.id === id
                  )

      if (updatedDevice) {
                          if (selectedRoomDevice?.id === id) {
                            setSelectedRoomDevice(updatedDevice)
                          }
                          if (selectedDevice?.id === id) {
                            setSelectedDevice(updatedDevice)
                          }
      }
    return true
  }

  const renameRentalDates = async (
                                    deviceId: number,
                                    rentalStartDate?: string,
                                    rentalEndDate?: string
                                  ): Promise<boolean> => {

    const device =deviceList.find(
                        d => d.id === deviceId
                      )

    if (!device) {return false}

    await updateRentalDates({
                              device: {
                                        ...device,
                                        rentalStartDate,
                                        rentalEndDate
                                      }
                            })

    const devices = await getDevicesFromApi()
    const normalizedDevices =devices.map(normalizeDevice)
    setDeviceList(normalizedDevices)
    const updatedDevice =normalizedDevices.find(
                              d => d.id === deviceId
                            )
    if (updatedDevice) {
      if (selectedRoomDevice?.id === deviceId) {
        setSelectedRoomDevice(updatedDevice)
      }
      if (selectedDevice?.id === deviceId) {
        setSelectedDevice(updatedDevice)
      }
    }
    return true
  }


  const renameMaintenanceDates = async (
                                              deviceId: number,
                                              maintenanceStartedAt?: string
                                            ): Promise<boolean> => {

    const device = deviceList.find(
                                    d => d.id === deviceId
                                  )

    if (!device) {return false}

    await updateMaintenanceDatesTransaction({
                                              device: {
                                                        ...device,
                                                        maintenanceStartedAt
                                                      }
                                            })

    const devices = await getDevicesFromApi()
    const normalizedDevices = devices.map(normalizeDevice)
    setDeviceList(normalizedDevices)

    const updatedDevice = normalizedDevices.find(
                                                  d => d.id === deviceId
                                                )

    if (updatedDevice) {

      if (selectedRoomDevice?.id === deviceId) {
        setSelectedRoomDevice(updatedDevice)
      }

      if (selectedDevice?.id === deviceId) {
        setSelectedDevice(updatedDevice)
      }

    }

    return true
  }



  const toggleDeviceStandby = async (
                                      deviceId: number,
                                      standby: boolean,
                                    ): Promise<boolean> => {

    if (standby) { await startStandby( deviceId)
    } else {await finishStandby(deviceId)
    }
    const devices =await getDevicesFromApi()
    const normalizedDevices =devices.map(normalizeDevice)
    setDeviceList(normalizedDevices)
    const updatedDevice =normalizedDevices.find(
                                           d => d.id === deviceId
                                        )

    if (updatedDevice) {
      setSelectedRoomDevice(updatedDevice)
    }
    return true
  }

  const toggleDeviceMaintenance = async (
                                          deviceId: number,
                                          nextMaintenance: boolean,
                                        ): Promise<boolean> => {
    if (nextMaintenance) {
      await startMaintenance(deviceId)
    } else {
      await finishMaintenance(deviceId)
    }

    const devices =await getDevicesFromApi()
    const normalizedDevices =devices.map(normalizeDevice)
    setDeviceList(normalizedDevices)
    const updatedDevice =normalizedDevices.find(
                                        d => d.id === deviceId
                                      )
    if (updatedDevice) {
      if (selectedRoomDevice?.id === deviceId)
         {setSelectedRoomDevice(updatedDevice)}

      if (selectedDevice?.id === deviceId) 
        {setSelectedDevice( updatedDevice)
      }
    }
    return true
  }  






  const handleRoomDeviceInfoCancel = () => {
    if (!currentUser) {return}  
    setRoomDeviceInfoModalOpen(false)
  }

  //RoomDeviceInfoModal
  const updateSelectedRoomDevice = (updater: (d: Device) => Device
    ) => {
      setSelectedRoomDevice(prev =>
        prev ? updater(prev) : prev
      )
  }

  
  const deleteDevice = async (
    deviceId: number
  ) => {

    await deleteDeviceTransaction({
      deviceId,
      setDeviceList,
      setTasks,
      setHistories,
      setRooms,
      setRoomInfections  
      })
    } 



  //タスク完了ボタンを押したときの処理
  const handleCompleteTask = async (
                                     task: CompleteMaintenanceTask
                                  ) => {

    await completeMaintenanceTaskTransaction({
                                              task,
                                              setTasks
                                            })
    return true
    }

  //device_idに紐づくタスクを取得する関数
  const getDeviceTasks = (deviceId?: number) => {
    if (!deviceId) return []
    return tasks.filter(
      t =>
        Number(t.deviceId) === Number(deviceId)
        
    )
  }  
  const renameMaintenanceTaskDueAt = async (
  task: UpdateMaintenanceTaskDueAt
  ): Promise<boolean> => {

  await updateMaintenanceTaskDueAtTransaction({
    task,
    setTasks
  })

  return true
  }


  const cancelTask = async (
    task: CancelMaintenanceTask
  ): Promise<boolean> => {

    await cancelMaintenanceTaskTransaction({
      task,
      setTasks
    })

    return true
  }



  //device_idに紐づくタスクの状態からアラートカラーを返す関数
const getMAlert = (deviceId?: number): "red" | "yellow" | "green" => {

  if (!deviceId) return "green"

  const nearestTask =
    tasks
      .filter(
        t =>
          Number(t.deviceId) === Number(deviceId) &&
          !t.completedAt
      )
      .sort(
        (a, b) =>
          new Date(a.dueAt).getTime() -
          new Date(b.dueAt).getTime()
      )[0]

  if (!nearestTask) return "green"

  const now = new Date()

  const diff =
    new Date(nearestTask.dueAt).getTime() - now.getTime()

  const days =
    Math.ceil(diff / (1000 * 60 * 60 * 24))

  if (days < 0) return "red"

  if (days <= 2) return "yellow"

  return "green"
}



  const fetchHistories = async () => {
    const histories = await getHistoriesFromApi()
    setHistories(
      histories.map(normalizeHistory)
    )
  }  
  
  //deviceListの中でstatusが"room"のものだけを抽出する関数
  //病棟機器リストを取得する関数
  const getWardDeviceList = () => {
    return deviceList.filter(
      d => d.status === "room"
    )
  }



  //getDeviceTasksを使って、device_idに紐づくタスクの中で最も期限が近いものを返す関数
  // ===== 直近期限task取得 =====
  const getLatestMaintenanceTask = (deviceId?: number) => {
        if (!deviceId) return null
            const deviceTasks =getDeviceTasks(deviceId)
            console.log(deviceId)
            console.log(deviceTasks)
              if (deviceTasks.length === 0) {
                return null
            }
            const sorted = [...deviceTasks]
              .sort((a, b) =>
                new Date(a.dueAt).getTime()
                -
                new Date(b.dueAt).getTime()
              )
            const latest = sorted[0]
            const maintenanceType =
              maintenanceTypes.find(
                mt =>
                  Number(mt.id)
                  === Number(
                    latest.maintenanceTypeId
                  )
              )
            return {
              name:
                maintenanceType?.name ?? "",
              due_at:
                latest.dueAt
            }
  }
  //機種ごとの残数をカウントする
  const lowStockDevices = deviceList.map(device => {
    const typeName =
      deviceTypes.find(
        t => Number(t.id) === Number(device.type)
      )?.name ?? "不明"
    const modelName =
      deviceModels.find(
        m => Number(m.id) === Number(device.model)
      )?.name ?? "不明"
    return {
      id: device.id,
      typeName,
      modelName,
      isUnderMaintenance:device.isUnderMaintenance,
      currentWardId:device.roomId ?? null,
    }
  })

  //logout関数
  const handleLogout = async () => {
    await supabase.auth.signOut()
    setCurrentUser(null)
    router.push("/login")
  }



    


 
  //FASTAPIのfetch関数類を呼び出し、レンダリング時にDBデータを受け取る
  useEffect(() => {

  const fetchData = async () => {
    if (!currentUser) {return}
    const data =await fetchInitDashboard()
    console.log("infection_types:",data.infection_types)
    if (!data) {return}
    setDeviceList(data.devices.map(normalizeDevice))
    setStockAreas(data.stock_areas.map(normalizeStockArea))
    setWards(data.wards.map(normalizeWard))
    setRooms(data.rooms.map(normalizeRoom))
    setDeviceTypes(data.device_types.map(normalizeDeviceType))
    setDeviceModels(data.device_models.map(normalizeDeviceModel))
    setTasks(data.tasks.map(normalizeMaintenanceTask))
    setMaintenanceTypes(data.maintenance_types.map(normalizeMaintenanceType))
    setHistories(data.histories.map(normalizeHistory))
    setInfectionTypes(data.infection_types.map(normalizeInfectionType))
    setRoomInfections(data.room_infections.map(normalizeRoomInfection))
    //最終更新日を取得用APIをたたく
    const stockLastUpdated = await fetchStockLastUpdated()
    const wardLastUpdated = await fetchWardLastUpdated()
    console.log("wardLastUpdated:",wardLastUpdated)
    setStockLastUpdated(stockLastUpdated)
    setWardLastUpdated(wardLastUpdated)

  }
  fetchData()}, [currentUser])
  
  //login情報ない場合はnullを返す。結果login画面に遷移される。
  //一番最後に記述しないとエラーになる
  useEffect(() => {
    if (currentUser === undefined) return

    if (!currentUser) {
      router.replace("/login")
    }
  }, [currentUser, router])

  if (currentUser === undefined) {
    return null // 認証確認中
  }
if (!currentUser) {
  return null
}

    return (
      <div
        //page.module.cssのlayoutクラスと
        // draggingDeviceが存在する場合はdraggingクラスを呼び出す
        className={`${styles.layout} ${draggingDevice ? styles.dragging : ""}`}
        style={{
        gridTemplateRows: `${split}fr 6px ${1 - split}fr` // 画面をsplitと6pxと残りの割合で分割
        }}
        onPointerMove={e => {handleMouseMove(e)}}
        onPointerUp={e => {handlePointerUp(e)}}
        >
      {/* 病棟エリア */}
      <div className={styles.ward} ref={wardRef}>
        <WardArea
          deviceList={deviceList}
          deviceTypes={deviceTypes}
          deviceModels={deviceModels}
          deleteDevice={deleteDevice}
          wards={wards}
          startDrag={startDrag}
          draggingDevice={draggingDevice}
          pendingDevice={pendingDevice}
          onDrop={handleDropToWard} 
          rooms={rooms}
          openRoomDeviceInfoModal={openRoomDeviceInfoModal}
          getMAlert={getMAlert}
          wardCellSize={wardCellSize}
          setWardCellSize={setWardCellSize}
          currentUser={currentUser}
          scrollRef={wardScrollRef}
          isDragging={isDragging}
          wardLastUpdated={wardLastUpdated}
          infectionTypes={infectionTypes}
          roomInfections={roomInfections}

        />
      </div>
      {/* ✅ 境界バー */}
      <div
        style={{
          height: "6px",
          background: isResizing ? "#2563eb" : "#ccc",
          cursor: "row-resize",
          touchAction: "none",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          userSelect: "none"
        }}
            onPointerDown={() => {
                startLongPress(
                  resizeLongPress.current,
                  () => {
                    setIsResizing(true)
                  }
                )
            }}
            onPointerLeave={() => {
                cancelLongPress(resizeLongPress.current)
            }}      
      > 
      <div
          style={{
            width: "48px",
            height: "20px",
            borderRadius: "10px",
            background: isResizing ? "#2563eb" : "#888",
            color: "white",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            fontSize: "14px",
            fontWeight: "bold"
          }}
      >
        ≡
  </div>
</div>
      



      



      {/* 在庫エリア */}
      <div className={styles.stock} ref={stockRef}>
        <StockAreas
          deviceList={deviceList}
          stockAreas={stockAreas}
          deviceTypes={deviceTypes}
          deviceModels={deviceModels}
          deleteDevice={deleteDevice}

          managementNumber={managementNumber}
          serialNumber={serialNumber}
          startDrag={startDrag}
          handleMouseMove={handleMouseMove}
          draggingDevice={draggingDevice}
          pendingDevice={pendingDevice}
          onDrop={handleDropToStock}
          openStockInfoModal={openStockInfoModal}
          getMAlert={getMAlert}
          stockCellSize={stockCellSize}
          setStockCellSize={setStockCellSize}
          currentUser={currentUser}
          scrollRef={stockScrollRef}
          isDragging={isDragging}
          stockLastUpdated={stockLastUpdated}
        />
      </div>      

      {/* ボタンパネル */}
      <div className={styles.button}>
        <ButtonPanel 
          deviceList={deviceList}
          setDeviceList={setDeviceList}
          deviceTypes={deviceTypes}
          setDeviceTypes={setDeviceTypes}
          deviceModels={deviceModels}
          setDeviceModels={setDeviceModels}
          stockAreas={stockAreas}
          setStockAreas={setStockAreas}
          wards={wards}
          setWards={setWards}
          rooms={rooms}
          setRooms={setRooms}
         
          maintenanceTypes={maintenanceTypes}
          setMaintenanceTypes={setMaintenanceTypes}

          histories={histories}
          fetchHistories={fetchHistories}
          getWardDeviceList={getWardDeviceList}
          getLatestMaintenanceTask={getLatestMaintenanceTask}
          handleLogout={handleLogout} 
          hospitalId={currentUser.hospitalId}
          userName={currentUser.displayName}
          role={currentUser.role}
          userId={currentUser.id}

          infectionTypes={infectionTypes}
          setInfectionTypes={setInfectionTypes}

        />
      </div>
      {/*機器残数表示パネル */}
      <LowStockPanel
        devices={lowStockDevices}
        isDragging={!!draggingDevice}
      />


      {/* drag layer */}
      <div className={styles.dragLayer}>
        <DragLayer
          deviceTypes={deviceTypes}
          deviceModels={deviceModels}
          draggingDevice={draggingDevice}
          mousePos={mousePos}
          getMAlert={getMAlert}
        />
      </div>
      {/* 病室モーダル表示 */}
      <RoomModal
        isOpen={roomModalOpen}
        onClose={handleRoomCancel}
        onSubmit={handleRoomSubmit}
        wardId={targetWardId}
        wards={wards}
        rooms={rooms}
        pendingDevice={pendingDevice}
      />

      <RoomToRoomModal
        deviceList={deviceList}
        isOpen={roomToRoomModalOpen}
        onClose={handleRoomToRoomCancel}
        onSubmit={handleRoomToRoomSubmit}
        wards={wards}
        rooms={rooms}
        deviceTypes={deviceTypes}
        deviceModels={deviceModels}
        pendingDevice={pendingDevice}
        initialWardId={targetWardId}
      />
      {/*ストック機器詳細モーダル表示 */}
      <StockInfoModal
        isOpen={stockInfoModalOpen}
        device={selectedDevice}
        deviceTypes={deviceTypes}
        deviceModels={deviceModels}
        stockAreas={stockAreas}
        onCancel={handleStockInfoCancel}
        renameManagementNumber={renameManagementNumber}
        renameSerialNumber={renameSerialNumber}
        renameNote={renameNote}
        renameRentalDates={renameRentalDates}
        renameMaintenanceDates={renameMaintenanceDates} 
        toggleDeviceMaintenance={toggleDeviceMaintenance}
        onDelete={deleteDevice}
      />
       {/* 病室機器詳細モーダル表示 */}
      <RoomDeviceInfoModal
        isOpen={roomDeviceInfoModalOpen}
        selectedRoomDevice={selectedRoomDevice}
        deviceTypes={deviceTypes}
        deviceModels={deviceModels}
        onCancel={handleRoomDeviceInfoCancel}
        rooms={rooms}
        wards={wards}
        tasks={getDeviceTasks(selectedRoomDevice?.id)}                  // ← 渡す
        maintenanceTypes={maintenanceTypes} // ← 渡す
        onCompleteTask={handleCompleteTask} // ← 渡す
        renamePatientName={renamePatientName}
        renameManagementNumber={renameManagementNumber}
        renameSerialNumber={renameSerialNumber}
        renameNote={renameNote}
        toggleDeviceStandby={toggleDeviceStandby}
        renameRentalDates={renameRentalDates}
        renameMaintenanceTaskDueAt={renameMaintenanceTaskDueAt}
        cancelTask={cancelTask}
        infectionTypes={infectionTypes}
        roomInfections={roomInfections}
        setRoomInfections={setRoomInfections}
        onDelete={deleteDevice}

      />


    </div>
  )
}
