"use client"

import styles from "./page.module.css"
import StockAreas from "./components/StockArea"
import WardArea from "./components/WardArea"
import ButtonPanel from "./components/ButtonPanel"
import DragLayer from "./components/DragLayer"
import RoomModal from "./components/RoomModal"
import StockInfoModal from "./components/StockInfoModal"
import RoomDeviceInfoModal from "./components/RoomDeviceInfoModal"
import { Device} from "./types/deviceTypes"
import { rooms as initialRooms,Room} from "./types/wards"
import { useEffect, useState,useRef } from "react"
import RoomContainer from "./components/RoomContainer"

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

  const [draggingDevice, setDraggingDevice] = useState<Device | null>(null)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  //病室の情報を管理するstate,初期値はinitialRoomsから
  //const [rooms, setRooms] = useState<Room[]>(initialRooms)  
  //roomModalを開くためのstate
  const [roomModalOpen, setRoomModalOpen] = useState(false)
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
  //StockAreaとWardAreaの仕切りをドラッグするためのstate
  const [split, setSplit] = useState(0.65) // 上の割合
  const [isResizing, setIsResizing] = useState(false)
  //auto scroll用にStockArea / WardArea のDOMをrefで取得
  const wardRef = useRef<HTMLDivElement | null>(null)
  const stockRef = useRef<HTMLDivElement | null>(null)

  //device tableにfetchする
  const fetchDevices = async () => {
    const { data, error } = await supabase
      .from('devices')
      .select('*')

    if (error) {
      console.error("fetchDevices error:", error)
      return
    }

    if (data) {
      setDeviceList(
        data.map(d => ({
          ...d,
          stockAreaID: d.stock_area_id,
          roomId: d.room_id,
          assetType: d.asset_type
        }))
      )
    }
  }
  //新規登録時stockAreaIDは1のCE室に固定。ドラッグで移動させる前提。
  const addDevice = async (device: Device) => {
    const { error } = await supabase
      .from('devices')
      .insert([
        {
          type: device.type,
          model: device.model,          
          asset_type: device.assetType,
          status: "stock",
          stock_area_id: 1,
          room_id: null
        }
      ])

    if (error) {
      console.error("insert error:", error)
      return
    }

    await fetchDevices()
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

    console.log("drop position", x, y)

    setDraggingDevice(null)
    setIsResizing(false)// ドラッグ終了と同時にリサイズも終了する
  }

  const handleDropToStock = (device: Device, stockAreaId: number) => {
    setDeviceList(prev =>
      prev.map(d =>
        d.id === device.id
          ? {
              ...d,
              status: "stock",
              stockAreaID: stockAreaId,
              wardId: undefined,
              roomId: undefined
            }
          : d
      )
    )
  }
  const handleDropToWard = (device: Device, wardID: number) => {  
  
    setPendingDevice(device)
    setTargetWardId(wardID)
    setRoomModalOpen(true)
    //機器アイコンのdragですのフラグ
    //setJustDropped(true)
    console.log("機器アイコンのドラッグイベント")
    // 少し後に解除
    setTimeout(() => setJustDropped(false), 100)
  }
  //roomMadalを開く
  //roomModalで病室名と患者名を入力して確定ボタンを押したときの処理
  const handleRoomSubmit = async (roomID: number, patientName: string) => {    if (!pendingDevice) return

        // ① DB更新（患者名）
    const { error } = await supabase
      .from('rooms')
      .update({ patient_name: patientName })
      .eq('id', roomID)

    if (error) {
      console.error(error)
      return
    }
    const { error: deviceError } = await supabase
      .from('devices')
      .update({
        status: "room",
        room_id: roomID
      })
      .eq('id', pendingDevice.id)

    if (deviceError) {
      console.error(deviceError)
      return
    }
    // Deviceを選択されたRoomに更新する
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

    // RoomにroomIDと患者名を格納する
    //patientNameはUI上の情報
    setRooms(prev =>
      prev.map(r =>
        r.id === roomID
          ? { ...r, patientName:patientName }
          : r
      )
    )
    console.log("患者名",patientName)
    setRoomModalOpen(false)
    setPendingDevice(null)
    setTargetWardId(null)
  } 

  const handleRoomCancel = () => {
  setRoomModalOpen(false)
  setPendingDevice(null)
  setTargetWardId(null)
}
  
    // Device削除関数
  const deleteDevice = async (id: number) => {
    // ① DBから削除
    const { error } = await supabase
      .from('devices')
      .delete()
      .eq('id', id)

    if (error) {
      console.error("delete error:", error)
      return
    }

    // ② UI更新（どちらか）
    // パターンA：ローカル削除
    //setDeviceList(prev => prev.filter(d => d.id !== id))

    // パターンB（おすすめ）：DB再取得
    await fetchDevices()
  }

  //StockInfoModal開くコンポーネント
  const openStockInfoModal = (device: Device) => {
  setSelectedDevice(device)
  setStockInfoModalOpen(true)
  }
  const handleStockInfoSubmit = (data: {
    id: number
    managementNumber: string
    serialNumber: string
    note: string
    }) => {
      setDeviceList(prev =>
        prev.map(d =>
          d.id === data.id
            ? {
                ...d,
                managementNumber: data.managementNumber,
                serialNumber: data.serialNumber,
                note: data.note
              }
            : d
        )
      )
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
  const handleRoomDeviceInfoSubmit = (data:{
    id: number
    managementNumber: string
    serialNumber: string
    note: string
    patientName: string
    roomId: number 
    }) => {
            setDeviceList(prev =>
              prev.map(d =>
                d.id === data.id
                  ? {
                      ...d,
                      managementNumber: data.managementNumber,
                      serialNumber: data.serialNumber,
                      note: data.note
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

   //draggingDeviceの状態が変わるたびにコンソールに出力する
  useEffect(() => {
    console.log("selected draggingDevice", draggingDevice)
  }, [draggingDevice])


  //病室の機器アイコンがO個になったとき、patientNameを空にするためのuseEffect
  //deviceListが更新されるたびにroomsを更新する
  useEffect(() => {
    setRooms(prev =>
      prev.map(room => {
        const devicesInRoom = deviceList.filter(d => d.roomId === room.id)

        if (devicesInRoom.length === 0 && room.patientName) {
          return { ...room, patientName: "" }
        }

        return room
      })
    )
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
  useEffect(() => {
    const fetchWards = async () => {
      const { data, error } = await supabase
        .from('wards')
        .select('*')

      if (error) {
        console.error(error)
        return
      }

      if (data) {
        setWards(data)
      }
    }

      fetchWards()
  }, [])
  //rooms tableからroomの情報を取得するためのuseEffect
  useEffect(() => {
    const fetchRooms = async () => {
      const { data, error } = await supabase
        .from('rooms')
        .select('*')

      if (error) {
        console.error(error)
        return
      }

      if (data) {
        setRooms(data)
      }
    }

    fetchRooms()
  }, [])
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
  //最初のレンダリングでdeviceListをDBから取得するためのuseEffect
  useEffect(() => {
    fetchDevices()
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
          startDrag={startDrag}
          handleMouseMove={handleMouseMove}
          deleteDevice={deleteDevice}
          draggingDevice={draggingDevice}
          pendingDevice={pendingDevice}
          onDrop={handleDropToStock}
          openStockInfoModal={openStockInfoModal}
        />
      </div>      

      {/* ボタンパネル */}
      <div className={styles.button}>
        <ButtonPanel 
          addDevice={addDevice}
          deviceTypes={deviceTypes}
          deviceModels={deviceModels}
        />
      </div>

            {/* drag layer */}
      <div className={styles.dragLayer}>
        <DragLayer
          deviceTypes={deviceTypes}
          deviceModels={deviceModels}
          draggingDevice={draggingDevice}
          mousePos={mousePos}
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
      />



    </div>
  )
}