import { Device } from "../types/deviceTypes"
import DeviceIcon from "../utils/DeviceIcon"
import { deviceTypes, deviceModels } from "../types/deviceTypes"
import {useRef} from "react"

type Props = {
  devices: Device[]
  roomId: number
  roomName: string
  patientName?: string
  startDrag: (target: HTMLElement,clientX: number,  clientY: number,device: Device) => void
  draggingDevice: Device | null
  pendingDevice: Device | null
  deleteDevice: (id: number) => void
  openRoomDeviceInfoModal: (device: Device) => void

}

export default function Room({
                            devices,
                            roomId,
                            roomName,
                            patientName,
                            startDrag,
                            draggingDevice,
                            pendingDevice,   
                            deleteDevice,
                            openRoomDeviceInfoModal
                            }: Props) {

const roomDevices = devices.filter(
  d => d.status === "room" && 
  d.roomId === roomId &&
  d.id !== pendingDevice?.id
)
  //console.log("roomName(props):", roomName)




    // 病室に配置されている機器がない場合は病棟に何も表示しない
  if (roomDevices.length === 0) {
  return 
  }

   
return (
    <div
      style={{
        border: "1px solid #888",
        borderRadius: "8px",
        padding: "8px",
        background: "#f9fafb",
        width: "calc(90px * 2 + 8px)" // 👈 2列固定（80px×2 + gap）
      }}
    >      
      <div className="text-sm font-bold mb-1">{roomName}</div>

        {/* 🔥 患者名 */}
    <div className="text-xs text-gray-600 mb-1">
      {patientName ? `患者: ${patientName}` : "患者なし"}
    </div>
          {/* 👇 flex配置 */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "8px"
        }}
      >

      {roomDevices.slice(0, 6).map(d => {
        const isDragging = draggingDevice?.id === d.id

        const typeName =
          deviceTypes.find(t => t.typeID === d.type)?.name ?? "不明"

        const modelName =
          deviceModels.find(m => m.modelID === d.model)?.name ?? "不明"
        const longPressTimer = useRef<NodeJS.Timeout | null>(null)        
        const isLongPress = useRef(false)
        return (
          <div
            key={d.id}
              onMouseDown={(e) => {
                if (e.button !== 0) return

                isLongPress.current = false

                // ✅ 必要な値を先に退避
                const target = e.currentTarget as HTMLElement
                const clientX = e.clientX
                const clientY = e.clientY

                longPressTimer.current = setTimeout(() => {
                  console.log("長押し → drag開始")
                  isLongPress.current = true

                  startDrag(target, clientX, clientY, d)
                }, 300)
              }}
              onMouseUp={() => {
                if (longPressTimer.current) {
                  clearTimeout(longPressTimer.current)
                  longPressTimer.current = null
                }
                if (!isLongPress.current) {
                  console.log("シングルクリック")
                  openRoomDeviceInfoModal(d)
                }
              }}


              onContextMenu={(e) => {
                              console.log("右クリック検知")
              e.preventDefault()
              if (confirm(`${typeName} ${modelName} を削除しますか？`)) {
                deleteDevice(d.id)
              }
            }}
            //機器アイコンdrag中は元位置のアイコンは見えなくする
            style={{
              visibility: isDragging ? "hidden" : "visible"
            }}
          >
            <DeviceIcon typeName={typeName} modelName={modelName} />
          </div>
        )
      })}
      </div>
    </div>
  )
}