import { Device } from "../types/deviceTypes"
import DeviceIcon from "../utils/DeviceIcon"
import { deviceTypes, deviceModels } from "../types/deviceTypes"
type Props = {
  devices: Device[]
  wardId: number
  startDrag: (e: React.MouseEvent, device: Device) => void
  deleteDevice: (id: number) => void
  draggingDevice: Device | null
}

export default function Ward({
  devices,
  wardId,
  startDrag,
  deleteDevice,
  draggingDevice
}: Props) {

  const wardDevices = devices.filter(
    d => d.status === "room" && d.wardId === wardId
  )

  return (
    <>
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
            {/* DeviceIcon使い回しでOK */}
            <DeviceIcon
              typeName={typeName}
              modelName={modelName}
            />
          </div>
        )
      })}
    </>
  )
}