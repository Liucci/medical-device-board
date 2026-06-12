"use client"

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
import { Device} from "../types/deviceTypes"
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


import {getStockAreasFromApi} from "../api/stockAreas/fetchStockAreas"
import {getWardsFromApi} from "../api/wards/fetchWards"
import {getRoomsFromApi} from "../api/rooms/fetchRooms"
import {getDeviceTypesFromApi} from "../api/deviceTypes/fetchDeviceTypes"
import {getTasksFromApi} from "../api/tasks/fetchTasks"
import {getMaintenanceTypesFromApi} from "../api/maintenanceTypes/fetchMaintenanceTypes"
import {getHistoriesFromApi} from "../api/histories/fetchHistories"
import { fetchInitDashboard } from "../api/transactions/fetchInitDashboard"
import { deleteDeviceTransaction } from "../api/transactions/devices/deleteDeviceTransaction"
import { updateManagementNumber } from "../api/transactions/devices/updateManagementNumber"
import { updateSerialNumber } from "../api/transactions/devices/updateSerialNumber"
import { updateNote } from "../api/transactions/devices/updateNote"
import {startStandby} from "../api/transactions/devices/startStandby"
import {finishStandby} from "../api/transactions/devices/finishStandby"

import { updateWardTransaction }from "../api/transactions/wards/updateWardTransaction"
import { createDeviceTypeTransaction } from "../api/transactions/deviceTypes/createDeviceTypeTransaction"


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

  // 管理番号とシリアル番号の状態
  const [managementNumber, setManagementNumber] = useState<string | undefined>(undefined)
  const [serialNumber, setSerialNumber] = useState<string | undefined>(undefined)

  const [draggingDevice, setDraggingDevice] = useState<Device | null>(null)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
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
  //RoomMOdalとRoomDeviceInfoModal同時に開かないようにするフラグstate
  const [justDropped, setJustDropped] = useState(false)
  //どのデバイスをどの病棟に落としたかを保存するstate
  const [pendingDevice, setPendingDevice] = useState<Device | null>(null)
  const [targetWardId, setTargetWardId] = useState<number | null>(null)

  //メンテナンス関連を管理するstate
  const [tasks, setTasks] = useState<any[]>([])
  const [maintenanceTypes, setMaintenanceTypes] = useState<any[]>([])
  //StockAreaとWardAreaの仕切りをドラッグするためのstate
  const [split, setSplit] = useState(0.65) // 上の割合
  const [isResizing, setIsResizing] = useState(false)
  //auto scroll用にStockArea / WardArea のDOMをrefで取得
  const wardRef = useRef<HTMLDivElement | null>(null)
  const stockRef = useRef<HTMLDivElement | null>(null)
  //機器アイコンのサイズを管理するstate
  const [wardCellSize, setWardCellSize] =useState(80)
  const [stockCellSize, setStockCellSize] =useState(80)
  
  //user情報を格納する関数
  const router = useRouter()
  const {currentUser,setCurrentUser} = useAuth()


  const startDrag = (
                      target: HTMLElement,
                      clientX: number,
                      clientY: number,
                      device: Device
                    ) => {
    
    const rect = target.getBoundingClientRect()

    setDragOffset({
      x: clientX - rect.left,
      y: clientY - rect.top
    })

    setMousePos({
      x: clientX,
      y: clientY
    })
    
    setDraggingDevice(device)
    //Dragイベント発生のフラグ
    //setJustDropped(true)
  }
  //auto scroll関連
  const autoScroll = (container: HTMLElement,mouseX: number, mouseY: number) => {
    const AUTO_SCROLL_MARGIN = 60  // 端の判定範囲(px)
    const AUTO_SCROLL_SPEED = 10   // スクロール速度
    const rect = container.getBoundingClientRect()
        // ===== 縦スクロール =====
    // 上端
    if (mouseY < rect.top + AUTO_SCROLL_MARGIN) {
      container.scrollTop -= AUTO_SCROLL_SPEED
    }

    // 下端
    if (mouseY > rect.bottom - AUTO_SCROLL_MARGIN) {
      container.scrollTop += AUTO_SCROLL_SPEED
    }
        // ===== 横スクロール =====
        //左端
    if (mouseX < rect.left + AUTO_SCROLL_MARGIN) {
      container.scrollLeft -= AUTO_SCROLL_SPEED
    }
        //右端
    if (mouseX > rect.right - AUTO_SCROLL_MARGIN) {
      container.scrollLeft += AUTO_SCROLL_SPEED
    }
  }
  //マウスがStockAreaまたはWardArea内にあるか判定するための関数
  const isInside = (e: React.MouseEvent, el: HTMLElement) => {
    const rect = el.getBoundingClientRect()
    return (
      e.clientX >= rect.left &&
      e.clientX <= rect.right &&
      e.clientY >= rect.top &&
      e.clientY <= rect.bottom
    )
  }
    // ドラッグ中の処理
  const handleMouseMove = (e: React.MouseEvent) => {
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
        setMousePos({
          x: e.clientX, 
          y: e.clientY 
        })
    // 👇 追加：自動スクロール
    if (wardRef.current && isInside(e, wardRef.current)) {
      autoScroll(wardRef.current,e.clientX,e.clientY)
    }
    if (stockRef.current && isInside(e, stockRef.current)) {
      autoScroll(stockRef.current,e.clientX,e.clientY)
    }  
  }
  //dragLayerのマウス位置情報を更新するため、handleMouseMove内でsetMousePosを呼び出すように変更
  const handleMouseUp = (e: React.MouseEvent) => {
    const x = e.clientX
    const y = e.clientY

    //console.log("drop position", x, y)

    setDraggingDevice(null)
    setIsResizing(false)// ドラッグ終了と同時にリサイズも終了する
  }

