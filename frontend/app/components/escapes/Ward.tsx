import { Device } from "../../types/deviceTypes"
import DeviceIcon from "../../utils/DeviceIcon"
import { wards, rooms } from "../../types/wards"
import Room from "../Room"
import { deviceTypes, deviceModels } from "../../types/deviceTypes"
type Props = {
  devices: Device[]
  wardId: number
  startDrag: (e: React.MouseEvent, device: Device) => void
  deleteDevice: (id: number) => void
  draggingDevice: Device | null
  rooms: Room[]
}

export default function Ward({
                              devices,
                              wardId,
                              startDrag,
                              deleteDevice,
                              draggingDevice,
                              rooms
                            }: Props) {
  //deviceのstatusがroomで、wardIdがpropsのwardIdと同じ、roomNumberが"TEST"のものを抽出
  const wardDevices = devices.filter(
    d => d.status === "room" && 
    d.wardId === wardId &&
    d.roomName === "TEST"
  )
  //roomNameが"TEST"の病室を抽出
  const room = rooms.find(
    r => r.wardId === wardId && r.roomName === "TEST"
  )
  console.log("Wardコンポーネントのroom", room)
  


  // 病室に配置されている機器がない場合は病棟に何も表示しない
  if (wardDevices.length === 0) {
  return null
  }

  return (
        <div className="border p-2">
          <Room
          devices={devices}
          roomId={room?.id}
          roomName={room?.roomName}
          patientName={room?.patientName}
          startDrag={startDrag}
          draggingDevice={draggingDevice}
          OnDrop={(device, status, id) => void
          />
          </div>
          )
}

{/*
            {wardDevices.map(d => {
        const isDragging = draggingDevice?.id === d.id
        const typeName =
          deviceTypes.find(t => t.typeID === d.type)?.name ?? "不明"

        const modelName =
          deviceModels.find(m => m.modelID === d.model)?.name ?? "不明"
        return (
          <div
            key={d.id}
            onMouseDown={(e) => startDrag(e, d)}
            style={{
              cursor: "grab",
              visibility: isDragging ? "hidden" : "visible"
            }}
          >
            <DeviceIcon
              typeName={typeName}
              modelName={modelName}
            />
          </div>
        )
      })}
</div>
  )
} 
*/}
