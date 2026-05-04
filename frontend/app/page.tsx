"use client"

import styles from "./page.module.css"
import StockAreas from "./components/StockArea"
import WardArea from "./components/WardArea"
import ButtonPanel from "./components/ButtonPanel"
import DragLayer from "./components/DragLayer"
import RoomModal from "./components/modals/RoomModal"
import RoomToRoomModal from "./components/modals/RoomToRoomModal"
import StockInfoModal from "./components/modals/StockInfoModal"
import RoomDeviceInfoModal from "./components/modals/RoomDeviceInfoModal"
import { Device} from "./types/deviceTypes"
import { useEffect, useState,useRef } from "react"
import { normalizeDevice,toDBDevice} from "./utils/deviceMapper"
import { normalizeRoom } from "./utils/roomsMapper"
import { normalizeWard } from "./utils/wardsMapper"

//supabasek
import { createClient } from '@supabase/supabase-js'

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

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

  //device tableのデータをDBから取得する関数
  const fetchDevices = async () => {
    const { data, error } = await supabase
      .from('devices')
      .select('*')

    if (error) {
      console.error("fetchDevices error:", error)
      return
    }
    //DBから取得したデータをnormalizeDevice関数でDevice型に変換してからstateに格納する
    if (data) {
      setDeviceList(data.map(normalizeDevice))
    }

  }
  //DBのrooms tableから病室の情報を取得し、roomsに格納する関数
  const fetchRooms = async () => {

    const { data, error } =
      await supabase
        .from("rooms")
        .select("*")

    if (error) {
      console.error(
        "fetchRooms error:",
        error
      )
      return
    }

    if (data) {
      setRooms(
        data.map(normalizeRoom)
      )
    }
  }  
  //新規登録時stockAreaIDは1のCE室に固定。ドラッグで移動させる前提。
  const addDevice = async (device: Omit<Device, 'id'>) => {
    
    // ① DB用データ作成（idなし）
    const dbData = {
      ...toDBDevice(device),
      status: "stock",
      stock_area_id: 1,
      room_id: null,
      rental_start_date: device.rentalStartDate || null,
      rental_end_date: device.rentalEndDate || null,
    }

    // デバッグ（必要なら）
    console.log("insert data:", dbData)

    // ② DBに追加してidを取得
    const { data, error } = await supabase
      .from('devices')
      .insert([dbData])
      .select()
      .single() // 1件だけ取得

    if (error) {
      console.error("addDevice error:", error)
      return
    }
    if (!data) return
    // ===== 履歴追加 =====
    const type = deviceTypes.find(
      t => Number(t.id) === Number(device.type)
    )

    const model = deviceModels.find(
      m => Number(m.id) === Number(device.model)
    )    
    const { error: historyError } = await supabase
          .from("device_histories")
          .insert({
            device_id: data.id,
            action_type: "create",
            status: "stock",
            stock_area_id: 1,
            stock_area_name: "CE室",
            device_type_name: type?.name ?? null,
            device_model_name: model?.name ?? null,
            message: `${type?.name ?? "不明"} : ${model?.name ?? "不明"} 新規登録`
            })

    if (historyError) {
      console.error("history insert error:", historyError)
    }
    // DBから再取得
    await fetchHistories()
    // ③ UI用に変換
    const newDevice = normalizeDevice(data)

    // ④ UIに追加（DBのid付き）
    setDeviceList(prev => [...prev, newDevice])
  }
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
    setJustDropped(true)
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

  const handleDropToStock = async (device: Device, stockAreaId: number) => {
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
              note: undefined              // ←追加
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


  const handleDropToWard = (
    device: Device,
    wardId: number
  ) => {
    //保守中はWardAreAへのdrag禁止
    if (device.isUnderMaintenance) {
      alert(
        "保守中機器は病棟へ配置できません"
      )
      return
    }
    // 共通
    setPendingDevice(device)
    setTargetWardId(wardId)

    console.log("機器アイコンのドラッグイベント")

    // stock → room
    if (device.status === "stock") {
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
    roomID: number,
    patientName: string
  ) => {

    if (
      !pendingDevice ||
      pendingDevice.id === undefined
    ) return

    // ===== 移動前状態 =====

    const prevDevice =
      deviceList.find(
        d => d.id === pendingDevice.id
      )

    const prevStatus =
      prevDevice?.status

    const prevRoomId =
      prevDevice?.roomId

    const prevRoom =
      rooms.find(
        r => r.id === prevRoomId
      )

    // 患者名はroom由来
    const prevPatient =
      prevRoom?.patientName ?? ""

    // ===== DB更新 =====

    // 患者名更新
    const { error: roomError } =
      await supabase
        .from("rooms")
        .update({
          patient_name: patientName
        })
        .eq("id", roomID)

    if (roomError) {
      console.error(roomError)
      return
    }

    // device更新
    const { error: deviceError } =
      await supabase
        .from("devices")
        .update({
          status: "room",
          room_id: roomID,
        })
        .eq("id", pendingDevice.id)

    if (deviceError) {
      console.error(deviceError)
      return
    }

    // ===== 履歴用 =====

    const room =
      rooms.find(
        r => Number(r.id) === Number(roomID)
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

    // ===== 変更判定 =====

    const roomChanged =
      prevRoomId !== roomID

    const patientChanged =
      prevPatient !== patientName

    // ===== action_type =====

    let actionType: "move" | "other"

    // 病室変更ありなら常にmove
    if (roomChanged) {

      actionType = "move"
    }

    // 同一病室で患者変更
    else if (patientChanged) {

      actionType = "other"
    }

    // 変更なし
    else {

      actionType = "other"
    }
    // ===== message生成 =====

    let message = ""

    // ===== 病室変更 =====

    if (roomChanged) {

      message =
        `${type?.name ?? "不明"} : ` +
        `${model?.name ?? "不明"} ` +
        `${room?.roomName ?? "不明"}へ移動`

      // 同時に患者変更
      if (patientChanged) {
        message += " / 患者名変更"
      }
    }

    // ===== 同一病室 =====

    else {

      const updates: string[] = []

      // 患者名変更
      if (patientChanged) {
        updates.push("患者名変更")
      }

      // ===== 変更あり =====

      if (updates.length > 0) {

        message =
          `${type?.name ?? "不明"} : ` +
          `${model?.name ?? "不明"} ` +
          `${room?.roomName ?? "不明"} ` +
          updates.join(" / ")
      }

      // ===== 変更なし =====

      else {

        message =
          `${type?.name ?? "不明"} : ` +
          `${model?.name ?? "不明"} ` +
          `${room?.roomName ?? "不明"} ` +
          `情報更新無し`
      }
    }

    // ===== 履歴追加 =====

    const { error: historyError } =
      await supabase
        .from("device_histories")
        .insert({

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

              roomId: roomID,
            }
          : d
      )
    )

    // ===== room UI更新 =====

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

    // ===== メンテ種別取得 =====

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

    // stock → room

    if (prevStatus === "stock") {

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

    // room → room

    if (
      prevStatus?.trim() === "room"
    ) {

      const proceed =
        window.confirm(
          "同一患者に同一機器を使用しますか？\n\nOK：はい\nキャンセル：いいえ"
        )

      if (!proceed) {

        // 別患者扱い

        if (types.length > 0) {

          await cancelTasks(
            pendingDevice.id
          )

          await createTasks(
            pendingDevice,
            types
          )
        }

      } else {

        console.log("タスク継続")
      }
    }

    // ===== task再取得 =====

    await fetchTasks()

    // ===== 後処理 =====

    setRoomModalOpen(false)

    setPendingDevice(null)

    setTargetWardId(null)
  }
  const handleRoomCancel = () => {
    setRoomModalOpen(false)
    setPendingDevice(null)
    setTargetWardId(null)
    }
  const handleRoomToRoomSubmit = async (
    roomID: number,
    patientName: string,
    samePatient: boolean
  ) => {

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
        r => r.id === prevRoomId
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

    if (deviceError) {
      console.error(deviceError)
      return
    }

    // ===== 履歴用 =====

    const room =
      rooms.find(
        r => Number(r.id) === Number(roomID)
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
  const handleRoomToRoomCancel = () => {
    setRoomToRoomModalOpen(false)
    setPendingDevice(null)
    setTargetWardId(null)
  }

    // Device削除関数
  const deleteDevice = async (id: number) => {
    // 🔽 事前準備：削除対象のdevice情報を先に取得（履歴のため）
    const target = deviceList.find(d => d.id === id)
    if (!target) return
    // 履歴用の情報を取得
    const type = deviceTypes.find(
      t => Number(t.id) === Number(target.type)
    )
    const model = deviceModels.find(
      m => Number(m.id) === Number(target.model)
    )
    const room = rooms.find(r => Number(r.id) === Number(target.roomId))
    const stockArea = stockAreas.find(a => Number(a.id) === Number(target.stockAreaID))

    // 🔽 ① maintenance_taskを先に削除
    const { error: taskError } = await supabase
      .from("device_maintenance_tasks")
      .delete()
      .eq("device_id", id)

    if (taskError) {
      console.error("task delete error:", taskError)
      return
    }

    // 🔽 ② device削除
    const { error } = await supabase
      .from('devices')
      .delete()
      .eq('id', id)

    if (error) {
      console.error("device delete error:", error)
      return
    }
        // ===== 履歴追加 =====
    const { error: historyError } = await supabase
      .from("device_histories")
      .insert({
        device_id: id,
        action_type: "delete",
        device_type_name: type?.name ?? null,
        device_model_name: model?.name ?? null,
        status: target.status,
        room_id: target.roomId ?? null,
        room_name: room?.roomName ?? null,
        stock_area_id: target.stockAreaID ?? null,
        stock_area_name: stockArea?.name ?? null,
        patient_name:
          rooms.find(r => Number(r.id) === Number(target.roomId))
            ?.patientName ?? null,

        management_number:
          target.managementNumber ?? null,

        serial_number:
          target.serialNumber ?? null,

        note:
          target.note ?? null,

        message:
          `${type?.name ?? "不明"} : ` +
          `${model?.name ?? "不明"} 削除`
      })

    if (historyError) {
      console.error(
        "history insert error:",
        historyError
      )
    }
    // DBから再取得
    await fetchHistories()

    // 🔽 ③ UI更新（DB再取得）
    await fetchDevices()
    await fetchTasks()
  }
  //StockInfoModal開くコンポーネント
  const openStockInfoModal = (device: Device) => {
    setSelectedDevice(device)
    setStockInfoModalOpen(true)
    }
  //StockInfoModalの保存ボタンを押したときの処理
  const handleStockInfoSubmit = async (data: {
    id: number
    managementNumber: string
    serialNumber: string
    note: string

    rentalStartDate?: string
    rentalEndDate?: string

    isUnderMaintenance?: boolean

    maintenanceStartedAt?: string
    maintenanceFinishedAt?: string
  }) => {

    // ===== 現在device =====

    const target =
      deviceList.find(
        d => d.id === data.id
      )

    if (!target) return

    // ===== 保守判定 =====

    // 保守開始
    const becameMaintenance =

      !target.isUnderMaintenance
      &&
      !!data.isUnderMaintenance

    // 保守終了
    const completedMaintenance =

      target.isUnderMaintenance
      &&
      !!data.maintenanceFinishedAt

    // ===== 修理完了時は保守解除 =====

    const finalMaintenance =

      completedMaintenance
        ? false
        : data.isUnderMaintenance

    // ===== DB更新 =====

    const { error } = await supabase

      .from("devices")

      .update({

        management_number:
          data.managementNumber,

        serial_number:
          data.serialNumber,

        note:
          data.note,

        rental_start_date:
          data.rentalStartDate || null,

        rental_end_date:
          data.rentalEndDate || null,

        is_under_maintenance:
          finalMaintenance,

        maintenance_started_at:
          data.maintenanceStartedAt
            || null,

        maintenance_finished_at:
          data.maintenanceFinishedAt
            || null,
      })

      .eq("id", data.id)

    if (error) {

      console.error(
        "stock update error:",
        error
      )

      return
    }

    // ===== UI更新 =====

    setDeviceList(prev =>

      prev.map(d =>

        d.id === data.id

          ? {

              ...d,

              managementNumber:
                data.managementNumber,

              serialNumber:
                data.serialNumber,

              note:
                data.note,

              rentalStartDate:
                data.rentalStartDate,

              rentalEndDate:
                data.rentalEndDate,

              isUnderMaintenance:
                finalMaintenance,

              maintenanceStartedAt:
                data.maintenanceStartedAt,

              maintenanceFinishedAt:
                data.maintenanceFinishedAt,
            }

          : d
      )
    )

    // ===== 履歴用 =====

    const type =
      deviceTypes.find(
        t => t.id === target.type
      )

    const model =
      deviceModels.find(
        m => m.id === target.model
      )

    const room =
      rooms.find(
        r =>
          Number(r.id)
          === Number(target.roomId)
      )

    const stockArea =
      stockAreas.find(
        a =>
          Number(a.id)
          === Number(target.stockAreaID)
      )

    // =====================================================
    // 保守開始履歴
    // =====================================================

    if (becameMaintenance) {

      const { error: historyError } =

        await supabase

          .from("device_histories")

          .insert({

            device_id:
              data.id,

            action_type:
              "fix_start",

            device_type_name:
              type?.name ?? null,

            device_model_name:
              model?.name ?? null,

            status:
              target.status ?? null,

            room_id:
              target.roomId ?? null,

            room_name:
              room?.roomName ?? null,

            stock_area_id:
              target.stockAreaID ?? null,

            stock_area_name:
              stockArea?.name ?? null,

            patient_name:
              room?.patientName ?? null,

            management_number:
              data.managementNumber
              ?? null,

            serial_number:
              data.serialNumber
              ?? null,

            note:
              data.note ?? null,

            maintenance_started_at:
              data.maintenanceStartedAt
              ?? null,

            maintenance_finished_at:
              null,

            message:

              `${type?.name ?? "不明"} : ` +

              `${model?.name ?? "不明"} ` +

              `保守開始`
          })

      if (historyError) {

        console.error(
          "fix start history error:",
          historyError
        )
      }
    }

    // =====================================================
    // 保守終了履歴
    // =====================================================

    if (completedMaintenance) {

      const { error: historyError } =

        await supabase

          .from("device_histories")

          .insert({

            device_id:
              data.id,

            action_type:
              "fix_end",

            device_type_name:
              type?.name ?? null,

            device_model_name:
              model?.name ?? null,

            status:
              target.status ?? null,

            room_id:
              target.roomId ?? null,

            room_name:
              room?.roomName ?? null,

            stock_area_id:
              target.stockAreaID ?? null,

            stock_area_name:
              stockArea?.name ?? null,

            patient_name:
              room?.patientName ?? null,

            management_number:
              data.managementNumber
              ?? null,

            serial_number:
              data.serialNumber
              ?? null,

            note:
              data.note ?? null,

            maintenance_started_at:
              data.maintenanceStartedAt
              ?? null,

            maintenance_finished_at:
              data.maintenanceFinishedAt
              ?? null,

            message:

              `${type?.name ?? "不明"} : ` +

              `${model?.name ?? "不明"} ` +

              `保守終了`
          })

      if (historyError) {

        console.error(
          "fix end history error:",
          historyError
        )
      }
    }

    // ===== 履歴再取得 =====

    await fetchHistories()

    // ===== modal close =====

    setStockInfoModalOpen(false)
  }
  const handleStockInfoCancel = () => {
    setStockInfoModalOpen(false)
  }
  //RoomDeviceModalを開くコンポーネント
  const openRoomDeviceInfoModal = (device: Device) => {
    if  (device.roomId === undefined) return    
        setSelectedRoomDevice(device)
        setRoomDeviceInfoModalOpen(true)
  }
  //RoomDeviceInfoModalの保存ボタンを押したときの処理
  const handleRoomDeviceInfoSubmit = async (data: {
    //RoomDeviceInfoModalから受け取るデータの型定義
    id: number
    managementNumber: string
    serialNumber: string
    note: string
    patientName: string
    roomId: number
    rentalStartDate?: string
    rentalEndDate?: string

    standby: boolean
    standbyStartedAt?: string
    standbyFinishedAt?: string

  }) => {

    // ① devices更新（機器情報）
    const { error: deviceError } = await supabase
      .from('devices')
      .update({
        management_number: data.managementNumber,
        serial_number: data.serialNumber,
        note: data.note,
        standby: data.standby,
        standby_started_at: data.standbyStartedAt || null,
        standby_finished_at: data.standbyFinishedAt || null,

      })
      .eq('id', data.id)

    if (deviceError) {
      console.error("device update error:", deviceError)
      return
    }

    // ② rooms更新（患者名）
    const { error: roomError } = await supabase
      .from('rooms')
      .update({
        patient_name: data.patientName
      })
      .eq('id', data.roomId)

    if (roomError) {
      console.error("room update error:", roomError)
      return
    }

    // ③ UI更新（今のままでOK）
    setDeviceList(prev =>
      prev.map(d =>
        d.id === data.id
          ? {
              ...d,
              managementNumber: data.managementNumber,
              serialNumber: data.serialNumber,
              note: data.note,
              standby: data.standby,
              standbyStartedAt: data.standbyStartedAt,
              standbyFinishedAt: data.standbyFinishedAt,

            }
          : d
      )
    )

    setRooms(prev =>
      prev.map(r =>
        r.id === data.roomId
          ? { ...r, patientName: data.patientName }
          : r
      )
    )

    setRoomDeviceInfoModalOpen(false)
  }

  const handleRoomDeviceInfoCancel = () => {
    setRoomDeviceInfoModalOpen(false)
  }
  //DBのstock_areas tableに新しいストックエリアを追加する関数
  const addStockArea = async (name: string) => {
    // 前処理: 余分な空白を削除し、空文字を弾く
    const trimmed = name.trim()
    // 空文字チェック
    if (!trimmed) return
    // 🔥 同名チェック（ローカル）
    //someで同じ名前が存在するかチェック（大文字小文字は区別しない）
    const exists = stockAreas.some(
      a => a.name.toLowerCase() === trimmed.toLowerCase()
    )
    if (exists) {
      alert("同じ名前のストックエリアが既に存在します")
      return
    }
    //DBのstock_areas tableに新しいストックエリアを追加する
    const { data, error } = await supabase
      .from("stock_areas")
      .insert([{ name: trimmed }])
      .select()
      .single()
    if (error) {
      console.error(error.message)
      alert("追加に失敗しました")
      return
    }
    setStockAreas(prev => [...prev, data])
  }
  //DBのstock_areas tableからストックエリア名を変更する関数
  const renameStockArea = async (id: number, newName: string) => {
    const trimmed = newName.trim()

    if (!trimmed) return

    // 🔥 重複チェック（自分以外）
    const exists = stockAreas.some(
      a =>
        a.id !== id &&
        a.name.toLowerCase() === trimmed.toLowerCase()
    )

    if (exists) {
      alert("同じ名前のストックエリアが既に存在します")
      return
    }

    const { error } = await supabase
      .from("stock_areas")
      .update({ name: trimmed })
      .eq("id", id)

    if (error) {
      console.error(error.message)
      alert("ストックエリア名の変更に失敗しました")
      return
    }

    // 🔥 UI更新
    setStockAreas(prev =>
      prev.map(a =>
        a.id === id ? { ...a, name: trimmed } : a
      )
    )
  }
  //DBのstock_areas tableからストックエリアを削除する関数
  const deleteStockAreas = async (ids: number[]) => {
    //削除するstockAreaに機器が存在したら削除できないようにする
    // deviceListの"stock"状態のdeviceのstockAreaIDがidsに含まれているかチェック
    const usedIds = new Set(
      deviceList
        .filter(d => d.status === "stock")
        .map(d => d.stockAreaID)
    )
    //idsの中でusedIdsに含まれているものをblockedとして抽出
    const blocked = ids.filter(id => usedIds.has(id))
    //blockedが存在する場合はアラートを表示して処理を中断
    if (blocked.length > 0) {
      alert("機器が存在するストックエリアは削除できません")
      return
    }
    //DBのstock_areas tableからストックエリアを削除する
    const { error } = await supabase
      .from("stock_areas")
      .delete()
      .in("id", ids)

    if (error) {
      console.error(error.message)
      alert("削除に失敗しました")
      return
    }

    setStockAreas(prev => prev.filter(a => !ids.includes(a.id)))
  }
  //DBのwards tableに新しい病棟を追加する関数
  const addWard = async (name: string) => {
    const trimmed = name.trim()

    if (!trimmed) return

    // 🔥 重複チェック
    const exists = wards.some(
      w => w.wardName.toLowerCase() === trimmed.toLowerCase()
    )

    if (exists) {
      alert("同じ名前の病棟が既に存在します")
      return
    }

    const { data, error } = await supabase
      .from("wards")
      .insert([{ name: trimmed }])
      .select()
      .single()

    if (error) {
      console.error(error.message)
      alert("病棟の追加に失敗しました")
      return
    }

    setWards(prev => [...prev, data])
  }
  //DBのwards tableから病棟名を変更する関数
  const renameWard = async (id: number, newName: string) => {
    const trimmed = newName.trim()

    if (!trimmed) return

    // 🔥 重複チェック（自分は除外）
    const exists = wards.some(
      w =>
        w.wardId !== id &&
        w.wardName.toLowerCase() === trimmed.toLowerCase()
    )

    if (exists) {
      alert("同じ名前の病棟が既に存在します")
      return
    }

    const { error } = await supabase
      .from("wards")
      .update({ name: trimmed })
      .eq("id", id)

    if (error) {
      console.error(error.message)
      alert("病棟名の変更に失敗しました")
      return
    }

    // 🔥 UI更新
    setWards(prev =>
      prev.map(w =>
        w.wardId === id ? { ...w, name: trimmed } : w
      )
    )
  }
  //DBのwards tableから病棟を削除する関数
  const deleteWards = async (ids: number[]) => {

    // 🔥 対象Wardに属するRoom取得
    const targetRooms = rooms.filter(r => ids.includes(r.wardId))
    const roomIds = targetRooms.map(r => r.id)

    // 🔥 機器存在チェック（最重要）
    const hasDevice = deviceList.some(
      d => d.roomId && roomIds.includes(d.roomId)
    )

    if (hasDevice) {
      alert("機器が存在する病棟は削除できません")
      return
    }

    // ===== ここから削除 =====

    // ① Room削除（先）
    if (roomIds.length > 0) {
      const { error: roomError } = await supabase
        .from("rooms")
        .delete()
        .in("id", roomIds)

      if (roomError) {
        console.error(roomError.message)
        alert("部屋削除に失敗しました")
        return
      }
    }

    // ② Ward削除
    const { error: wardError } = await supabase
      .from("wards")
      .delete()
      .in("id", ids)

    if (wardError) {
      console.error(wardError.message)
      alert("病棟削除に失敗しました")
      return
    }

    // ===== UI更新 =====
    setRooms(prev => prev.filter(r => !roomIds.includes(r.id)))
    setWards(prev => prev.filter(w => !ids.includes(w.wardId)))
  }
  //DBのrooms tableに新しい病室を追加する関数
  const addRoom = async (wardId: number,roomName: string) => {
      const trimmed =roomName.trim()
      if (!trimmed) return

      // ===== 重複チェック =====

      const exists = rooms.some(
        r =>
          r.wardId === wardId &&
          r.roomName.toLowerCase()
            === trimmed.toLowerCase()
      )

      if (exists) {

        alert(
          "同じ名前の部屋がこの病棟内に既に存在します"
        )

        return
      }

      // ===== DB insert =====

      const { data, error } =
        await supabase
          .from("rooms")
          .insert([{

            // DB列名
            name: trimmed,

            ward_id: wardId

          }])
          .select()
          .single()

      if (error) {

        console.error(error.message)

        alert("部屋の追加に失敗しました")

        return
      }

      // ===== normalize =====

      const normalizedRoom = {

        id: data.id,

        wardId:
          data.ward_id,

        roomName:
          data.name,

        patientName:
          data.patient_name ?? ""
      }

      setRooms(prev => [
        ...prev,
        normalizedRoom
      ])
  }  //DBのrooms tableから病室名を変更する関数
  const renameRoom = async (id: number, newName: string) => {
    const trimmed = newName.trim()

    if (!trimmed) return

    const exists = rooms.some(
      r =>
        r.id !== id &&
        (
          r.roomName ?? ""
        ).toLowerCase()
          === trimmed.toLowerCase()
    )

    if (exists) {
      alert("同じ名前の部屋がこの病棟内に存在します")
      return
    }

    const { error } = await supabase
      .from("rooms")
      .update({ name: trimmed })
      .eq("id", id)

    if (error) {
      console.error(error.message)
      alert("部屋名の変更に失敗しました")
      return
    }

    setRooms(prev =>
      prev.map(r =>
        r.id === id ? { ...r, roomName: trimmed } : r
      )
    )
  }
  //DBのrooms tableから病室を削除する関数
  const deleteRooms = async (ids: number[]) => {

    // 🔥 機器存在チェック
    const hasDevice = deviceList.some(
      d => d.roomId && ids.includes(d.roomId)
    )

    if (hasDevice) {
      alert("機器が存在する部屋は削除できません")
      return
    }

    const { error } = await supabase
      .from("rooms")
      .delete()
      .in("id", ids)

    if (error) {
      console.error(error.message)
      alert("削除に失敗しました")
      return
    }

    setRooms(prev => prev.filter(r => !ids.includes(r.id)))
  }
  //DBのdevice_types tableに新しい機種を追加する関数
  const addDeviceType = async (name: string) => {
    const trimmed = name.trim()
    if (!trimmed) return

    // 🔥 重複チェック
    const exists = deviceTypes.some(
      t => t.name.toLowerCase() === trimmed.toLowerCase()
    )

    if (exists) {
      alert("同じ機種が既に存在します")
      return
    }

    const { data, error } = await supabase
      .from("device_types")
      .insert([{ name: trimmed }])
      .select()
      .single()

    if (error) {
      console.error(error.message)
      alert("機種の追加に失敗しました")
      return
    }

    setDeviceTypes(prev => [...prev, data])
  }
  //DBのdevice_types tableの機種名を変更する関数
  const renameDeviceType = async (id: number, newName: string) => {
    const trimmed = newName.trim()

    if (!trimmed) {
      alert("名前を入力してください")
      return
    }

    // 🔥 重複チェック（自分以外）
    const exists = deviceTypes.some(
      t =>
        t.id !== id &&
        t.name.toLowerCase() === trimmed.toLowerCase()
    )

    if (exists) {
      alert("同じ機種が既に存在します")
      return
    }

    const { error } = await supabase
      .from("device_types")
      .update({ name: trimmed })
      .eq("id", id)

    if (error) {
      console.error(error.message)
      alert("機種名の変更に失敗しました")
      return
    }

    // UI更新
    setDeviceTypes(prev =>
      prev.map(t =>
        t.id === id ? { ...t, name: trimmed } : t
      )
    )
  }
  //DBのdevice_types tableから機種を削除する関数
  const deleteDeviceTypes = async (ids: number[]) => {
    // 🔥 紐づくモデル取得
    const relatedModels = deviceModels.filter(m =>
      ids.includes(m.device_type_id)
    )

    if (relatedModels.length > 0) {
      alert("型式が存在する機種は削除できません")
      return
    }

    const { error } = await supabase
      .from("device_types")
      .delete()
      .in("id", ids)

    if (error) {
      console.error(error.message)
      alert("削除に失敗しました")
      return
    }

    // UI更新
    setDeviceTypes(prev =>
      prev.filter(t => !ids.includes(t.id))
    )
  }
  //DBのdevice_models tableに新しい型式を追加する関数
  const addDeviceModel = async (deviceTypeId: number, name: string) => {
    const trimmed = name.trim()
    if (!trimmed) return

    // 🔥 type内で重複チェック
    const exists = deviceModels.some(
      m =>
        m.device_type_id === deviceTypeId &&
        m.name.toLowerCase() === trimmed.toLowerCase()
    )

    if (exists) {
      alert("同じ型式がこの機種内に既に存在します")
      return
    }

    const { data, error } = await supabase
      .from("device_models")
      .insert([{
        name: trimmed,
        device_type_id: deviceTypeId
      }])
      .select()
      .single()

    if (error) {
      console.error(error.message)
      alert("型式の追加に失敗しました")
      return
    }

    setDeviceModels(prev => [...prev, data])
  }
  //DBのdevice_models tableから型式名を変更する関数
  const renameDeviceModel = async (id: number, newName: string) => {
    const trimmed = newName.trim()

    if (!trimmed) {
      alert("名前を入力してください")
      return
    }

    // 🔥 対象model取得（ward_idの代わりにtype_idが必要）
    const target = deviceModels.find(m => m.id === id)
    if (!target) return

    // 🔥 同一type内で重複チェック
    const exists = deviceModels.some(
      m =>
        m.id !== id &&
        m.device_type_id === target.device_type_id &&
        m.name.toLowerCase() === trimmed.toLowerCase()
    )

    if (exists) {
      alert("同じ型式がこの機種内に既に存在します")
      return
    }

    const { error } = await supabase
      .from("device_models")
      .update({ name: trimmed })
      .eq("id", id)

    if (error) {
      console.error(error.message)
      alert("型式名の変更に失敗しました")
      return
    }

    // UI更新
    setDeviceModels(prev =>
      prev.map(m =>
        m.id === id ? { ...m, name: trimmed } : m
      )
    )
  }
  //DBのdevice_models tableから型式を削除する関数
  const deleteDeviceModels = async (ids: number[]) => {
    // 🔥 device使用チェック（最重要）
    const used = deviceList.filter(d =>
      ids.includes(d.model)
    )

    if (used.length > 0) {
      alert("使用中の機器がある型式は削除できません")
      return
    }

    const { error } = await supabase
      .from("device_models")
      .delete()
      .in("id", ids)

    if (error) {
      console.error(error.message)
      alert("削除に失敗しました")
      return
    }

    // UI更新
    setDeviceModels(prev =>
      prev.filter(m => !ids.includes(m.id))
    )
  }
  //DBのmaintenance_types tableに新しいメンテナンス種別を追加する関数
  const addMaintenanceType = async (data: {
                                            name: string
                                            deviceTypeId: number
                                            deviceModelId: number | null
                                            intervalDays: number
                                          }) => {

    const trimmed = data.name.trim()

    if (!trimmed) return

    const { data: inserted, error } = await supabase
      .from("maintenance_types")
      .insert([{
        name: trimmed,
        device_type_id: data.deviceTypeId,
        device_model_id: data.deviceModelId,
        interval_days: data.intervalDays
      }])
      .select()
      .single()

    if (error) {
      console.error(error)
      alert("追加失敗")
      return
    }

  setMaintenanceTypes(prev => [...prev, inserted])
  }
  //DBのmaintenance_types tableからメンテナンス種別名を変更する関数
  const renameMaintenanceType = async (
    id: number,
    data: {
      name: string
      intervalDays: number
    }
  ) => {

    const trimmed = data.name.trim()

    if (!trimmed) return

    const { error } = await supabase
      .from("maintenance_types")
      .update({
        name: trimmed,
        interval_days: data.intervalDays
      })
      .eq("id", id)

    if (error) {
      console.error(error)
      alert("変更失敗")
      return
    }

    setMaintenanceTypes(prev =>
      prev.map(t =>
        t.id === id
          ? {
              ...t,
              name: trimmed,
              interval_days: data.intervalDays
            }
          : t
      )
    )
  }
  //DBのmaintenance_types tableからメンテナンス種別を削除する関数
  const deleteMaintenanceTypes = async (ids: number[]) => {
    const used = tasks.some(t =>
      ids.includes(t.maintenance_type_id)
    )

    if (used) {
      alert("使用中のメンテ種別は削除できません")
      return
    }

    const { error } = await supabase
      .from("maintenance_types")
      .delete()
      .in("id", ids)

    if (error) {
      console.error(error)
      return
    }

    setMaintenanceTypes(prev =>
      prev.filter(t => !ids.includes(t.id))
    )
  }
  //DBからdevice_maintenance_tasks tableを取得しtasksに格納する関数
  const fetchTasks = async () => {
    const { data, error } = await supabase
      .from("device_maintenance_tasks")
      .select("*")

      if (error) {
        console.error(error)
        return
      }

    setTasks(data || [])
  }
  //DBからmaintenance_types tableを取得しmaintenanceTypesに格納する関数
  const fetchMaintenanceTypes = async () => {
    const { data, error } = await supabase
      .from("maintenance_types")
      .select("*")

      if (error) {
        console.error(error)
        return
      }

    setMaintenanceTypes(data || [])
  }
  //device_idに紐づくタスクをキャンセルする関数
  const cancelTasks = async (deviceId: number) => {
    await supabase
      .from("device_maintenance_tasks")
      .update({ status: "canceled" })
      .eq("device_id", deviceId)
      .eq("status", "pending")
  }
  //新しいタスクを作成する関数
  const createTasks = async (device: Device, types: any[]) => {
    const now = new Date()

    const inserts = types.map(type => {
      const due = new Date(now)
      due.setDate(due.getDate() + type.interval_days)

      return {
        device_id: device.id,
        maintenance_type_id: type.id,
        due_at: due.toISOString(),
        status: "pending"
      }
    })

    await supabase
      .from("device_maintenance_tasks")
      .insert(inserts)
}
  //タスク完了ボタンを押したときの処理
  const handleCompleteTask = async (taskId: number) => {
    const task = tasks.find(t => t.id === taskId)
    if (!task) return

    const now = new Date().toISOString()

    // ① task完了
    const { error: updateError } = await supabase
      .from("device_maintenance_tasks")
      .update({
        status: "completed",
        completed_at: now
      })
      .eq("id", taskId)

    if (updateError) {
      console.error(updateError)
      return
    }

    // ② log作成
    await supabase
      .from("device_maintenance_logs")
      .insert({
        device_id: task.device_id,
        maintenance_type_id: task.maintenance_type_id,
        performed_at: now,
        task_id: task.id
      })

    // ③ 次タスク生成
    const type = maintenanceTypes.find(
      t => t.id === task.maintenance_type_id
    )

    if (type?.interval_days) {
      const due = new Date()
      due.setDate(due.getDate() + type.interval_days)

      await supabase
        .from("device_maintenance_tasks")
        .insert({
          device_id: task.device_id,
          maintenance_type_id: task.maintenance_type_id,
          due_at: due.toISOString(),
          status: "pending"
        })
    }

    // ④ 再取得（これ重要）
    fetchTasks()
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
    const { data, error } = await supabase
      .from("device_histories")
      .select("*")
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
  const getLatestMaintenanceTask = (deviceId?: number
      ) => {
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

  //DBからstock_area tableを取得しstockAreaに格納
  //stock_areas tableの内容をstockAreaに表示するためのuseEffect
  useEffect(() => {
    const fetchStockAreas = async () => {
      const { data, error } = await supabase
        .from('stock_areas')
        .select('*')

      if (error) {
        console.error(error)
        return
      }

      if (data) {
        setStockAreas(data)
      }
      }
      fetchStockAreas()
  }, [])
  //DBからwards tableを取得しwardsに格納
  //wards tableの内容をwardAreaに表示するためのuseEffect
  useEffect(() => {
    //DBからwards tableを取得しwardsに格納
    const fetchWards = async () => {
      const { data, error } = await supabase
        .from('wards')
        .select('*')

      if (error) {
        console.error(error)
        return
      }

      if (data) {
        setWards(
          data.map(normalizeWard)
        )      
      }
    }

      fetchWards()
  }, [])
  //rooms tableの内容をroomContainerに表示するためのuseEffect
  //deviceTypesとdeviceModelsをDBから取得するためのuseEffect
  useEffect(() => {
    const fetchMaster = async () => {
      const { data: types } = await supabase.from('device_types').select('*')
      const { data: models } = await supabase.from('device_models').select('*')

      if (types) setDeviceTypes(types)
      if (models) setDeviceModels(models)
    }

  fetchMaster()
  }, [])
  //最初のレンダリングでdeviceList, tasks, maintenanceTypesをDBから取得するためのuseEffect
  useEffect(() => {
    fetchDevices()
    fetchRooms()
    fetchTasks()
    fetchMaintenanceTypes()
    fetchHistories()
  }, [])

  

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
          wards={wards}
          startDrag={startDrag}
          deleteDevice={deleteDevice}
          draggingDevice={draggingDevice}
          pendingDevice={pendingDevice}
          onDrop={handleDropToWard} 
          rooms={rooms}
          openRoomDeviceInfoModal={openRoomDeviceInfoModal}
          justDropped={justDropped}
          getMAlert={getMAlert}
          wardCellSize={wardCellSize}
          setWardCellSize={setWardCellSize}
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
          managementNumber={managementNumber}
          serialNumber={serialNumber}
          startDrag={startDrag}
          handleMouseMove={handleMouseMove}
          deleteDevice={deleteDevice}
          draggingDevice={draggingDevice}
          pendingDevice={pendingDevice}
          onDrop={handleDropToStock}
          openStockInfoModal={openStockInfoModal}
          getMAlert={getMAlert}
          stockCellSize={stockCellSize}
          setStockCellSize={setStockCellSize}
        />
      </div>      

      {/* ボタンパネル */}
      <div className={styles.button}>
        <ButtonPanel 
          deviceList={deviceList}
          addDevice={addDevice}
          deviceTypes={deviceTypes}
          deviceModels={deviceModels}
          stockAreas={stockAreas}
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
          maintenanceTypes={maintenanceTypes}
          addMaintenanceType={addMaintenanceType}
          renameMaintenanceType={renameMaintenanceType}
          deleteMaintenanceTypes={deleteMaintenanceTypes}
          histories={histories}
          getWardDeviceList={getWardDeviceList}
          getLatestMaintenanceTask={getLatestMaintenanceTask}
        
        />
      </div>

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
        onSubmit={handleStockInfoSubmit}
        onCancel={handleStockInfoCancel}
      />
       {/* 病室機器詳細モーダル表示 */}
      <RoomDeviceInfoModal
        isOpen={roomDeviceInfoModalOpen}
        device={selectedRoomDevice}
        deviceTypes={deviceTypes}
        deviceModels={deviceModels}
        onSubmit={handleRoomDeviceInfoSubmit}
        onCancel={handleRoomDeviceInfoCancel}
        rooms={rooms}
        wards={wards}
        tasks={getDeviceTasks(selectedRoomDevice?.id)}                  // ← 渡す
        maintenanceTypes={maintenanceTypes} // ← 渡す
        onCompleteTask={handleCompleteTask} // ← 渡す
      />
      


    </div>
  )
}