/*   const handleDropToStock = async (device: Device, stockAreaId: number) => {
    if (!currentUser) {return}  
    // ① UI即更新（UX）
    setDeviceList(prev =>
      prev.map(d =>
        d.id === device.id
          ? {
              ...d,
              status: "stock",
              stockAreaID: stockAreaId,
              roomId: undefined,
              managementNumber: undefined, // ←追加
              serialNumber: undefined,     // ←追加
              note: undefined,              // ←追加
              standby: false,
              standbyStartedAt: undefined
            }
          : d
      )
    )

    // ② DB更新
    const { error } = await supabase
      .from('devices')
      .update({
        status: "stock",
        stock_area_id: stockAreaId,
        room_id: null,
        management_number: null, // ←追加
        serial_number: null,     // ←追加
        note: null               // ←追加
      })
      .eq('id', device.id)
      .eq(
          "hospital_id",
          currentUser?.hospitalId
      )


    if (error) {
      console.error(error)
      // 必要ならrollback
    }

    // ===== 履歴追加 =====
    const type = deviceTypes.find(
      t => Number(t.id) === Number(device.type)
    )
    const model = deviceModels.find(
      m => Number(m.id) === Number(device.model)
    )    
    const stockArea = stockAreas.find(a => Number(a.id) === Number(stockAreaId))
    const { error: historyError } = await supabase
      .from("device_histories")
      .insert({
        hospital_id:currentUser?.hospitalId,
        device_id: device.id,
        action_type: "move",
        device_type_name: type?.name ?? null,
        device_model_name: model?.name ?? null,
        status: "stock",
        stock_area_id: stockAreaId,
        stock_area_name: stockArea?.name ?? null,
        room_id: null,
        patient_name: null,
        management_number: null,
        serial_number: null,
        note: null,
        message: `${stockArea?.name ?? "不明"}へ移動`      
      })

    if (historyError) {
      console.error("history insert error:", historyError)
    }
    // DBから再取得
    await fetchHistories()
    }

 */    
  
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
                                        setTasks
                                      })

      setDraggingDevice(null)
    return
  }

  await moveStockToStockTransaction({
                                      deviceId: device.id,
                                      stockAreaId,
                                      setDevices: setDeviceList,
                                      setHistories
                                    })

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

    // drag flag
    setTimeout(
      () => setJustDropped(false),
      100
    )
  }
  // roomModalで病室名と患者名を入力して確定ボタンを押したときの処理
// roomModalで病室名と患者名を入力して確定ボタンを押したときの処理
  const handleRoomSubmit = async (
    roomId: number,
    patientName: string
  ) => {

    if (!pendingDevice?.id) {return}

    await moveStockToRoomTransaction({
                                      deviceId: pendingDevice.id,
                                      roomId,
                                      patientName,
                                      setDevices: setDeviceList,
                                      setRooms,
                                      setHistories,
                                      setTasks
                                    })

    setRoomModalOpen(false)
    setPendingDevice(null)
    setTargetWardId(null)
  }


  const handleRoomCancel = () => {
    if (!currentUser) {return}  
    setRoomModalOpen(false)
    setPendingDevice(null)
    setTargetWardId(null)
    }
/*   const handleRoomToRoomSubmit = async (
    roomID: number,
    patientName: string,
    samePatient: boolean
  ) => {
    if (!currentUser) {return}  
    if (
      !pendingDevice ||
      pendingDevice.id === undefined
    ) return

    // ===== 移動前状態 =====

    const prevDevice =
      deviceList.find(
        d => d.id === pendingDevice.id
      )

    const prevRoomId =
      prevDevice?.roomId

    const prevRoom =
      rooms.find(
        r => r.roomId === prevRoomId
      )

    const prevPatient =
      prevRoom?.patientName ?? ""

    // ===== DB更新 =====

    const { error: roomError } =
      await supabase
        .from("rooms")
        .update({
          patient_name: patientName
        })
        .eq("id", roomID)
        .eq(
          "hospital_id",
          currentUser?.hospitalId
        )

    if (roomError) {
      console.error(roomError)
      return
    }

    const { error: deviceError } =
      await supabase
        .from("devices")
        .update({
          status: "room",
          room_id: roomID
        })
        .eq("id", pendingDevice.id)
        .eq(
          "hospital_id",
          currentUser?.hospitalId
        )

    if (deviceError) {
      console.error(deviceError)
      return
    }

    // ===== 履歴用 =====

    const room =
      rooms.find(
        r => Number(r.roomId) === Number(roomID)
      )

    const type =
      deviceTypes.find(
        t =>
          Number(t.id) ===
          Number(pendingDevice.type)
      )

    const model =
      deviceModels.find(
        m =>
          Number(m.id) ===
          Number(pendingDevice.model)
      )

    // ===== 判定 =====

    const roomChanged =
      prevRoomId !== roomID

    const patientChanged =
      prevPatient !== patientName

    // ===== action_type =====

    const actionType =
      roomChanged
        ? "move"
        : "other"

    // ===== message =====

    let message = ""

    // room変更
    if (roomChanged) {

      message =
        `${type?.name ?? "不明"} : ` +
        `${model?.name ?? "不明"} ` +
        `${room?.roomName ?? "不明"}へ移動`

      if (patientChanged) {
        message += " / 患者名変更"
      }

      if (!samePatient) {
        message += " / 別患者使用開始"
      } else {
        message += " / 同一患者継続"
      }
    }

    // 同一room
    else {

      if (patientChanged) {

        message =
          `${type?.name ?? "不明"} : ` +
          `${model?.name ?? "不明"} ` +
          `${room?.roomName ?? "不明"} ` +
          `患者名変更`
      }

      else {

        message =
          `${type?.name ?? "不明"} : ` +
          `${model?.name ?? "不明"} ` +
          `${room?.roomName ?? "不明"} ` +
          `情報更新無し`
      }
    }

    // ===== 履歴 =====

    const { error: historyError } =
      await supabase
        .from("device_histories")
        .insert({
          hospital_id:currentUser?.hospitalId,
          device_id:
            pendingDevice.id,

          action_type:
            actionType,

          device_type_name:
            type?.name ?? null,

          device_model_name:
            model?.name ?? null,

          status:
            "room",

          room_id:
            roomID,

          room_name:
            room?.roomName ?? null,

          stock_area_id:
            null,

          stock_area_name:
            null,

          patient_name:
            patientName || null,

          management_number:
            pendingDevice.managementNumber ?? null,

          serial_number:
            pendingDevice.serialNumber ?? null,

          note:
            pendingDevice.note ?? null,

          message
        })

    if (historyError) {
      console.error(
        "history insert error:",
        historyError
      )
    }

    // ===== 履歴再取得 =====

    await fetchHistories()

    // ===== UI更新 =====

    setDeviceList(prev =>
      prev.map(d =>
        d.id === pendingDevice.id
          ? {
              ...d,
              status: "room",
              roomId: roomID
            }
          : d
      )
    )

    setRooms(prev =>
      prev.map(r =>
        r.id === roomID
          ? {
              ...r,
              patientName
            }
          : r
      )
    )

    // ===== メンテ種別 =====

    let types =
      maintenanceTypes.filter(
        t =>
          t.device_model_id ===
          pendingDevice.model
      )

    if (types.length === 0) {

      types =
        maintenanceTypes.filter(
          t =>
            t.device_type_id ===
              pendingDevice.type &&
            t.device_model_id === null
        )
    }

    // ===== タスク処理 =====

    if (!samePatient) {

      if (types.length > 0) {

        await cancelTasks(
          pendingDevice.id
        )

        await createTasks(
          pendingDevice,
          types
        )
      }
    }

    // ===== task再取得 =====

    await fetchTasks()

    // ===== 後処理 =====

    setRoomToRoomModalOpen(false)

    setPendingDevice(null)

    setTargetWardId(null)
  }
 */

const handleRoomToRoomSubmit = async (
  roomId: number,
  patientName: string,
  samePatient: boolean
) => {

  if (!pendingDevice?.id) {return}
  if (!pendingDevice?.roomId) {return}

  if (samePatient) {

    await moveRoomToRoomTransaction({
                                      deviceId: pendingDevice.id,
                                      preRoomId: pendingDevice.roomId,
                                      postRoomId: roomId,
                                      patientName,
                                      setDevices: setDeviceList,
                                      setRooms,
                                      setHistories
                                    })

  } 
  //else {
    // await moveRoomToRoomNewPatientTransaction({
    //   deviceId: pendingDevice.id,
    //   preRoomId: pendingDevice.roomId,
    //   postRoomId: roomId,
    //   patientName,
    //   setDevices: setDeviceList,
    //   setRooms,
    //   setHistories,
    //   setTasks
   // })
  //}

  setRoomToRoomModalOpen(false)
  setPendingDevice(null)
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
  //管理番号編集関数（boolean)
/*   const renameManagementNumber =async (id: number,value: string): Promise<boolean> => {
    if (!currentUser) {
      return false
    }
    const {
      data,
      error
    } = await supabase
      .from("devices")
      .update({
        management_number: value
      })
      .eq("id", id)
      .eq(
        "hospital_id",
        currentUser.hospitalId
      )
      .select()

    if (error) {

      console.error(error)

      alert(
        "編集権限がありません"
      )

      return false
    }

    if (
      !data ||
      data.length === 0
    ) {

      alert(
        "編集権限がありません"
      )

      return false
    }

    // UI更新
    setDeviceList(prev =>
      prev.map(d =>
        d.id === id
          ? {
              ...d,
              managementNumber:
                value
            }
          : d
      )
    )

    updateSelectedRoomDevice(d =>
      d.id === id
        ? {
            ...d,
            managementNumber: value
          }
        : d
  )
    return true
  }
 */

/*   //シリアル編集関数(boolean)
  const renameSerialNumber = async (id: number,value: string): Promise<boolean> => {

    if (!currentUser) {
      return false
    }

    const trimmed =
      value.trim()

    const {
      data,
      error
    } = await supabase
      .from("devices")
      .update({
        serial_number:
          trimmed
      })
      .eq("id", id)
      .eq(
        "hospital_id",
        currentUser.hospitalId
      )
      .select()

    if (error) {

      console.error(error)

      alert(
        "シリアル番号編集権限がありません"
      )

      return false
    }

    // 🔥 RLSで0件更新
    if (
      !data ||
      data.length === 0
    ) {

      alert(
        "シリアル番号編集権限がありません"
      )

      return false
    }

    // ===== UI更新 =====
    // deviceListのserialNumber更新
    setDeviceList(prev =>
      prev.map(d =>
        d.id === id
          ? {
              ...d,
              serialNumber:
                trimmed
            }
          : d
      )
    )
    // RoomDeviceInfoModalのserialNumberも更新
    updateSelectedRoomDevice(d =>
      d.id === id
        ? {
            ...d,
            serialNumber: trimmed
          }
        : d
  )
  
    return true
  } 
 */ 
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

    const devices =
      await getDevicesFromApi()

    setDeviceList(devices.map(normalizeDevice))

    const updatedDevice =
      devices.find(
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

    const devices =
      await getDevicesFromApi()

    setDeviceList(devices)

    const updatedDevice =
      devices.find(
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

    const devices=
      await getDevicesFromApi()

    setDeviceList(devices.map(normalizeDevice))
    console.log(
    devices.find(
                (d: Device) => d.id === id
    )
    )
    const updatedDevice =
      devices.find(
                    (d: Device) => d.id === id
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
/* 
  //備考欄編集関数(boolean)
  const renameNote = async (id: number,value: string): Promise<boolean> => {
    if (!currentUser) {
      return false
    }
    const trimmed =
      value.trim()
    const {
      data,
      error
    } = await supabase
      .from("devices")
      .update({
        note: trimmed
      })
      .eq("id", id)
      .eq(
        "hospital_id",
        currentUser.hospitalId
      )
      .select()
    if (error) {
      console.error(error)

      alert(
        "備考編集権限がありません"
      )

      return false
    }

    // 🔥 RLSで0件更新
    if (
      !data ||
      data.length === 0
    ) {

      alert(
        "備考編集権限がありません"
      )

      return false
    }

    // ===== UI更新 =====

    setDeviceList(prev =>
      prev.map(d =>
        d.id === id
          ? {
              ...d,
              note: trimmed
            }
          : d
      )
    )
    updateSelectedRoomDevice(d =>
      d.id === id
        ? {
            ...d,
            note: trimmed
          }
        : d
  )

    return true
  } */
  
/*   const toggleDeviceStandby = async (
      deviceId: number,
      standby: boolean,
      standbyStartedAt?: string,
      standbyFinishedAt?: string
    ): Promise<boolean> => {

    if (!currentUser) {
      return false
    }

    const {
      data,
      error
    } = await supabase
      .from("devices")
      .update({
        standby,
        standby_started_at:
          standbyStartedAt || null,
        standby_finished_at:
          standbyFinishedAt || null,
      })
      .eq("id", deviceId)
      .eq(
        "hospital_id",
        currentUser.hospitalId
      )
      .select()

    if (error) {

      console.error(error)

      alert(
        "スタンバイ変更権限がありません"
      )

      return false
    }

    // 🔥 RLS 0件対策
    if (
      !data ||
      data.length === 0
    ) {

      alert(
        "スタンバイ変更権限がありません"
      )

      return false
    }

    // ===== UI更新 =====

    setDeviceList(prev =>
      prev.map(d =>
        d.id === deviceId
          ? {
              ...d,
              standby,
              standbyStartedAt,
              standbyFinishedAt
            }
          : d
      )
    )
    updateSelectedRoomDevice(d =>
      d.id === deviceId
        ? {
            ...d,
            standby,
            standbyStartedAt,
            standbyFinishedAt
          }
        : d
    )
    return true
  }
 */


  const toggleDeviceStandby = async (
  deviceId: number,
  standby: boolean,
): Promise<boolean> => {

  if (standby) {

    await startStandby(
                        deviceId
                      )

  } else {

    await finishStandby(
                         deviceId
                       )
  }

  const devices =
    await getDevicesFromApi()

  setDeviceList(devices.map(normalizeDevice))

  const updatedDevice =
    devices.find(
                  d => d.id === deviceId
                )

  if (updatedDevice) {

    setSelectedRoomDevice(
                            updatedDevice
                         )

  }

  return true
}

  const toggleDeviceMaintenance = async (
    deviceId: number,
    nextMaintenance: boolean,
    maintenanceStartedAt?: string,
    maintenanceFinishedAt?: string
  ): Promise<boolean> => {

    if (!currentUser) {
      return false
    }

    const {
      data,
      error
    } = await supabase
      .from("devices")
      .update({
        is_under_maintenance:
          nextMaintenance,

        maintenance_started_at:
          maintenanceStartedAt || null,

        maintenance_finished_at:
          maintenanceFinishedAt || null,
      })
      .eq("id", deviceId)
      .eq(
        "hospital_id",
        currentUser.hospitalId
      )
      .select()

    // SQL失敗
    if (error?.message) {

      alert(
        "保守変更権限がありません"
      )

      return false
    }

    // 🔥 RLS対策
    if (
      !data ||
      data.length === 0
    ) {

      alert(
        "保守変更権限がありません"
      )

      return false
    }

    // ===== UI更新 =====

    setDeviceList(prev =>
      prev.map(d =>
        d.id === deviceId
          ? {
              ...d,
              isUnderMaintenance:
                nextMaintenance,
              maintenanceStartedAt,
              maintenanceFinishedAt
            }
          : d
      )
    )
    updateSelectedRoomDevice(d =>
      d.id === deviceId
        ? {
            ...d,
            isUnderMaintenance:
              nextMaintenance,
            maintenanceStartedAt,
            maintenanceFinishedAt
          }
        : d
    )
    console.log("currentUser", currentUser)
    console.log("data", data)
    console.log("error", error)
    return true
  }
  const renameRentalDates = async (
        deviceId: number,
        rentalStartDate?: string,
        rentalEndDate?: string
      ): Promise<boolean> => {
    if (!currentUser) {
      return false
    }
    const {
      data,
      error
    } = await supabase
      .from("devices")
      .update({
        rental_start_date:
          rentalStartDate || null,
        rental_end_date:
          rentalEndDate || null,
      })
      .eq("id", deviceId)
      .eq(
        "hospital_id",
        currentUser.hospitalId
      )
      .select()
    if (error) {
      console.error(error)
      alert(
        "貸与日編集権限がありません"
      )
      return false
    }
    // 🔥 RLS対策
    if (
      !data ||
      data.length === 0
    ) {
      alert(
        "貸与日編集権限がありません"
      )
      return false
    }
    // ===== UI更新 =====
    setDeviceList(prev =>
      prev.map(d =>
        d.id === deviceId
          ? {
              ...d,
              rentalStartDate,
              rentalEndDate
            }
          : d
      )
    )
    
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
      setHistories
    })
  } 


  //DBのmaintenance_types tableに新しいメンテナンス種別を追加する関数
  const addMaintenanceType = async (
                                    data: {
                                      name: string
                                      deviceTypeId: number
                                      deviceModelId: number | null
                                      intervalDays: number
                                    }
  ) => {

    if (!currentUser) {
      return
    }

    const trimmed =
      data.name.trim()

    if (!trimmed) return

    const {
      data: inserted,
      error
    } = await supabase
      .from("maintenance_types")
      .insert([{
        hospital_id:
          currentUser.hospitalId,
        name: trimmed,
        device_type_id:
          data.deviceTypeId,
        device_model_id:
          data.deviceModelId,
        interval_days:
          data.intervalDays
      }])
      .select()
      .single()

    if (error) {

      console.error(error)

      // 🔥 権限エラー
      if (
        error.code === "42501"
      ) {

        alert(
          "メンテナンス項目追加権限がありません"
        )

      } else {

        alert(
          "追加に失敗しました"
        )
      }

      return
    }

    setMaintenanceTypes(prev => [
      ...prev,
      inserted
    ])
  }  
  //DBのmaintenance_types tableからメンテナンス種別名を変更する関数
  const renameMaintenanceType = async (
                                id: number,
                                data: {
                                  name: string
                                  intervalDays: number
                                }
                              ): Promise<boolean> => {

    if (!currentUser) {
      return false
    }

    const trimmed =
      data.name.trim()

    if (!trimmed) {
      return false
    }

    const {
      data: updated,
      error
    } = await supabase
      .from("maintenance_types")
      .update({
        name: trimmed,
        interval_days:
          data.intervalDays
      })
      .eq("id", id)
      .eq(
        "hospital_id",
        currentUser.hospitalId
      )
      .select()

    if (error) {

      console.error(error)

      // 🔥 権限エラー
      if (
        error.code === "42501"
      ) {

        alert(
          "メンテナンス項目変更権限がありません"
        )

      } else {

        alert(
          "変更に失敗しました"
        )
      }

      return false
    }

    // 🔥 RLSで0件更新対策
    if (
      !updated ||
      updated.length === 0
    ) {

      alert(
        "メンテナンス項目変更権限がありません"
      )

      return false
    }

    // ===== UI更新 =====

    setMaintenanceTypes(prev =>
      prev.map(t =>
        t.id === id
          ? {
              ...t,
              name: trimmed,
              interval_days:
                data.intervalDays
            }
          : t
      )
    )

    return true
  }
    //DBのmaintenance_types tableからメンテナンス種別を削除する関数
  const deleteMaintenanceTypes = async (ids: number[]): Promise<boolean> => {

    if (!currentUser) {
      return false
    }

    // 🔥 使用中チェック
    const used = tasks.some(
      t =>
        ids.includes(
          t.maintenance_type_id
        )
    )

    if (used) {

      alert(
        "使用中のメンテ種別は削除できません"
      )

      return false
    }

    const { data, error } =
      await supabase
        .from("maintenance_types")
        .delete()
        .in("id", ids)
        .eq(
          "hospital_id",
          currentUser.hospitalId
        )
        .select()

    if (error) {

      console.error(error)

      // 🔥 権限エラー
      if (
        error.code === "42501"
      ) {

        alert(
          "メンテ種別削除権限がありません"
        )

      } else {

        alert(
          "削除に失敗しました"
        )
      }

      return false
    }

    // 🔥 RLSで0件削除対策
    if (
      !data ||
      data.length !== ids.length
    ) {

      alert(
        "メンテ種別削除権限がありません"
      )

      return false
    }

    // ===== UI更新 =====

    setMaintenanceTypes(prev =>
      prev.filter(
        t =>
          !ids.includes(t.id)
      )
    )

    return true
  }
  //device_idに紐づくタスクをキャンセルする関数
  const cancelTasks = async (deviceId: number) => {
    if (!currentUser) {return}  
    await supabase
      .from("device_maintenance_tasks")
      .update({ status: "canceled" })
      .eq("device_id", deviceId)
      .eq("status", "pending")
      .eq(
        "hospital_id",
        currentUser?.hospitalId
      )

  }
  //新しいタスクを作成する関数
  const createTasks = async (device: Device, types: any[]) => {
    if (!currentUser) {return}  
    const now = new Date()
    const inserts = types.map(type => {
      const due = new Date(now)
      due.setDate(due.getDate() + type.interval_days)

      return {
        hospital_id:currentUser.hospitalId,
        device_id: device.id,
        maintenance_type_id: type.id,
        due_at: due.toISOString(),
        status: "pending"
      }
    })
    const { error } =
      await supabase
        .from("device_maintenance_tasks")
        .insert(inserts)//inserts関数にhosoital_id含んでいる
    if (error) {
      console.error(error)
    }
}
  //タスク完了ボタンを押したときの処理
  const handleCompleteTask = async (taskId: number): Promise<boolean> => {
    if (!currentUser) {return false}
    const today =new Date().toISOString()
    // ① task completed化
    const {data,error} = await supabase
                          .from("device_maintenance_tasks")
                          .update({
                                    completed_at: today,
                                    status: "completed"
                                  })
                          .eq("id", taskId)
                          .eq(
                            "hospital_id",currentUser.hospitalId
                          )
                          .select()
    // SQL失敗
    if (error?.message) {alert("メンテ実施権限がありません")
      return false
    }
    // RLS対策
    if ( !data ||data.length === 0)
       {alert("メンテ実施権限がありません")
          return false
       }
    // ② completed task取得
    const completedTask =data[0]
    // ③ maintenanceType取得
    const type =maintenanceTypes.find(t =>
          t.id ===completedTask.maintenance_type_id)
    // ④ device取得
    const device =deviceList.find( d =>
          d.id ===completedTask.device_id)
    // ⑤ 次回task生成
    if (type &&device){
                        await createTasks(device,[type])
                      }
    // ⑥ UI更新
    setTasks(prev =>
      prev.map(t =>
        t.id === taskId
          ? {
              ...t,
              completed_at: today,
              status: "completed"
            }
          : t
      )
    )
    // ⑦ DBから最新task再取得
    await fetchTasks()
    return true
  }
  //device_idに紐づくタスクを取得する関数
  const getDeviceTasks = (deviceId?: number) => {
    if (!deviceId) return []
    return tasks.filter(
      t =>
        Number(t.device_id) === Number(deviceId) &&
        t.status === "pending"
    )
  }  
  //device_idに紐づくタスクの状態からアラートカラーを返す関数
  const getMAlert = (deviceId?: number): "red" | "yellow" | "green" => {
    if (!deviceId) return "green"
    // 対象デバイスのタスクだけ取得
    const deviceTasks = tasks.filter(
      t =>
        Number(t.device_id) === Number(deviceId) &&
        t.status === "pending"
    )

    // タスクが無ければ正常
    if (deviceTasks.length === 0) return "green"

    const now = new Date()

    let hasWarning = false

    for (const task of deviceTasks) {
      const diff =
        new Date(task.due_at).getTime() - now.getTime()

      const days = Math.ceil(diff / (1000 * 60 * 60 * 24))

      // 🔴 期限切れが1つでもあれば即赤
      if (days < 0) return "red"

      // 🟡 2日以内なら警告
      if (days <= 2) hasWarning = true
      }

    // 🟡があれば黄色
    if (hasWarning) return "yellow"

    // それ以外は正常
    return "green"
  }
  //DBからdevice_histories tableを取得しhistoriesに格納する関数
  const fetchHistories = async () => {
    if (!currentUser) {return}  
    const { data, error } = await supabase
      .from("device_histories")
      .select("*")
      .eq(
        "hospital_id",
        currentUser?.hospitalId
      )
      .order("created_at", { ascending: false })
      .limit(300)

    if (error) {
      console.error(error)
      return
    }

    setHistories(data || [])
    console.log("histories:", data)
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
              if (deviceTasks.length === 0) {
                return null
            }
            const sorted = [...deviceTasks]
              .sort((a, b) =>
                new Date(a.due_at).getTime()
                -
                new Date(b.due_at).getTime()
              )
            const latest = sorted[0]
            const maintenanceType =
              maintenanceTypes.find(
                mt =>
                  Number(mt.id)
                  === Number(
                    latest.maintenance_type_id
                  )
              )
            return {
              name:
                maintenanceType?.name ?? "",
              due_at:
                latest.due_at
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

  //未login時はlogin画面に遷移
  useEffect(() => {
    // session確認中
    if (currentUser === undefined) {
      return
    }
    // 未login
    if (!currentUser) {
      router.push("/login")
    }
  }, [currentUser, router])

  //draggingDeviceの状態が変わるたびにコンソールに出力する
  useEffect(() => {
    console.log("selected draggingDevice", draggingDevice)
  }, [draggingDevice])


  //病室の機器アイコンがO個になったとき、patientNameを空にするためのuseEffect
  //deviceListが更新されるたびにroomsを更新する
  useEffect(() => {
    const updateRooms = async () => {
      for (const room of rooms) {
        const devicesInRoom = deviceList.filter(d => d.roomId === room.id)

        if (devicesInRoom.length === 0 && room.patientName) {
          // ① DB更新
          const { error } = await supabase
            .from('rooms')
            .update({ patient_name: null }) // or ""
            .eq('id', room.id)
            .eq(
              "hospital_id",
              currentUser?.hospitalId
            )
          if (error) {
            console.error("patient clear error:", error)
            continue
          }

          // ② UI更新
          setRooms(prev =>
            prev.map(r =>
              r.id === room.id
                ? { ...r, patientName: "" }
                : r
            )
          )
        }
      }
    }

    updateRooms()
  }, [deviceList])
    
  //deviveListが更新されたら、更新されたdeviceだけ出力
  const prevDeviceListRef = useRef<Device[]>([])
  useEffect(() => {
    const prev = prevDeviceListRef.current

    // 更新されたdeviceだけ抽出
    const updatedDevices = deviceList.filter(current => {
      const old = prev.find(d => d.id === current.id)

      // 新規 or 内容が変わった
      return !old || JSON.stringify(old) !== JSON.stringify(current)
    })

    if (updatedDevices.length > 0) {
      console.log("更新されたdevice:", updatedDevices)
    }

    // 次回のために保存
    prevDeviceListRef.current = deviceList
  }, [deviceList])


 
  //FASTAPIのfetch関数類を呼び出し、レンダリング時にDBデータを受け取る
useEffect(() => {

  const fetchData = async () => {

    if (!currentUser) {
      return
    }

    const data =
      await fetchInitDashboard()

    if (!data) {
      return
    }

    setDeviceList(
      data.devices.map(
        normalizeDevice
      )
    )
    setStockAreas(
      data.stock_areas.map(
        normalizeStockArea
      )
    )

    setWards(
      data.wards.map(
        normalizeWard
      )
    )

    setRooms(
      data.rooms.map(
        normalizeRoom
      )
    )

    setDeviceTypes(
      data.device_types.map(normalizeDeviceType)
    )

    setDeviceModels(
      data.device_models.map(normalizeDeviceModel)
    )

    setTasks(
      data.tasks.map(normalizeMaintenanceTask)
    )

    setMaintenanceTypes(
      data.maintenance_types.map(normalizeMaintenanceType)
    )

    setHistories(
      data.histories.map(normalizeHistory)
    )
  }

  fetchData()

  }, [currentUser])
  
  //login情報ない場合はnullを返す。結果login画面に遷移される。
  //一番最後に記述しないとエラーになる
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
        onMouseMove={e => {handleMouseMove(e)}}
        onMouseUp={e => {handleMouseUp(e)}}
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
          justDropped={justDropped}
          getMAlert={getMAlert}
          wardCellSize={wardCellSize}
          setWardCellSize={setWardCellSize}
          currentUser={currentUser}
        />
      </div>
      {/* ✅ 境界バー */}
      <div
        style={{
          background: "#ccc",
          cursor: "row-resize"
        }}
        onMouseDown={() => setIsResizing(true)}
      />



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
          getWardDeviceList={getWardDeviceList}
          getLatestMaintenanceTask={getLatestMaintenanceTask}
          handleLogout={handleLogout} 
          hospitalId={currentUser.hospitalId}
          userName={currentUser.displayName}
          role={currentUser.role}
          userId={currentUser.id}

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
        isOpen={roomToRoomModalOpen}
        onClose={handleRoomToRoomCancel}
        onSubmit={handleRoomToRoomSubmit}
        wards={wards}
        rooms={rooms}
        deviceTypes={deviceTypes}
        deviceModels={deviceModels}
        pendingDevice={pendingDevice}
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
        toggleDeviceMaintenance={toggleDeviceMaintenance}
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
        renameManagementNumber={renameManagementNumber}
        renameSerialNumber={renameSerialNumber}
        renameNote={renameNote}
        toggleDeviceStandby={toggleDeviceStandby}
        renameRentalDates={renameRentalDates}
      />


    </div>
  )
}
